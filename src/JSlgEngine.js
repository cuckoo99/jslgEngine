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
					DRAWING_OPTIONS : '_graphics'
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
			findElementsWorkerURL : 'FindingElementsWorker.js',
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
		dispose : function(element, limit) {
			console.log('dispose');
			if(limit === 1) return;
			//循環参照が発生したら止まる。
			var lim = limit||15;
			if(typeof element === 'object' && element != null) {
				console.log('dis'+lim);
				if(element.className) {
					console.log(element.className);
					if(element._key && element._key.getKeyCode != null) {
						console.log(element.getPath());
						console.log(element.getKey());
					}
				}
			}
			if(element == null) {
				//undefined or null
				delete element;
			} else if(element instanceof Array) {
				for(var i = 0; i < element.length; i++) {
					var child = element[i];
					jslgEngine.dispose(child, lim-1);
					delete child;
				}
			} else if(typeof element == 'object') {
				if(element.dispose && typeof element.dispose === 'function') {
					element.dispose();
				} else {
					for ( var key in element ) {
						jslgEngine.dispose(element[key], lim-1);
						delete element;
					}
				}
			}　else {
				element = null;
				delete element;
			}
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
		loadJs : function(append_files) {
			 var self = this;
			 var scripts = self.jsFiles;

			 scripts = append_files ? scripts.concat(append_files) : scripts.concat([
					 "controller/MainController.js",
					 "controller/IconController.js",
					 "controller/file/ImageFileController.js",
					 "controller/Ticker.js"]);

			 for (var i = 0, len = scripts.length; i < len; i++) {
				 document.write('<script type=\"text/javascript\" src=\"'+self.workSpace +scripts[i] +'\"></script>');
			 }
		},
		jsFiles : [
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
			"model/issue/RequiredCustomize.js",
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
			"model/action/ActionJSlgCustomize.js",
			"model/stage/ItemFrame.js",
			"model/stage/CastFrame.js",
			"model/stage/GroundFrame.js",
			"model/stage/StageFrame.js",
			"model/stage/Item.js",
			"model/stage/Cast.js",
			"model/stage/Ground.js",
			"model/stage/Stage.js",
			"model/stage/Icon.js",
			"model/stage/Menu.js",
			"model/stage/Message.js",
			"model/stage/MessageSelectionItem.js",
			"model/stage/Customize.js",
			"model/stage/ScrollButton.js",
			"model/stage/NetworkButton.js",
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
			"controller/ElementBinder.js",
			"controller/BackGroundWorker.js",
			"controller/IconControllerBase.js",
			"controller/OnlineManager.js",
			"controller/file/FileControllerBase.js",
			"controller/file/AudioFileController.js"
		]
	};
}());
