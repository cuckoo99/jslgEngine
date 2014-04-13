/*
 * @author cuckoo99
 */

(function() {
	// namespace:
	var o = this.jslgEngine = this.jslgEngine||{};
	o = (o.controller = o.controller||{});

	/**
	 * <h4>タイマー処理クラス</h4>
	 * <p>
	 * 定期的に実行する処理を管理する。
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
	 * 初期化
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
	 * コールバック関数
	 *
	 * @private
	 * @name _callbacks
	 * @property
	 * @type Function[]
	 * @memberOf jslgEngine.controller.Ticker#
	 **/
	p._callbacks = null;

	/**
	 * 管理アニメーション
	 *
	 * @private
	 * @name _animationContainers
	 * @property
	 * @type jslgEngine.model.animation.AnimationContainer[]
	 * @memberOf jslgEngine.controller.Ticker#
	 **/
	p._animationContainers = null;

	/**
	 * 管理アニメーションのグループ
	 *
	 * @private
	 * @name _animationGroups
	 * @property
	 * @type jslgEngine.model.animation.AnimationGroups[]
	 * @memberOf jslgEngine.controller.Ticker#
	 **/
	p._animationGroups = null;

	/**
	 * 通信
	 *
	 * @private
	 * @name _connector
	 * @property
	 * @type jslgEngine.model.network.ConnectorOnline
	 * @memberOf jslgEngine.controller.Ticker#
	 **/
	p._connector = null;

	/**
	 * タイマー処理を実行する
	 *
	 * @name tick
	 * @method
	 * @function
	 * @memberOf jslgEngine.controller.Ticker#
	 * @param {JSON} options
	 * <ul>
	 * </ul>
	 **/
	p.tick = function(options) {
		var self = this;
		var length;
		var groundLocation = null;
		var castKey = null;
		var itemKey = null;
		var ui = options.ui;
	
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
	 * コールバック関数を追加する
	 *
	 * @name addCallback
	 * @method
	 * @function
	 * @memberOf jslgEngine.controller.Ticker#
	 * @param {JSON} options
	 * <ul>
	 * </ul>
	 **/
	p.addCallback = function(callback, options) {
		var self = this;
		
		self._callbacks.push(callback);
	};

	/**
	 * アニメーションを追加する
	 *
	 * @name addAnimation
	 * @method
	 * @function
	 * @memberOf jslgEngine.controller.Ticker#
	 * @param {JSON} options
	 * <ul>
	 * </ul>
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
	 * アニメーション・グループを追加する
	 *
	 * @name addAnimationGroup
	 * @method
	 * @function
	 * @memberOf jslgEngine.controller.Ticker#
	 * @param {JSON} options
	 * <ul>
	 * </ul>
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
	 * アニメーションが終了したか確認
	 *
	 * @name wasFinished
	 * @method
	 * @function
	 * @memberOf jslgEngine.controller.Ticker#
	 * @param {JSON} options
	 * @returns Boolean
	 * <ul>
	 * </ul>
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
	 * アニメーション・グループを追加する
	 *
	 * @name notifyEndOfAnimation
	 * @method
	 * @function
	 * @memberOf jslgEngine.controller.Ticker#
	 * @param {JSON} options
	 * <ul>
	 * </ul>
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
	 * アニメーションのロックを解除する
	 *
	 * @name unlockAnimation
	 * @method
	 * @function
	 * @memberOf jslgEngine.controller.Ticker#
	 * @param {JSON} options
	 * <ul>
	 * </ul>
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
	 * アニメーションを取得する
	 *
	 * @name _getAnimationContainer
	 * @method
	 * @function
	 * @memberOf jslgEngine.controller.Ticker#
	 * @param {JSON} options
	 * <ul>
	 * </ul>
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
	 * グループを取得する
	 *
	 * @name _setAnimationGroup
	 * @method
	 * @function
	 * @memberOf jslgEngine.controller.Ticker#
	 * @param {JSON} options
	 * <ul>
	 * </ul>
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