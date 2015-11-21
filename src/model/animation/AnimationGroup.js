/*
 * @author cuckoo99
 */

(function() {
	// namespace:
	var o = this.jslgEngine = this.jslgEngine||{};
	o = (o.model = o.model||{});
	o = (o.animation = o.animation||{});
	
	/**
	 * <h4>アニメーション・グループ・クラス</h4>
	 * <p>
	 * 複数のアニメーションの管理を行うオブジェクト。
	 * </p>
	 * @class
	 * @name AnimationGroup
	 * @memberOf jslgEngine.model.animation
	 * @constructor
	 */
	var AnimationGroup = function(options) {
		this.initialize(options);
	};
	/**
	 *
	 */
	var p = AnimationGroup.prototype;

	/**
	 * キー
	 *
	 * @name key
	 * @property
	 * @type String
	 * @memberOf jslgEngine.model.animation.AnimationGroup#
	 **/
	p.key = null;

	/**
	 * 関連するアニメーション・キーの配列
	 *
	 * @name _group
	 * @property
	 * @type String[]
	 * @memberOf jslgEngine.model.animation.AnimationGroup#
	 **/
	p._group = null;

	/**
	 * コールバック関数
	 *
	 * @name _callback
	 * @property
	 * @type Function
	 * @memberOf jslgEngine.model.animation.AnimationGroup#
	 **/
	p._callback = null;

	/**
	 * 利用可能か
	 *
	 * @name _isAvailable
	 * @property
	 * @type Boolean
	 * @memberOf jslgEngine.model.animation.AnimationGroup#
	 **/
	p._isAvailable = true;

	/**
	 * 初期化
	 *
	 * @name initialize
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.animation.AnimationGroup#
	 * @protected
	 **/
	p.initialize = function(options) {
		var self = this;
		
		self.key = options.key;
		self._groupKeys = options.groupKeys;
		self._callback = options.callback;
	};

	/**
	 * 終了判定
	 *
	 * @name wasFinished
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.animation.AnimationGroup#
	 * @returns {Boolean}
	 */
	p.wasFinished = function(containers, options) {
		var self = this;
		if(!this._isAvailable) return false;
		
		var animationContainers = containers;
	
		var finishedCount = 0;
		for(var i = 0; i < self._groupKeys.length; i++) {
			var key = self._groupKeys[i];
			for(var j = 0; j < animationContainers.length; j++) {
				var animationContainer = animationContainers[j];
				if(animationContainer.key === key && animationContainer.wasFinished()) {
					finishedCount++;
				}
			}
		}
		
		if(finishedCount == self._groupKeys.length) {
			jslgEngine.count++;
			return true;
		}
		return false;
	};

	/**
	 * コールバック関数が残っているか確認する
	 *
	 * @name hasCallback
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.animation.AnimationGroup#
	 */
	p.hasCallback = function() {
		var self = this;
		return self._callback;
	};
	
	/**
	 * ロックを解除する
	 *
	 * @name unlock
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.animation.AnimationGroup#
	 */
	p.unlock = function() {
		var self = this;
	};
	
	/**
	 * アニメーションに終了通知を行う。
	 * 
	 * @name notifyFinish
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.animation.AnimationGroup#
	 */
	p.notifyFinish = function() {
	};

	/**
	 * アニメーションを実行する。
	 *
	 * @name run
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.animation.AnimationGroup#
	 * @param {JSON} options
	 * <ul>
	 * <li>{jslgEngine.network.SynchronizeBase} network 直列処理クラス</li>
	 * </ul>
	 **/
	p.run = function(containers, options) {
		var self = this;
		
		if(self.wasFinished(containers, options)) {
			self._isAvailable = false;
			self._callback(options);
			//TODO: 再実行の可能性がある場合フラグにする。
			self._callback = null;
		}
	};

	o.AnimationGroup = AnimationGroup;
}());
