/*
 * @author cuckoo99
 */

(function() {
	// namespace:
	var o = this.jslgEngine = this.jslgEngine||{};
	o = (o.controller = o.controller||{});

	/**
	 * <p>
	 * this class frequently updates anything of data like images on canvas.
     * and it manages animation data to update object in IconController.
	 * </p>
	 * @class
	 * @name Ticker
	 * @memberOf jslgEngine.controller
	 * @constructor
	 */
	var Ticker = function() {
		this.initialize();
	};
	/**
	 *
	 */
	var p = Ticker.prototype;

	/**
	 * set up
	 *
	 * @name initialize
	 * @method
	 * @function
	 * @memberOf jslgEngine.controller.Ticker#
	 **/
	p.initialize = function() {
		var self = this;
		self._animationContainers = [];
		self._animationGroups = [];
		self._callbacks = [];
	};

	/**
	 * callback functions.
     * when all animations are done, it would be called.
	 *
	 * @private
	 * @name _callbacks
	 * @property
	 * @type Function[]
	 * @memberOf jslgEngine.controller.Ticker#
	 **/
	p._callbacks = null;

	/**
	 * animation containers
	 *
	 * @private
	 * @name _animationContainers
	 * @property
	 * @type jslgEngine.model.animation.AnimationContainer[]
	 * @memberOf jslgEngine.controller.Ticker#
	 **/
	p._animationContainers = null;

	/**
	 * animation groups.
	 *
	 * @private
	 * @name _animationGroups
	 * @property
	 * @type jslgEngine.model.animation.AnimationGroups[]
	 * @memberOf jslgEngine.controller.Ticker#
	 **/
	p._animationGroups = null;

	/**
	 * state of waiting fetching elements.
	 *
	 * @private
	 * @name _isIdlingTime
	 * @property
	 * @type jslgEngine.model.animation.AnimationGroups[]
	 * @memberOf jslgEngine.controller.Ticker#
	 **/
	p._isIdlingTime = false;

	/**
	 * count of dilay.
	 *
	 * @private
	 * @name _updateIdleTime
	 * @property
	 * @type jslgEngine.model.animation.AnimationGroups[]
	 * @memberOf jslgEngine.controller.Ticker#
	 **/
	p._idleTimeCount = 0;

	/**
	 * delay of fetching elements
	 *
	 * @private
	 * @name _updateIdleTime
	 * @property
	 * @type jslgEngine.model.animation.AnimationGroups[]
	 * @memberOf jslgEngine.controller.Ticker#
	 **/
	p._updateIdleTime = 1000;

	/**
	 * run
	 *
	 * @name tick
	 * @method
	 * @function
	 * @memberOf jslgEngine.controller.Ticker#
	 * @param {Object} options
	 **/
	p.tick = function(options) {
		var self = this;
		var length;
		var groundLocation = null;
		var castKey = null;
		var itemKey = null;
		var ui = options.ui;
	
		if(options.mainController.isOnline()) {
			if(!self._isIdlingTime && (self._idleTimeCount++) > self._updateIdleTime) {
				self._isIdlingTime = true;
				self._idleTimeCount = 0;
			
				var connector = new jslgEngine.model.network.ConnectorOnline();
				// if online mode was enabled, rewrites elements frequently.
				var onlineManager = options.mainController.getOnlineManager();
				onlineManager.fetchElements(connector, {
					
				}, options);
				onlineManager = null;
				connector.pipe(function(connector_s) {
					self._isIdlingTime = false;
				});
			}
		}
		
		if(self.wasFinished()) {
			if(self._callbacks && self._callbacks.length > 0) {
				var callbackList = self._callbacks.reverse();
				var currentFunc = callbackList.pop();
				if(!currentFunc(ui)) {
					callbackList.push(currentFunc);
					self._callbacks = callbackList.reverse();
				}
			}
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
	};

	/**
	 * add callback function.
	 *
	 * @name addCallback
	 * @method
	 * @function
	 * @memberOf jslgEngine.controller.Ticker#
	 * @param {Object} options
	 **/
	p.addCallback = function(callback, options) {
		var self = this;
		
		self._callbacks.push(callback);
	};

	/**
	 * add animation
	 *
	 * @name addAnimation
	 * @method
	 * @function
	 * @memberOf jslgEngine.controller.Ticker#
	 * @param {Object} data
	 * @param {Object} options
	 **/
	p.addAnimation = function(data, options) {
		var self = this;
		
		if(!data) {
			jslgEngine.log('There is no data to add Animation.');
			return;
		}
		
		var key = data.key;
		
		if(!options.iconController.hasKey(key)) {
			jslgEngine.log('Not found '+key+' Icon to animate.');
			return;
		}
		
		var animationContainer = self._getAnimationContainer(key);

		if(!animationContainer) {
			animationContainer = new jslgEngine.model.animation.AnimationContainer(data);
			self._animationContainers.push(animationContainer);
		}
		
		animationContainer.addChild({
			obj : new jslgEngine.model.animation.Animation(data)
		});
	};

	/**
	 * add AnimationGroup.
	 *
	 * @name addAnimationGroup
	 * @method
	 * @function
	 * @memberOf jslgEngine.controller.Ticker#
	 * @param {Object} options
	 **/
	p.addAnimationGroup = function(data, options) {
		var self = this;
		
		if(!data) {
			jslgEngine.log('There is no options to add Animation.');
			return;
		}
		
		var key = data.key;
		
		self._setAnimationGroup(key, data);
	};

	/**
	 * check if all animations were finished.
	 *
	 * @name wasFinished
	 * @method
	 * @function
	 * @memberOf jslgEngine.controller.Ticker#
	 * @param {Object} options
	 **/
	p.wasFinished = function(options) {
		var self = this;
		var key = options ? options.key : null;
		var isClear = true;
		
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
				isClear = animationContainer.wasFinished() ? isClear : false;
			}
		}
		if(!key) {
			length = self._animationGroups.length;
			for(var i = 0; i < length; i++) {
				var animationGroup = self._animationGroups[i];
				isClear = !animationGroup.hasCallback() ? isClear : false;
			}
		}
		return isClear;
	};
	

	/**
	 * let a animation be finished.
	 *
	 * @name notifyEndOfAnimation
	 * @method
	 * @function
	 * @memberOf jslgEngine.controller.Ticker#
	 * @param {String} key
	 * @param {Boolean} flag
	 **/
	p.notifyEndOfAnimation = function(key, flag) {
		var self = this;
		
		length = self._animationContainers.length;
		for(var i = 0; i < length; i++) {
			var animationContainer = self._animationContainers[i];
			
			if(animationContainer.key === key) {
				animationContainer.notifyEndOfAnimation(flag);
			}
		}
	};

	/**
	 * play all animations.
	 *
	 * @name unlockAnimation
	 * @method
	 * @function
	 * @memberOf jslgEngine.controller.Ticker#
	 * @param {Object} options
	 **/
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
	};


	/**
	 * get AnimationContainer.
	 *
	 * @name _getAnimationContainer
	 * @method
	 * @function
	 * @memberOf jslgEngine.controller.Ticker#
	 * @param {String} key
	 **/
	p._getAnimationContainer = function(key) {
		var self = this;
		var container;
		
		var length = self._animationContainers.length;
		for(var i = 0; i < length; i++) {
			var animationContainer = self._animationContainers[i];
			if(animationContainer.key === key) {
				container = animationContainer;
				return container;
			}
		}
		return null;
	};

	/**
	 * get AnimationGroup.
	 *
	 * @name _setAnimationGroup
	 * @method
	 * @function
	 * @memberOf jslgEngine.controller.Ticker#
	 * @param {String} key
	 * @param {Object} options
	 **/
	p._setAnimationGroup = function(key, options) {
		var self = this;
		var group = null;
		
		var length = self._animationGroups.length;
		for(var i = 0; i < length; i++) {
			var animationGroup = self._animationGroups[i];
			if(animationGroup.key === key) {
				self._animationGroups[i] = new jslgEngine.model.animation.AnimationGroup(options);
				group = true;
			}
		}
		
		if(!group) {
			group = new jslgEngine.model.animation.AnimationGroup(options);
			self._animationGroups.push(group);
		}
		
		return true;
	};
	
	o.Ticker = Ticker;
}());
