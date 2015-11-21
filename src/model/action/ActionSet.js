/*
 * @author cuckoo99
 */

(function() {
	// namespace:
	var o = this.jslgEngine = this.jslgEngine||{};
	o = (o.model = o.model||{});
	o = (o.action = o.action||{});

	/**
	 * <h4>コード処理・設定クラス</h4>
	 * <p>
	 * 要素にステータス値を設定する。
	 * </p>
	 * @class
	 * @name ActionSet
	 * @memberOf jslgEngine.model.action
	 * @constructor
	 */
	var ActionSet = jslgEngine.extend(
		jslgEngine.model.action.ActionBase,
		function(options) {
			this.initialize(options);
		}
	);
	/**
	 *
	 */
	var p = ActionSet.prototype;
	
	/**
	 * クラス名
	 *
	 * @name className
	 * @property
	 * @type String
	 * @memberOf jslgEngine.model.action.ActionSet#
	 **/
	p.className = 'ActionSet';

	/**
	 * 実行
	 *
	 * @name run
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.action.ActionSet#
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
		
		self._readAllElements(connector, data, options);
		connector.connects(function(connector_s, result_s) {
			var target = result_s[0];
			var key = result_s[1];
			var setElement = result_s[2];
			
			if(target === null || key === null) {
				jslgEngine.log(self.className + ' has no enough parameters.');
				return;
			}
			
			if(!target instanceof jslgEngine.model.common.JSlgElementBase) {
				jslgEngine.log(self.className + '\'s targets must be status element.');
				return;
			}
	
			var restoreObj;
			var isInvalid = false;
			
			key = key.value ? key.value : key;
			
			setElement = self.getAsSingle(setElement);
			setElement = setElement.value != null ? setElement.value : setElement;
			
			//TODO: 複数要素の書き換え可能にする予定
			if(setElement instanceof jslgEngine.model.common.JSlgElementBase) {
				//設定対象が要素だった場合
				target = target.getChild({
					key : key
				});
				
				if(target instanceof jslgEngine.model.common.JSlgElementVariable) {
					//変数の場合
					if(!setElement) {
						//無指定の場合、要素を全て消去する。
						restoreObj = target;
						target.clearChildren();
					} else {
						//要素を追加する。
						restoreObj = target.getChild({
							key : setElement.getKey()
						});
						target.addChild({
							obj : setElement
						}, options);
					}
					jslgEngine.log('set key:'+key+', value:'+setElement.getPath()+', before:'+
						(restoreObj ? restoreObj.getPath() : 'null')+', in:'+target.getPath());
				} else {
					jslgEngine.log(self.className + ': Invalid target');
					isInvalid = true;
				}
			} else {
				//設定対象が値だった場合
				
				self.checkPending(connector, {
					key : key,
					target : target,
					setElement : setElement,
					testIndex : data.testIndex
				}, options);
				
				//数値または文字列要素などの場合、ステータスと判断
				restoreObj = target.getStatus(key);
				restoreObj = restoreObj ? restoreObj.value : restoreObj;
				jslgEngine.log('set key:'+key+', value:'+setElement+', before:'+
					(restoreObj ? restoreObj : 'null')+', in:'+target.getPath());
				target.setStatus(key, setElement);
			}
			
			self._restoreData = {};
			if(!isInvalid) {
				self._restoreData = {
					target : result_s[0],
					key : key,
					setElement : restoreObj
				};			
			}
			
			self._wasDone = true;
			
			var subData = {
				target : target,
				before : restoreObj,
				after : setElement
			};
			if(!self.runSubCommand(connector_s, 'onChange', target, data, subData, options)) {
			}
		});
		connector.connects(function(connector_s, result_s) {
			jslgEngine.log('hogeset');
		});
	};

	/**
	 * リストア
	 *
	 * @name restore
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.action.ActionSet#
	 * @param {Object} options
	 * <ul>
	 * <li>{jslgEngine.controller.IconController} iconController</li>
	 * <li>{jslgEngine.controller.mainController} mainController</li>
	 * </ul>
	 */
	p.restore$ = function(connector, data, options) {
		var self = this;

		if(!self.isReadyToRestore(connector, options)) return;
		
		connector.resolve();
		
		connector.pipe(function(connector_s) {
			if(!self.restoreSubCommand(connector_s, data, options)) {
				connector_s.resolve();
			}
		});
		
		self._readAllElements(connector, data, options);
		connector.connects(function(connector_s, result_s) {
			var target = self._restoreData.target;
			var key = self._restoreData.key;
			var setElement = self._restoreData.setElement;
			
			if(target === null || key === null) {
				jslgEngine.log(self.className + ' has no enough parameters.');
				return;
			}
		
			if(!(setElement instanceof jslgEngine.model.common.JSlgElementBase)) {
				jslgEngine.log('set(restore) key:'+key+', value:'+setElement+', in'+target.getPath());
				target.setStatus(key, setElement);
			} else {
				jslgEngine.log('set(restore) key:'+key+', value:'+(setElement ? setElement.getPath() : 'null')+', in:'+target.getPath());
				var obj = target.getChild({
					key : key
				});
				
				if(setElement) {
					obj.addChild({
						obj : setElement
					}, options);
				} else {
					target.removeChild({
						key : key
					}, options);
				}
			}
			connector_s.resolve();
		});
		
		self._wasDone = false;
	};

	/**
	 * 副イベントのための情報を作成する。
	 *
	 * @name makeDataForSubCommand
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.action.ActionBase#
	 * @param {Object} options
	 */
	p._makeDataForSubCommand = function(connector, data, sub_data, options) {
		var self = this;
		var localElements = data.localElements;
		var target = sub_data.target;
		var before = sub_data.before;
		var after = sub_data.after;
		
		var key =　['$',self.className].join('');
		localElements[key] = new jslgEngine.model.common.JSlgElementVariable({
			key : key,
			isArray : true
		});
		var targetVariable = new jslgEngine.model.common.JSlgElementVariable({
			key : 'target'
		});
		targetVariable.addChild({
			obj : target
		});
		localElements[key].addChild({
			obj : targetVariable
		});
		localElements[key].setStatus('before', before);
		localElements[key].setStatus('after', after);
		var changeValue = ((!isNaN(before)) && (!isNaN(after))) ? after-before:0;
		localElements[key].setStatus('changeValue', changeValue);
		
		return data;
	};

	/**
	 * 副イベントのための情報を削除する。
	 *
	 * @name removeDataForSubCommand
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.action.ActionBase#
	 * @param {Object} options
	 */
	p.removeDataForSubCommand = function(connector, data, options) {
		var self = this;
		
		return data;
	};
	
	/**
	 * 展開する
	 *
	 * @name expand
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.action.ActionSet#
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
	 * @memberOf jslgEngine.model.action.ActionSet#
	 * @param {Object} options
	 */
	p.review = function(result, data, options) {
		//Mindから得た情報を元に評価を行う
		var reputation = 0;
		var key = data.key;
		var setElement = data.setElement;
		
		for(var i = 0; i < result.family.length; i++) {
			var family = result.family[i];
			var status = family.data.getStatus(key);
			
			if(status) {
				before = status.value;
				after = data.setElement;
				
				reputation -= Math.abs(after - before);
			}
		}
		for(var i = 0; i < result.enemy.length; i++) {
			var enemy = result.enemy[i];
			var status = enemy.data.getStatus(key);
			
			if(status) {
				before = status.value;
				after = data.setElement;
				
				reputation += -Math.abs(after - before);
			}
		}
		
		jslgEngine.log('ActionSet point:'+reputation);
		
		return {
			point : reputation
		};
	};
	
	o.ActionSet = ActionSet;
}());
