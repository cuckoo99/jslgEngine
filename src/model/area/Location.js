/*
 * @author cuckoo99
 */

(function() {
	// namespace:
	var o = this.jslgEngine = this.jslgEngine||{};
	o = (o.model = o.model||{});
	o = (o.area = o.area||{});

	/**
	 * <h4>座標オブジェクト</h4>
	 * <p>
	 * 座標を表す。
	 * </p>
	 * @class
	 * @name Location
	 * @memberOf jslgEngine.model.area
	 * @constructor
	 */
	var Location = function(options) {
		this.initialize(options);
	};
	/**
	 *
	 */
	var p = Location.prototype;

	/**
	 * 初期化
	 *
	 * @name initialize
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.area.Location#
	 **/
	p.initialize = function(options) {
		var self = this;
		var data = options||{};
		if(data.key) {
			var split = data.key.split(jslgEngine.config.locationSeparator);
			data.x = split[0];
			data.y = split[1];
			data.z = split[2];
		}
		self.x = typeof data.x == 'number' ||
			(typeof data.x == 'string' &&  parseInt(data.x) != NaN) ? parseInt(data.x) : null;
		self.y = typeof data.y == 'number' ||
			(typeof data.y == 'string' &&  parseInt(data.y) != NaN) ? parseInt(data.y) : null;
		self.z  = typeof data.z == 'number' ||
			(typeof data.z == 'string' &&  parseInt(data.z) != NaN) ? parseInt(data.z) : null;
	};

	/**
	 * X座標
	 *
	 * @name x
	 * @property
	 * @type Number
	 * @memberOf jslgEngine.model.area.Location#
	 **/
	p.x = null;

	/**
	 * Y座標
	 *
	 * @name y
	 * @property
	 * @type Number
	 * @memberOf jslgEngine.model.area.Location#
	 **/
	p.y = null;

	/**
	 * Z座標
	 *
	 * @name z
	 * @property
	 * @type Number
	 * @memberOf jslgEngine.model.area.Location#
	 **/
	p.z = null;

	/**
	 * 区切り文字
	 *
	 * @name separator
	 * @property
	 * @type String
	 * @memberOf jslgEngine.model.area.Location#
	 **/
	p.separator = '_';

	/**
	 * 座標を連結する。
	 *
	 * @name join
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.area.Location#
	 **/
	p.join = function(location) {
		var self = this;
		self.x = location.x;
		self.y = location.y;
		self.z = location.z;
		return self;
	};
	
	/**
	 * 座標のキー文字列として取得
	 *
	 * @name toString
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.area.Location#
	 **/
	p.toString = function(options) {
		var self = this;
		if(self.x == null || self.y == null || self.z == null) return null;
		var offset = options ? options.offset : {};
		var x = self.x + (offset.x||0);
		var y = self.y + (offset.y||0);
		var z = self.z + (offset.z||0);
		return [x, y, z].join(self.separator);
	};

	o.Location = Location;
}());
