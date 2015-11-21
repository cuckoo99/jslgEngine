/*
 * @author cuckoo99
 */

(function() {
	// namespace:
	var o = this.jslgEngine = this.jslgEngine||{};
	o = (o.model = o.model||{});
	o = (o.network = o.network||{});

	/**
	 * <h4>オフライン実行クラス</h4>
	 * <p>
	 * 実行環境がオフラインの場合の振る舞いを制御する。
	 * </p>
	 * @class
	 * @name ConnectorOffline
	 * @memberOf jslgEngine.model.network
	 * @constructor
	 */
	var ConnectorOffline = function() {
		this.initialize();
	};
	/**
	 *
	 */
	var p = ConnectorOffline.prototype;

	/**
	 * 初期化
	 *
	 * @name initialize
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.network.ConnectorOffline#
	 **/
	p.initialize = function() {};

	o.ConnectorOffline = ConnectorOffline;
}());
