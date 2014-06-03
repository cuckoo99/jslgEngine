/*
 *
 */

(function() {
	// namespace:
	var o = this.jslgEngine = this.jslgEngine||{};
	o = (o.model = o.model||{});
	o = (o.area = o.area||{});

	/**
	 * <h4>ワールド領域オブジェクト</h4>
	 * <p>
	 * ローカル領域を保有するグローバル領域
	 * </p>
	 * @class
	 * @name WorldRegion
	 * @memberOf jslgEngine.model.area
	 * @constructor
	 */
	var WorldRegion = jslgEngine.extend(
		jslgEngine.model.area.Region,
		function(data, options) {
			this.initialize(data, options);
		}
	);
	/**
	 *
	 */
	var p = WorldRegion.prototype;

	/**
	 * パスのキーコード
	 *
	 * @private
	 * @name keyPathCode
	 * @property
	 * @type String[]
	 * @memberOf jslgEngine.model.area.WorldRegion#
	 **/
	p._keyPathCodes = [jslgEngine.model.stage.keys.WORLD_REGION];

	/**
	 * 対象キーコード
	 *
	 * @private
	 * @name keyCode
	 * @property
	 * @type String
	 * @memberOf jslgEngine.model.area.WorldRegion#
	 **/
	p._keyCode = jslgEngine.model.stage.keys.WORLD_REGION;

	/**
	 * クラス名
	 *
	 * @name className
	 * @property
	 * @type String
	 * @memberOf jslgEngine.model.area.WorldRegion#
	 **/
	p.className = 'WorldRegion';

	/**
	 * 座標を持つかどうか
	 *
	 * @name hasLocation
	 * @property
	 * @type Boolean
	 * @memberOf jslgEngine.model.area.WorldRegion#
	 **/
	p.hasLocation = false;

	/**
	 * ローカル領域にユーザ領域を与える。
	 *
	 * @name lent
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.area.WorldRegion#
	 **/
	p.lent = function() {
	};

	/**
	 * ローカル領域にユーザ領域を与える。
	 *
	 * @name grant
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.area.WorldRegion#
	 **/
	p.grant = function() {
	};

	/**
	 * ローカル領域にユーザ領域を与える事を許可しない。
	 *
	 * @name deny
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.area.WorldRegion#
	 **/
	p.deny = function() {
	};

	/**
	 * ユーザが使用しているローカル領域を取得する。
	 *
	 * @name getActiveLocalRegions
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.area.WorldRegion#
	 **/
	p.getActiveLocalRegions = function(options) {
		var self = this;
		var localRegions = [];
		var length = self._children.length;
		for(var i = 0; i < length; i++) {
			var child = self._children[i];
			
			if(options.userName == child.userName) {
				localRegions.push(child);
			}
		}
		return localRegions;
	};

	o.WorldRegion = WorldRegion;
}());
