/*
 * @author cuckoo99
 */

(function() {
	// namespace:
	var o = this.jslgEngine = this.jslgEngine||{};
	o = (o.model = o.model||{});
	o = (o.area = o.area||{});

	/**
	 * <h4>範囲オブジェクト</h4>
	 * <p>
	 * 範囲を表す。
	 * </p>
	 * @class
	 * @name Size
	 * @memberOf jslgEngine.model.area
	 * @constructor
	 */
	var Size = function(options) {
		this.initialize(options);
	};
	/**
	 *
	 */
	var p = Size.prototype;

	/**
	 * 初期化
	 *
	 * @name initialize
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.area.Size#
	 **/
	p.initialize = function(options) {
		var self = this;
		var data = options||{};
		self.width = typeof data.width == 'number' ||
			(typeof data.width == 'string' &&  parseInt(data.width) != NaN) ? data.width : null;
		self.height = typeof data.height == 'number' ||
			(typeof data.height == 'string' &&  parseInt(data.height) != NaN) ? data.height : null;
		self.depth  = typeof data.depth == 'number' ||
			(typeof data.depth == 'string' &&  parseInt(data.depth) != NaN) ? data.depth : null;
	};

	/**
	 * 幅
	 *
	 * @name width
	 * @property
	 * @type Number
	 * @memberOf jslgEngine.model.area.Size#
	 **/
	p.width = null;

	/**
	 * 高さ
	 *
	 * @name height
	 * @property
	 * @type Number
	 * @memberOf jslgEngine.model.area.Size#
	 **/
	p.height = null;

	/**
	 * 奥行き
	 *
	 * @name depth
	 * @property
	 * @type Number
	 * @memberOf jslgEngine.model.area.Size#
	 **/
	p.depth = null;

	/**
	 * 区切り文字
	 *
	 * @name separator
	 * @property
	 * @type String
	 * @memberOf jslgEngine.model.area.Size#
	 **/
	p.separator = '_';

	/**
	 * 座標を連結する。
	 *
	 * @name join
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.area.Size#
	 **/
	p.join = function(size) {
		var self = this;
		self.width = size.width;
		self.height = size.height;
		self.depth = size.depth;
		return self;
	};
	
	/**
	 * 座標のキー文字列として取得
	 *
	 * @name toString
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.area.Size#
	 **/
	p.toString = function(options) {
		var self = this;
		var offset = options ? options.offset : {};
		var width = self.width + offset.width||0;
		var height = self.height + offset.height||0;
		var depth = self.depth + offset.depth||0;
		return [width, height, depth].join(self.separator);
	};

	o.Size = Size;
}());
