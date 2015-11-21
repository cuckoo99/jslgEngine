/*
 * @author cuckoo99
 */

(function() {
	// namespace:
	var o = this.jslgEngine = this.jslgEngine||{};
	o = (o.model = o.model||{});
	o = (o.area = o.area||{});

	/**
	 * <h4>領域オブジェクト</h4>
	 * <p>
	 * SLG要素を座標空間のキーによって管理する。
	 * </p>
	 * @class
	 * @name Region
	 * @memberOf jslgEngine.model.area
	 * @constructor
	 */
	var Region = jslgEngine.extend(
		jslgEngine.model.common.JSlgElement,
		function(data, options) {
			this.initialize(data, options);
		}
	);
	/**
	 *
	 */
	var p = Region.prototype;

	/**
	 * クラス名
	 *
	 * @name className
	 * @property
	 * @type String
	 * @memberOf jslgEngine.model.area.Region#
	 **/
	p.className = 'Region';

	/**
	 * パスのキーコード
	 *
	 * @private
	 * @name keyPathCode
	 * @property
	 * @type String[]
	 * @memberOf jslgEngine.model.area.Region#
	 **/
	p._keyPathCodes = [jslgEngine.model.stage.keys.LOCAL_REGION];

	/**
	 * 対象キーコード
	 *
	 * @private
	 * @name keyCode
	 * @property
	 * @type String
	 * @memberOf jslgEngine.model.area.Region#
	 **/
	p._keyCode = jslgEngine.model.stage.keys.LOCAL_REGION;

	/**
	 * 座標
	 *
	 * @name location
	 * @property
	 * @type jslgEngine.model.area.Location
	 * @memberOf jslgEngine.model.area.Region#
	 **/
	p.location = null;

	o.Region = Region;
}());
