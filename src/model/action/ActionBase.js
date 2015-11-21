/*
 * @author cuckoo99
 */

(function() {
	// namespace:
	var o = this.jslgEngine = this.jslgEngine||{};
	o = (o.model = o.model||{});
	o = (o.action = o.action||{});

	/**
	 * <h4>ActionBase</h4>
	 * <p>
	 * This is abstract class of Action classes。
	 * </p>
	 * @class
	 * @name ActionBase
	 * @memberOf jslgEngine.model.action
	 * @constructor
	 */
	var ActionBase = jslgEngine.extend(
		jslgEngine.model.command.CommandBlockBase,
		function(options) {
			this.initialize(options);
		}
	);
	/**
	 *
	 */
	var p = ActionBase.prototype;

	/**
	 * set up.
	 *
	 * @name initialize
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.action.ActionBase#
	 **/
	p.initialize = function(options) {
		var self = this;
        
		self._parameters = options.parameters;
		self._wasDone = false;
	};

	/**
	 * クラス名
	 *
	 * @name className
	 * @property
	 * @type String
	 * @memberOf jslgEngine.model.action.ActionBase#
	 **/
	p.className = 'ActionBase';

	/**
	 * アクションの種類
	 *
	 * @name statement
	 * @property
	 * @type String
	 * @memberOf jslgEngine.model.action.ActionBase#
	 **/
	p._statement = null;

	/**
	 * parameters
	 *
	 * @name parameters
	 * @property
	 * @type String[]
	 * @memberOf jslgEngine.model.action.ActionBase#
	 **/
	p._parameters = null;

	/**
	 * information for restoration.
	 *
	 * @name _restoreData
	 * @property
	 * @type Object
	 * @memberOf jslgEngine.model.action.ActionBase#
	 **/
	p._restoreData = null;
	
	/**
	 * 初期化
	 *
	 * @name findElements
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.action.ActionBase#
	 * @param {JSON} options
	 * <ul>
	 * {jslgEngine.model.common.JSlgElementFinder} finder
	 * </ul>
	 **/
	p.findElements = function(connector, data, options) {
	};
	
	/**
	 * check if it was done.
	 *
	 * @name wasDone
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.action.ActionBase#
	 * @boolean is_back 逆実行するかどうか
	 */
	p.wasDone = function(options) {
		var self = this;
		var wasDone = self._wasDone;

		if(self._children) {
			var length = self._children.length;
			for(var i = 0; i < length; i++) {
				var child = self._children[i];
				
				if(!child.wasDone()) wasDone = false;
			}
		}
		return wasDone;
	};
	
	/**
	 * check if it was done, case of true, it could not be run.
	 *
	 * @name isReadyToRun
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.action.ActionBase#
	 */
	p.isReadyToRun = function(connector, options) {
		var self = this;
		
		var isNotReady = !self._isAlreadyFound();
		var wasDone = self.wasDone();
		if(isNotReady||wasDone) {
			if(self.run$) {
				connector.resolve();
			}
			if(wasDone) {
				jslgEngine.log(self.className+' was already done.');
			}
			return false;
		}
		jslgEngine.log('Run Action: '+self.className+'('+self._parameters.join(',')+')');
		return true;
	};
	
	/**
	 * check if it was done, case of false, it could not be run.
	 *
	 * @name isReadyToRestore
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.action.ActionBase#
	 * @boolean is_back 逆実行するかどうか
	 */
	p.isReadyToRestore = function(connector, options) {
		var self = this;
		
		var isNotReady = !self._isAlreadyFound();
		var wasDone = self.wasDone();
		if(isNotReady||!wasDone) {
//			jslgEngine.log('Cannot Restore Action: '+self.className+
//					(isNotReady?',has unknown parameters':'')+(wasDone?',wasDone':'')+'('+self._parameters.join(',')+')');
			if(self.restore$) {
				connector.resolve();
			}
			return false;
		}
		jslgEngine.log('Restore Action: '+self.className+'('+self._parameters.join(',')+')');
		return true;
	};
	
	
	/**
	 * Pendingに対して参照があれば評価を行う
	 *
	 * @name checkPending
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.action.ActionBase#
	 * @param {Object} options
	 */
	p.checkPending = function(connector, target_data, data, options) {
		var self = this;
		
		var pendingStack = data[jslgEngine.model.command.keys.PENDING_STACK+data.testIndex];
		
		if(data.checkFunc && pendingStack) {
			if(pendingStack.length == 0) {
				jslgEngine.log('no issue');
				return false;
			}
			
			var pending = pendingStack[pendingStack.length - 1];
			
			//レビューというメソッドで修正値を評価する。
			data.checkFunc(pending, target_data, self.review, options);
			
		}
		return false;
	};
	
	/**
	 * 配列の場合、結果を一つにする。
	 *
	 * @name getAsSingle
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.action.ActionBase#
	 * @param {Object} options
	 */
	p.getAsSingle = function(data, options) {
		var self = this;
		
		if(data instanceof Array && data.length == 1) {
			data = data[0];
		}
		
		return data;
	};
	
	/**
	 * 副イベントを実行する。
	 *
	 * @name runSubCommand
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.action.ActionBase#
	 * @param {Object} options
	 */
	p.runSubCommand = function(connector, key, target, data, sub_data, options) {
		var self = this;
		
		var sub = target.getChild({
			key : key
		});
		
		if(sub) {
			subCommand = sub.getRunnableCommand();
			var nwData = {};
			for(var dataKey in data) {
				nwData[dataKey] = data[dataKey];
			}
			nwData.sender = data.localElements[jslgEngine.model.logic.keys.SELF];
			self.makeDataForSubCommand(connector, nwData, sub_data, options);
			subCommand.run(connector.resolve(), nwData, options);
			self._restoreData.subCommand = subCommand;
			self._restoreData.subCommandData = nwData;
			return true;
		}
		return false;
	};
	
	/**
	 * 副イベントを復元する。
	 *
	 * @name restoreSubCommand
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.action.ActionBase#
	 * @param {Object} options
	 */
	p.restoreSubCommand = function(connector, data, options) {
		var self = this;
		
		var restoreData = self._restoreData||{};
		var subCommand = restoreData.subCommand;
		var subCommandData = restoreData.subCommandData;
		
		if(subCommand) {
			subCommand.restore(connector.resolve(), subCommandData, options);
			connector.pipe(function(connector_s) {
				//delete self._restoreData.subCommand;
				//delete self._restoreData.subCommandData;
				self._restoreData.subCommand = null;
				self._restoreData.subCommandData = null;
				connector_s.resolve();
			});
			return true;
		}
		return false;
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
	p.makeDataForSubCommand = function(connector, data, sub_data, options) {
		var self = this;
		
		self._makeDataForSubCommand(connector, data, sub_data, options);
		return data;
	};
	
	/**
	 * イベント自身を取得する。
	 *
	 * @name getSelfElement
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.action.ActionBase#
	 * @param {Object} options
	 */
	p.getSelfElement = function(connector, data, options) {
		var self = this;
		
		return data.localElements[jslgEngine.model.logic.keys.SELF];
	};
	
	/**
	 * イベント自身を取得する。
	 *
	 * @name setLocalElement
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.action.ActionBase#
	 * @param {Object} options
	 */
	p.setLocalElement = function(connector, key, value, data, options) {
		var self = this;
		
		data.localElements[key] = value;
	};
	
	/**
	 * Validates parameters, and returns reformatted parameters.
	 *
	 * @name validate
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.action.ActionBase#
	 * @param {jslgEngine.model.network.ConnectorBase} connector
	 * @param {Object} data
	 * @param {Object} options
	 */
	p.validate = function(connector, data, options) {
    };
    
	o.ActionBase = ActionBase;
}());
