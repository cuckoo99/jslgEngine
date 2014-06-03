/**
 *
 * @author cuckoo99 
 */
(function() {
	/**
	 * ルート
	 * @namespace
	 **/
	jslgEngine = {
		/**
		 * ルートURL
		 * @namespace
		 */
		workSpace : './js/slg/src/',
		/**
		 * コントローラ層
		 * @namespace
		 */
		controller : {
		},
		/**
		 * モデル層
		 * @namespace
		 */
		model : {
			/**
			 * アクション
			 * @namespace
			 * @memberOf jslgEngine.model
			 */
			action : {
				/**
				 * キー情報
				 * @namespace
				 * @memberOf jslgEngine.model.action
				 */
				keys : {
					ADD: 'add',
					REMOVE: 'remove',
					SET: 'set',
					ANIME: 'anm',
					MESSAGE: 'msg',
					REQUIRE_AREA: 'require',
					PENDING: 'pending',
					UPDATE: 'update',
					CALL: 'call',
					IF: 'if',
					ELSE_IF: 'elseif',
					ELSE: 'else',
					END_IF: 'endif',
					FOR: 'for',
					END_FOR: 'endfor',
					VARIABLE: 'var',
					SLG_MOVE: 'slg_move',
					SLG_SCROLL: 'slg_scroll',
					SLG_MENU: 'slg_menu',
					SLG_UPDATE_AREA: 'slg_update_area',
					LOG: 'alert'
				}
			},
			/**
			 * アニメーション
			 * @namespace
			 * @memberOf jslgEngine.model
			 */
			animation : {
				/**
				 * キー情報
				 * @namespace
				 * @memberOf jslgEngine.model.animation
				 */
				keys : {
					DEFERRED_KEY : 'deferred',
					TICKER_ALL : 0,
					TICKER_GENERAL : 1,
					TICKER_TIMER : 2,
					fadeType : {
						NO_FADE : 0,
						FADE_IN : 1,
						FADE_OUT : 2,
						FADE_IN_AND_OUT : 3
					}
				}
			},
			/**
			 * 座標関連
			 * @namespace
			 * @memberOf jslgEngine.model
			 */
			area : {
				/**
				 * キー情報
				 * @namespace
				 * @memberOf jslgEngine.model.area
				 */
				keys : {
					SEPARATOR_KEY: '_'
				}
			},
			/**
			 * 汎用クラス
			 * @namespace
			 * @memberOf jslgEngine.model
			 */
			common : {
				/**
				 * キー情報
				 * @namespace
				 * @memberOf jslgEngine.model.common
				 */
				keys : {
					X_KEY : '_X',
					Y_KEY : '_Y',
					Z_KEY : '_Z',
					DRAWING_OPTIONS : 'drawingOptions'
				}
			},
			/**
			 * イベント
			 * @namespace
			 * @memberOf jslgEngine.model
			 */
			command : {
				/**
				 * キー情報
				 * @namespace
				 * @memberOf jslgEngine.model.command
				 */
				keys : {
					RETRY_COUNT : 'RetryCount',
					PENDING_STACK : 'PendingStack',
					EVENT_DRIVERS : 'CommandDrivers',
					IS_AVAILABLE : '_ENABLE'
				}
			},
			/**
			 * 作成クラス
			 * @namespace
			 * @memberOf jslgEngine.model
			 */
			factory : {
				/**
				 * キー情報
				 * @namespace
				 * @memberOf jslgEngine.model.factory
				 */
				keys : {
					command : {
						MOVE : 'move'
					},
					icon : {
						CAST : 'cast',
						GROUND : 'ground',
						SCROLL_BUTTON : 'scroll',
						TELOP : 'telop',
						EFFECTS : 'effects',
						MESSAGE : 'message',
						MENU : 'menu'
					},
					menu : {
						PROFILE : 'profile',
						MOVE : 'move',
						ITEM : 'item',
						CLOSE : 'close',
						GROUND_NAME : 'ground_name',
						GROUND_DETAIL : 'ground_detail',
						GROUND_END : 'ground_end'
					}
				}
			},
			/**
			 * オブジェクト制御
			 * @namespace
			 * @memberOf jslgEngine.model
			 */
			logic : {
				/**
				 * キー情報
				 * @namespace
				 * @memberOf jslgEngine.model.logic
				 */
				keys : {
					CHILDREN : '_CHILDREN',
					PENDING : '$PENDING',
					PEND_OBJ : 'obj',
					AREA : '$AREA',
					SELF : '$THIS',
					SENDER : '$SENDER',
					GROUND_KEY : '_GROUNDS', // マップ土台のキー
					CAST_KEY : '_CASTS', // キャストのキー
					ITEM_KEY : '_ITEMS', // アイテムのキー
					VARIABLE_KEY : '_$', // 変数キー
					LOOP_VARIABLE_KEY : '_L', // ループ一時格納配列
					SEPARATOR_KEY: '-'
				}
			},
			/**
			 * 数学
			 * @namespace
			 * @memberOf jslgEngine.model
			 */
			math : {
				
			},
			/**
			 * 人工知能
			 * @namespace
			 * @memberOf jslgEngine.model
			 */
			mind : {
				/**
				 * キー情報
				 * @namespace
				 * @memberOf jslgEngine.model.mind
				 */
				keys : {
					MIND_EVENT_DRIVERS : 'CommandDriversInMind'
				}
			},
			/**
			 * アクセス制御
			 * @namespace
			 * @memberOf jslgEngine.model
			 */
			network : {},
			/**
			 * 入力待機
			 * @namespace
			 * @memberOf jslgEngine.model
			 */
			issue : {},
			/**
			 * ステージ
			 * @namespace
			 * @memberOf jslgEngine.model
			 */
			stage : {
				/**
				 * キー情報
				 * @namespace
				 * @memberOf jslgEngine.model.stage
				 */
				keys : {
					STAGE_FRAME : 'StageFrame',
					GROUND_FRAME : 'GroundFrame',
					CAST_FRAME : 'CastFrame',
					ITEM_FRAME : 'ItemFrame',
					STAGE : 'Stage',
					GROUND : 'Ground',
					CAST : 'Cast',
					ITEM : 'Item',
					ICON : 'Icon',
					STATUS : 'Status',
					EVENT : 'Command',
					PENDING_EVENT : 'PendingCommand',
					LOCAL_REGION : 'LocalRegion',
					WORLD_REGION : 'WorldRegion',
					VARIABLE : 'Variable',
					ICON : 'Icon',
					RESOURCE : 'Resource',
					USER : 'User',
					ROOT : '_',
				}
			},
			/**
			 * ユーザ
			 * @namespace
			 * @memberOf jslgEngine.model
			 */
			user : {}
		},
		/**
		 * UI層
		 * @namespace
		 */
		ui : {
			/**
			 * キー情報
			 * @namespace
			 * @memberOf jslgEngine.ui
			 */
			keys : {
				MESSAGE_BOARD_GROUP: 'message_board_group',
				MESSAGE_BOARD: 'message_board',
				MESSAGE_BOARD_IMAGE: 'message_board_image',
				MESSAGE_BOARD_SELECTION: 'message_board_selection',
				EFFECTS: 'effects',
				TELOP: 'telop',
				TEXT: '_txt',
				BELONGS : 'belongs',
				LIFE : 'life',
				MOVE : 'moving',
				BELONGS_PLAYER : 'player',
				BELONGS_ENEMY : 'enemy'
			}
		},
		/**
		 * ユーティリティ
		 * @namespace
		 * @memberOf jslgEngine
		 */
		utility : {},
		/**
		 * エラーメッセージ
		 * @namespace
		 * @memberOf jslgEngine
		 */
		errorMessage : {},
		/**
		 * 環境設定
		 *
		 * @namespace
		 * @memberOf jslgEngine
		 **/
		config : {
			/**
			 * ログレベル
			 *
			 * 3: 全て
			 * 3: 一般
			 * 2: タイマー以外
			 * @name logLevel
			 * @property
			 * @type Number
			 * @memberOf jslgEngine.config
			 */
			logLevel : 3,
			/**
			 * ループ制限
			 *
			 * @name loopLimit
			 * @property
			 * @type Number
			 * @memberOf jslgEngine.config
			 */
			loopLimit : 100,
			/**
			 * 座標の区切り文字
			 *
			 * @name locationSeparator
			 * @property
			 * @type String
			 * @memberOf jslgEngine.config
			 **/
			locationSeparator : '_',
			/**
			 * SLG要素の区切り文字
			 *
			 * @name elementSeparator
			 * @property
			 * @type String
			 * @memberOf jslgEngine.config
			 **/
			elementSeparator : '.',
			/**
			 * SLG要素の絞込み文字
			 *
			 * @name refineSeparator
			 * @property
			 * @type String
			 * @memberOf jslgEngine.config
			 **/
			refineSeparator : ':',
			/**
			 * マップ土台表示オフセット
			 *
			 * @name groundOffset
			 * @property
			 * @type String
			 * @memberOf jslgEngine.config
			 **/
			groundOffset : {x : 0, y : 200, z : 0},
			/**
			 * キャスト表示オフセット
			 *
			 * @name castOffset
			 * @property
			 * @type String
			 * @memberOf jslgEngine.config
			 **/
			castOffset : {x : 0, y : -30, z : 0},
			/**
			 * メニュー表示オフセット
			 *
			 * @name statusOffset
			 * @property
			 * @type String
			 * @memberOf jslgEngine.config
			 **/
			statusOffset : {x : 0, y : 0, z : 0},
			/**
			 * WebWorkersのパス
			 *
			 * @name workersURL
			 * @property
			 * @type String
			 * @memberOf jslgEngine.config
			 **/
			workersURL : '',
			/**
			 * ロジック用Workerのonmessageを記述したURL
			 *
			 * @name logicWorkerURL
			 * @property
			 * @type String
			 * @memberOf jslgEngine.config
			 **/
			logicWorkerURL : 'LogicWorker.js',
			/**
			 * 要素検索用Workerのonmessageを記述したURL
			 *
			 * @name findElementsWorkerURL
			 * @property
			 * @type String
			 * @memberOf jslgEngine.config
			 **/
			findElementsWorkerURL : 'FindingElementsWorker.js'
		},
		/**
		 * SLGENGINEのシステムを構築。
		 *
		 * @name build
		 * @function
		 * @static
		 * @memberOf jslgEngine
		 **/
		build : function(connector, data, options) {
			var width, height, depth;
	
			var mainController = options.mainController;
			var iconController = options.iconController;
			var converter = iconController.converter;
			var slgIconFactory = iconController.iconFactory;
			var slgCommandFactory = iconController.commandFactory;
			var elements, locationOrders;
			var separator = jslgEngine.config.locationSeparator;
			
			var drawingKey = jslgEngine.model.common.keys.DRAWING_OPTIONS;
			
			var viewOptions;
			
			mainController.findElements(connector, {
				className : 'Stage'
			}, options);
			connector.connects(function(connector_s, result_s) {
				elements = result_s;
				
				var stage = elements[0];
				var size = stage.getSize();
				width = size.width;
				height = size.height;
				depth = size.depth;
				
				viewOptions = {
					stageViewOffset : {x:0,y:0,z:0}
				};
				iconController.stageViewOffset = viewOptions.stageViewOffset;
				
				//スクリーン生成
				//ステージメニュー作成
				slgCommandFactory.makeScreenMenu(connector_s, converter, options);
				connector_s.connects(function(connector_ss, result_ss) {
					var screenCommand = result_ss;
					stage.addChild({
						obj : screenCommand
					}, options);
					
					slgIconFactory.makeScreen(connector_ss, {
						screenCommandKey : screenCommand.getPath()
					}, options);
				});
			});
			//マップ土台生成
			mainController.findElements(connector, {
				className : 'Ground'
			}, options);
			connector.connects(function(connector_s, result_s) {
				var elements = result_s;
				locationOrders = {};
				for(var i = 0; i < elements.length; i++) {
					var element = elements[i];
					var location = element.getGlobalLocation();
					var locationKey = [location.x,location.y,location.z].join(separator);
					locationOrders[locationKey] = element;
				}
				mainController.sortSecondDimension(width, height, function(pt, location) {
					var locationKey = [location.x,location.y,0].join(separator);
					
					var element = locationOrders[locationKey];
					if(element) {
						var position = element.getPosition(viewOptions, options);
						var drawingOptions = element.getStatus(drawingKey);
						
						//マップ土台
						slgIconFactory.makeGround({
							//key : 'g'+locationKey,
							key : element.getKey(),
							position : position,
							drawingOptions : drawingOptions.value
						}, options);
					}
				});
			});
			//キャスト生成
			mainController.findElements(connector, {
				className : 'Cast'
			}, options);
			connector.connects(function(connector_s, result_s) {
				var elements = result_s;
				locationOrders = {};
				for(var i = 0; i < elements.length; i++) {
					var element = elements[i];
					var location = element.getGlobalLocation();
					var locationKey = [location.x,location.y,location.z].join(separator);
					locationOrders[locationKey] = element;
				}
				mainController.sortSecondDimension(width, height, function(pt, location) {
					var locationKey = [location.x,location.y,0].join(separator);
					
					var element = locationOrders[locationKey];
					if(element) {
						var position = element.getPosition(viewOptions, options);
						var drawingOptions = element.getStatus(drawingKey);
						
						//キャスト
						slgIconFactory.makeCast({
							key : element.getKey(),
							position : position,
							drawingOptions : drawingOptions.value
						}, options);
					}
				});
				
				//スクロールボタン生成
				slgIconFactory.makeScrollButtons({}, options);
			});
		},
		
		/**
		 * SLGENGINEのサンプル要素を作成。
		 *
		 * @name makeSampleElements
		 * @function
		 * @static
		 * @memberOf jslgEngine
		 **/
		makeSampleElements : function(data, options) {
			var width = data.width;
			var height = data.height;
			var depth = data.depth;
			var viewOptions = data.viewOptions;
			
			var iconController = options.iconController;
			var mainController = options.mainController;
			var converter = iconController.converter;
			
			var slgIconFactory = options.slgIconFactory;
			var slgCommandFactory = options.slgCommandFactory;
			
			var stateCommand = slgCommandFactory.makeWinningCommand(connector, converter, options);
			
			var worldRegion = mainController.getWorldRegion();
			worldRegion.setKey('w1');
			
			var localRegion = new jslgEngine.model.area.LocalRegion();
			localRegion.setKey('r1');
			worldRegion.addChild({ obj : localRegion }, options);
			
			var stageFrame = new jslgEngine.model.stage.StageFrame();
			stageFrame.setKey('rs1');
			stageFrame.setStatus('width', width);
			stageFrame.setStatus('height', height);
			stageFrame.setStatus('depth', depth);
			
			var groundFrame1 = new jslgEngine.model.stage.GroundFrame();
			groundFrame1.setKey('rg1');
			groundFrame1.setStatus('type', 'grass');
			groundFrame1.setStatus('effect', 1);
			
			var groundFrame2 = new jslgEngine.model.stage.GroundFrame();
			groundFrame2.setKey('rg2');
			groundFrame2.setStatus('type', 'pond');
			groundFrame2.setStatus('effect', 2);
			
			var castFrame = new jslgEngine.model.stage.CastFrame();
			castFrame.setKey('rc1');
			castFrame.setStatus('type', 'human');
			castFrame.setStatus('effect', 3);
			
			var itemFrame = new jslgEngine.model.stage.ItemFrame();
			itemFrame.setKey('ri1');
			itemFrame.setStatus('type', 'weapon');
			itemFrame.setStatus('effect', 4);
			
			localRegion.addChild({ obj : stageFrame }, options);
			localRegion.addChild({ obj : groundFrame1 }, options);
			localRegion.addChild({ obj : groundFrame2 }, options);
			localRegion.addChild({ obj : castFrame }, options);
			localRegion.addChild({ obj : itemFrame }, options);
			
			//ステージ
			var stage = stageFrame.generate({
				key : 's1',
				location : new jslgEngine.model.area.Location({x:0,y:0,z:0}),
				size : new jslgEngine.model.area.Size({width:1,height:1,depth:1})
			}, options);
			localRegion.addChild({ obj : stage }, options);
			
			//マップ土台
			mainController.sortSecondDimension(width, height, function(pt, location) {
				var i = location.x;
				var j = location.y;
				
				var separator = jslgEngine.config.locationSeparator;
				var key = [i,j,0].join(separator);
				
				//マップ土台
				var ground = groundFrame1.generate({
						location : new jslgEngine.model.area.Location({ x : i, y : j, z : 0}),
						key : 'g'+key
				}, options);
				ground.setStatus('anime_show','area0');
				ground.setStatus('anime_default','default');
				stage.addChild({ obj : ground }, options);
			});
			
			//味方１
			var cast = castFrame.generate({ key : 'c1'}, options);
			var item = itemFrame.generate({ key : 'i1'}, options);
			cast.addChild({ obj : item }, options);
			cast.setStatus('belongs', 'player');
			cast.setStatus('life', 10);
			cast.addChild({
				obj : new jslgEngine.model.mind.Mind({
					key : 'mind1',
					decreasedKeys : ['life'],
					increasedKeys : [],
					memberKey : 'belongs',
					familyMemberNames : ['player'],
					enemyMemberNames : ['enemy']
				})
			}, options);
			
			//敵１
			var cast2 = castFrame.generate({ key : 'c2'}, options);
			cast2.setStatus('belongs', 'enemy');
			cast2.setStatus('life', 8);
			cast2.addChild({
				obj : slgCommandFactory.getCommand(converter, {
					key : 'move',
					children : [
						slgCommandFactory.getActionTemplate({
							className : 'ActionLog',
							arguments : ['"移動X"']
						}),
						slgCommandFactory.getActionTemplate({
							className : 'ActionJSlgMenu',
							arguments : ['null']
						}),
						slgCommandFactory.getActionTemplate({
							className : 'ActionRequireArea',
							arguments : [[0,0,0],[[1,5,2,[[0,3,0]],0,[90,0]]]]
						}),
						slgCommandFactory.getActionTemplate({
							className : 'ActionPending'
						}),
						slgCommandFactory.getActionTemplate({
							className : 'ActionJSlgMove',
							arguments : ['$THIS.parent()','$PENDING']
						})
					]
				}, options)
			}, options);
			cast2.addChild({
				obj : slgCommandFactory.getCommand(converter, {
					key : 'kill',
					children : [
						slgCommandFactory.getActionTemplate({
							className : 'ActionLog',
							arguments : ['"攻撃X"']
						}),
						slgCommandFactory.getActionTemplate({
							className : 'ActionJSlgMenu',
							arguments : ['null']
						}),
						slgCommandFactory.getActionTemplate({
							className : 'ActionRequireArea',
							arguments : [[0,0,0],[[1,2,2,[[0,3,0]],0,[90,0]],[1,0,0,[[0,1,0],[0,2,0],[0,3,0]],0,[90,0]]],['"Cast"']]
						}),
						slgCommandFactory.getActionTemplate({
							className : 'ActionPending'
						}),
						slgCommandFactory.getActionTemplate({
							className : 'ActionSet',
							arguments : ['$PENDING.obj','"life"','$PENDING.obj.life-5']
						})
					]
				}, options)
			}, options);
			var menuItem1 = slgCommandFactory.makeMenuItem('m1', '移動',
						[slgCommandFactory.getActionTemplate({
							className : 'ActionLog',
							arguments : ['"移動"']
						}),slgCommandFactory.getActionTemplate({
							className : 'ActionCall',
							arguments : ['$THIS.parent().parent().move']
						})], cast2, options);
			var menuItem2 = slgCommandFactory.makeMenuItem('m2', 'アイテム',
						[slgCommandFactory.getActionTemplate({
							className : 'ActionLog',
							arguments : ['"アイテム"']
						}),slgCommandFactory.getActionTemplate({
							className : 'ActionJSlgMenu',
							arguments : ['$THIS.parent()']
						})], cast2, options);
			var menuItem2_1 = slgCommandFactory.makeMenuItem('m2_1', '攻撃',
						[slgCommandFactory.getActionTemplate({
							className : 'ActionLog',
							arguments : ['"攻撃"']
						}),slgCommandFactory.getActionTemplate({
							className : 'ActionCall',
							arguments : ['$THIS.parent().parent().parent().kill']
						})], menuItem2, options);
			var menuItem3 = slgCommandFactory.makeMenuItem('m3', '閉じる',
						[slgCommandFactory.getActionTemplate({
							className : 'ActionLog',
							arguments : ['"閉じる"']
						}),slgCommandFactory.getActionTemplate({
							className : 'ActionJSlgMenu',
							arguments : ['null']
						})], cast2, options);
			cast2.addChild({
				obj : slgCommandFactory.getCommand(converter, {
					key : 'onClick',
					children : [
						slgCommandFactory.getActionTemplate({
							className : 'ActionJSlgMenu',
							arguments : ['$THIS.parent()']
						})
					]
				}, options)
			}, options);
			cast2.addChild({
				obj : new jslgEngine.model.mind.Mind({
					key : 'mind2',
					decreasedKeys : ['life'],
					increasedKeys : [],
					memberKey : 'belongs',
					familyMemberNames : ['enemy'],
					enemyMemberNames : ['player']
				})
			}, options);
			
			//キャスト配置１
			var gLocation = [2,2,0].join('_');
			var ground = stage.getChild({ key : gLocation});
			ground.addChild({ obj : cast }, options);
			
			//キャスト配置２
			gLocation = [3,3,0].join('_');
			ground = stage.getChild({ key : gLocation});
			ground.addChild({ obj : cast2 }, options);
			
		},
		
		/**
		 * 継承
		 *
		 * @name extend
		 * @function
		 * @static
		 * @memberOf jslgEngine
		 * @param {Object} s スーパークラス
		 * @param {Fucntion} c コンストラクタ
		 **/
		extend :  function(s, c) {
			var jslgEngineTemporay = function () {};
			var sup = s ? s : function() {};
			jslgEngineTemporay.prototype = s.prototype;
			c.prototype = new jslgEngineTemporay();
			c.prototype.__super__ = s.prototype;
		    c.prototype.__super__.constructor = s;
			c.prototype.constructor = c;
			return c;
		},
		/**
		 * クローン
		 *
		 * @name getClone
		 * @function
		 * @static
		 * @memberOf jslgEngine
		 * @param {Object} s スーパークラス
		 * @param {Fucntion} c コンストラクタ
		 **/
		getClone :  function(arr, data) {
			var ar, n;
			if(arr === null) return null;
			
			if(data && (data.limit != null ? (data.limit--) : 1) <= 0) {
				jslgEngine.log('reached limit. getClone was failed.');
				return null;
			}
			
			if ( arr instanceof Array ) {
				ar = new Array( arr.length );
				for ( n = 0; n < ar.length; n++ ) {
					ar[n] = jslgEngine.getClone(arr[n], data);
				}
				return ar;
			}
			if ( typeof arr == 'object' ) {
				ar = {};
				ar.__proto__ = arr.__proto__;
				for ( var key in arr ) {
					ar[key] = jslgEngine.getClone(arr[key], data);
				}
				return ar;
			}
			
			return arr;
		},
		
		/**
		 * 要素かどうかチェックする
		 *
		 * @name checkSameElement
		 * @function
		 * @static
		 * @memberOf jslgEngine
		 **/
		checkSameElement :  function(element, c) {
			return (element instanceof c);
		},
		/**
		 * 要素の破棄
		 *
		 * @name dispose
		 * @method
		 * @function
		 * @memberOf jslgEngine.model.common.JSlgElementBase#
		 * @param {Object} options
		 */
		dispose : function(element) {
			// if(element instanceof Array) {
				// for(var i = 0; i < element.length; i++) {
					// var child = element[i];
					// jslgEngine.dispose(child);
					// delete child;
				// }
			// } else if(typeof element == 'object') {
				// for ( var key in element ) {
					// jslgEngine.dispose(element[key]);
					// delete element[key];
				// }
			// }　else {
				// element = null;
			// }
			for ( var key in element ) {
				var obj = self[key];
				
				// if(obj instanceof jslgEngine.model.common.JSlgElementBase) {
					// obj.dispose();
					// delete obj;
				// }
				if(obj instanceof Array) {
					for(var i = 0; i < obj.length; i++) {
						var child = obj[i];
						jslgEngine.dispose(child);
						delete child;
					}
				} else if(obj instanceof Object) {
					for ( var oKey in obj ) {
						jslgEngine.dispose(obj[oKey]);
						delete obj;
					}
				} else {
					obj = null;
				}
			}
			delete element;
		},
		/**
		 * ログ出力
		 *
		 * @name log
		 * @function
		 * @static
		 * @memberOf jslgEngine
		 * @param {Object} obj 出力オブジェクト
		 * @param {Number} level ログレベル
		 **/
		log : function(obj, level) {
            //return;
			var logLevel = level ? level : 0;
			if(logLevel >= jslgEngine.config.logLevel) return;

			if(!(obj instanceof Array)) {
				console.log(obj);
			} else {
				var strip = '';
				for(var i = 0; i < obj.length; i++) {
					if(typeof obj[i] == 'number' || typeof obj[i] == 'string') {
						strip += obj[i]+',';
					}
					else strip += '[?],';
				}
				console.log(strip);
			}
		},
		/**
		 * 要素のパスを取得する。
		 * （移動可能要素のパスは固定じゃないので取得不可能）
		 * 
		 * @name getElementPathCodes
		 * @function
		 * @static
		 * @memberOf jslgEngine
		 **/
		getElementPathCodes : function(class_name) {
			var className = class_name;
			
			switch(className) {
				case jslgEngine.model.stage.keys.STAGE_FRAME:
					return jslgEngine.model.stage.StageFrame.prototype._keyPathCodes;
				case jslgEngine.model.stage.keys.GROUND_FRAME:
					return jslgEngine.model.stage.GroundFrame.prototype._keyPathCodes;
				case jslgEngine.model.stage.keys.CAST_FRAME:
					return jslgEngine.model.stage.CastFrame.prototype._keyPathCodes;
				case jslgEngine.model.stage.keys.ITEM_FRAME:
					return jslgEngine.model.stage.ItemFrame.prototype._keyPathCodes;
				case jslgEngine.model.stage.keys.STAGE:
					return jslgEngine.model.stage.Stage.prototype._keyPathCodes;
				case jslgEngine.model.stage.keys.GROUND:
					return jslgEngine.model.stage.Ground.prototype._keyPathCodes;
				case jslgEngine.model.stage.keys.CAST:
					return jslgEngine.model.stage.Cast.prototype._keyPathCodes;
				case jslgEngine.model.stage.keys.ITEM:
					return jslgEngine.model.stage.Item.prototype._keyPathCodes;
				case jslgEngine.model.stage.keys.ICON:
					return jslgEngine.model.stage.Icon.prototype._keyPathCodes;
				case jslgEngine.model.stage.keys.STATUS:
					return jslgEngine.model.common.JSlgElementStatus.prototype._keyPathCodes;
				case jslgEngine.model.stage.keys.EVENT:
					return jslgEngine.model.command.Command.prototype._keyPathCodes;
				case jslgEngine.model.stage.keys.PENDING_EVENT:
					return jslgEngine.model.issue.PendingCommand.prototype._keyPathCodes;
				case jslgEngine.model.stage.keys.LOCAL_REGION:
					return jslgEngine.model.area.LocalRegion.prototype._keyPathCodes;
				case jslgEngine.model.stage.keys.WORLD_REGION:
					return jslgEngine.model.area.WorldRegion.prototype._keyPathCodes;
				case jslgEngine.model.stage.keys.VARIABLE:
					return jslgEngine.model.common.JSlgElementVariable.prototype._keyPathCodes;
			}
		},
		loadJs : function(append_files) {
			var self = this;
	        var scripts = self.jsFiles;
	        
	        if(append_files) {
		        scripts = scripts.concat(append_files);
	        } else {
		        scripts = scripts.concat([
		        	"controller/MainController.js",
					"controller/IconController.js",
					"controller/ImageFileController.js",
					"controller/Ticker.js"]);
	        }

	        for (var i=0; i<scripts.length; i++) {
	        	document.write('<script type=\"text/javascript\" src=\"'+self.workSpace +scripts[i] +'\"></script>');
	        }
		},
		
		jsFiles : [
			"ErrorMessage.js",
			"Utility.js",
			"model/common/SerialRunner.js",
			"model/common/JSlgKey.js",
			"model/common/JSlgElementBase.js",
			"model/common/JSlgElementFrame.js",
			"model/common/JSlgElement.js",
			"model/common/JSlgElementStatus.js",
			"model/common/JSlgElementVariable.js",
			"model/common/JSlgElementFinder.js",
			"model/common/ResourceElement.js",
			"model/network/Ajax.js",
			"model/network/ConnectorBase.js",
			"model/network/ConnectorOnline.js",
			"model/network/ConnectorOffline.js",
			"model/area/Region.js",
			"model/area/Area.js",
			"model/area/Location.js",
			"model/area/Size.js",
			"model/area/LocalRegion.js",
			"model/area/WorldRegion.js",
			"model/issue/IssueDataSet.js",
			"model/issue/Issue.js",
			"model/issue/RequiredArea.js",
			"model/issue/RequiredMessage.js",
			"model/issue/PendingCommand.js",
			"model/command/Command.js",
			"model/command/CommandBlockBase.js",
			"model/command/CommandBlockIF.js",
			"model/command/CommandBlockElseIF.js",
			"model/command/CommandBlockFOR.js",
			"model/command/CommandDriver.js",
			"model/action/ActionBase.js",
			"model/action/ActionLog.js",
			"model/action/ActionCall.js",
			"model/action/ActionAdd.js",
			"model/action/ActionAddFrame.js",
			"model/action/ActionAudio.js",
			"model/action/ActionAnime.js",
			"model/action/ActionPending.js",
			"model/action/ActionSet.js",
			"model/action/ActionMind.js",
			"model/action/ActionRemove.js",
			"model/action/ActionRequireArea.js",
			"model/action/ActionUpdate.js",
			"model/action/ActionVariable.js",
			"model/action/ActionIcon.js",
			"model/action/ActionJSlgMenu.js",
			"model/action/ActionJSlgScroll.js",
			"model/action/ActionJSlgMessage.js",
			"model/action/ActionJSlgUpdateArea.js",
			"model/action/ActionJSlgMove.js",
			"model/action/ActionJSlgText.js",
			"model/action/ActionJSlgProfile.js",
			"model/action/ActionJSlgEffect.js",
			"model/stage/ItemFrame.js",
			"model/stage/CastFrame.js",
			"model/stage/GroundFrame.js",
			"model/stage/StageFrame.js",
			"model/stage/Item.js",
			"model/stage/Cast.js",
			"model/stage/Ground.js",
			"model/stage/Stage.js",
			"model/stage/Icon.js",
			"model/user/User.js",
			"model/animation/Animation.js",
			"model/animation/AnimationGroup.js",
			"model/animation/AnimationContainer.js",
			"model/logic/Logic.js",
			"model/logic/Expression.js",
			"model/logic/Converter.js",
			"model/mind/MindFrame.js",
			"model/mind/Mind.js",
			"model/mind/Simulator.js",
			"model/factory/JSlgCommandFactory.js",
			"ui/UI.js",
			"controller/ElementBinder.js",
			"controller/BackGroundWorker.js",
			"controller/IconControllerBase.js",
			"controller/file/FileControllerBase.js",
			"controller/file/AudioFileController.js"
		]
	};
}());