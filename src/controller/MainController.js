/*
 * @author cuckoo99
 */

(function() {
	// namespace:
	var o = this.jslgEngine = this.jslgEngine||{};
	o = (o.controller = o.controller||{});

	/**
	 * <h4>MainController</h4>
	 * <p>
	 * It has the root of all JSlg element,
     * and these managing functions.
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
	 * set up
	 *
	 * @name initialize
	 * @method
	 * @function
	 * @memberOf jslgEngine.controller.MainController#
	 **/
	p.initialize = function(data) {
		var self = this;
		var workersPath = data.workersPath||jslgEngine.workSpace+jslgEngine.config.workersURL;
		self._worldRegion = new jslgEngine.model.area.WorldRegion({
		    key : self.defWorldRegionKey
		}, {
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
		self._onlineManager = new jslgEngine.controller.OnlineManager();
        	self.bindElement(self._worldRegion, null);
	};

	/**
	 * WorldRegion key
	 *
	 * @name defWorldRegionKey
	 * @property
	 * @type jslgEngine.model.area.WorldRegion
	 * @memberOf jslgEngine.controller.MainController#
	 **/
	p.defWorldRegionKey = 'w1';

	/**
	 * WorldRegion
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
	 * Web Workers
	 *
	 * @name backGroundWorker
	 * @property
	 * @type jslgEngine.controller.BackGroundWorker
	 * @memberOf jslgEngine.controller.MainController#
	 **/
	p.backGroundWorker = null;

	/**
	 * timer
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
	 * Unsolved input element.
	 *
	 * @name pendingCommand
	 * @property
	 * @type jslgEngine.model.issue.PendingCommand
	 * @memberOf jslgEngine.controller.MainController#
	 **/
	p.pendingCommand = null;

	/**
	 * users
	 *
	 * @name users
	 * @property
	 * @type jslgEngine.model.user.User[]
	 * @memberOf jslgEngine.controller.MainController#
	 **/
	p.users = null;
	
	/**
	 * ElementBinder.
	 *
	 * @name elementBinder
	 * @property
	 * @type jslgEngine.controller.ElementBinder
	 * @memberOf jslgEngine.controller.MainController#
	 **/
	p._elementBinder = null;

	/**
	 * Online manager.
	 *
	 * @name _onlineManager
	 * @property
	 * @type jslgEngine.controller.ElementBinder
	 * @memberOf jslgEngine.controller.MainController#
	 **/
	p._onlineManager = null;
	
	/**
	 * unique Id count
	 *
	 * @name idCount
	 * @property
	 * @type Number
	 * @memberOf jslgEngine.controller.MainController#
	 **/
	p._idCount = 1;

	p.isOnline = function() {
		return this._onlineManager.isOnline;
	};
	
	p.getOnlineManager = function() {
		return this._onlineManager;
	};

	p.reset = function(options) {
		var self = this;
		
		// clear all elements
		self._elementBinder.reset();
		
		self._worldRegion.dispose();
		self._worldRegion = new jslgEngine.model.area.WorldRegion({
			key : self.defWorldRegionKey
		}, options);
		// clear all icon elements
		options.iconController.removeAll(options);

		for(var i = 0; i < self._fileControllers.length; i++) {
			var fileController = self._fileControllers[i];
			
			fileController.removeAll();
		}
	};

	/**
	 * call onClick Command in Element.
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
		
		// create process.
		var connector = new jslgEngine.model.network.ConnectorOnline();
		
		if(self.isOnline()) {
			self._onlineManager.run(connector, {
				id : data.key,
			}, options);
			return;
		}

		self.findElements(connector, {
			id : data.key,
		}, options);
		connector.connects(function(connector_s, result) {
			if(result.length > 0) {
				var element = result[0];
				
				jslgEngine.log('found out runnable element:'+data.key);
				
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
								command.dispose();
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
	 * Load files in FileControllers.
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
				
                var fileType = resouce.getStatus('fileType');
                fileType = fileType ? fileType.value : null;
                var key = resouce.getKey();
                var url = resouce.getStatus('url');
                url = url ? url.value : null;
                
				if(fileController.getKey() === fileType) {
					fileController.add({
						key : key,
						url : url
					});
				}
			}
		}
	};

	/**
	 * get WorldRegion.
	 *
	 * @name getWorldRegion
	 * @method
	 * @function
	 * @memberOf jslgEngine.controller.MainController#
	 * @param {Object} options
	 **/
	p.getWorldRegion = function(options) {
		var self = this;
		return self._worldRegion;
	};

	/**
	 * get a controller by key.
	 *
	 * @name getController
	 * @method
	 * @function
	 * @memberOf jslgEngine.controller.MainController#
	 * @param {String} key
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
	 * find elements from WorldRegion.
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
	p.sortBySecondDimension = function(list, w, h) {

		for(var i = 0, len = list.length; i < len; i++) {
			var element = list[i];
			
			var loc = element.getGlobalLocation();
		}

		list.sort(function(a, b) {
			var aLoc = a.getGlobalLocation();
			var bLoc = b.getGlobalLocation();
			
			var aPt = ((w - aLoc.x) + aLoc.y) * (w + h) + aLoc.y;
			var bPt = ((w - bLoc.x) + bLoc.y) * (w + h) + bLoc.y;

			return aPt - bPt;
		});

		return list;
	};
	
	/**
	 * bind relationship between elements.
	 *
	 * @name bindElement
	 * @method
	 * @function
	 * @memberOf jslgEngine.controller.MainController#
	 **/
	p.bindElement = function(key_element, element, data) {
		var self = this;
        
		var key = self._elementBinder.getUniqueId(key_element);
		self._elementBinder.set(key, key_element, {
			mainController : self
		});
		
		self._elementBinder.attachParent(key, element);
	};
	
	/**
	 * search for elements in ElementBinder.
	 *
	 * @name getElementFromBinder
	 * @method
	 * @function
	 * @memberOf jslgEngine.controller.MainController#
	 **/
	p.searchElements = function(connector, data, options) {
		var self = this;
        
		self._elementBinder.search(connector, data, options);
	};
	
	/**
	 * get element from ElementBinder.
	 *
	 * @name getElementFromBinder
	 * @method
	 * @function
	 * @memberOf jslgEngine.controller.MainController#
	 **/
	p.getElementFromBinder = function(key_element) {
		var self = this;
        
        var key = self._elementBinder.getUniqueId(key_element);
		return self._elementBinder.getParent(key);
	};
	
	/**
	 * get web workers from key.
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
	 * get unique id.
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
	
	/**
	 * update all icons.
	 *
	 * @name updateAllIcons
	 * @method
	 * @function
	 * @memberOf jslgEngine.controller.MainController#
	 **/
	p.updateIconsAll = function(connector, data, options) {
		var self = this;

		var list = [];
		var region = self.getWorldRegion();

		connector.pipe(function(connector_s) {
			data.animationKeys = [];
			data.groupKeys = [];
			
			region.updateIcon(connector_s, data, options);

			var list = options.iconController.getNegationList(data.groupKeys);
			
			// remove icons unlinked.
			for(var i = 0, len = list.length; i < len; i++) {
				options.iconController.remove({
					key : list[i]
				});
			}
			
			if(data.animationKeys.length > 0) {
				options.mainController.ticker.addAnimationGroup({
					key : 'update',
					groupKeys : [data.animationKeys],
					callback : function() {
						jslgEngine.log('finished update');
						connector_s.resolve();
					}
				}, options);
			} else {
				jslgEngine.log('finished update');
				connector_s.resolve();
			}

			self.ticker.unlockAnimation(options);
		});
	};

	o.MainController = MainController;
}());
