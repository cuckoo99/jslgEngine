/*
 * @author cuckoo99
 */

(function() {
	// namespace:
	var o = this.jslgEngine = this.jslgEngine||{};
	o = (o.model = o.model||{});
	o = (o.command = o.command||{});

	/**
	 * <h4>ローカル領域オブジェクト</h4>
	 * <p>
	 * ユーザが操作できる領域
	 * </p>
	 * @class
	 * @name CommandBlockContainer
	 * @memberOf jslgEngine.model.command
	 * @constructor
	 */
	var CommandBlockContainer = jslgEngine.extend(
		jslgEngine.model.common.SerialRunner,
		function(options) {
			this.initialize();
		}
	);
	/**
	 *
	 */
	var p = CommandBlockContainer.prototype;

	/**
	 * 初期化
	 *
	 * @name initialize
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.command.CommandBlockContainer#
	 **/
	p.initialize = function() {
	};

	/**
	 * 座標配列
	 *
	 * @name locations
	 * @property  locations
	 * @type jslgEngine.model.command.Location[]
	 * @memberOf jslgEngine.model.command.CommandBlockContainer#
	 **/
	p.locations = null;

	o.CommandBlockContainer = CommandBlockContainer;
}());
