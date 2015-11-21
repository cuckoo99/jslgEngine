/*
 * @author cuckoo99
 */

(function() {
	// namespace:
	var o = this.jslgEngine = this.jslgEngine||{};
	o = (o.model = o.model||{});
	o = (o.action = o.action||{});

	/**
	 * <h4>コード処理・メッセージクラス（SLG固有要素）</h4>
	 * <p>
	 * メッセージを呼び出す。<br />
	 * また未解決の選択要素を追加する。<br />
	 * </p>
	 * @class
	 * @name ActionJSlgProfile
	 * @memberOf jslgEngine.model.action
	 * @constructor
	 */
	var ActionJSlgProfile = jslgEngine.extend(
		jslgEngine.model.action.ActionBase,
		function(options) {
			this.initialize(options);
		}
	);
	/**
	 *
	 */
	var p = ActionJSlgProfile.prototype;
	
	/**
	 * クラス名
	 *
	 * @name className
	 * @property
	 * @type String
	 * @memberOf jslgEngine.model.action.ActionJSlgProfile#
	 **/
	p.className = 'ActionJSlgProfile';

	/**
	 * 実行
	 *
	 * @name run
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.action.ActionJSlgProfile#
	 * @param {Object} options
	 */
	p.run$ = function(connector, data, options) {
		var self = this;

		if(!self.isReadyToRun(connector, options)) return;
		
		connector.resolve();
		
		//ステータス表示
		
		self._readAllElements(connector, data, options);
		connector.connects(function(connector_s, result_s) {
			var cast = result_s[0];
			var viewTargets = result_s[1];
			var isClose = result_s[2] ? result_s[2].value : null;
			
			var viewStatus = [];
			for(var i = 0; i < viewTargets.length; i++) {
				viewTarget = viewTargets[i];
				viewStatus.push({
					key : viewTarget[0].value,
					before : viewTarget[1].value,
					after : viewTarget[2].value
				});
			}
			
			var groupName = 'profile';
			
			if(!data.isTest) {
				var removeKeys = options.iconController.getKeysByGroup(groupName);
			
				if(removeKeys.length > 0) {
					for(var i = 0; i < removeKeys.length; i++) {
						options.mainController.ticker.addAnimation({
							key : removeKeys[i],
							fadeType : jslgEngine.model.animation.keys.fadeType.FADE_OUT,
							group : groupName
						}, options);
					}
					connector_s.pipe(function(connector_ss) {
						options.mainController.ticker.addAnimationGroup({
							key : groupName+'Group',
							groupKeys : removeKeys,
							callback : function() {
								for(var i = 0; i < removeKeys.length; i++) {
									options.iconController.remove({
										key : removeKeys[i]
									});
								}
								connector_ss.resolve();
							}
						}, options);
						
						options.mainController.ticker.unlockAnimation();
					});
				}
				var slgIconFactory = options.iconController.iconFactory;
				
				var key = 'pf';
				
                connector_s.connects(function(connector_ss) {
                    slgIconFactory.makeProfile(connector_s, {
                        key : key,
                        name : cast.getKey(),
                        targets : viewStatus,
                    }, options);
                });
				connector_s.pipe(function(connector_ss) {
					var targetKeys = [];
					
					for(var i = 0; i < viewStatus.length; i++) {
						var viewTarget = viewStatus[i];
						var textList = [];
						var limit = 100;
						var direction = viewTarget.after-viewTarget.before > 0 ? 1 : -1;
						for(var j = viewTarget.before; (j !== viewTarget.after && (limit--) > 0); j+=direction) {
							textList.push(j);
						}
				        textList.push(viewTarget.after);
				        textList.push(viewTarget.after);
						
						var targetKey = [key,viewTarget.key].join(jslgEngine.config.elementSeparator);
						targetKeys.push(targetKey);
						options.mainController.ticker.addAnimation({
							key : targetKey,
							textList : textList,
							delay : 10
						}, options);
					}
					
					options.mainController.ticker.addAnimationGroup({
						key : groupName+'Group',
						groupKeys : targetKeys,
						callback : function() {
							for(var i = 0; i < targetKeys.length; i++) {
								options.iconController.remove({
									key : targetKeys[i]
								});
							}
							connector_ss.resolve();
						}
					}, options);
					
					options.mainController.ticker.unlockAnimation();
				});
				connector_s.pipe(function(connector_ss) {
					var removeKeys = options.iconController.getKeysByGroup(groupName);
				
					if(removeKeys.length > 0) {
						for(var i = 0; i < removeKeys.length; i++) {
							// 現在のメッセージを優先して表示
							options.mainController.ticker.addAnimation({
								key : removeKeys[i],
								fadeType : jslgEngine.model.animation.keys.fadeType.FADE_OUT,
								group : groupName
							}, options);
						}
						options.mainController.ticker.addAnimationGroup({
							key : groupName+'Group',
							groupKeys : removeKeys,
							callback : function() {
								for(var i = 0; i < removeKeys.length; i++) {
									options.iconController.remove({
										key : removeKeys[i]
									});
								}
								connector_ss.resolve();
							}
						}, options);
						
						options.mainController.ticker.unlockAnimation();
					}
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
	 * @memberOf jslgEngine.model.action.ActionJSlgProfile#
	 * @param {Object} options
	 */
	p.restore = function(connector, data, options) {
		var self = this;

		if(!self.isReadyToRestore(connector, options)) return;
	};


	/**
	 * 展開する
	 *
	 * @name expand
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.action.ActionJSlgProfile#
	 * @param {Object} options
	 * <ul>
	 * <li>{jslgEngine.controller.IconController} iconController</li>
	 * <li>{jslgEngine.controller.mainController} mainController</li>
	 * </ul>
	 */
	p.expand = function(options) {};

	o.ActionJSlgProfile = ActionJSlgProfile;
}());
