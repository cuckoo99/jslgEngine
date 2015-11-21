/*
 * @author cuckoo99
 */

(function() {
	// namespace:
	var o = this.jslgEngine = this.jslgEngine||{};
	o = (o.model = o.model||{});
	o = (o.common = o.common||{});

	/**
	 * <h4>SLGフレーム要素</h4>
	 * <p>
	 * ゲームに用いられる、物理的要素の生成元クラス。
	 * </p>
	 * @class
	 * @name JSlgElementFrame
	 * @memberOf jslgEngine.model.common
	 * @constructor
	 */
	var JSlgElementFrame = jslgEngine.extend(
		jslgEngine.model.common.JSlgElementBase,
		function(data, options) {
            this.initialize(data, options);
		}
	);
	/**
	 *
	 */
	var p = JSlgElementFrame.prototype;

	/**
	 * 要素のタイプ
	 *
	 * @name elementType
	 * @property
	 * @type String
	 * @memberOf jslgEngine.model.common.JSlgElementFrame#
	 **/
	p.elementType = 'Frame';

	/**
	 * オフセット
	 *
	 * @name offset
	 * @property
	 * @type jslgEngine.model.area.Location
	 * @memberOf jslgEngine.model.common.JSlgElementFrame#
	 **/
	p.offset = null;

	/**
	 * 大きさ
	 *
	 * @name size
	 * @property
	 * @type jslgEngine.model.area.Size
	 * @memberOf jslgEngine.model.common.JSlgElementFrame#
	 **/
	p.size = null;

	/**
	 * 大きさを持つかどうか
	 *
	 * @name hasSize
	 * @property
	 * @type Boolean
	 * @memberOf jslgEngine.model.common.JSlgElementFrame#
	 **/
	p.hasSize = false;

	/**
	 * 初期化
	 *
	 * @name initialize
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.common.JSlgElementFrame#
	 **/
	p.initialize = function(data, options) {
		var self = this;
        p.__super__.initialize.call(self, data, options);
		if(self.hasSize) {
			self.size = data ? data.size : 
			new jslgEngine.model.area.Size({width : 0, height : 0, depth : 0});
		}
		self._resetOffset(data ? data.parent : null);
	};
	
	/**
	 * オフセットの再設定
	 *
	 * @private
	 * @name _resetOffset
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.common.JSlgElementFrame#
	 * @param {jslgEngine.model.common.JSlgElementBase} element キー書き換え元要素
	 */
	p._resetOffset = function(element) {
		var self = this;
		var data = element ?
				{x : element.offset.x + (element.location ? element.location.x : 0),
				 y : element.offset.y + (element.location ? element.location.y : 0),
				 z : element.offset.z + (element.location ? element.location.z : 0)} : {x : 0, y : 0, z : 0};
		if(self.offset) {
			self.offset.x = data.x;
			self.offset.y = data.y;
			self.offset.z = data.z;
		} else {
			self.offset = new jslgEngine.model.area.Location(data);
		}
	};
	
	/**
	 * 実オブジェクトの生成
	 *
	 * @name generate
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.common.JSlgElementFrame#
	 **/
	p.generate = function(data, options) {
		var self = this;

		var children = self.getChildren();
		//サイズの継承
		//TODO: フレームのサイズを変更できるようにしたがいいのか。
		data.size = data.size ? data.size : self.size;
		var obj = self.getModel(data, options);

		var length = children.length;
		for(var i = 0; i < length; i++) {
			var child = children[i];
			
			if(child.className === 'Status') {
				child = jslgEngine.getClone(child);
				child.setup({
					parent : self
				}, options);
			} else if(child.elementType === 'Frame' || child.className === 'Command') {
				child = child.generate({
					key : child.getKey()
				}, options);
			}
			
			obj.addChild({
				obj : child
			}, options);
		}
		
		//フレームを参照できるようにしておく
		var frame = new jslgEngine.model.common.JSlgElementVariable({
			key : '$FRAME'
		}, options);
		frame.addChild({
			obj : self
		}, options);
		obj.addChild({
			obj : frame
		}, options);
		
		return obj;
	};

	/**
	 * JSON形式として返す
	 *
	 * @name toJson
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.common.JSlgElementFrame#
	 * @returns {JSON}
	 */
	p.toJson = function(options) {
		var self = this;
		return JSON.parse(self.toJsonString(options));
	};
	
	/**
	 * JSON形式として返す
	 *
	 * @name toJsonString
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.common.JSlgElementFrame#
	 * @returns {String}
	 */
	p.toJsonString = function(options) {
		var self = this;
		var length, text = '';
		var obj = [];
		
		text+='{';
		text+='\"type\":\"Frame\",';
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
	 * 実体要素取得
	 *
	 * @name getImageData
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.common.JSlgElementFrame#
	 **/
	p.getImageData = function() {
		var self = this;
		
		var drawingKey = jslgEngine.model.common.keys.DRAWING_OPTIONS;
		var _graphics = self.getStatus(drawingKey);
		_graphics = _graphics ? _graphics.value : null;
		
		var key = _graphics ? _graphics[0][0] : null;
		var regX = _graphics ? _graphics[0][1] : 0;
		var regY = _graphics ? _graphics[0][2] : 0;
		var width = _graphics ? _graphics[0][3] : 0;
		var height = _graphics ? _graphics[0][4] : 0;
		
		return {
            key : key,
            regX : regX,
            regY : regY,
			width : width,
			height : height,
		};
	};
    
	o.JSlgElementFrame = JSlgElementFrame;
}());
