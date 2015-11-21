/*
 *
 */

(function() {
	// namespace:
	var o = this.jslgEngine = this.jslgEngine||{};
	o = (o.model = o.model||{});
	o = (o.area = o.area||{});

	/**
	 * <h4>範囲・オブジェクト</h4>
	 * <p>
	 * ゲームにおける範囲を表す。
	 * </p>
	 * @class
	 * @name Area
	 * @memberOf jslgEngine.model.area
	 * @constructor
	 */
	var Area = jslgEngine.extend(
		jslgEngine.model.common.JSlgElement,
		function(options) {
			this.initialize(options);
			
			this.splitIndex = 0;
			this.locations = [];
			this.isMulti = false;
		}
	);
	/**
	 *
	 */
	var p = Area.prototype;

	/**
	 * 識別キー
	 *
	 * @name key
	 * @property
	 * @type String
	 * @memberOf jslgEngine.model.area.Area#
	 **/
	p.key = null;

	/**
	 * 識別キー
	 *
	 * @name splitIndex
	 * @property
	 * @type Number
	 * @memberOf jslgEngine.model.area.Area#
	 **/
	p.splitIndex = null;

	/**
	 * 座標が適用されたかどうか
	 *
	 * @name _isApplied
	 * @property
	 * @type Boolean
	 * @memberOf jslgEngine.model.area.Area#
	 **/
	p._isApplied = false;

	/**
	 * 適用された座標
	 *
	 * @name appliedLocation
	 * @property
	 * @type jslgEngine.model.area.Location
	 * @memberOf jslgEngine.model.area.Area#
	 **/
	p.appliedLocation = null;

	/**
	 * 選択範囲
	 *
	 * @name locations
	 * @property
	 * @type Array
	 * @memberOf jslgEngine.model.area.Area#
	 **/
	p.locations = null;

	/**
	 * 複数の選択が可能
	 *
	 * @name isMulti
	 * @property
	 * @type Array
	 * @memberOf jslgEngine.model.area.Area#
	 **/
	p.isMulti = null;

	o.Area = Area;
}());
