/*
 * @author cuckoo99
 */

(function() {
	// namespace:
	var o = this.jslgEngine = this.jslgEngine||{};
	o = (o.model = o.model||{});
	o = (o.network = o.network||{});

	/**
	 * <h4>Ajaxクラス</h4>
	 * <p>
	 * 非同期通信を実装する。
	 * </p>
	 * @class
	 * @name Ajax
	 * @memberOf jslgEngine.model.network
	 * @constructor
	 */
	var Ajax = function() {
		this.initialize();
	};
	/**
	 *
	 */
	var p = Ajax.prototype;

	/**
	 * 初期化
	 *
	 * @name initialize
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.network.Ajax#
	 **/
	p.initialize = function() {};

	/**
	 * 非同期通信
	 *
	 * @name run
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.network.Ajax#
	 * @param {JSON} options
	 * <ul>
	 * <li>{jslgEngine.model.network.ConnectorBase} connector</li>
	 * <li>{Number} method POST or GET</li>
	 * <li>{Number} url 通信</li>
	 * <li>{JSON} data データ</li>
	 * </ul>
	 **/
	p.run = function(options) {
		return $.ajax(options);
	};

	o.Ajax = Ajax;
}());
