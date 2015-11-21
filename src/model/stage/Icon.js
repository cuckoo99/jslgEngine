/*
 * @author cuckoo99
 */

(function() {
	// namespace:
	var o = this.jslgEngine = this.jslgEngine||{};
	o = (o.model = o.model||{});
	o = (o.stage = o.stage||{});

	/**
	 * <h4>アイコンクラス</h4>
	 * <p>
	 * 画面に描画されるオブジェクトと結びついた要素。
	 * </p>
	 * @class
	 * @name Icon
	 * @memberOf jslgEngine.model.stage
	 * @constructor
	 */
	var Icon = jslgEngine.extend(
		jslgEngine.model.common.JSlgElement,
		function(data, options) {
			this.initialize(data, options);
		}
	);
	/**
	 *
	 */
	var p = Icon.prototype;

	/**
	 * クラス名
	 *
	 * @name className
	 * @property
	 * @type String
	 * @memberOf jslgEngine.model.stage.Icon#
	 **/
	p.className = 'Icon';

	/**
	 * 対象キーコード
	 *
	 * @name keyCode
	 * @property
	 * @type String
	 * @memberOf jslgEngine.model.stage.Icon#
	 **/
	p._keyCode = jslgEngine.model.stage.keys.ICON;

	/**
	 * どこにでも着脱可能かどうか
	 *
	 * @name _isFloat
	 * @property
	 * @type Boolean
	 * @memberOf jslgEngine.model.stage.Icon#
	 **/
	p._isFloat = true;

	/**
	 * 描画オフセット
	 *
	 * @name offset
	 * @property
	 * @type JSON
	 * @memberOf jslgEngine.model.stage.Icon#
	 **/
	p.offset = null;

	/**
	 * 待機状態を維持するためのオブジェクト
	 *
	 * @name connector
	 * @property
	 * @type jslgEngine.model.network.ConnectorBase
	 * @memberOf jslgEngine.model.stage.Icon#
	 **/
	p.connector = null;

	/**
	 * 実行イベント
	 *
	 * @name run
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.stage.Icon#
	 * @param {JSON} options
	 * <ul>
	 * <li>{jslgEngine.controller.IconManager} iconManager</li>
	 * <li></li>
	 * </ul>
	 **/
	p.run = function(options) {
		connector.resolve();
		mainController.kick(options);
	};

	o.Icon = Icon;
}());
