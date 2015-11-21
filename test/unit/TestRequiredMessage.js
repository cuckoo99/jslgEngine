module('Mind');
testSettingAsAsync("TestRequiredMessage", {
		mainData : {width:10,height:10},
		timeOut : 2000
	},
	function(iconController, mainController, connector, options) {
	var issueSet = [];
	//var webWorkersDir = '../src/';
	
	var messageKey = jslgEngine.ui.keys.MESSAGE_BOARD;
        var selectionName = jslgEngine.ui.keys.MESSAGE_BOARD_SELECTION;
	
	var result;

	var region = options.mainController.getWorldRegion();

	var requiredMessage = new jslgEngine.model.issue.RequiredMessage({
		settings : [{
			message : 'hoge',
	    		imageData : null,
	    		selection : [{
				key : selectionName+0,
	  			text : '0'
			}, {
				key : selectionName+1,
	    			text : '1'
			}]
		}, {
			message : 'hoge2',
	    		imageData : {
				key : 'img',
	   			regX : 0,
	    			regY : 0,
	    			width : 10,
	    			height : 10
			},
	    		selection : [{
				key : selectionName+0,
	    			text : '2'
			}]
		}]
	});
	var eObj = new jslgEngine.model.common.JSlgElement({
		key : 'empty'
	}, options);

	// apply.
	testAsSync('apply', connector, function(name, connector_s) {
		requiredMessage.apply(connector_s, eObj, {}, options);

		var result = requiredMessage.wasResolved();
		var expected = false;
		equal(expected, result, name);
	});
	// resolve
	testAsSync('resolve', connector, function(name, connector_s) {
		
		requiredMessage.resolve(connector_s, eObj, {}, options);

		var result = requiredMessage.wasResolved();
		var expected = true;
		equal(expected, result, name);
	});
	// get patterns
	testAsSync('get patterns', connector, function(name, connector_s) {
		var list = [];

		requiredMessage.getPatterns(connector_s, 1, {
			result : list
		}, options);

		var result = list.length;
		var expected = 2;
		equal(expected, result, name);

	});
	// make element.
	testAsSync('make element', connector, function(name, connector_s) {
		requiredMessage._makeMessageElement(connector_s, {
			text : 'hoge',
			imageData : {
			},
			selection : [{
				text : 'tx',
				colors : null
			}]
		}, options);
		
		var message = region.getChild({
			key : messageKey
		});

		var expected = messageKey;
		equal(expected, message.getKey(), name);

		options.mainController.updateIconsAll(connector_s, {}, options);
	});
	// remove message elements.
	testAsSync('remove message elements', connector, function(name, connector_s) {
		requiredMessage._removeMessages$(connector_s, options);
		
		var message = region.getChild({
			key : messageKey
		});

		var expected = null;
		equal(expected, message, name);
	});
});
