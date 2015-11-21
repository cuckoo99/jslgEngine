/*
 * @author cuckoo99
 */

(function() {
	// namespace:
	var o = this.jslgEngine = this.jslgEngine||{};
	o = (o.model = o.model||{});
	o = (o.action = o.action||{});

	/**
	 * <h4>コード処理・移動クラス（SLG固有要素）</h4>
	 * <p>
	 * 対象要素を指定された要素上へ移動する。（子要素として追加する）
	 * </p>
	 * @class
	 * @name ActionJSlgMove
	 * @memberOf jslgEngine.model.action
	 * @constructor
	 */
	var ActionJSlgMove = jslgEngine.extend(
		jslgEngine.model.action.ActionBase,
		function(options) {
			this.initialize(options);
		}
	);
	/**
	 *
	 */
	var p = ActionJSlgMove.prototype;
	
	/**
	 * クラス名
	 *
	 * @name className
	 * @property
	 * @type String
	 * @memberOf jslgEngine.model.action.ActionJSlgMove#
	 **/
	p.className = 'ActionJSlgMove';

	/**
	 * 非同期かどうか
	 *
	 * @private
	 * @name _isAsync
	 * @property
	 * @type Boolean
	 * @memberOf jslgEngine.model.action.ActionJSlgMove#
	 **/
	p._isAsync = true;

	/**
	 * 実行
	 *
	 * @name run
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.action.ActionJSlgMove#
	 * @param {Object} options
	 * <ul>
	 * <li>{jslgEngine.controller.IconController} iconController</li>
	 * <li>{jslgEngine.controller.mainController} mainController</li>
	 * </ul>
	 */
	p.run$ = function(connector, data, options) {
		var self = this;

		if(!self.isReadyToRun(connector, options)) return;
		
		connector.resolve();
		
		var target, to;
		var ground, cast;
		var castPath, path, lastLocationKey;
		
		var region = options.mainController.getWorldRegion();
		
		self._readAllElements(connector, data, options);
		connector.pipe(function(connector_s, result_s) {
			target = result_s[0];
			to = result_s[1];
			
			self._wasDone = true;
			
			if(to.className === 'PendingCommand') {
				var issue = to.getCurrentIssue();
				to = issue.getCurrentAppliedElement();
			} else if(to instanceof jslgEngine.model.common.JSlgElement) {
				//to = to.getGlobalLocation();
			}
			
			if(target.className !== 'Cast') {
				jslgEngine.log('target is not Cast element.');
				connector_s.reject();
			}
			
			if(to.className !== 'Ground') {
				jslgEngine.log('destination is not Ground element.');
				connector_s.reject();
			}

			path = target.getPath();

			// get ground and cast paths.
			ground = target.getParent(options);
			var castPath = target.getPath();
			cast = target;
			lastGround = to;

			lastLocationKey = [to.x,to.y,to.z].join(jslgEngine.config.locationSeparator);
			
			var animeKey = target.getStatus('walk');
			
			self._restoreData = {
				target : cast,
				from : ground,
				to : lastGround
			};
			
			self.checkPending(connector_s, {
				target : cast,
				from : ground,
				to : lastGround
			}, data, options);
			
			if(data.isTest) {
				ground.removeChild({
					obj : cast
				}, options);
				lastGround.addChild({
					obj : cast
				}, options);
	
				var loc = ground.getGlobalLocation();
				var lloc = lastGround.getGlobalLocation();
				jslgEngine.log('moved cast next:'+cast.getPath()+', from:'+loc.toString()+', to:'+lloc.toString());
				connector_s.resolve();
			} else {
				//TODO: 座標が取得できているか確認
				var backGroundWorker = options.mainController.getWebWorkers('Logic');
				
				region.findElements(connector_s.resolve(), {
					className : 'Ground'
				}, options);
				connector_s.pipe(function(connector_ss, result_ss) {
					var elements = result_ss;
					
					var effectsMap = [];
					for(var i = 0; i < elements.length; i++) {
						var element = elements[i];
						var elementLocation = element.getGlobalLocation();
						var effect = element.getStatus('effect').value;
						effectsMap.push({
							location : elementLocation,
							effect : effect
						});
					}
					
					var obj = {
						type : 'Route',
						from : target.getGlobalLocation(),
						to : to.getGlobalLocation(),
						effectsMap : effectsMap
					};
					
					backGroundWorker.add(JSON.stringify(obj), function(obj) {
			        		connector_ss.resolve(obj);
			        	});
				}).pipe(function(connector_ss, result_ss) {
		        	var route = result_ss;
					var positions = [];
		
					for(var i = 0; i < route.length; i++) {
						var position = cast.getPosition({
							dummyLocation : {
								x : route[i][0],
								y : route[i][1],
								z : route[i][2]
							},
							stageViewOffset : options.iconController.stageViewOffset,
							stageViewSize : options.iconController.stageViewSize
						}, options);
						positions.push(position);
					}
		
					var castKey = cast.getKeyData().getUniqueId();

					options.mainController.ticker.addAnimation({
						key : castKey,
						animeKey : animeKey ? animeKey.value : null,
						partitions : 4,
						positions : positions.reverse()
					}, options);
					
					options.mainController.ticker.addAnimationGroup({
						key : 'moveGroup',
						groupKeys : [castKey],
						callback : function() {
							ground.removeChild({
								obj : cast
							}, options);
							lastGround.addChild({
								obj : cast
							}, options);
							
							var loc = ground.getGlobalLocation();
							var lloc = lastGround.getGlobalLocation();
							jslgEngine.log('moved cast:'+cast.getPath()+', from:'+loc.toString()+', to:'+lloc.toString());
							connector_ss.resolve();
						}
					}, options);
					
					options.mainController.ticker.unlockAnimation(options);
		        });
			}
		});
		
	};

	/**
	 * リストア
	 *
	 * @name restore
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.action.ActionJSlgMove#
	 * @param {Object} options
	 * <ul>
	 * <li>{jslgEngine.controller.IconController} iconController</li>
	 * <li>{jslgEngine.controller.mainController} mainController</li>
	 * </ul>
	 */
	p.restore$ = function(connector, data, options) {
		var self = this;

		if(!self.isReadyToRestore(connector, options)) return;
		
		var cast = self._restoreData.target;
		var ground = self._restoreData.from;
		var lastGround = self._restoreData.to;
		
		lastGround.removeChild({
			obj : cast
		}, options);
		
		ground.addChild({
			obj : cast
		}, options);

		self._wasDone = false;
		
		var loc = ground.getGlobalLocation();
		var lloc = lastGround.getGlobalLocation();
		jslgEngine.log('moved cast(restore):'+cast.getPath()+', from:'+lloc.toString()+', to:'+loc.toString());
		
		connector.resolve();
	};


	/**
	 * 展開する
	 *
	 * @name expand
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.action.ActionJSlgMove#
	 * @param {Object} options
	 * <ul>
	 * <li>{jslgEngine.controller.IconController} iconController</li>
	 * <li>{jslgEngine.controller.mainController} mainController</li>
	 * </ul>
	 */
	p.expand = function(options) {};

	/**
	 * Pendingに対して参照があれば評価を行う
	 *
	 * @name review
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.action.ActionJSlgMove#
	 * @param {Object} options
	 */
	p.review = function(result, data, options) {
		//Mindから得た情報を元に評価を行う
		var reputation = 0;
		var location = result.me.getGlobalLocation();
		
		for(var i = 0; i < result.family.length; i++) {
			var family = result.family[i];
			var distance = result.measureFunc(family.data.getGlobalLocation(), location);
			
			reputation += distance;
		}
		for(var i = 0; i < result.enemy.length; i++) {
			var enemy = result.enemy[i];
			var distance = result.measureFunc(enemy.data.getGlobalLocation(), location);
			
			reputation += distance;
		}
		
		return {
			type : jslgEngine.model.action.keys.SLG_MOVE,
			location : data.to.getGlobalLocation(),
			point : reputation
		};
	};
	
	o.ActionJSlgMove = ActionJSlgMove;
}());
