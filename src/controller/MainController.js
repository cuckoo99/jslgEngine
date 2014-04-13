/*
 * @author cuckoo99
 */

(function() {
	// namespace:
	var o = this.jslgEngine = this.jslgEngine||{};
	o = (o.controller = o.controller||{});

	/**
	 * <h4>要素総合・管理クラス</h4>
	 * <p>
	 * 存在するSLG要素を管理する。
	 * </p>
	 * @class
	 * @name MainController
	 * @memberOf jslgEngine.controller
	 * @constructor
	 */
	var MainController = function(options) {
		this.initialize(options);
	};
	/**
	 *
	 */
	var p = MainController.prototype;

	/**
	 * 初期化
	 *
	 * @name initialize
	 * @method
	 * @function
	 * @memberOf jslgEngine.controller.MainController#
	 **/
	p.initialize = function(data) {
		var self = this;
		var workersPath = data.workersPath||jslgEngine.workSpace+jslgEngine.config.workersURL;
		self._worldRegion = new jslgEngine.model.area.WorldRegion({}, {
			mainController : self
		});
		self._webworkers = [];
		self._webworkers['FindElements'] = new jslgEngine.controller.BackGroundWorker({
				absolutePath : workersPath,
	        	url : jslgEngine.config.findElementsWorkerURL
	        });
		self._webworkers['Logic'] = new jslgEngine.controller.BackGroundWorker({
				absolutePath : workersPath,
	        	url : jslgEngine.config.logicWorkerURL
	        });
		self.finder = new jslgEngine.model.common.JSlgElementFinder();
		self.logic = new jslgEngine.model.logic.Logic();
		self.connector = new jslgEngine.model.network.ConnectorOnline();
		self.ticker = new jslgEngine.controller.Ticker();
		self.backGroundWorker = null;
		self._fileControllers = [];
		if(data.fileControllers) {
			for(var i = 0; i < data.fileControllers.length; i++) {
				var fileController = data.fileControllers[i];
				self._fileControllers.push(fileController);
			}
		}
		self.users = [];
		self._elementBinder = new jslgEngine.controller.ElementBinder();
	};

	/**
	 * ワールド領域
	 *
	 * @private
	 * @name _worldRegion
	 * @property
	 * @type jslgEngine.model.area.WorldRegion
	 * @memberOf jslgEngine.controller.MainController#
	 **/
	p._worldRegion = null;

	/**
	 * 要素探索オブジェクト
	 *
	 * @name _finder
	 * @property
	 * @type jslgEngine.model.common.JSlgElementFinder
	 * @memberOf jslgEngine.controller.MainController#
	 **/
	p.finder = null;

	/**
	 * ロジック・オブジェクト
	 *
	 * @name logic
	 * @property
	 * @type jslgEngine.model.logic.Logic
	 * @memberOf jslgEngine.controller.MainController#
	 **/
	p.logic = null;

	/**
	 * Web Workers
	 *
	 * @name backGroundWorker
	 * @property
	 * @type jslgEngine.controller.BackGroundWorker
	 * @memberOf jslgEngine.controller.MainController#
	 **/
	p.backGroundWorker = null;

	/**
	 * タイマー・オブジェクト
	 * TODO: 同階層でいいか検討
	 *
	 * @name ticker
	 * @property
	 * @type jslgEngine.controller.Ticker
	 * @memberOf jslgEngine.controller.MainController#
	 **/
	p.ticker = null;

	/**
	 * 通信オブジェクト
	 *
	 * @name connector
	 * @property
	 * @type jslgEngine.model.network.ConnectorBase
	 * @memberOf jslgEngine.controller.MainController#
	 **/
	p.connector = null;

	/**
	 * ファイル管理オブジェクト
	 *
	 * @name _fileControllers
	 * @property
	 * @type jslgEngine.controller.FileControllerBase[]
	 * @memberOf jslgEngine.controller.MainController#
	 **/
	p._fileControllers = null;

	/**
	 * ウェブワーカーズ
	 *
	 * @name _webworkers
	 * @property
	 * @type jslgEngine.controller.FileControllerBase[]
	 * @memberOf jslgEngine.controller.MainController#
	 **/
	p._webworkers = null;

	/**
	 * 未解決オブジェクト
	 *
	 * @name pendingCommand
	 * @property
	 * @type jslgEngine.model.issue.PendingCommand
	 * @memberOf jslgEngine.controller.MainController#
	 **/
	p.pendingCommand = null;

	/**
	 * ユーザオブジェクト
	 *
	 * @name users
	 * @property
	 * @type jslgEngine.model.user.User[]
	 * @memberOf jslgEngine.controller.MainController#
	 **/
	p.users = null;
	
	/**
	 * 親要素取得のためのオブジェクト
	 *
	 * @name elementBinder
	 * @property
	 * @type jslgEngine.controller.ElementBinder
	 * @memberOf jslgEngine.controller.MainController#
	 **/
	p._elementBinder = null;
	
	/**
	 * 一意ID用カウント
	 *
	 * @name idCount
	 * @property
	 * @type Number
	 * @memberOf jslgEngine.controller.MainController#
	 **/
	p._idCount = 1;
	
	/**
	 * 任意の要素の持つイベントを実行する。
	 *
	 * @name kick
	 * @method
	 * @function
	 * @memberOf jslgEngine.controller.MainController#
	 * @param {Object} options
	 **/
	p.kick = function(data, options) {
		var self = this;
		var pendingCommand = self.pendingCommand;
		
		//新規に追加
		var connector = new jslgEngine.model.network.ConnectorOnline();
		
		self.findElements(connector, {
			key : data.key,
			className : data.className
		}, options);
		connector.connects(function(connector_s, result) {
			if(result.length > 0) {
				var element = result[0];
				
				jslgEngine.log('found out kicked Element:'+data.key);
				
				if(pendingCommand && !pendingCommand.wasResolved()) {
					pendingCommand.resolve(connector, element, {}, options);
				}
				
				connector_s.connects(function(connector_ss) {
					
					if(!pendingCommand || (pendingCommand && pendingCommand.wasResolved())) {
						//TODO: 解決後、消去するタイミングを考える必要があるかもしれない。
						self.pendingCommand = null;
						
						var command = element.getChild({
							key : 'onClick'
						});
						if(command) {
							command = command.getRunnableCommand({}, options);
							command.run(connector_ss, {}, options);
							connector_ss.pipe(function(connector_sss) {
								jslgEngine.dispose(command);
								delete command;
								
								if(data.callback) {
									data.callback(element);
								}
								connector_sss.resolve();
							});
						}
					}
				});
			}
		});
	};

	/**
	 * ファイルの読み込み
	 *
	 * @name load
	 * @method
	 * @function
	 * @memberOf jslgEngine.controller.MainController#
	 **/
	p.load = function(connector, data, options) {
		var self = this;
		var fileType = data.fileType;
		
		for(var i = 0; i < self._fileControllers.length; i++) {
			var fileController = self._fileControllers[i];
			
			if(fileType && fileController.getKey() !== fileType) {
				continue;
			}
			fileController.load(connector, data, options);
		}
	};
	
	/**
	 * リソースに読み込むためのファイルを追加
	 *
	 * @name addResourceElements
	 * @method
	 * @function
	 * @memberOf jslgEngine.controller.MainController#
	 **/
	p.addResourceElements = function(data) {
		var self = this;
		
		for(var i = 0; i < data.resources.length; i++) {
			var resouce = data.resources[i];
			for(var j = 0; j < self._fileControllers.length; j++) {
				var fileController = self._fileControllers[j];
				
				if(fileController.getKey() === resouce.resourceFileType) {
					fileController.add({
						key : resouce.resourceKey,
						url : resouce.resourceUrl
					});
				}
			}
		}
	};

	/**
	 * ワールド空間を取得
	 *
	 * @name getWorldRegion
	 * @method
	 * @function
	 * @memberOf jslgEngine.controller.MainController#
	 * @param {Object} options
	 * <ul>
	 * <li>{Object} position 入力座標</li>
	 * </ul>
	 **/
	p.getWorldRegion = function(options) {
		var self = this;
		return self._worldRegion;
	};

	/**
	 * 特定のファイルコントローラを取得する
	 *
	 * @name getController
	 * @method
	 * @function
	 * @memberOf jslgEngine.controller.MainController#
	 **/
	p.getController = function(key) {
		var self = this;
		
		for(var i = 0; i < self._fileControllers.length; i++) {
			var fileController = self._fileControllers[i];
			
			if(fileController.getKey() === key) {
				return fileController;
			}
		}
	};
	
	/**
	 * 子要素の検索
	 *
	 * @name findElements
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.common.JSlgElementBase#
	 * @param {Object} options
	 */
	p.findElements = function(connector, data, options) {
		var self = this;
		var worldRegion = self._worldRegion;
		var elementSeparator = jslgEngine.config.elementSeparator;
		
		return worldRegion.findElements(connector, data, options);
	};
	
	/**
	 * 未解決の問題を取得
	 *
	 * @name getIssue
	 * @method
	 * @function
	 * @memberOf jslgEngine.controller.MainController#
	 * @param {Object} options
	 * <ul>
	 * <li>{Object} position 入力座標</li>
	 * </ul>
	 **/
	p.getIssue = function(options) {
		var self = this;
		return self.pendingCommand;
	};
	
	/**
	 * 幅と高さから、2次元座標として奥から描画するようにソートする
	 *
	 * @name sortSecondDimension
	 * @method
	 * @function
	 * @memberOf jslgEngine.controller.MainController#
	 * @param {Object} options
	 * <ul>
	 * <li>{Object} position 入力座標</li>
	 * </ul>
	 **/
	p.sortSecondDimension = function(w, h, callback) {
		var list = [];

		for ( var i = 0; i < w; i++) {
			for ( var j = 0; j < h; j++) {
				var pt = ((w - i) + j) * (w + h) + j;
				//var pt = (w - i) + j;
				list.push([ pt, { x : i, y : j, z : 0} ]);
			}
		}

		list.sort(function(a, b) {
			return a[0] - b[0];
		});

		for ( var i = 0; i < list.length; i++) {
			callback(list[i][0], list[i][1]);
		}
	};
		
	/**
	 * ユーザーを追加する
	 *
	 * @name addUser
	 * @method
	 * @function
	 * @memberOf jslgEngine.controller.MainController#
	 **/
	p.addUser = function(user) {
		var self = this;
		
		for(var i = 0; i < self.users.length; i++) {
			var target = self.users[i];
			if(target.key === user.getKey()) {
				return false;
			}
		}
		self.users.push(user);
	};
	
	/**
	 * ユーザーをアクティブ化する
	 *
	 * @name activateUser
	 * @method
	 * @function
	 * @memberOf jslgEngine.controller.MainController#
	 **/
	p.activateUser = function(connector, key, options) {
		var self = this;
		
		for(var i = 0; i < self.users.length; i++) {
			var user = self.users[i];
			if(user.key === key) {
				user.beActive(connector, options);
				return true;
			}
		}
		return false;
	};
	
	/**
	 * 要素を紐づける
	 *
	 * @name bindElement
	 * @method
	 * @function
	 * @memberOf jslgEngine.controller.MainController#
	 **/
	p.bindElement = function(key_element, element, data) {
		var self = this;
		var uniqueId = key_element.getKeyData().getUniqueId();
		var key = [key_element.getKey(),uniqueId].join(jslgEngine.config.elementSeparator);
		
		self._elementBinder.set(key, element);
	};
	
	/**
	 * 要素のもつ一意キーから、対象の要素を取得する。
	 *
	 * @name getElementFromBinder
	 * @method
	 * @function
	 * @memberOf jslgEngine.controller.MainController#
	 **/
	p.getElementFromBinder = function(key_element) {
		var self = this;
		var uniqueId = key_element.getKeyData().getUniqueId();
		var key = [key_element.getKey(),uniqueId].join(jslgEngine.config.elementSeparator);
		
		return self._elementBinder.get(key);
	};
	
	/**
	 * 要素のもつ一意キーから、対象の要素を取得する。
	 *
	 * @name getWebWorkers
	 * @method
	 * @function
	 * @memberOf jslgEngine.controller.MainController#
	 **/
	p.getWebWorkers = function(key) {
		var self = this;
		return self._webworkers[key];
	};
	
	/**
	 * 一意なIDを取得する。
	 *
	 * @name getUniqueId
	 * @method
	 * @function
	 * @memberOf jslgEngine.controller.MainController#
	 **/
	p.getUniqueId = function() {
		var self = this;
		
		return (self._idCount++);
	};
	
	o.MainController = MainController;
}());