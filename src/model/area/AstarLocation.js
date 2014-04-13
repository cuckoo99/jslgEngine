/*
 * @author cuckoo99
 */

(function() {
	// namespace:
	var o = this.jslgEngine = this.jslgEngine||{};
	o = (o.model = o.model||{});
	o = (o.area = o.area||{});

	/**
	 * <h4>座標オブジェクト（A*アルゴリズム用）</h4>
	 * <p>
	 * 座標を表す。
	 * </p>
	 * @class
	 * @name AstarLocation
	 * @memberOf jslgEngine.model.area
	 * @constructor
	 */
	var AstarLocation = jslgEngine.extend(
		jslgEngine.model.area.Location,
		function(options) {
			this.initialize(options);
			
			this.cost = options.cost;
			this.parent = options.parent;
		}
	);
	/**
	 *
	 */
	var p = AstarLocation.prototype;

	/**
	 * 移動コスト
	 *
	 * @name cost
	 * @property
	 * @type Number
	 * @memberOf jslgEngine.model.area.AstarLocation#
	 **/
	p.cost = null;

	/**
	 * 移動元座標
	 *
	 * @name parent
	 * @property
	 * @type jslgEngine.model.area.AstarLocation
	 * @memberOf jslgEngine.model.area.AstarLocation#
	 **/
	p.parent = null;
	
	o.AstarLocation = AstarLocation;
}());
