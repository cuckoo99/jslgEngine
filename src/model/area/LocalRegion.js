/*
 *
 */

(function() {
	// namespace:
	var o = this.jslgEngine = this.jslgEngine||{};
	o = (o.model = o.model||{});
	o = (o.area = o.area||{});

	/**
	 * <h4>ローカル領域オブジェクト</h4>
	 * <p>
	 * ユーザが操作できる領域
	 * </p>
	 * @class
	 * @name LocalRegion
	 * @memberOf jslgEngine.model.area
	 * @constructor
	 */
	var LocalRegion = jslgEngine.extend(
		jslgEngine.model.area.Region,
		function(data, options) {
			this.initialize(data, options);
			this.userName = data ? data.userName : null;
		}
	);
	/**
	 *
	 */
	var p = LocalRegion.prototype;

	/**
	 * 保有ユーザー
	 *
	 * @name userName
	 * @property
	 * @type String
	 * @memberOf jslgEngine.model.area.LocalRegion#
	 **/
	p.userName = null;

	/**
	 * パスのキーコード
	 *
	 * @private
	 * @name keyPathCode
	 * @property
	 * @type String[]
	 * @memberOf jslgEngine.model.area.LocalRegion#
	 **/
	p._keyPathCodes = [	jslgEngine.model.stage.keys.WORLD_REGION,
						jslgEngine.model.stage.keys.LOCAL_REGION];

	/**
	 * 対象キーコード
	 *
	 * @private
	 * @name keyCode
	 * @property
	 * @type String
	 * @memberOf jslgEngine.model.area.LocalRegion#
	 **/
	p._keyCode = jslgEngine.model.stage.keys.LOCAL_REGION;

	/**
	 * クラス名
	 *
	 * @name className
	 * @property
	 * @type String
	 * @memberOf jslgEngine.model.area.LocalRegion#
	 **/
	p.className = 'LocalRegion';

	/**
	 * 座標を持つかどうか
	 *
	 * @name hasLocation
	 * @property
	 * @type Boolean
	 * @memberOf jslgEngine.model.area.LocalRegion#
	 **/
	p.hasLocation = true;

	/**
	 * 大きさを持つかどうか
	 *
	 * @name hasSize
	 * @property
	 * @type Boolean
	 * @memberOf jslgEngine.model.area.LocalRegion#
	 **/
	p.hasSize = true;

	o.LocalRegion = LocalRegion;
}());
