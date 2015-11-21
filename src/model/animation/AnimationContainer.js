/*
 * @author cuckoo99
 */

(function() {
	// namespace:
	var o = this.jslgEngine = this.jslgEngine||{};
	o = (o.model = o.model||{});
	o = (o.animation = o.animation||{});

	/**
	 * <h4>アニメーション・管理クラス</h4>
	 * <p>
	 * アニメーションを管理する。
	 * 直列的にアニメーションを再生することができる。
	 * </p>
	 * @class
	 * @name AnimationContainer
	 * @memberOf jslgEngine.model.animation
	 * @constructor
	 */
	var AnimationContainer = jslgEngine.extend(
		jslgEngine.model.common.SerialRunner,
		function(options) {
			this.initialize(options);
			
			this.key = options.key;
		}
	);
	/**
	 *
	 */
	var p = AnimationContainer.prototype;

	/**
	 * キー
	 *
	 * @name key
	 * @property
	 * @type String
	 * @memberOf jslgEngine.model.animation.AnimationContainer#
	 **/
	p.key = null;

	/**
	 * 座標配列
	 *
	 * @name locations
	 * @property
	 * @type jslgEngine.model.animation.Location[]
	 * @memberOf jslgEngine.model.animation.AnimationContainer#
	 **/
	p.locations = null;

	/**
	 * ロックを解除して再生状態する。
	 *
	 * @name unlock
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.animation.AnimationContainer#
	 **/
	p.unlock = function() {
		var self = this;
	
		for(var i = 0; i < self._children.length; i++) {
			var child = self._children[i];
			child.unlock();
		}
	};

	/**
	 * 実行
	 *
	 * @name run
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.animation.AnimationContainer#
	 */
	p.run = function(options) {
		var self = this;
		for(var i = 0; i < self._children.length; i++) {
			var child = self._children[i];
			
			if(child.wasFinished()) {
				self._children.splice(i, 1);
				i--;
			} else {
				child.run(options);
				break;
			}
		}
	};
	
	/**
	 * ロックを解除して再生状態する。
	 *
	 * @name notifyEndOfAnimation
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.animation.AnimationContainer#
	 **/
	p.notifyEndOfAnimation = function(flag) {
		var self = this;
		
		if(self._children.length == 0) {
			return false;
		}
		
		var anime = self._children[0];
		
		//jslgEngine.log('Notify '+[anime.iconKey,anime.animeKey].join('_'));
		anime.notifyEndOfAnimation();
		
		//var currentAnimation = self._children[self._children.length-1];
		//currentAnimation.notifyEndOfAnimation();
	};

	/**
	 * アニメーションが終了したか確認。
	 *
	 * @name wasFinished
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.animation.AnimationContainer#
	 **/
	p.wasFinished = function() {
		var self = this;
		var isClear = true;
	
		for(var i = 0; i < self._children.length; i++) {
			var child = self._children[i];
			isClear = child.wasFinished() ? isClear : false;
			//テストコードは書くべきでない。
			// if(child.iconKey == 'c1') {
				// jslgEngine.log([child.iconKey,child.animeKey,child.wasFinished()].join('_'));
			// }
		}
		
		return isClear;
	};
	
	o.AnimationContainer = AnimationContainer;
}());
