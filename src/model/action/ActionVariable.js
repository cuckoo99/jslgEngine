/*
 *
 */

(function() {
	// namespace:
	var o = this.jslgEngine = this.jslgEngine||{};
	o = (o.model = o.model||{});
	o = (o.action = o.action||{});

	/**
	 * <h4>コード処理・基本クラス</h4>
	 * <p>
	 * ステージを操作する命令を実行するクラス。
	 * </p>
	 * @class
	 * @name ActionVariable
	 * @memberOf jslgEngine.model.action
	 * @constructor
	 */
	var ActionVariable = jslgEngine.extend(
		jslgEngine.model.action.ActionBase,
		function(options) {
			this.initialize(options);
		}
	);
	/**
	 *
	 */
	var p = ActionVariable.prototype;

	/**
	 * クラス名
	 *
	 * @name className
	 * @property
	 * @type String
	 * @memberOf jslgEngine.model.action.ActionVariable#
	 **/
	p.className = 'ActionVariable';

	/**
	 * 実行
	 *
	 * @name run
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.action.ActionVariable#
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
			var key = result_s[0];
			var val = result_s[1];
			
			key = key.value ? key.value : key;
			//val = val.value ? val.value : val;
			
			jslgEngine.log('make variable:'+key);
			
			// var obj = new jslgEngine.model.common.JSlgElementVariable({
				// key : key
			// }, options);
			// if(val instanceof jslgEngine.model.common.JSlgElementBase) {
				// obj.addChild({
					// obj : val
				// }, options);
			// }
			var obj = val;
			
			self._restoreData = data.localElements[key];
			self.setLocalElement(connector, key, obj, data, options);
			
			self._wasDone = true;
		});
	};

	/**
	 * リストア
	 *
	 * @name restore
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.action.ActionVariable#
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
		connector.connects(function(connector_s, result_s) {
			var key = result_s[0];
			
			key = key.value ? key.value : key;
			
			jslgEngine.log('remove variable:'+key);
			self.setLocalElement(connector, key, self._restoreData, data, options);
			
			self._wasDone = false;
		});
	};


	/**
	 * 展開する
	 *
	 * @name expand
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.action.ActionVariable#
	 * @param {Object} options
	 * <ul>
	 * <li>{jslgEngine.controller.IconController} iconController</li>
	 * <li>{jslgEngine.controller.mainController} mainController</li>
	 * </ul>
	 */
	p.expand = function(options) {};

	o.ActionVariable = ActionVariable;
}());
