module('Command');

testSettingAsAsync("TestCommandBlock", {
		mainData : {width:10,height:10}
	},
	function(iconController, mainController, connector, options) {

	var textRun = 'Run', textRestore = 'Restore', textSeparator = '_';
	var result;
	var commandBlock;
	var elements;
	var region = mainController.getWorldRegion();;
	var data = {
		localElements : {},
		resolveFunc : options ? options.resolveFunc : null
	};
		
	var testCommandBlock = function(connector_s, block, data_s, options_s, callback, callback_s) {
		connector_s.pipe(function(connector_ss) {
			block.find(connector_ss.resolve(), data_s, options_s);
		}).pipe(function(connector_ss) {
			data.localElements[jslgEngine.model.logic.keys.SELF] = null;
			
			//実行
			block.run.apply(block, [connector_ss.resolve(), data_s, options_s]);
		}).pipe(function(connector_ss) {
			connector_ss.resolve();
			callback(connector_ss, data_s);
		}).pipe(function(connector_ss) {
			//リストア
			block.restore.apply(block, [connector_ss.resolve(), data_s, options_s]);
		}).pipe(function(connector_ss) {
			connector_ss.resolve();
			callback_s(connector_ss, data_s);
		});
	};
	
	
	testAsSync('ブロック：要素の取得', connector, function(name, connector_s) {
	});
	testAsSync('ブロック：配列要素の取得', connector, function(name, connector_s) {
	});
	testAsSync('ブロック：ジャグ配列要素の取得', connector, function(name, connector_s) {
	});
	testAsSync('ブロック：IF', connector, function(name, connector_s) {
		commandBlock = new jslgEngine.model.command.CommandBlockIF({
			parameters : '15+20>0',
			children : []
		});
		testCommandBlock(connector_s, commandBlock, data, options, function(data_s) {
			var element = commandBlock.wasPassed();
			
			equal(element, true, [name,textRun].join(textSeparator));
		}, function(data_s) {
			var element = commandBlock.wasPassed();
			
			equal(element, false, [name,textRestore].join(textSeparator));
		});
	});
	testAsSync('ブロック：ElseIF', connector, function(name, connector_s) {
		commandBlock = new jslgEngine.model.command.CommandBlockElseIF({
			parameters : '15+20>0',
			children : [],
			mainController : mainController
		});
		testCommandBlock(connector_s, commandBlock, data, options, function(data_s) {
			var element = commandBlock.wasPassed();
			
			equal(element, true, [name,textRun].join(textSeparator));
		}, function(data_s) {
			var element = commandBlock.wasPassed();
			
			equal(element, false, [name,textRestore].join(textSeparator));
		});
	});
	testAsSync('ブロック：FOR', connector, function(name, connector_s) {

		var action = new jslgEngine.mock.Action({});
		commandBlock = new jslgEngine.model.command.CommandBlockFOR({
			parameters : ['"$temp"', ['w1.r1', 'w1.r1']],
			children : [action],
			mainController : mainController		
		});
		var loops = 2;
		testCommandBlock(connector_s, commandBlock, data, options, function(connector_ss, data_s) {
			children = commandBlock.getChildren();
			var isGreen = true;
			for(var i = 0, len = children.length; i < len; i++) {
				isGreen = children[i].wasDone() ? isGreen : false;
				equal(children[i].wasDone(), true, [name,textRun].join(textSeparator)+i);
			}
		}, function(connector_ss, data_s) {
			children = commandBlock.getChildren();
			var isGreen = true;
			for(var i = 0, len = children.length; i < len; i++) {
				isGreen = !children[i].wasDone() ? isGreen : false;
				equal(children[i].wasDone(), false, [name,textRestore].join(textSeparator)+i);
			}
		});
	});
});
