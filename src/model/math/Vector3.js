/*
 * @author cuckoo99
 */

(function() {
	// namespace:
	var o = this.jslgEngine = this.jslgEngine||{};
	o = (o.model = o.model||{});
	o = (o.area = o.area||{});

	/**
	 * <h4>ベクトル・オブジェクト</h4>
	 * <p>
	 * ベクトルを表す。
	 * </p>
	 * @class
	 * @name Vector3
	 * @memberOf jslgEngine.model.math
	 * @constructor
	 */
	var Vector3 = function(options) {
		this.initialize(options);
	};
	/**
	 *
	 */
	var p = Vector3.prototype;

	/**
	 * 初期化
	 *
	 * @name initialize
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.math.Vector3#
	 **/
	p.initialize = function(options) {
		var self = this;
		var data = options||{};
		if(data.key) {
			var split = data.key.split(jslgEngine.config.Vector3Separator);
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
	 * @memberOf jslgEngine.model.math.Vector3#
	 **/
	p.x = null;

	/**
	 * Y座標
	 *
	 * @name y
	 * @property
	 * @type Number
	 * @memberOf jslgEngine.model.math.Vector3#
	 **/
	p.y = null;

	/**
	 * Z座標
	 *
	 * @name z
	 * @property
	 * @type Number
	 * @memberOf jslgEngine.model.math.Vector3#
	 **/
	p.z = null;

	/**
	 * 区切り文字
	 *
	 * @name separator
	 * @property
	 * @type String
	 * @memberOf jslgEngine.model.math.Vector3#
	 **/
	p.separator = '_';

	/**
	 * 座標を連結する。
	 *
	 * @name join
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.math.Vector3#
	 **/
	p.join = function(Vector3) {
		var self = this;
		self.x = Vector3.x;
		self.y = Vector3.y;
		self.z = Vector3.z;
		return self;
	};
	
	/**
	 * 座標のキー文字列として取得
	 *
	 * @name toString
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.math.Vector3#
	 **/
	p.toString = function(options) {
		var self = this;
		var offset = options ? options.offset : {};
		var x = self.x + (offset.x||0);
		var y = self.y + (offset.y||0);
		var z = self.z + (offset.z||0);
		return [x, y, z].join(self.separator);
	};
	
	/**
	 * 加算
	 *
	 * @name add
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.math.Vector3#
	 **/
	p.add = function(other) {
        var self = this;
		self.x += other.x;
		self.y += other.y;
		self.z += other.z;
	};

	/**
	 * 加算
	 *
	 * @name subtract
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.math.Vector3#
	 **/
	p.subtract = function(other) {
        var self = this;
		x -= other.x;
		y -= other.y;
		z -= other.z;
	};
	
	/**
	 * 乗算
	 *
	 * @name multiply
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.math.Vector3#
	 **/
	p.multiply = function(magnitude) {
        var self = this;
		self.x *= magnitude;
		self.y *= magnitude;
		self.z *= magnitude;
	}

	/**
	 * 除算
	 *
	 * @name divide
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.math.Vector3#
	 **/
	p.divide = function(magnitude) {
        var self = this;
		if (magnitude != 0.0) {
			self.x /= magnitude;
			self.y /= magnitude;
			self.z /= magnitude;
		};
	};

	/**
	 * ベクトルを設定
	 *
	 * @name set
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.math.Vector3#
	 **/
	p.set = function(other) {
        var self = this;
		self.x = other.x;
		self.y = other.y;
		self.z = other.z;
	};

	/**
	 * 長さを取得
	 *
	 * @name dot
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.math.Vector3#
	 **/
	p.dot = function(other) {
		return (x * other.x) + (y * other.y) + (z * other.z);
	};
	
	/**
	 * 長さを取得
	 *
	 * @name length
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.math.Vector3#
	 **/
	p.length = function() {
		var self = this;
		return Math.sqrt(self.length2());
	};

	/**
	 * 長さを取得
	 *
	 * @name length2
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.math.Vector3#
	 **/
	p.length2 = function() {
        var self = this;
		return (self.x * self.x) + (self.y * self.y) + (self.z * self.z);
	};

	/**
	 * 外積を取得
	 *
	 * @name cross
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.math.Vector3#
	 **/
	p.cross = function(other) {
        var self = this;
		self.x = (y*other.z)-(other.y*z);
		self.y = (z*other.x)-(other.z*x);
		self.z = (x*other.y)-(other.x*y);
	};
	
	/**
	 * 外積を取得
	 *
	 * @name cross2
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.math.Vector3#
	 **/
	p.cross2 = function(other, other2) {
		return new Vector3((other.y*other2.z)-(other2.y*other.z),
				(other.z*other2.x)-(other2.z*other.x),
				(other.x*other2.y)-(other2.x*other.y));
	};
	
	/**
	 * 長さを得る
	 *
	 * @name distance2
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.math.Vector3#
	 **/
	p.distance2 = function(other) {
		var dx = self.x - other.x;
		var dy = self.y - other.y;
		var dz = self.z - other.z;
		return (dx * dx) + (dy * dy) + (dz * dz);
	};

	/**
	 * 正規化
	 *
	 * @name normalize
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.math.Vector3#
	 **/
	p.normalize = function() {
        var self = this;
		var magnitude = self.length();
		if (magnitude != 0.0) {
			self.x /= magnitude;
			self.y /= magnitude;
			self.z /= magnitude;
		};
		return magnitude;
	};

	/**
	 * ゼロベクトルの取得
	 *
	 * @name zero
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.math.Vector3#
	 **/
	p.zero = function() {
        var self = this;
		self.set(0.0, 0.0, 0.0);
	};
	
	o.Vector3 = Vector3;
}());
