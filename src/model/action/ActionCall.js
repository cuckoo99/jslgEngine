/*
 * @author cuckoo99
 */

(function() {
	// namespace:
	var o = this.jslgEngine = this.jslgEngine||{};
	o = (o.model = o.model||{});
	o = (o.action = o.action||{});

	/**
	 * <h4>コード処理・関数実行クラス</h4>
	 * <p>
	 * SLG要素の関数を実行する。
	 * </p>
	 * @class
	 * @name ActionCall
	 * @memberOf jslgEngine.model.action
	 * @constructor
	 */
	var ActionCall = jslgEngine.extend(
		jslgEngine.model.action.ActionBase,
		function(options) {
			this.initialize(options);
		}
	);
	/**
	 *
	 */
	var p = ActionCall.prototype;
	
	/**
	 * クラス名
	 *
	 * @name className
	 * @property
	 * @type String
	 * @memberOf jslgEngine.model.action.ActionCall#
	 **/
	p.className = 'ActionCall';

	/**
	 * 実行
	 *
	 * @name run
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.action.ActionCall#
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
		connector.pipe(function(connector_s, result_s) {
			connector_s.resolve();
			
			var target = result_s[0];
			var parametersParameter = result_s[1];
			
			if(target === null) {
				jslgEngine.log(self.className + ' has no enough parameters.');
				return;
			}
	
			if(!target instanceof jslgEngine.model.command.Command) {
				jslgEngine.log(self.className + '\'s targets must be status element.');
				return;
			}
	
			self._wasDone = true;
			
			target = target.getRunnableCommand();
			var nwData = {};
			nwData.parameters = {};
			for(var dataKey in data) {
				nwData[dataKey] = data[dataKey];
			}
			//set parameters
			if(parametersParameter instanceof Array) {
				for(var i = 0; i < parametersParameter.length; i++) {
					if(parametersParameter[i] instanceof Array) {
						var key = parametersParameter[i][0].value;
						var value = parametersParameter[i][1];
						
						nwData.parameters[key] = value;
					}
				}
			}
			nwData.sender = self.getSelfElement(connector, data, options);
			self._restoreData = {};
			self._restoreData.subCommand = target;
			self._restoreData.subCommandData = nwData;
	
			target.run(connector_s, nwData, options);
		});
	};

	/**
	 * リストア
	 *
	 * @name restore
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.action.ActionCall#
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
		
		self._readAllElements(connector, data, options);
		connector.pipe(function(connector_s, result_s) {
			connector_s.resolve();
		
			var target = result_s[0];
			
			if(target === null) {
				jslgEngine.log(self.className + ' has no enough parameters.');
				return;
			}
			
			if(!target instanceof jslgEngine.model.command.Command) {
				jslgEngine.log(self.className + '\'s targets must be status element.');
				return;
			}
			
			self._wasDone = false;
			
			var restoreData = self._restoreData||{};
			var subCommand = restoreData.subCommand;
			var subCommandData = restoreData.subCommandData;
			
			if(subCommand) {
				subCommand.restore(connector_s, subCommandData, options);
				connector_s.connects(function(connector_ss) {
					jslgEngine.dispose(subCommand);
				});
			}
		});
	};


	/**
	 * 展開する
	 *
	 * @name expand
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.action.ActionCall#
	 * @param {Object} options
	 * <ul>
	 * <li>{jslgEngine.controller.IconController} iconController</li>
	 * <li>{jslgEngine.controller.mainController} mainController</li>
	 * </ul>
	 */
	p.expand = function(options) {};

	o.ActionCall = ActionCall;
}());
