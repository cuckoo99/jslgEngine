/*
 * @author cuckoo99
 */

(function() {
	// namespace:
	var o = this.jslgEngine = this.jslgEngine||{};
	o = (o.model = o.model||{});
	o = (o.network = o.network||{});

	/**
	 * <h4>レスポンス・クラス</h4>
	 * <p>
	 * サーバ間でデータを通信する際に、返却されるデータを格納する。
	 * </p>
	 * @class
	 * @name Response
	 * @memberOf jslgEngine.model.network
	 * @constructor
	 */
	var Response = function() {
		this.initialize();
	};
	/**
	 *
	 */
	var p = Response.prototype;

	/**
	 * 初期化
	 *
	 * @name initialize
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.network.Response#
	 **/
	p.initialize = function() {};

	o.Response = Response;
}());
