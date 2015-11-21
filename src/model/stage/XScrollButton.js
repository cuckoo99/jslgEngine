/*
 * @author cuckoo99
 */

(function() {
	// namespace:
	var o = this.jslgEngine = this.jslgEngine||{};
	o = (o.model = o.model||{});
	o = (o.stage = o.stage||{});

	/**
	 * <h4>XScrollButton</h4>
	 * <p>
	 * this is icon class.
	 * it has one fixed status key.
	 * </p>
	 * @class
	 * @name XScrollButton
	 * @memberOf jslgEngine.model.stage
	 * @constructor
	 */
	var XScrollButton = jslgEngine.extend(
		jslgEngine.model.common.JSlgElement,
		function(data, options) {
			this.initialize(data, options);
		}
	);
	/**
	 *
	 */
	var p = XScrollButton.prototype;

	/**
	 * クラス名
	 *
	 * @name className
	 * @property
	 * @type String
	 * @memberOf jslgEngine.model.stage.XScrollButton#
	 **/
	p.className = 'ScrollButton';

	/**
	 * パスのキーコード
	 *
	 * @name keyPathCode
	 * @property
	 * @type String[]
	 * @memberOf jslgEngine.model.stage.XScrollButton#
	 **/
	p._keyPathCodes = null;

	/**
	 * 対象キーコード
	 *
	 * @name keyCode
	 * @property
	 * @type String
	 * @memberOf jslgEngine.model.stage.XScrollButton#
	 **/
	p._keyCode = jslgEngine.model.stage.keys.XScrollButton;

	p._onClick = function(e, options) {
		var self = this;
		var id = e.target.name;
		var buttonName = 'allow';
		
		// create process.
		var connector = new jslgEngine.model.network.ConnectorOnline();
		
		options.mainController.findElements(connector, {
			id : id,
		}, options);
		connector.pipe(function(connector_s, result) {
			if(result.length == 0) {
				jslgEngine.log('scroll not found');
				return connector_s.reject();
			}
				
			var name = result[0].getKey();
			var mainController = options.mainController;
			var iconController = options.iconController;
			var connector = mainController.connector;

			var stageViewOffset = iconController.stageViewOffset;
			var x = 0, y = 0;

			switch(name) {
				case 'up':
					y = -1;
					break;
				case 'right':
					x = 1;
					break;
				case 'left':
					x = -1;
					break;
				case 'down':
					y = 1;
					break;
			}
			x = stageViewOffset.x+x;
			y = stageViewOffset.y+y;

			if(x < 0 || y < 0) return;
			jslgEngine.log('to:'+x+','+y);

			jslgEngine.log('scroll run');
			var command = new jslgEngine.model.command.Command({}, options);
			command.addChild({
				obj : new jslgEngine.model.action.ActionJSlgScroll({
					parameters : [[x,y,0]]
				})
			}, options);
			command.run(connector_s.resolve(), {}, {
				mainController : mainController,
				iconController : iconController
			});
			return connector_s;
		}).pipe(function(connector_s) {
			jslgEngine.log('scroll finished');
			return connector_s.resolve();
		});
	};

	p.createIcon = function(connector, data, options) {
		var self = this;
		var key = self.getKeyData().getUniqueId();

		var buttonName = 'allow';
		
		var direction = self.getStatus('direction').value;

		switch(direction) {
			case 'up':
				number = 0;
				break;
			case 'right':
				number = 1;
				break;
			case 'left':
				number = 2;
				break;
			case 'down':
				number = 3;
				break;
			default:
				jslgEngine.log('illegal scroll buttons property');
				return;
		}

		var g = self._getGraphics(number, data, options);

		options.iconController.add(options.mainController.connector, {
			key : key,
			graphics : {
				data : g,
				onClick : self._onClick
			},
			position : { x:0, y:0, z:0 },
			alpha : data.alpha
		});
	};

	p.updateIcon = function(connector, data, options) {
		var self = this;
		var position = self.getPosition({}, options);
		var key = self.getKeyData().getUniqueId();

		if(!options.iconController.hasKey(key)) {
			self.createIcon(connector, data, options);
		}

		if(data.groupKeys) {
			data.groupKeys.push(key);
		}
	};

	p.removeIcon = function(data, options) {
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
	p._getGraphics = function(number, data, options) {
		var self = this;

		var buttonName = 'allow';
		var n = number;
	
		var iconController = options.iconController;
		var ui = data.ui;
	
		var canvasSize = iconController.canvasSize;
	
		var cWidth = canvasSize.width;
		var cHeight = canvasSize.height;
	
		var positions = [ [ 100, 100 ], [ cWidth - 100, 100 ],
				[ 100, cHeight - 100 ], [ cWidth - 100, cHeight - 100 ] ];
		var shifts = [ [ -1, -1 ], [ 1, -1 ], [ -1, 1 ], [ 1, 1 ] ];
		var curves = [ [ 0, 0 ], [ 50, 0 ], [ 50, -30 ], [ 0, 0 ] ];
		var offsets = {};
		offsets[buttonName+'0'] = { x : 0, y : -0.1, z :0 };
		offsets[buttonName+'1'] = { x : 0.1, y : 0,  z : 0 };
		offsets[buttonName+'2'] = { x : -0.1, y : 0, z : 0 };
		offsets[buttonName+'3'] = { x : 0, y : 0.1, z : 0 };

		var position = positions[n];

		var g = new createjs.Graphics();
		g.beginFill(createjs.Graphics.getRGB(127, 0, 0));
		g.setStrokeStyle(10, 1, 1);
		g.moveTo(position[0], position[1]);

		var before = null;
		for ( var j = 0; j < curves.length; j++) {
			var curve = curves[j];
			if (before != null) {
				var beforePosition = [ before[0] * shifts[n][0],
					before[1] * shifts[n][1] ];
				var lastPosition = [ curve[0] * shifts[n][0],
				    curve[1] * shifts[n][1] ];

				g.lineTo(position[0] + beforePosition[0], position[1]
						+ beforePosition[1]);
			}
			before = curve;
		}
		g.closePath();

		return g;
	}

	o.XScrollButton = XScrollButton;
}());
