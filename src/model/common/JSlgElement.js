/*
 * @author cuckoo99
 */

(function() {
	// namespace:
	var o = this.jslgEngine = this.jslgEngine||{};
	o = (o.model = o.model||{});
	o = (o.common = o.common||{});

	/**
	 * <h4>SLG要素</h4>
	 * <p>
	 * ゲームに用いられる、全ての物理的要素。
	 * </p>
	 * @class
	 * @name JSlgElement
	 * @memberOf jslgEngine.model.common
	 * @constructor
	 */
	var JSlgElement = jslgEngine.extend(
		jslgEngine.model.common.JSlgElementFrame,
		function(data, options) {
            this.initialize(data, options);
		}
	);
	/**
	 *
	 */
	var p = JSlgElement.prototype;

	/**
	 * クラス名
	 *
	 * @name className
	 * @property
	 * @type String
	 * @memberOf jslgEngine.model.common.JSlgElement#
	 **/
	p.className = 'Element';

	/**
	 * 要素のタイプ
	 *
	 * @name elementType
	 * @property
	 * @type String
	 * @memberOf jslgEngine.model.common.JSlgElement#
	 **/
	p.elementType = 'Element';

	/**
	 * 描画オフセット
	 *
	 * @name canvasOffset
	 * @property
	 * @type jslgEngine.model.area.Location
	 * @memberOf jslgEngine.model.common.JSlgElement#
	 **/
	p.canvasOffset = null;

	/**
	 * 描画オフセット
	 *
	 * @name canvasParentsOffset
	 * @property
	 * @type jslgEngine.model.area.Location
	 * @memberOf jslgEngine.model.common.JSlgElement#
	 **/
	p.canvasParentsOffset = null;

	/**
	 * 座標
	 *
	 * @name location
	 * @property
	 * @type jslgEngine.model.area.Location
	 * @memberOf jslgEngine.model.common.JSlgElement#
	 **/
	p.location = null;

	/**
	 * 座標を持つかどうか
	 *
	 * @name hasLocation
	 * @property
	 * @type Boolean
	 * @memberOf jslgEngine.model.common.JSlgElement#
	 **/
	p.hasLocation = false;

	/**
	 * 初期化
	 *
	 * @name initialize
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.common.JSlgElement#
	 **/
	p.initialize = function(data, options) {
		var self = this;

        p.__super__.initialize.call(self, data, options);
        
		//ここからBaseとが違う？
		self._resetOffset(data ? data.parent : null);
		if(self.hasLocation) {
			self.location = data ? data.location : 
			new jslgEngine.model.area.Location({x : 0, y : 0, z : 0});
		}
		if(self.hasSize) {
			self.size = data ? data.size : 
			new jslgEngine.model.area.Size({width : 0, height : 0, depth : 0});
		}
		if(data) {
			self.canvasOffset = data.canvasOffset ? data.canvasOffset : self.canvasOffset;
		}
	};
	/**
	 * 絶対座標の設定
	 *
	 * @name _refreshLocation
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.common.JSlgElement#
	 * @param {Object} options
	 */
	p._refreshLocation = function(options) {
		var self = this;
		var xKey = jslgEngine.model.common.keys.X_KEY;
		var yKey = jslgEngine.model.common.keys.Y_KEY;
		var zKey = jslgEngine.model.common.keys.Z_KEY;
		
		//子要素にグローバル座標を設定し、
		//書き換えられたときにローカル座標を修正する。
		//TODO: やはり座標は直接書き換えるべきでないと思うので、読み取り専用とする。
		//		それは親要素への影響が計りしえない（座標の存在する親までさかのぼる）
		
		var offset = self.offset;
		var globalLocation = self.getGlobalLocation();
		self.setStatus(xKey, globalLocation.x);
		self.setStatus(yKey, globalLocation.y);
		self.setStatus(zKey, globalLocation.z);
	};
	
	/**
	 * 子要素の取得
	 *
	 * @name getChildrenByLocation
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.common.JSlgElement#
	 * @param {Object} options
	 * <ul>
	 * <li>{jslgEngine.model.network.ConnectorBase} connector</li>
	 * <li>{jslgEngine.model.common.JSlgElementFinder} finder</li>
	 * <li>{String} filter</li>
	 * </ul>
	 */
	p.getChildrenByLocation = function(options) {
		var self = this;
		var child = null;
		options.list = (options.list||[]);
		
		var data = {
		};

		options.list.push(self.getChild(options));

		var length = self._children.length;
		for(var i = 0; i < length; i++) {
			self._children.getChildrenByLocation(options);
		}
	};

	/**
	 * キーの書き換え（再帰処理）
	 *
	 * @name resetKey
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.common.JSlgElement#
	 * @param {jslgEngine.model.common.JSlgElementBase} element キー書き換え元要素
	 */
	p.resetKey = function(element) {
		var self = this;
		self._resetOffset(element);
		self._refreshLocation();
		self.resetCanvasOffset(element);
		self._resetKey(element);
	};
	
	/**
	 * 座標の取得
	 *
	 * @name getLocation
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.common.JSlgElement#
	 **/
	p.getLocation = function(options) {
		var self = this;
		
		return self.hasLocation ? self.location : null;
	};

	/**
	 * 絶対座標の取得
	 *
	 * @name getGlobalLocation
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.common.JSlgElement#
	 **/
	p.getGlobalLocation = function(options) {
		var self = this;
		
		//if(!self.hasLocation) return null;
		var location = self.hasLocation ? self.location : { x : 0, y : 0, z : 0};
		
		
		return new jslgEngine.model.area.Location({
			x : location.x + self.offset.x,
			y : location.y + self.offset.y,
			z : location.z + self.offset.z});
	};

	/**
	 * 描画座標を取得する
	 *
	 * @name getPosition
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.common.JSlgElement#
	 * @returns {String}
	 */
	p.getPosition = function(data, options) {
		var self = this;
		
		var parent = self.getParent(options)||{};
		
		return parent.getPosition ? parent.getPosition(data, options) : {x:0,y:0,z:0};
	};

	/**
	 * 必要ないかも。getPositionで個別にまとめられる。
	 *
	 * @name getCanvasOffset
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.common.JSlgElement#
	 * @returns {String}
	 */
	p.getCanvasOffset = function(data, options) {
		var self = this;
		
		var canvasOffset = self.canvasOffset||{ x : 0, y : 0, z : 0 };
		var canvasParentsOffset = self.canvasParentsOffset||{ x : 0, y : 0, z : 0 };
		return {
			x : canvasOffset.x + canvasParentsOffset.x,
			y : canvasOffset.y + canvasParentsOffset.y,
			z : canvasOffset.z + canvasParentsOffset.z
		};
	};

	/**
	 * 大きさの取得
	 *
	 * @name getSize
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.common.JSlgElement#
	 **/
	p.getSize = function(options) {
		var self = this;
		
		return self.hasSize ? self.size : null;
	};

	/**
	 * 範囲内に座標が存在するかどうか
	 *
	 * @name exists
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.common.JSlgElement#
	 * @returns {Boolean}
	 **/
	p.exists = function(location) {
		var self = this;
		var myLocation = self.location;
		if(!myLocation) {
			myLocation = {x:0,y:0,z:0};
		}
		//if(!myLocation) return false;
		if(!self.hasSize) {
			return self.offset.toString({ offset : myLocation }) ===
				[location.x,location.y,location.z].join(jslgEngine.config.locationSeparator);
		}
		var x = self.offset.x + myLocation.x;
		var y = self.offset.y + myLocation.y;
		var z = self.offset.z + myLocation.z;
		return (	location.x >= x &&
					location.x < x + self.size.width &&
					location.y >= y &&
					location.y < y + self.size.height &&
					location.z >= z &&
					location.z < z + self.size.depth);
	};
	
	/**
	 * JSON形式として返す
	 *
	 * @name toJsonString
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.common.JSlgElement#
	 * @returns {String}
	 */
	p.toJsonString = function(options) {
		var self = this;
		var length, text = '';
		var obj = [];
		
		text+='{';
		text+='\"type\":\"Element\",';
		text+='\"className\":\"'+self.className+'\",';
		text+='\"key\":\"'+self.getKey()+'\",';
		text+='\"elements\":[';
		length = self._children.length;
		for(var i = 0; i < length; i++) {
			text+=self._children[i].toJsonString(options);
			text+=(i!==length-1)?',':'';
		}
		text+=']';
		text+='}';
		return text;
	};
	
	/**
	 * キーの書き換え（再帰処理）
	 *
	 * @private
	 * @name resetCanvasOffset
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.common.JSlgElement#
	 * @param {jslgEngine.model.common.JSlgElementBase} element キー書き換え元要素
	 */
	p.resetCanvasOffset = function(element) {
		var self = this;
		
		if(element) {
			var canvasParentsOffset = element.canvasParentsOffset ? element.canvasParentsOffset : {
				x : 0, y : 0, z : 0
			};
			var canvasOffset = element.canvasOffset ? element.canvasOffset : {
				x : 0, y : 0, z : 0
			};
			self.canvasParentsOffset = {
				x : canvasParentsOffset.x + canvasOffset.x,
				y : canvasParentsOffset.y + canvasOffset.y,
				z : canvasParentsOffset.z + canvasOffset.z
			};
		} else {
			self.canvasParentsOffset = {
				x : 0, y : 0, z : 0
			};
		}
		//self.parentCanvasOffset = element.canvasOffset;
	};
	
	o.JSlgElement = JSlgElement;
}());
