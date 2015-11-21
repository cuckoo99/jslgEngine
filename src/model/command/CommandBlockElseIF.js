/*
 * @author cuckoo99
 */

(function() {
	// namespace:
	var o = this.jslgEngine = this.jslgEngine||{};
	o = (o.model = o.model||{});
	o = (o.command = o.command||{});

	/**
	 * <h4>イベントブロック・IFクラス</h4>
	 * <p>
	 * 条件により分岐が発生する。
	 * </p>
	 * @class
	 * @name CommandBlockElseIF
	 * @memberOf jslgEngine.model.command
	 * @constructor
	 */
	var CommandBlockElseIF = jslgEngine.extend(
		jslgEngine.model.command.CommandBlockIF,
		function(options) {
			this.initialize(options);
		}
	);
	/**
	 *
	 */
	var p = CommandBlockElseIF.prototype;

	/**
	 * クラス名
	 *
	 * @name className
	 * @property
	 * @type String
	 * @memberOf jslgEngine.model.command.CommandBlockElseIF#
	 **/
	p.className = 'CommandBlockElseIF';

	/**
	 * 条件が通ったかどうか。
	 *
	 * @private
	 * @name _passed
	 * @property
	 * @type Boolean
	 * @memberOf jslgEngine.model.command.CommandBlockElseIF#
	 **/
	p._passed = false;

	/**
	 * コード展開（TODO）
	 *
	 * @name expand
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.command.CommandBlockElseIF#
	 * @param {Object} options
	 * <ul>
	 * <li>{jslgEngine.controller.IconController} iconController</li>
	 * <li>{jslgEngine.controller.mainController} mainController</li>
	 * </ul>
	 */
	p.expand = function(options) {};
	
	/**
	 * 実行
	 *
	 * @name run
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.command.CommandBlockIF#
	 * @param {Object} options
	 * <ul>
	 * <li>{jslgEngine.controller.IconController} iconController</li>
	 * <li>{jslgEngine.controller.mainController} mainController</li>
	 * </ul>
	 */
	p.run$ = function(connector, data, options) {
		var self = this;
		connector.resolve();
		if(!self.wasPassed()) {
			self.check(connector, data, options);
			connector.connects(function(connector_s, result_s) {
				if(result_s) {
					var length = self._children.length;
					for(var i = 0; i < length; i++) {
						var child = self._children[i];
		
						child.run(connector_s, data, options);
					}
					self.setPassingInfo(true);
					self._passedHere = true;
				}
			});
		}
	};

	o.CommandBlockElseIF = CommandBlockElseIF;
}());
