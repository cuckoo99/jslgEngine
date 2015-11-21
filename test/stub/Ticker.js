/*
 * @author cuckoo99
 */

(function() {
	var o = this.jslgEngine = this.jslgEngine||{};
	o = (o.stub = o.stub||{});

	var Ticker = function() {
		this.initialize();
	};
	var p = Ticker.prototype;
	
	for(prop in jslgEngine.controller.Ticker.prototype) {
		p[prop] = jslgEngine.controller.Ticker.prototype[prop];
	}
	
	//p.initialize = function() {
	//}
	
	p.addAnimation = function(data, options) {
		var self = this;
		
		if(!data) {
			jslgEngine.log('There is no options to add Animation.');
			return;
		}
		
		var key = data.key;
		var animationContainer = self._getAnimationContainer(key);

		if(!animationContainer) {
			animationContainer = new jslgEngine.model.animation.AnimationContainer(data);
			self._animationContainers.push(animationContainer);
		}
		
		//アニメーションを無効にする。
		var anime = new jslgEngine.model.animation.Animation(data);
		anime.wasFinishedFlags.animation = true;
		
		animationContainer.addChild({
			obj : anime
		});
	};
	
	p.unlockAnimation = function(options) {
		var self = this;
		var key = options ? options.key : null;
		
		var animationContainers;

		if(key) { 
			animationContainers = [self._getAnimationContainer(key)];
		}
		else {
			animationContainers = self._animationContainers;		
		}
		
		var length = self._animationContainers.length;
		for(var i = 0; i < length; i++) {
			var animationContainer = self._animationContainers[i];
			if(animationContainer) {
				animationContainer.unlock();
			}
		}
		
		self._runCallbacks(options);
	};

	p._runCallbacks = function(options) {
		var self = this;
		var limit = 20;
		var ui = options?options.ui:{};
		
		while((limit--) > 0) {
			if(self.wasFinished()) {
				if(self._callbacks && self._callbacks.length > 0) {
					var callbackList = self._callbacks.reverse();
					var currentFunc = callbackList.pop();
					if(!currentFunc(ui)) {
						callbackList.push(currentFunc);
						self._callbacks = callbackList.reverse();
					}
				}
				break;
			} else {
				length = self._animationContainers.length;
				for(var i = 0; i < length; i++) {
					var animationContainer = self._animationContainers[i];
					animationContainer.run(options);
				}
				length = self._animationGroups.length;
				for(var i = 0; i < length; i++) {
					var animationGroup = self._animationGroups[i];
					animationGroup.run(self._animationContainers, options);
				}
			}
		}
	};

	o.Ticker = Ticker;
}());
