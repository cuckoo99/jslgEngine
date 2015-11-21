
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
	 * @name CustomizeCastSelectionItem
	 * @memberOf jslgEngine.model.stage
	 * @constructor
	 */
	var CustomizeCastSelectionItem = jslgEngine.extend(
		jslgEngine.model.common.JSlgElement,
		function(data, options) {
			this.initialize(data, options);
		}
	);
	/**
	 *
	 */
	var p = CustomizeCastSelectionItem.prototype;

	/**
	 * クラス名
	 *
	 * @name className
	 * @property
	 * @type String
	 * @memberOf jslgEngine.model.stage.CustomizeCastSelectionItem#
	 **/
	p.className = 'CustomizeCastSelectionItem';

	/**
	 * パスのキーコード
	 *
	 * @name keyPathCode
	 * @property
	 * @type String[]
	 * @memberOf jslgEngine.model.stage.CustomizeCastSelectionItem#
	 **/
	p._keyPathCodes = null;

	/**
	 * 対象キーコード
	 *
	 * @name keyCode
	 * @property
	 * @type String
	 * @memberOf jslgEngine.model.stage.CustomizeCastSelectionItem#
	 **/
	p._keyCode = 'CustomizeCastSelectionItem';

	/**
	 * 情報が格納されているステータス名
	 *
	 * @name answerStatusName
	 * @property
	 * @type jslgEngine.model.issue.Area[]
	 * @memberOf jslgEngine.model.issue.RequiredMessage#
	 **/
	p.answerStatusName = '_ANSWER';

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

	p.getSelectionItemLength = function(data, options) {
		var self = this;
		
		var p = self.getParent(options);
		var pChildren = p.getChildren();
		var count = 0;
		for(var i = 0, len = pChildren.length; i < len; i++) {
			if(pChildren[i].className === 'CustomizeCastSelectionItem') {
				count++;
			}
		}
		return count;
	};

	p.createIcon = function(connector, data, options) {
		var self = this;
	
		var groupKey = 'customize';
		var canvasSize = options.iconController.canvasSize;
	
		// Left Button

		var n = self.getStatus('number').value;

		var color = '#f0dbd8';
		var font = "24px impact";
		var offset = 5;
		var selectionText = self.getStatus(self.answerStatusName).value;
		var textHeight = self._getTextSize({
			text : selectionText,
			font : font
		}).height+offset*2;
		
		var selectionHeight = textHeight * self.getSelectionItemLength(data, options);
		var selectionKey = self.getKeyData().getUniqueId();
		var textName = '_txt';

		var colors = self.getStatus('colors');
		var selectionColors = colors ? colors.value : null;
		var selectionOffset = n*canvasSize.height/5*2;

		var selectionRect = {
			x : canvasSize.width/10*1,
			y : canvasSize.height/2 - selectionHeight/2 + textHeight*n,
			z : 0,
			width : canvasSize.width/10*8,
			height : textHeight,
			colors : selectionColors,
			round : 5
		};

		var g2 = self._getGraphicsOfGradientRect(selectionRect);

		//選択肢ボード
		options.iconController.add(connector, {
			key : selectionKey,
			group : groupKey,
			graphics : {
				data : g2,
				onClick : function(e, options_s) {
					var name = e.target.name;
					options_s.mainController.kick({
						key : name
					}, options_s);
				}
			},
			position : { x : 0, y : 0, z : 0 },
			alpha : 1
		});

		//選択肢テキスト
		options.iconController.add(connector, {
			key : selectionKey+textName,
			group : groupKey,
			position : {
				x : selectionRect.x+offset,
				y : selectionRect.y+offset,
				z : 0
			},
			text : {
				textValue : selectionText,
				color : color,
				font : font
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

	p.updateIcon = function(connector, data, options) {
		var self = this;
		var region = options.mainController.getWorldRegion();
		var regionKey = region.getKey();

		var groupKey = 'message';

		var canvasSize = options.iconController.canvasSize;

		if(!options.iconController.hasKey()) {
			self.createIcon(connector, data, options);
		}

		if(data.groupKeys) {
			var selectionKey = self.getKeyData().getUniqueId();
			var textName = '_txt';
			
			data.groupKeys.push(selectionKey);
			data.groupKeys.push(selectionKey+textName);
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
	 * @memberOf jslgEngine.model.factory.CustomizeCastSelectionItem#
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

	o.CustomizeCastSelectionItem = CustomizeCastSelectionItem;
}());

