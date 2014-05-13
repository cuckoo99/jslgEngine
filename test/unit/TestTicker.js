module('Animation');
testSettingAsAsync("TestTicker", {
		mainData : {width:10,height:10}
	},
	function(iconController, mainController, connector, options) {
		
	var result;
	var isStarted = false;
	
	var iconController2 = jslgEngine.stub.IconController.prototype.getSample(['test1', 'test2', 'test3']);
	options.iconController = iconController2;
	
	var ticker = new jslgEngine.controller.Ticker();
	
	var positions = [{ x : 0, y : 0, z : 0}];
	
	ticker.addAnimation({
		key : 'test1',
		positions : positions,
		fadeType : jslgEngine.model.animation.keys.fadeType.FADE_IN
	}, options);
	
	ticker.addAnimation({
		key : 'test2',
		positions : positions,
		fadeType : jslgEngine.model.animation.keys.fadeType.FADE_IN
	}, options);
	
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
	
	ticker.unlockAnimation({});

	var limit = 20;	
	var interval = setInterval(function() {
		ticker.tick({
			iconController : iconController2
		});
		if ((limit--) < 0) {
			clearInterval(interval);
			jslgEngine.log('removed tick');
		}
	}, 100);
	
});