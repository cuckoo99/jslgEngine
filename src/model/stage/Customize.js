/*
 * @author cuckoo99
 */

(function() {
	// namespace:
	var o = this.jslgEngine = this.jslgEngine||{};
	o = (o.model = o.model||{});
	o = (o.stage = o.stage||{});

	/**
	 * <h4>インターミッションクラス</h4>
	 * <p>
	 * キャストを継承し、カスタマイズするための画面要素。
	 * </p>
	 * @class
	 * @name Customize
	 * @memberOf jslgEngine.model.stage
	 * @constructor
	 */
	var Customize = jslgEngine.extend(
		jslgEngine.model.common.JSlgElement,
		function(data, options) {
			this.initialize(data, options);
		}
	);
	/**
	 *
	 */
	var p = Customize.prototype;

	/**
	 * クラス名
	 *
	 * @name className
	 * @property
	 * @type String
	 * @memberOf jslgEngine.model.stage.Customize#
	 **/
	p.className = 'Customize';

	/**
	 * クラス名
	 *
	 * @name customizeKey
	 * @property
	 * @type String
	 * @memberOf jslgEngine.model.stage.Customize#
	 **/
	p.customizeKey = 'customizeKey';
	
	/**
	 * パスのキーコード
	 *
	 * @name keyPathCode
	 * @property
	 * @type String[]
	 * @memberOf jslgEngine.model.stage.Customize#
	 **/
	p._keyPathCodes = null;

	/**
	 * 対象キーコード
	 *
	 * @name keyCode
	 * @property
	 * @type String
	 * @memberOf jslgEngine.model.stage.Customize#
	 **/
	p._keyCode = 'Customize';

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
		var groupKey = 'customize';

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
		var groupKey = 'customize';
		var name = jslgEngine.ui.keys.MESSAGE_BOARD;
		var textName = '_txt';
		var text = 'Customize Cast';
		
		var messageRect = {
			x : 10,
			y : canvasSize.height/5,
			width : canvasSize.width - 20,
			height : canvasSize.height/5*4 - 10,
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

		// Show Cast Image
		var worldRegion = options.mainController.getWorldRegion();
		var customize = worldRegion.getChild({
			key : self.customizeKey
		});

		var casts = customize.getChildren();
		var index = self.getStatus('index').value;
		var cast = casts[index];
		
		var iconInfo = cast.getIconInfo({
			group : 'cast'
		}, options);
	
		iconInfo.key = 'img1';
		iconInfo.position = { x : 0, y : 0, z : 0 };
		iconInfo.sprite.onClick = null;

		options.iconController.add(connector, iconInfo);

		// Change Cast Buttons
		// Status Grade Up Buttons
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

		var groupKey = 'customize';

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

	o.Customize = Customize;
}());
