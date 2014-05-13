
(function() {	
	var o = this.jslgEngine = this.jslgEngine||{};
	o = (o.stub = o.stub||{});

	var MainController = jslgEngine.extend(
		jslgEngine.controller.MainController,
		function(options) {
			this.initialize(options);
		}
	);

	var p = MainController.prototype;
	
	p.initialize = function(data) {
        var self = this;
		var opt = data||{};
		
        data.fileControllers = [
			new jslgEngine.controller.ImageFileController()
		];
        p.__super__.initialize.call(self, data, options);
        
		self.ticker = new jslgEngine.stub.Ticker();
        
		var makeSample = opt.noSample ? false : true;
		
		if(makeSample) {
			var localRegion = self.makeRegionElements(
					self, { width : opt.width?opt.width:5, height : opt.height?opt.height:5}, {}
				);
            
			self._worldRegion.setKey('w1');
			self._worldRegion.setStatus('width', 100);
			self._worldRegion.setStatus('height', 100);
			self._worldRegion.setStatus('depth', 100);
			var options = {
				mainController : self
			};
	
			self._worldRegion.addChild({
				obj : localRegion
			}, options);
		}

	};
	
	// サンプルデータ作成
	p.makeRegionElements = function(main_controller, data) {
		var self = this;
		
		var width = data.width;
		var height = data.height;
		var options = {
			mainController : main_controller
		};
		
		var localRegion = new jslgEngine.model.area.LocalRegion();
		localRegion.setKey('r1');
		var stageFrame = new jslgEngine.model.stage.StageFrame();
		stageFrame.setKey('rs1');
		var groundFrame = new jslgEngine.model.stage.GroundFrame();
		groundFrame.setKey('rg1');
		var castFrame = new jslgEngine.model.stage.CastFrame();
		castFrame.setKey('rc1');
		var itemFrame = new jslgEngine.model.stage.ItemFrame();
		itemFrame.setKey('ri1');
	
		stageFrame.setStatus('width', width);
		stageFrame.setStatus('height', height);
		stageFrame.setStatus('depth', 30);
	
		groundFrame.setStatus('type', 'grass');
		groundFrame.setStatus('effect', 0);
	
		castFrame.setStatus('type', 'human');
		castFrame.setStatus('effect', 3);
	
		itemFrame.setStatus('type', 'weapon');
		itemFrame.setStatus('effect', 4);
	
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
		cast.setStatus('belongs', 'player');
		cast.setStatus('life', 10);
	
		cast.addChild({ obj : itemFrame.generate({ key : 'i1'}, options) }, options);
		var item = cast.getChild({ key : 'i1' });
		
		var ground2 = stage.getChild({ key : 'g1_1_0' });
	
		ground2.addChild({ obj : castFrame.generate({ key : 'c_e1'}, options) }, options);
		var cast2 = ground2.getChild({ key : 'c_e1' });
		cast2.setStatus('belongs', 'enemy');
		cast2.setStatus('life', 8);
		
		return localRegion;
	};

	o.MainController = MainController;
}());