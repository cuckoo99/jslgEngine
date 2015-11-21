module('Animation');
testSettingAsAsync("TestTicker", {
		mainData : {width:10,height:10}
	},
	function(iconController, mainController, connector, options) {
		
	var result;
	var isStarted = false;
	
	//var iconController2 = jslgEngine.stub.IconController.prototype.getSample(['test1', 'test2', 'test3']);
	//options.iconController = iconController2;
	
	var ticker = new jslgEngine.controller.Ticker();
	
	var positions = [{ x : 0, y : 0, z : 0}];
	
	iconController.add(null, {
		key : 'test1'
	}, options);
	iconController.add(null, {
		key : 'test2'
	}, options);
	
	// test adding animation.
	ticker.addAnimation({
		key : 'test1',
		positions : positions,
		fadeType : jslgEngine.model.animation.keys.fadeType.FADE_IN
	}, options);

	var animationContainer = ticker._animationContainers[0];
	equal(animationContainer != null, true, 'works adding animation');
	var children = animationContainer._children;
	equal(children.length === 1, true, 'works adding animation');

	ticker.addAnimation({
		key : 'test2',
		positions : positions,
		fadeType : jslgEngine.model.animation.keys.fadeType.FADE_IN
	}, options);

	var callingCount = 0;

	// test adding animation group.
	ticker.addAnimationGroup({
		key : 'test_group1',
		groupKeys : ['test1', 'test2'],
		callback : function(options) {
			
			result = ticker.wasFinished({ key : 'test1' });
			//アニメ終了
			equal(result, true, "passed!");
			
			result = ticker.wasFinished({ key : 'test2' });		
			//アニメ終了
			equal(result, true, "passed!");
			
			//result = ticker.wasFinished('test_group1');		
			//アニメ終了
			//equal(result, true, "passed!");
			
			informEndOfTest();
		}
	}, options);
	
	var animationGroup = ticker._animationGroups[0];
	equal(animationGroup != null, true, 'works adding animation');
	var groupKeys = animationGroup._groupKeys;
	equal(groupKeys.length, 2, 'works adding animation');
	
	// unlock animations.
	ticker.unlockAnimation({});
	
	// check if works animation update.
	for(var i = 0, len = 11; i < len; i++) {
		callingCount = i;

		// test tick
		ticker.tick({
			iconController : iconController,
			mainController : mainController,
		});
	}

	var onlineManager = mainController.getOnlineManager();
	onlineManager.isOnline = true;

	// check if works animation update.
	for(var i = 0, len = 11; i < len; i++) {
		callingCount = i;

		// test tick
		ticker.tick({
			iconController : iconController,
			mainController : mainController,
		});
	}
});
