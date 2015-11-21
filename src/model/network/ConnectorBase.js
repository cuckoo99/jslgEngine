/*
 * @author cuckoo99
 */

(function() {
	// namespace:
	var o = this.jslgEngine = this.jslgEngine||{};
	o = (o.model = o.model||{});
	o = (o.network = o.network||{});

	/**
	 * <h4>Connector基底クラス</h4>
	 * <p>
	 * SLG要素の取得・設定に関する振る舞いを定義する。
	 * </p>
	 * @class
	 * @name ConnectorBase
	 * @memberOf jslgEngine.model.network
	 * @constructor
	 */
	var ConnectorBase = function() {
		this.initialize();
	};
	/**
	 *
	 */
	var p = ConnectorBase.prototype;

	/**
	 * 初期化
	 *
	 * @name initialize
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.network.ConnectorBase#
	 **/
	p.initialize = function() {};

	o.ConnectorBase = ConnectorBase;
}());
