/*
 * @author cuckoo99
 */

(function() {
	// namespace:
	var o = this.jslgEngine = this.jslgEngine||{};
	o = (o.model = o.model||{});
	o = (o.stage = o.stage||{});

	/**
	 * <h4>キャストクラス</h4>
	 * <p>
	 * マップ土台上に配置できる要素。
	 * </p>
	 * @class
	 * @name Message
	 * @memberOf jslgEngine.model.stage
	 * @constructor
	 */
	var Message = jslgEngine.extend(
		jslgEngine.model.common.JSlgElement,
		function(data, options) {
			this.initialize(data, options);
		}
	);
	/**
	 *
	 */
	var p = Message.prototype;

	/**
	 * クラス名
	 *
	 * @name className
	 * @property
	 * @type String
	 * @memberOf jslgEngine.model.stage.Message#
	 **/
	p.className = 'Message';

	/**
	 * パスのキーコード
	 *
	 * @name keyPathCode
	 * @property
	 * @type String[]
	 * @memberOf jslgEngine.model.stage.Message#
	 **/
	p._keyPathCodes = null;

	/**
	 * 対象キーコード
	 *
	 * @name keyCode
	 * @property
	 * @type String
	 * @memberOf jslgEngine.model.stage.Message#
	 **/
	p._keyCode = 'Message';

	/**
	 * どこにでも着脱可能かどうか
	 *
	 * @name _isFloat
	 * @property
	 * @type Boolean
	 * @memberOf jslgEngine.model.stage.Icon#
	 **/
	p._isFloat = true;
	
	/**
	 * 実体要素取得
	 *
	 * @name getPosition
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.stage.Ground#
	 **/
	p.getPosition = function(data, options) {
		var self = this;
		
		return { x : 0, y : 0, z : 0 };
	};
	
	p._makeImage = function(connector, data, options) {
		var self = this;
		var groupKey = 'message';

		var image = self.getIconInfo({}, options);
		
		var canvasSize = options.iconController.canvasSize;
		var messageRect = {
			x : 10,
			y : canvasSize.height/5*3,
			width : canvasSize.width - 20,
			height : canvasSize.height/5*2 - 10,
			round : 5
		};
		
		if(image) {
			var imageName = 'SelectionItemImage';
			var isReflected = data.isReflected;
			
			var imageRect = {
				x : messageRect.x,
				y : messageRect.y-image.sprite.frames.height/2,
				width : image.sprite.frames.width,
				height : image.sprite.frames.height,
				round : 5
			};
		
			options.iconController.add(connector, {
				key : imageName,
				imageKey : image.imageKey,
				group : groupKey,
				position : { x : imageRect.x,  y : imageRect.y,  z : 0 },
				sprite : {
					frames : image.sprite.frames,
						// width : imageRect.width,
						// height : imageRect.height,
						// regX : image.regX,
						// regY : image.regY
					//},
					animations : { 'default' : [ 0, 0, "default" ] }
				}
			});
			if(data.groupKeys) {
				data.groupKeys.push(imageName);
			}
		}
	};

	p._makeBoard = function(connector, data, options) {
		var self = this;

		var canvasSize = options.iconController.canvasSize;
		var groupKey = 'message';
		var name = jslgEngine.ui.keys.MESSAGE_BOARD;
		var textName = '_txt';
		var text = self.getStatus('text').value;
		
		var messageRect = {
			x : 10,
			y : canvasSize.height/5*3,
			width : canvasSize.width - 20,
			height : canvasSize.height/5*2 - 10,
			round : 5
		};
		
		var g = self._getGraphicsOfGradientRect(messageRect);
		var position = { x : 0, y : 0, z : 0};
		
		//メインボード
		options.iconController.add(connector, {
			key : name,
			group : groupKey,
			graphics : {
				data : g,
				onClick : function(e, obj) {
				}
			},
			position : position
		});

		//テキスト
		options.iconController.add(connector, {
			key : name+textName,
			group : groupKey,
			position : {
				x : messageRect.x+10,
				y : messageRect.y+10,
				z : 0
			},
			text : {
				textValue : text,
				color : '#f0dbd8',
				font : "24px impact"
			}
		});
	};

	p._getTextSize = function(data, options) {
		var text = data.text;
		var font = data.font;
		
		var txt = new createjs.Text(text, font, 'white');
		return {
			width : txt.getMeasuredWidth(),
			height : txt.getMeasuredLineHeight()
		};
	};

	p.createIcon = function(connector, data, options) {
		var self = this;
		var region = options.mainController.getWorldRegion();
		var regionKey = region.getKey();

		var groupKey = 'message';

		var canvasSize = options.iconController.canvasSize;
	
		var imageName = jslgEngine.ui.keys.MESSAGE_BOARD_IMAGE;
		var selectionName = jslgEngine.ui.keys.MESSAGE_BOARD_SELECTION;

		if(self.getStatus('_graphics')) {
			self._makeImage(connector, data, options);
		}
		self._makeBoard(connector, data, options);
	};

	p.updateIcon = function(connector, data, options) {
		var self = this;
		var region = options.mainController.getWorldRegion();
		var regionKey = region.getKey();

		var name = jslgEngine.ui.keys.MESSAGE_BOARD;
		var textName = '_txt';
		var imageName = jslgEngine.ui.keys.MESSAGE_BOARD_IMAGE;
		var selectionName = jslgEngine.ui.keys.MESSAGE_BOARD_SELECTION;

		if(!options.iconController.hasKey(name)) {
			self.createIcon(connector, data, options);
		}
		if(data.groupKeys) {
			data.groupKeys.push(name);
			data.groupKeys.push(name+textName);
		}

		var children = self.getChildren();
		for(var i = 0, len = children.length; i < len; i++) {
			children[i].updateIcon(connector, data, options);
		}
	};

	p.removeIcon = function(data, options) {
		var name = jslgEngine.ui.keys.MESSAGE_BOARD;
		var imageName = jslgEngine.ui.keys.MESSAGE_BOARD_IMAGE;
		var selectionName = jslgEngine.ui.keys.MESSAGE_BOARD_SELECTION;
		var textName = '_txt';
		
		var list = [menuName, menuName+textName];
		for(var i = 0, len = list.length; i < len; i++) {
			options.iconController.remove(list[i]);
		}
	};

	/**
	 * アイコン作成・ステージ配置モード切替
	 *
	 * @name _getGraphicsOfGradientRect
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.factory.JSlgIconFactory#
	 * @param {JSON} options
	 * <ul>
	 * </ul>
	 **/
	p._getGraphicsOfGradientRect = function(data, options) {
		var x = data.x;
		var y = data.y;
		var width = data.width;
		var height = data.height;
		var round = data.round;
		var colors = data.colors||[ "rgba(216, 219, 240, 0.5)", "rgba(157, 166, 209, 0.5)" ];
		
		var g = new createjs.Graphics();
		g.setStrokeStyle(1);
		
		g.beginRadialGradientFill(colors,
				[ 0, 1 ], x, y, 0,
				x, y, width/2);
		g.drawRoundRect(x, y, width, height, round);
		
		return g;
	};

	o.Message = Message;
}());
