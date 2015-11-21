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
	 * @name JSlgIconFactory
	 * @memberOf jslgEngine.model.factory
	 * @constructor
	 */
	var JSlgIconFactory = function() {
		this.initialize();
	};
	/**
	 *
	 */
	var p = JSlgIconFactory.prototype;

	/**
	 * クラス名
	 *
	 * @name textName
	 * @property
	 * @type String
	 * @function
	 * @memberOf jslgEngine.model.factory.JSlgIconFactory#
	 **/
	p.textName = '_txt';
	
	/**
	 * 初期化
	 *
	 * @name initialize
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.factory.JSlgIconFactory#
	 **/
	p.initialize = function() {
	};

	/**
	 * アイコン作成・メニュー
	 *
	 * @name makeMenu
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.factory.JSlgIconFactory#
	 * @param {JSON} options
	 * <ul>
	 * </ul>
	 **/
	p.makeMenu = function(data, options) {
		var self = this;

		var mainController = options.mainController;
		var menuItems = data.menuItems;
		var nestInfo = data.nestInfo;
		
		var color = [ "#d8dbf0", "#9da6d1" ];
		
		g = new createjs.Graphics();
		g.setStrokeStyle(1);
		g.beginLinearGradientFill(color, [ 0, 1 ], 60, 0, 60, 40);
		g.drawRoundRect(0, 0, 120, 40, 4);
	
		for ( var i = 0; i < menuItems.length; i++) {
			var item = menuItems[i];
			var obj = item.obj;
			
			var offset = {
				x : 100,
				y : i * 40 + 100
			};
	
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
	
			var position = {
				x : data.position.x + offset.x,
				y : data.position.y + offset.y,
				z : 0
			};
	
			options.iconController.add(mainController.connector, {
				key : menuName,
				group : 'menu',
				graphics : {
					data : g,
					onClick : function(e, options_s) {
						var mainController = options_s.mainController;
						var name = e.target.name;
						var location = new jslgEngine.model.area.Location({ key : name });
						
						mainController.kick({
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
					textValue : item.view,
					color : '#000000'
				}
			});
		}
	};

	/**
	 * アイコン作成・マップ土台
	 *
	 * @name makeGround
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.factory.JSlgIconFactory#
	 * @param {JSON} options
	 * <ul>
	 * </ul>
	 **/
	p.makeGround = function(data, options) {
		var self = this;
		
		data.group = 'ground';
		data.onClick = self._getClickDefault({ className : 'Ground' });
		data.onMouseMove = self._getMouseMoveDefault({ className : 'Ground' });
		
		var iconInfo = self._getIconData(data);
		
		options.iconController.add(options.mainController.connector, iconInfo);
	};

	/**
	 * アイコン作成・キャスト
	 *
	 * @name makeCast
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.factory.JSlgIconFactory#
	 * @param {JSON} options
	 * <ul>
	 * </ul>
	 **/
	p.makeCast = function(data, options) {
		var self = this;
		
		data.group = 'cast';
		data.onClick = self._getClickDefault({ className : 'Cast' });
		var iconInfo = self._getIconData(data);
		
		options.iconController.add(options.mainController.connector, iconInfo);
	};

	/**
	 * アイコン作成・スクロールボタン
	 *
	 * @name makeScrollButtons
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.factory.JSlgIconFactory#
	 * @param {JSON} options
	 * <ul>
	 * </ul>
	 **/
	p.makeScrollButtons = function(data, options) {
		var self = this;
	};

	/**
	 * アイコン作成・エフェクト
	 *
	 * @name makeEffects
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.factory.JSlgIconFactory#
	 * @param {JSON} options
	 * <ul>
	 * </ul>
	 **/
	p.makeEffects = function(connector, data, options) {
		var self = this;
	
		var canvasSize = options.iconController.canvasSize;
	
		var name = data.key;
		var imageKey = data.imageKey;
		var textName = self.textName;
		var groupKey = 'effects';
		
		var particleCount = data.particleCount;
		var frames = data.frames;
		var animations = data.animations;
	
		var position = data.position;
		var textOffset = { x:0, y:0, z:0 };
		
		var space = 10;
	
		for(var i = 0; i < particleCount; i++) {
			var r = i*space;
			var theta = 2*Math.PI*Math.random();
			
			var offset = {
				x : r*Math.cos(theta),
				y : r*Math.sin(theta),
				z : 0
			};
		 	//パーティクル画像
			options.iconController.add(connector, {
				key : [name,i].join(jslgEngine.config.elementSeparator),
				imageKey : imageKey,
				group : groupKey,
				position : {
					x : position.x + offset.x,
					y : position.y + offset.y,
					z : position.z + offset.z
				},
				sprite : {
					frames : frames,
					animations : animations
				}
			});
		}
	};

	/**
	 * アイコン作成・プロフィール
	 *
	 * @name makeProfile
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.factory.JSlgIconFactory#
	 * @param {JSON} options
	 * <ul>
	 * </ul>
	 **/
	p.makeProfile = function(connector, data, options) {
		var self = this;
		var region = options.mainController.getWorldRegion();
		var regionKey = region.getKey();
		var groupKey = 'profile';
	
		var canvasSize = options.iconController.canvasSize;
		var elementName = data.name;
		var viewTargets = data.targets;
	
	 	var frameRect = {
			x : 10,
			y : canvasSize.height/5*3,
			width : canvasSize.width/2,
			height : canvasSize.height/5*2 - 10,
			round : 5,
			colors : [ "rgba(216, 0, 0, 0.5)", "rgba(157, 0, 0, 0.5)" ]
		};
		var g = self._getGraphicsOfGradientRect(frameRect);
		var name = data.key;
		var textName = self.textName;
	
		var position = { x:0, y:0, z:0 };
		var textOffset = { x:0, y:0, z:0 };
	
		var color = '#f0dbd8';
		var font = "24px impact";
		
	 	//枠
		options.iconController.add(options.mainController.connector, {
			key : [name,'frame'].join(jslgEngine.config.elementSeparator),
			group : groupKey,
			graphics : {
				data : g,
				onClick : function(e, obj) {
				}
			},
			position : position,
			alpha : 0
		});
	 	//名前
		options.iconController.add(options.mainController.connector, {
			key : [name,'name'].join(jslgEngine.config.elementSeparator),
			group : groupKey,
			position : {
				x : frameRect.x+10,
				y : frameRect.y+10,
				z : 0
			},
			text : {
				textValue : elementName,
				color : color,
				font : font
			},
			alpha : 0
		});
		//各ステータス
		for(var i = 0; i < viewTargets.length; i++) {
			var viewTarget = viewTargets[i];
			
			var statusName = viewTarget.key;
			var before = viewTarget.before;
			var after = viewTarget.after;
			
			var textSize = self._getTextSize({
				text : statusName+'：',
				font : font
			});
			var textHeight = textSize.height+10;
			
			//テキスト
			options.iconController.add(connector, {
				key : [name,statusName,'name']
					.join(jslgEngine.config.elementSeparator),
				group : groupKey,
				position : {
					x : frameRect.x+10,
					y : frameRect.y+30 + textHeight*i,
					z : 0
				},
				text : {
					textValue : statusName+'：',
					color : color,
					font : font
				}
			});
			options.iconController.add(connector, {
				key : [name,statusName]
					.join(jslgEngine.config.elementSeparator),
				group : groupKey,
				position : {
					x : frameRect.x+textSize.width+20,
					y : frameRect.y+30 + textHeight*i,
					z : 0
				},
				text : {
					textValue : before,
					color : color,
					font : font
				}
			});
		}
	};

	/**
	 * アイコン作成・メッセージボード
	 *
	 * @name makeMessageBoard
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.factory.JSlgIconFactory#
	 * @param {JSON} options
	 * <ul>
	 * </ul>
	 **/
	p.makeMessageBoard = function(connector, data, options) {
	};

	/**
	 * アイコン作成・ステージ配置ツール
	 *
	 * @name makeScreen
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.factory.JSlgIconFactory#
	 * @param {JSON} options
	 * <ul>
	 * </ul>
	 **/
	p.makeScreen = function(connector, data, options) {
		var self = this;
		var screenCommandKey = data.screenCommandKey;
		
		options.iconController.add(connector, {
			key : screenCommandKey,
			imageKey : 'grid1',
			group : 'screen',
			position : {x:0,y:0,z:0},
			sprite : {
				frames : {
					width : 800,
					height : 600,
					regX : 0,
					regY : 0
				},
				animations : {
					'default' : [ 0, 0, "default" ]
				},
				onClick : self._getClickDefault({ className : null })
			}
		});
	};

	/**
	 * アイコン作成・ステータス
	 *
	 * @name makeText
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.factory.JSlgIconFactory#
	 * @param {JSON} options
	 * <ul>
	 * </ul>
	 **/
	p.makeText = function(connector, data, options) {
		var self = this;
		
		var name = data.key;
		var text = data.text;
		var color = '#f00000';
		var font = "24px impact";
		var position = data.position||{ x : 0, y : 0, z : 0};
		var groupKey = 'text';
	
		options.iconController.add(connector, {
			key : name,
			group : groupKey,
			position : position,
			text : {
				textValue : text,
				color : color,
				font : font
			}
		});
	};

	/**
	 * meke a connection with network.
	 * when click this button, all elements refresh.
	 *
	 * @name makeOnlineButton
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.factory.JSlgIconFactory#
	 * @param {JSON} options
	 * <ul>
	 * </ul>
	 **/
	p.makeOnlineButton = function(connector, data, options) {	
		var self = this;
		
		var name = data.key;
		var position = data.position||{ x : 0, y : 0, z : 0};
		var groupKey = 'buttons';
	
		options.iconController.add(connector, {
			key : name,
			position : position,
			imageKey : 'online1',
			group : groupKey,
			sprite : {
				frames : {
					width : 64,
					height : 64,
					regX : 0,
					regY : 0
				},
				animations : {
					'default' : [ 0, 0, "default" ]
				},
				onClick : function(data) {
					var connector = new jslgEngine.model.network.ConnectorOnline();

					var onlineManager = options.mainController.getOnlineManager();

					onlineManager.changeNetworkingMode(connector, {
						isOnline : true
					}, options);
				}
			}
		});
	};

	/**
	 * アイコン作成・ステータス
			text : {
				textValue : text,
				color : color,
				font : font
			}
		});
	};
	
	/**
	 * アイコン作成・ステータス
	 *
	 * @name makeStatus
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.factory.JSlgIconFactory#
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
	 * @memberOf jslgEngine.model.factory.JSlgIconFactory#
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
	 * @memberOf jslgEngine.model.factory.JSlgIconFactory#
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
	 * @memberOf jslgEngine.model.factory.JSlgIconFactory#
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
	 * @memberOf jslgEngine.model.factory.JSlgIconFactory#
	 * @param {JSON} options
	 * <ul>
	 * </ul>
	 **/
	p._getTextSize = function(data, options) {
		var text = data.text;
		var font = data.font;
		
		var txt = new createjs.Text(text, font, 'white');
		return {
			width : txt.getMeasuredWidth(),
			height : txt.getMeasuredLineHeight()
		};
	};

	/**
	 * アイコン作成・ステージ配置モード切替
	 *
	 * @name _getClickDefault
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.factory.JSlgIconFactory#
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
	 * @memberOf jslgEngine.model.factory.JSlgIconFactory#
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
		// g.beginLinearGradientFill([ "rgba(216, 219, 240, 0.5)", "rgba(157, 166, 209, 0.5)" ],
				// [ 0, 1 ], (width-x)/2+x, y,
				// (width-x)/2+x, height);
		g.drawRoundRect(x, y, width, height, round);
		
		return g;
	};

	o.JSlgIconFactory = JSlgIconFactory;
}());
