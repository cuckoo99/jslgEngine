/*
 * @author cuckoo99
 */

(function() {
	// namespace:
	var o = this.jslgEngine = this.jslgEngine||{};
	o = (o.model = o.model||{});
	o = (o.stage = o.stage||{});

	/**
	 * <h4>Menu</h4>
	 * <p>
	 * this is icon class.
	 * it has one fixed status key.
	 * </p>
	 * @class
	 * @name Menu
	 * @memberOf jslgEngine.model.stage
	 * @constructor
	 */
	var Menu = jslgEngine.extend(
		jslgEngine.model.common.JSlgElement,
		function(data, options) {
			this.initialize(data, options);
		}
	);
	/**
	 *
	 */
	var p = Menu.prototype;

	/**
	 * クラス名
	 *
	 * @name className
	 * @property
	 * @type String
	 * @memberOf jslgEngine.model.stage.Menu#
	 **/
	p.className = 'Menu';

	/**
	 * パスのキーコード
	 *
	 * @name keyPathCode
	 * @property
	 * @type String[]
	 * @memberOf jslgEngine.model.stage.Menu#
	 **/
	p._keyPathCodes = null;

	/**
	 * 対象キーコード
	 *
	 * @name keyCode
	 * @property
	 * @type String
	 * @memberOf jslgEngine.model.stage.Menu#
	 **/
	p._keyCode = jslgEngine.model.stage.keys.Menu;

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
		
		var parent = self.getParent(options)||{};
		var parentsPosition = parent.getPosition(data, options)||{x:0,y:0,z:0};
		
		var imageSize = self.getImageSize();
		
		var number = self.getStatus('number');
		number = number ? number.value : 0;

		var position = { x : 0,
				 y : imageSize.height * number,
				 z : 0 };
		
		return { x : parentsPosition.x + position.x,
				 y : parentsPosition.y + position.y,
				 z : parentsPosition.z + position.z };
	};
	
	/**
	 * 実体要素取得
	 *
	 * @name getPosition
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.stage.Ground#
	 **/
	p.getImageSize = function() {
		var self = this;

		//TODO: still not decided to how contains graphics property in easeljs.
		var drawingKey = jslgEngine.model.common.keys.DRAWING_OPTIONS;
		var _graphics = self.getStatus(drawingKey);
		_graphics = _graphics ? _graphics.value : null;
		
		var width = _graphics ? _graphics[0][3] : 0;
		var height = _graphics ? _graphics[0][4] : 0;
		
		return {
			width : width,
			height : height,
		};
	};
	
	p.onClick = function(e, options) {
		var mainController = options_s.mainController;
		var name = e.target.name;
		var location = new jslgEngine.model.area.Location({ key : name });

		options.mainController.kick({
			key : name,
			x : location.x,
			y : location.y,
			z : location.z,
			callback : function(obj_s) {
				if(obj_s.className === 'Item') {
					var count = obj_s.getStatus('count');
					if(count) {
						obj_s.setStatus('count', count.value-1);
					}
				}
			}
		}, options_s);
	};

	p.createIcon = function(connector, data, options) {
		var self = this;

		var group = 'menu';
		var iconInfo = self.getIconInfo(data);
		
		var number = self.getStatus('number');
		number = number ? number.value : 0;
		var text = self.getStatus('text');
		text = text ? text.value : '';
		
		var offset = {
			x : 100,
			y : number * 40 + 100
		};

		var position = self.getPosition(data, options);
		position = {
			x : position.x + offset.x,
			y : position.y + offset.y,
			z : 0
		};
	
		var g = self._getGraphics();
		var alpha = 1;

		var menuName = self.getKeyData().getUniqueId();
		var textName = '_txt';

		options.iconController.add(mainController.connector, {
			key : menuName,
			group : 'menu',
			graphics : {
				data : g,
				onClick : function(e, options_s) {
				}
			},
			position : position,
			alpha : data.alpha
		});

		options.iconController.add(mainController.connector, {
			key : menuName+textName,
			group : 'menu',
			position : {
				x : position.x + 25,
				y : position.y + 15,
				z : 0
			},
			text : {
				textValue : text,
				color : '#000000'
			}
		});
	};

	p.updateIcon = function(data, options) {
		var self = this;
		var menuName = self.getKeyData().getUniqueId();
		var textName = '_txt';
		
		var number = self.getStatus('number');
		number = number ? number.value : 0;
		var text = self.getStatus('text');
		text = text ? text.value : '';
		
		var offset = {
			x : 100,
			y : number * 40 + 100
		};

		var position = self.getPosition(data, options);
		position = {
			x : position.x + offset.x,
			y : position.y + offset.y,
			z : 0
		};
		
		options.iconController.update({
			key : menuName,
			position : position,
		});

		options.iconController.update({
			key : menuName+textName,
			text : text,
			position : {
				x : position.x + 25,
				y : position.y + 15,
				z : 0
			},
		});
	};

	p.removeIcon = function(data, options) {
		var menuName = self.getKeyData().getUniqueId();
		var textName = '_txt';
		
		var list = [menuName, menuName+textName];
		for(var i = 0, len = list.length; i < len; i++) {
			options.iconController.remove(list[i]);
		}
	};

	/**
	 * アイコン作成・ステージ配置モード切替
	 *
	 * @name getGraphics
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.common.JSlgElement#
	 * @param {JSON} options
	 * <ul>
	 * </ul>
	 **/
	p._getGraphics = function(data) {
		var self = this;
		
		var color = [ "#d8dbf0", "#9da6d1" ];
		
		g = new createjs.Graphics();
		g.setStrokeStyle(1);
		g.beginLinearGradientFill(color, [ 0, 1 ], 60, 0, 60, 40);
		g.drawRoundRect(0, 0, 120, 40, 4);

		return g;

	}

	o.Menu = Menu;
}());
