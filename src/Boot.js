jslgEngine = jslgEngine||{};

/**
 *
 * @author cuckoo99 
 */
jslgEngine.boot = function(data) {
	var o = this.jslgEngine = this.jslgEngine||{};

	var exData = data||{};
	var xml = exData.xml;

	if(!xml) return;

	var timerLimit = 2000;
	
	var imageController = new jslgEngine.controller.ImageFileController();
	var audioController = new jslgEngine.controller.AudioFileController();
	var mainController = new jslgEngine.controller.MainController({
		fileControllers : [imageController, audioController]
	});
	var connector = mainController.connector;
	var iconController = new jslgEngine.controller.IconController({
		mainController : mainController,
		iconFactory : new jslgEngine.model.factory.JSlgIconFactory(),
		commandFactory : new jslgEngine.model.factory.JSlgCommandFactory(),
	});
	
	var parser = new DOMParser();
	var xmlDoc = parser.parseFromString(xml.replace(/>[ |\t|\r|\n]*</g, "><"),
			"text/xml");
	iconController.converter.map({
		data : xmlDoc,
		mainController : mainController
	});

	// almost methods need this parameters.
	var options = {
		mainController : mainController,
		iconController : iconController
	};

	// load all dependent files.
	mainController.load(connector, {}, options);
	connector.connects(function(connector_s) {
		var width, height, depth;

		var converter = iconController.converter;
		var slgIconFactory = iconController.iconFactory;
		var slgCommandFactory = iconController.commandFactory;
		var elements, locationOrders;
		var separator = jslgEngine.config.locationSeparator;

		var drawingKey = jslgEngine.model.common.keys.DRAWING_OPTIONS;

		var viewOptions;

		viewOptions = {
			stageViewOffset : {x:0,y:0,z:0}
		};
		iconController.stageViewOffset = viewOptions.stageViewOffset;

		//スクロールボタン生成
		var region = mainController.getWorldRegion();
		var scrollTypes = ['left', 'right', 'up', 'down'];
		for(var i = 0, len = scrollTypes.length; i < len; i++) {
			var scrollType = scrollTypes[i];

			var scrollButton = new jslgEngine.model.stage.ScrollButton({
				key : scrollType
			}, options);
			scrollButton.setStatus('direction', scrollType);

			region.addChild({
				obj : scrollButton
			}, options);
		}

		mainController.updateIconsAll(connector, {}, options);
		//jslgEngine.build(connector_s, {}, options);
		
		// run animations.
		mainController.ticker.unlockAnimation();	
		
		//createjs.Ticker.setFPS(24);
		//createjs.Ticker.setFPS(10);
		createjs.Ticker.addEventListener("tick", handleTick);
		
		function handleTick(e) {
			if (!e.paused) {
				mainController.ticker.tick({
					iconController : iconController,
					mainController : mainController
				});
				iconController.update();
			}
			if (timerLimit < 0) {
				createjs.Ticker.removeEventListener("tick", handleTick);
				jslgEngine.log('removed tick');
				jslgEngine.dispose(mainController);
			}
			timerLimit--;
		}
	});
	
	mainController.findElements(connector, {
		className : 'LocalRegion'
	}, options);
	connector.connects(function(connector_s, result_s) {
		var localRegion = result_s[0];
		var firstCommand = localRegion.getChild({
			key : 'init'
		});

		if(firstCommand) {
			firstCommand.run(connector_s, {}, options);
		}
	});
	
};
