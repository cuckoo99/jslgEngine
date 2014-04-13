/**
 *
 * @author cuckoo99 
 */

jslgEngine.boot = function(data) {
	var o = this.jslgEngine = this.jslgEngine||{};

	var exData = data||{};
	var xml = exData.xml;
	
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
	var converter = iconController.converter;
	
	if(xml) {
  		var parser = new DOMParser();
		var xmlDoc = parser.parseFromString(xml.replace(/>[ |\t|\r|\n]*</g, "><"),
				"text/xml");
		
		var region = mainController.getWorldRegion();
		region.setKey('w1');
		converter.map({
			data : xmlDoc,
			mainController : mainController
		});
	}
	
	var options = {
		mainController : mainController,
		iconController : iconController,
		converter : converter
	};
	
	var player = new jslgEngine.model.user.User({
		key : 'player',
		isAuto : false,
		memberStatus : {
			key : 'belongs',
			value : 'player'
		}
	});
	
	var enemy = new jslgEngine.model.user.User({
		key : 'enemy',
		isAuto : true,
		memberStatus : {
			key : 'belongs',
			value : 'enemy'
		}
	});
	
	mainController.addUser(player);
	mainController.addUser(enemy);
	mainController.activateUser(mainController.connector, 'player', options);
	
	mainController.load(connector, {}, options);
	connector.pipe(function(connector_s) {
		if(!xml) {
			jslgEngine.makeSampleElements({
				width : 6,
				height : 6,
				depth : 1,
				viewOptions : {
					stageViewOffset : {x:0,y:0,z:0}
				}
			}, options);
		}
		connector_s.resolve();
		jslgEngine.build(connector_s, {}, options);
		
		mainController.ticker.unlockAnimation();	
		
		//createjs.Ticker.setFPS(24);
		createjs.Ticker.setFPS(10);
		createjs.Ticker.addEventListener("tick", handleTick);
		
		function handleTick(e) {
			if (!e.paused) {
				mainController.ticker.tick({
					iconController : iconController
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
	connector.connects(function(connector_s) {
		//初期イベント仮実装
		mainController.findElements(connector_s, {
			key : 'w1.r1.init'
		}, options);
		connector_s.connects(function(connector_ss, result_ss) {
			var firstCommand = result_ss[0];
			if(firstCommand) {
				firstCommand.run(connector_s, {}, options);
			} else {
				jslgEngine.log('No Initial Command');
			}
		});
	});
	
	o.addIcon = function(options) {
		var mainController = options.mainController;
		//GUIでテスト
		
		var code = 'icon(w1.r1.func1)';
		arguments = ['w1.r1', '"testIcon"', '"map1"', '"w1.r1.func1"',
			[
				[100,100,0],1,'null',
				[[160,160,0,0],[['"default"',0,0]]]
			]];
		actionData = {arguments : arguments};
		action = new jslgEngine.model.action.ActionIcon(actionData);
		
		mainController.connector.pipe(function(connector_s) {
			action.find({
				mainController : mainController,
				connector : connector_s.resolve()
			});
		});
		mainController.connector.pipe(function(connector_s) {
			action.run.apply(action, [connector_s.resolve(), {
				resolveFunc : options ? options.resolveFunc : null
			},
			{
				mainController : options.mainController,
				iconController : options.iconController
			}]);
		});
	};
	
};