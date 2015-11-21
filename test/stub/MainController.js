
(function() {	
	var o = this.jslgEngine = this.jslgEngine||{};
	o = (o.stub = o.stub||{});

	var MainController = function(data) {
		this._parents = [];
		this.initialize(data);
	};

	var p = MainController.prototype;

	p.connector = null;

	p.count = 0;

	p._parents = null;
	
	p.initialize = function(data) {
		var self = this;
		var opt = data||{};

		self.connector = opt.isAsync ? new jslgEngine.model.network.ConnectorOnline() : new jslgEngine.stub.Connector();

		self.fileControllers = [new jslgEngine.stub.ImageFileController()];
	
		self._elementBinder = new jslgEngine.controller.ElementBinder();
		self.onlineManager = new jslgEngine.stub.OnlineManager();

		self.ticker = new jslgEngine.stub.Ticker();
		self.finder = {
			readElements : function(data) {
				data.connector.resolve();
			}
		};

		var makeSample = opt.noSample ? false : true;

		if(makeSample) {
			var options = {
				mainController : self
			};

			var localRegion = self.makeRegionElements(
					self, { width : opt.width?opt.width:5, height : opt.height?opt.height:5}, options);

			self._worldRegion = new jslgEngine.model.area.WorldRegion({
				key : 'w1'
			}, options);
			self._worldRegion.setStatus('width', 100, options);
			self._worldRegion.setStatus('height', 100, options);
			self._worldRegion.setStatus('depth', 100, options);

			self._worldRegion.addChild({
				obj : localRegion
			}, options);

			options = null;
		}
	};

	p.onlineManager = null;

	p.reset = function() {
		//TODO
		jslgEngine.log('called reset in MainController, but it did not work');
	}

	p.isOnline = function() {
		return this.onlineManager.isOnline;
	};

	p.getOnlineManager = function() {
		return this.onlineManager;
	}

	p.load = function(connector, data, options) {
	};
	
	p.addResourceElements = function(data) {
	};

	p.getElementFromBinder = function(element) {
		var self = this;
		var uid = element.getKeyData().getUniqueId();
		if(uid === null) {
			//jslgEngine.log('failed to attach.');
			return null;
		}
		//jslgEngine.log(''+uid+element.getKey());
		return self._parents[uid];
	};

	p.getWebWorkers = function(key) {
		return new jslgEngine.stub.BackGroundWorker({
			key : key
		});
	};

	p.searchElements = function(connector, data, options) {
		var result = this.findElements(null, data, options);
		if(connector) {
			connector.pipe(function(connector_s) {
				connector_s.resolve(result);
			});
		}
		return result;
	};

	p.findElements = function(connector, data, options) {
		var region = options.mainController.getWorldRegion();
		var result = region.findElements(null, data, options);
		if(connector) {
			connector.pipe(function(connector_s) {
				connector_s.resolve(result);
			});
		}
		return result;
	};

	p.getController = function(key) {
		if(key === 'Image') {
			return new jslgEngine.stub.ImageFileController();
		}
		return null;
	};

	p.bindElement = function(key_element, element, data) {
		var self = this;
		var uid = key_element.getKeyData().getUniqueId();
		//jslgEngine.log(''+uid+element.getKey());
		self._parents[uid] = element;
	};
	
	p.getUniqueId = function() {
		return (this.count++);
	};
	
	p.sortSecondDimension = function(w, h, callback) {
		for(var i = 0; i < w; i++) {
			for(var j = 0; j < h; j++) {
				callback({}, {x:i, y:j});
			}
		}
	};
	
	p.getWorldRegion = function() {
		return this._worldRegion;
	};
	
	// サンプルデータ作成
	p.makeRegionElements = function(main_controller, data, options) {
		var self = this;

		var width = data.width;
		var height = data.height;

		var localRegion = new jslgEngine.model.area.LocalRegion({
			key : 'r1',
		    	location : new jslgEngine.model.area.Location({x:0,y:0,z:0}),
		}, options);
		var stageFrame = new jslgEngine.model.stage.StageFrame({
			key : 'rs1'
		}, options);
		var groundFrame = new jslgEngine.model.stage.GroundFrame({
			key : 'rg1'
		}, options);
		var castFrame = new jslgEngine.model.stage.CastFrame({
			key : 'rc1'
		}, options);
		var itemFrame = new jslgEngine.model.stage.ItemFrame({
			key : 'ri1'
		}, options);

		stageFrame.setStatus('width', width, options);
		stageFrame.setStatus('height', height, options);
		stageFrame.setStatus('depth', 30, options);

		groundFrame.setStatus('type', 'grass', options);
		groundFrame.setStatus('effect', 0, options);

		castFrame.setStatus('type', 'human', options);
		castFrame.setStatus('effect', 3, options);

		itemFrame.setStatus('type', 'weapon', options);
		itemFrame.setStatus('effect', 4, options);

		localRegion.addChild({ obj : stageFrame }, options);
		localRegion.addChild({ obj : groundFrame }, options);
		localRegion.addChild({ obj : castFrame }, options);
		localRegion.addChild({ obj : itemFrame }, options);

		var stage = stageFrame.generate({
			key : 's1',
		    location : new jslgEngine.model.area.Location({x:0,y:0,z:0}),
		    size : new jslgEngine.model.area.Size({width:1,height:1,depth:1})
		}, options);
		localRegion.addChild({ obj : stage }, options);


		main_controller.sortSecondDimension(width, height, function(pt, location) {
			var i = location.x;
			var j = location.y;

			var separator = jslgEngine.config.locationSeparator;
			var key = i+separator+j+separator+0;
			var ground = groundFrame.generate({
				location : new jslgEngine.model.area.Location({ x : i, y : j, z : 0}),
			    key : 'g'+key
			}, options);
			stage.addChild({ obj : ground }, options);
		});

		var ground = stage.getChild({ key : 'g0_0_0' });

		ground.addChild({ obj : castFrame.generate({ key : 'c1'}, options) }, options);
		var cast = ground.getChild({ key : 'c1' });
		cast.setStatus('belongs', 'player', options);
		cast.setStatus('life', 10, options);

		cast.addChild({ obj : itemFrame.generate({ key : 'i1'}, options) }, options);
		var item = cast.getChild({ key : 'i1' });

		var ground2 = stage.getChild({ key : 'g1_1_0' });

		ground2.addChild({ obj : castFrame.generate({ key : 'c_e1'}, options) }, options);
		var cast2 = ground2.getChild({ key : 'c_e1' });
		cast2.setStatus('belongs', 'enemy', options);
		cast2.setStatus('life', 8, options);

		return localRegion;
	};

	p.updateIconsAll = function(connector, data, options) {
		var self = this;

		var region = self.getWorldRegion();
		region.updateIcon(connector, data, options);
	};

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
	o.MainController = MainController;
}());
