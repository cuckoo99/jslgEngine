/*
 * @author cuckoo99
 */

// namespace:
var o = this.jslgEngine = this.jslgEngine||{};
o = (o.model = o.model||{});
o = (o.factory = o.factory||{});

(function() {
	/**
	 * <h4>SLG依存・アイコン生成クラス</h4>
	 * <p>
	 * SLGに依存するアイコンを生成するクラス。
	 * </p>
	 * @class
	 * @name JSlgXIconFactory
	 * @memberOf jslgEngine.model.factory
	 * @constructor
	 */
	var JSlgXIconFactory = function() {
		this.initialize();
	};
	/**
	 *
	 */
	var p = JSlgXIconFactory.prototype;

	/**
	 * クラス名
	 *
	 * @name textName
	 * @property
	 * @type String
	 * @function
	 * @memberOf jslgEngine.model.factory.JSlgXIconFactory#
	 **/
	p.textName = '_txt';
	
	/**
	 * クラス名
	 *
	 * @name spriteDepth
	 * @property
	 * @type String
	 * @function
	 * @memberOf jslgEngine.model.factory.JSlgXIconFactory#
	 **/
	p.spriteDepth = 70;
	
	/**
	 * 初期化
	 *
	 * @name initialize
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.factory.JSlgXIconFactory#
	 **/
	p.initialize = function() {
	};

	/**
	 * アイコン作成・メニュー
	 *
	 * @name makeMenu
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.factory.JSlgXIconFactory#
	 * @param {JSON} options
	 * <ul>
	 * </ul>
	 **/
	p.makeMenu = function(data, options) {
		var self = this;

		var mainController = options.mainController;
		var menuItems = data.menuItems;
		var nestInfo = data.nestInfo;
		
		// var color = [ "#d8dbf0", "#9da6d1" ];
		
		// g = new createjs.Graphics();
		// g.setStrokeStyle(1);
		// g.beginLinearGradientFill(color, [ 0, 1 ], 60, 0, 60, 40);
		// g.drawRoundRect(0, 0, 120, 40, 4);
	
		for ( var i = 0; i < menuItems.length; i++) {
			var item = menuItems[i];
			var obj = item.obj;
			
	
			var nestName = '';
			if (nestInfo != null) {
				for ( var j = 0; j < nestInfo.length; j++) {
					offset.x += 120;
					offset.y += nestInfo[j] * 40;
					nestName += nestInfo[j] + '_';
				}
			}
	
			var menuName = item.obj.getPath();
			var textName = self.textName;
	
			var size = {
				width : 120,
				height : 40
			};
			var offset = {
				x : 0,
				y : 0 + i * size.height 
			};
			// var position = {
				// x : data.position.x + offset.x,
				// y : data.position.y + offset.y,
				// z : self.spriteDepth
			// };
			var position = {
				x : 0 + offset.x,
				y : 0 + offset.y,
				z : self.spriteDepth
			};
			var material = self._getLabelMaterial( item.view, "rgba( 150, 0, 0, 1 )", size );
			 size = {
					width : 300,
					height : 140
			};
			options.iconController.add(mainController.connector, {
				type : 'Plane',
				key : menuName,
				group : 'menu',
				material : material,
				position : position,
				size : size,
				alpha : data.alpha
			});
			
			// var material = self._getLabelMaterial( item.view, "rgba( 0, 0, 0, 1 )", size );
// 		
			// options.iconController.add(mainController.connector, {
				// type : 'Plane',
				// key : menuName+textName,
				// group : 'menu',
				// material : material,
				// position : {
					// x : position.x + 25,
					// y : position.y + 15,
					// z : 0
				// },
				// size : size
			// });
		}
	};

	/**
	 * アイコン作成・マップ土台
	 *
	 * @name makeGround
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.factory.JSlgXIconFactory#
	 * @param {JSON} options
	 * <ul>
	 * </ul>
	 **/
	p.makeGround = function(data, options) {
		var self = this;
		
		var iconInfo = self._getIconData(data, options, function(obj) {
			var size = obj.geometry.boundingBox.size();
			jslgEngine.log([size.x,size.y,size.z].join('_'));
			
			obj.type = 'Model';
			obj.group = 'ground';
			obj.onClick = self._getClickDefault({ className : 'Ground' });
			obj.onMouseMove = self._getMouseMoveDefault({ className : 'Ground' });
			
			options.iconController.add(options.mainController.connector, obj);
		});
	};

	/**
	 * アイコン作成・キャスト
	 *
	 * @name makeCast
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.factory.JSlgXIconFactory#
	 * @param {JSON} options
	 * <ul>
	 * </ul>
	 **/
	p.makeCast = function(data, options) {
		var self = this;
		
		var iconInfo = self._getIconData(data, options, function(obj) {
			
			obj.type = 'Model';
			obj.group = 'cast';
			obj.onClick = self._getClickDefault({ className : 'Cast' });
			
			options.iconController.add(options.mainController.connector, obj);
		});
	};

	/**
	 * アイコン作成・スクロールボタン
	 *
	 * @name makeScrollButtons
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.factory.JSlgXIconFactory#
	 * @param {JSON} options
	 * <ul>
	 * </ul>
	 **/
	p.makeScrollButtons = function(data, options) {
		var self = this;
	
		var buttonName = 'allow';
	
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
	
		for ( var i = 0; i < positions.length; i++) {
			var position = positions[i];
	
			// var g = new createjs.Graphics();
			// g.beginFill(createjs.Graphics.getRGB(127, 0, 0));
			// g.setStrokeStyle(10, 1, 1);
			// g.moveTo(position[0], position[1]);

			// var before = null;
			// for ( var j = 0; j < curves.length; j++) {
				// var curve = curves[j];
				// if (before != null) {
					// var beforePosition = [ before[0] * shifts[i][0],
							// before[1] * shifts[i][1] ];
					// var lastPosition = [ curve[0] * shifts[i][0],
							// curve[1] * shifts[i][1] ];
// 	
					// g.lineTo(position[0] + beforePosition[0], position[1]
							// + beforePosition[1]);
				// }
				// before = curve;
			// }
			// g.closePath();
// 	
			// options.iconController.add(options.mainController.connector, {
				// key : buttonName + i,
				// graphics : {
					// data : g,
					// onClick : function(e, obj) {
						// var name = e.target.name;
// 						
						// var mainController = obj.mainController;
						// var iconController = obj.iconController;
						// var connector = mainController.connector;
// 						
						// var stageViewOffset = iconController.stageViewOffset;
						// var x = 0, y = 0;
// 						
						// switch(name) {
						// case buttonName+'0':
							// y = -1;
							// break;
						// case buttonName+'1':
							// x = 1;
							// break;
						// case buttonName+'2':
							// x = -1;
							// break;
						// case buttonName+'3':
							// y = 1;
							// break;
						// }
						// x = stageViewOffset.x+x;
						// y = stageViewOffset.y+y;
// 						
						// if(x < 0 || y < 0) return;
						// jslgEngine.log('to:'+x+','+y);
// 						
						// command = new jslgEngine.model.command.Command({});
						// command.addChild({
							// obj : new jslgEngine.model.action.ActionJSlgScroll({
								// parameters : [[x,y,0]]
							// })
						// });
						// connector.pipe(function(connector_s) {
							// jslgEngine.log('scroll run');
							// command.run(connector_s.resolve(), {
								// mainController : mainController,
								// iconController : iconController
							// });
							// return connector_s;
						// }).pipe(function(connector_s) {
							// jslgEngine.log('scroll finished');
							// return connector_s.resolve();
						// });
					// }
				// },
				// position : { x:0, y:0, z:0 },
				// alpha : data.alpha
			// });
		}
	};

	/**
	 * アイコン作成・エフェクト
	 *
	 * @name makeEffects
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.factory.JSlgXIconFactory#
	 * @param {JSON} options
	 * <ul>
	 * </ul>
	 **/
	p.makeEffects = function(data, options) {
		var self = this;
	
		var canvasSize = options.iconController.canvasSize;
	
		var g = new createjs.Graphics();
		g.setStrokeStyle(1);
		g.beginLinearGradientFill([ "rgba(0, 0, 0, 0)", "#d8dbf0", "#9da6d1", "rgba(0, 0, 0, 0)" ],
				[ 0.2, 0.3, 0.6, 0.7 ], canvasSize.width/2, canvasSize.height/5,
				canvasSize.width/2, canvasSize.height/5*3);
		g.drawRect(0, canvasSize.height/5, canvasSize.width,
				canvasSize.height/5*3, 4);
	
		var name = jslgEngine.ui.keys.TELOP;
		var textName = self.textName;
	
		var position = { x:0, y:0, z:0 };
		var textOffset = { x:0, y:0, z:0 };
	
		options.iconController.add(options.mainController.connector, {
			key : name,
			graphics : {
				data : g,
				onClick : function(e, obj) {
				}
			},
			position : position,
			alpha : 0
		});
	
		options.iconController.add(options.mainController.connector, {
			key : name+textName,
			position : position,
			alpha : options.alpha,
			text : {
				textValue : '',
				color : '#f0dbd8',
				font : "24px impact"
			}
		});
	};

	/**
	 * アイコン作成・メッセージボード
	 *
	 * @name makeMessageBoard
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.factory.JSlgXIconFactory#
	 * @param {JSON} options
	 * <ul>
	 * </ul>
	 **/
	p.makeMessageBoard = function(connector, data, options) {
		var self = this;
		var region = options.mainController.getWorldRegion();
		var regionKey = region.getKey();

		var text = data.text;
		var imageKey = data.imageKey;
		var imageSize = data.imageSize;
		var selection = data.selection;
		var groupKey = 'message';

		var canvasSize = options.iconController.canvasSize;
	
		var name = jslgEngine.ui.keys.MESSAGE_BOARD;
		var imageName = jslgEngine.ui.keys.MESSAGE_BOARD_IMAGE;
		var selectionName = jslgEngine.ui.keys.MESSAGE_BOARD_SELECTION;
		var textName = self.textName;
	
		var position = { x : 0, y : 0, z : 0};
		
		var messageRect = {
			x : 10,
			y : canvasSize.height/5*3,
			width : canvasSize.width - 20,
			height : canvasSize.height/5*2 - 10,
			round : 5
		};
		
		//画像
		if(imageKey) {
			var isReflected = data.isReflected;
			
			var imageRect = {
				x : messageRect.x,
				y : messageRect.y-imageSize.height/2,
				width : imageSize.width,
				height : imageSize.height,
				round : 5
			};
		
			options.iconController.add(connector, {
				key : imageName,
				imageKey : imageKey,
				group : groupKey,
				position : { x : imageRect.x,  y : imageRect.y,  z : 0 },
				sprite : {
					frames : {
						width : imageRect.width,
						height : imageRect.height,
						regX : 0,
						regY : 0
					},
					animations : { 'default' : [ 0, 0, "default" ] }
				}
			});
		}
		
		var g = self._getGraphicsOfGradientRect(messageRect);
		//メインボード
		options.iconController.add(connector, {
			key : [regionKey,name]
					.join(jslgEngine.config.elementSeparator),
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
			key : [regionKey,name+textName]
					.join(jslgEngine.config.elementSeparator),
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
		
		var color = '#f0dbd8';
		var font = "24px impact";
		var offset = 5;
		var textHeight = parseInt(self._getTextHeight({
			text : selectionText,
			font : font
		}))+offset*2;
		
		selection.unshift({
			text : 'Question:',
			colors : ["rgba(216, 0, 0, 0.5)", "rgba(157, 0, 0, 0.5)"]
		});
		var selectionHeight = textHeight * selection.length;
		
		for(var i = 0; i < selection.length; i++) {
			var selectionKey = selection[i].key||[selectionName,'_ex',i].join('');
			var selectionText = selection[i].text;
			var selectionColors = selection[i].colors;
			var selectionOffset = i*canvasSize.height/5*2;
			
			var selectionRect = {
				x : canvasSize.width/10*1,
				y : canvasSize.height/2 - selectionHeight/2 + textHeight*i,
				width : canvasSize.width/10*8,
				height : textHeight,
				colors : selectionColors,
				round : 5
			};
			
			var g2 = self._getGraphicsOfGradientRect(selectionRect);
		
			//選択肢ボード
			options.iconController.add(connector, {
				key : [regionKey,name,selectionKey]
					.join(jslgEngine.config.elementSeparator),
				group : groupKey,
				graphics : {
					data : g2,
					onClick : self._getClickDefault({ className : null })
				},
				position : position,
				alpha : 1
			});
			
			//選択肢テキスト
			options.iconController.add(connector, {
				key : [regionKey,name,selectionKey+textName]
					.join(jslgEngine.config.elementSeparator),
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
		}
	};

	/**
	 * アイコン作成・ステージ配置ツール
	 *
	 * @name makeScreen
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.factory.JSlgXIconFactory#
	 * @param {JSON} options
	 * <ul>
	 * </ul>
	 **/
	p.makeScreen = function(connector, data, options) {
		var self = this;
		var screenCommandKey = data.screenCommandKey;
		
		//TODO: 何もない空間にイベントを追加する必要がある。
		// options.iconController.add(options.mainController.connector, {
			// key : screenCommandKey,
			// imageKey : 'grid1',
			// group : 'screen',
			// position : {x:0,y:0,z:0},
			// sprite : {
				// frames : {
					// width : 800,
					// height : 600,
					// regX : 0,
					// regY : 0
				// },
				// animations : {
					// 'default' : [ 0, 0, "default" ]
				// },
				// onClick : self._getClickDefault({ className : null })
			// }
		// });
	};

	/**
	 * アイコン作成・ステータス
	 *
	 * @name makeStatus
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.factory.JSlgXIconFactory#
	 * @param {JSON} options
	 * <ul>
	 * </ul>
	 **/
	p.makeStatus = function(options) {
	};

	/**
	 * アイコン作成・タイトル
	 *
	 * @name makeTitle
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.factory.JSlgXIconFactory#
	 * @param {JSON} options
	 * <ul>
	 * </ul>
	 **/
	p.makeTitle = function(options) {
	};
	
	/**
	 * アイコン作成・ステージ配置ツール
	 *
	 * @name makePuttingStageTool
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.factory.JSlgXIconFactory#
	 * @param {JSON} options
	 * <ul>
	 * </ul>
	 **/
	p.makePuttingStageTool = function(options) {
	};

	/**
	 * アイコン作成・ステージ配置モード切替
	 *
	 * @name makePuttingStageModeButton
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.factory.JSlgXIconFactory#
	 * @param {JSON} options
	 * <ul>
	 * </ul>
	 **/
	p.makePuttingStageModeButton = function(options) {
	};


	/**
	 * アイコン作成・ステージ配置モード切替
	 *
	 * @name _getTextHeight
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.factory.JSlgXIconFactory#
	 * @param {JSON} options
	 * <ul>
	 * </ul>
	 **/
	p._getTextHeight = function(data, options) {
		var text = data.text;
		var font = data.font;
		
		var txt = new createjs.Text(text, font, 'white');
		return txt.getMeasuredLineHeight();
	};

	/**
	 * アイコン作成・ステージ配置モード切替
	 *
	 * @name _getClickDefault
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.factory.JSlgXIconFactory#
	 * @param {JSON} options
	 * <ul>
	 * </ul>
	 **/
	p._getClickDefault = function(data) {
		var className = data.className;
		
		return function(e, options) {
			var name = e.target.name;
			var location = new jslgEngine.model.area.Location({ key : name });
			
			options.mainController.kick({
				key : name,
				className : className,
				x : location.x,
				y : location.y,
				z : location.z
			}, options);
		};
	};
	
	/**
	 * アイコン作成・ステージ配置モード切替
	 *
	 * @name _getMouseMoveDefault
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.factory.JSlgXIconFactory#
	 * @param {JSON} options
	 * <ul>
	 * </ul>
	 **/
	p._getMouseMoveDefault = function(data) {
		var className = data.className;
		
		return function(e, options) {
			var name = e.target.name;

			var requiredArea = options.mainController.requiredArea;
			var location = new jslgEngine.model.area.Location({ key : name });

			if (requiredArea == null) return false;

			var areas = requiredArea.getCacheAreaAll();
			var area = null;
			if (areas.length > 0) {
				for ( var i = 0; i < areas.length; i++) {
					mainController.showArea(areas[i].locations, areas[i].objName);
				}
			}
			// 最新のキャッシュを取得
			// あれば名前を設定して更新
			// なければ、対応するlocationのキャッシュを上書き
			var lastArea = requiredArea.getLastCacheArea();

			if (lastArea != null) {
				mainController.showArea(lastArea.locations, lastArea.objName);
			} else {
				requiredArea.setLastCacheByLocation(location);
			}
		};
	};
	/**
	 * アイコン作成・ステージ配置モード切替
	 *
	 * @name _getIconData
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.factory.JSlgXIconFactory#
	 * @param {JSON} options
	 * <ul>
	 * </ul>
	 **/
	p._getIconData = function(data, options, callback) {
		//第１引数、モデルの情報
		var iconModelArgugemnts = data._graphics[2];
		var modelKey = iconModelArgugemnts[0];
		var textureKey = iconModelArgugemnts[1];
		
		options.mainController.getController('Model').get(options.mainController.connector, {
			key : modelKey
		}, options, function(obj) {
			//TODO: JSONLoader専用になっている。
			for(key in data) {
				//その他のプロパティを移し変え
				obj[key] = data[key];
			}
			callback(obj);
			
			// var texture = options.mainController.textureController.get(options.mainController.connector, {
				// key : textureKey
			// }, options);
			// callback({
				// texture : texture,
				// obj : obj
			// });
		});
	};

	/**
	 * アイコン作成・ステージ配置モード切替
	 *
	 * @name _getGraphicsOfGradientRect
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.factory.JSlgXIconFactory#
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
		// g.beginLinearGradientFill([ "rgba(216, 219, 240, 0.5)", "rgba(157, 166, 209, 0.5)" ],
				// [ 0, 1 ], (width-x)/2+x, y,
				// (width-x)/2+x, height);
		g.drawRoundRect(x, y, width, height, round);
		
		return g;
	};

	/**
	 * アイコン作成・ステージ配置モード切替
	 *
	 * @name _getGraphicsOfGradientRect
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.factory.JSlgXIconFactory#
	 * @param {JSON} options
	 * <ul>
	 * </ul>
	 **/
	p._getLabelMaterial = function( text, bg, size ) {
		var canvas = document.createElement( "canvas" );
		var ctx = canvas.getContext( "2d" );
		canvas.width = size.width;
		canvas.height = size.height;

		ctx.fillStyle = bg;
		ctx.fillRect( 0, 0, size.width, size.height );

		ctx.fillStyle = "black";
		ctx.font = "20pt arial bold";
		ctx.fillText( text, 5, 5 );
		
		var map = new THREE.Texture( canvas );
		map.needsUpdate = true;

		//var material = new THREE.MeshBasicMaterial( { map: map, transparent: true } );
		
		
		var spriteAlignment = THREE.SpriteAlignment.topLeft;
		var material = new THREE.SpriteMaterial( 
			{ map: map, useScreenCoordinates: true, alignment: spriteAlignment } );
	
		return material;
	};
	
	o.JSlgXIconFactory = JSlgXIconFactory;
}());
