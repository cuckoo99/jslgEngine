/*
 * @author cuckoo99
 */

(function() {
	// namespace:
	var o = this.jslgEngine = this.jslgEngine||{};
	o = (o.model = o.model||{});
	o = (o.network = o.network||{});

	/**
	 * <h4>リクエスト・クラス</h4>
	 * <p>
	 * サーバ間でデータを通信する際に、要求するデータを格納する。
	 * </p>
	 * @class
	 * @name Request
	 * @memberOf jslgEngine.model.network
	 * @constructor
	 */
	var Request = function() {
		this.initialize();
	};
	/**
	 *
	 */
	var p = Request.prototype;

	/**
	 * 初期化
	 *
	 * @name initialize
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.network.Request#
	 **/
	p.initialize = function() {};

	o.Request = Request;
}());