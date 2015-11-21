/*
 * @author cuckoo99
 */


(function() {
	// namespace:
	var o = this.jslgEngine = this.jslgEngine||{};
	o = (o.model = o.model||{});
	o = (o.animation = o.animation||{});
	
	/**
	 * <h4>アニメーション・クラス</h4>
	 * <p>
	 * １つのアニメーションの表すオブジェクト。
	 * AnimationContainerによって管理される。
	 * </p>
	 * @class
	 * @name Animation
	 * @memberOf jslgEngine.model.animation
	 * @constructor
	 */
	var Animation = function(options) {
		this.initialize(options);
	};
	/**
	 *
	 */
	var p = Animation.prototype;

	/**
	 * 初期化
	 *
	 * @name initialize
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.animation.Animation#
	 * @protected
	 **/
	p.initialize = function(data) {
		var self = this;
		
		self.iconKey = data.key;
		self.delay = data.delay;
		self.animeKey = data.animeKey;
		self.stopAnimation = (data.stopAnimation !== undefined) ?　data.stopAnimation : true;
		self.isLoop = data.isLoop||false;
		self.positions = data.positions||[];
		self.positions = self.interpolate(self.positions,
			data.partitions ? data.partitions : 0);
		self.fadeAnimationType = data.fadeType;
		switch(data.fadeType)
		{
		case jslgEngine.model.animation.keys.fadeType.FADE_IN:
		case jslgEngine.model.animation.keys.fadeType.FADE_IN_AND_OUT:
			self.fadeDirection = 1;
			self.fadeValue = 0.1;
			break;
		case jslgEngine.model.animation.keys.fadeType.FADE_OUT:
			self.fadeDirection = -1;
			self.fadeValue = 1.0;
			break;
		default:
			self.fadeDirection = 1;
			self.fadeValue = -1; // -1で動作しなくなる
			break;
		}
		self.textList = data.textList;
		
		self.wasFinishedFlags = {
			animation : (self.animeKey == null),
			motion : (self.positions == null || self.positions.length == 0),
			textAnimation : (self.textList == null || self.textList.length == 0),
			delay : (self.delay == null),
			fade : (data.fadeType == null)
		};
	};

	/**
	 * 再生済みフラグ
	 * 
	 * @name wasPlayedAnime
	 * @property
	 * @type Boolean
	 * @memberOf jslgEngine.model.animation.Animation#
	 */
	p.wasPlayedAnime = false;
	
	/**
	 * 通知済みフラグ
	 * 
	 * @name wasNotifiedAnimeFinish
	 * @property
	 * @type Boolean
	 * @memberOf jslgEngine.model.animation.Animation#
	 */
	p.wasNotifiedAnimeFinish = false;
	
	/**
	 * アニメーション完了フラグ
	 * 
	 * @name wasFinishedFlags
	 * @property
	 * @type Boolean
	 * @memberOf jslgEngine.model.animation.Animation#
	 */
	p.wasFinishedFlags = null;
	
	/**
	 * ループフラグ
	 * 
	 * @name isLoop
	 * @property
	 * @type Boolean
	 * @memberOf jslgEngine.model.animation.Animation#
	 */
	p.isLoop = false;
	
	/**
	 * アイコンのキー
	 * 
	 * @name iconKey
	 * @property
	 * @type String
	 * @memberOf jslgEngine.model.animation.Animation#
	 */
	p.iconKey = null;
	
	/**
	 * アニメーションのキー
	 * 
	 * @name animeKey
	 * @property
	 * @type String
	 * @memberOf jslgEngine.model.animation.Animation#
	 */
	p.animeKey = null;
	
	/**
	 * 描画座標配列
	 * 
	 * @name positions
	 * @property
	 * @type Object[]
	 * @memberOf jslgEngine.model.animation.Animation#
	 */
	p.positions = null;
	
	/**
	 * 描画座標配列のインデックス
	 * 
	 * @name positionIndex
	 * @property
	 * @type Number
	 * @memberOf jslgEngine.model.animation.Animation#
	 */
	p.positionIndex = 0;
	
	/**
	 * 描画オフセット
	 * 
	 * @name offset
	 * @property
	 * @type Object[]
	 * @memberOf jslgEngine.model.animation.Animation#
	 */
	p.offset = null;
	
	/**
	 * フェード・アニメーションの種類
	 * 
	 * @name fadeAnimationType
	 * @property
	 * @type Number
	 * @memberOf jslgEngine.model.animation.Animation#
	 */
	p.fadeAnimationType = false;
	
	/**
	 * フェード・アニメーションの数値上限
	 * 
	 * @name fadeDegree
	 * @property
	 * @type Number
	 * @memberOf jslgEngine.model.animation.Animation#
	 */
	p.fadeDegree = 10.0;
	
	/**
	 * フェード・アニメーションの現在値
	 * 
	 * @name fadeValue
	 * @property
	 * @type Number
	 * @memberOf jslgEngine.model.animation.Animation#
	 */
	p.fadeValue = 0;
	
	/**
	 * フェード・アニメーションの増減修正値
	 * 
	 * @name fadeDirection
	 * @property
	 * @type Number
	 * @memberOf jslgEngine.model.animation.Animation#
	 */
	p.fadeDirection = 1;
	
	/**
	 * テキストアニメーション配列のインデックス
	 * 
	 * @name textAnimationIndex
	 * @property
	 * @type Number
	 * @memberOf jslgEngine.model.animation.Animation#
	 */
	p.textAnimationIndex = 0;
	
	/**
	 * テキストアニメーション配列
	 * 
	 * @name textList
	 * @property
	 * @type String[]
	 * @memberOf jslgEngine.model.animation.Animation#
	 */
	p.textList = false;
	
	/**
	 * アニメーション待機時間
	 * 
	 * @name delay
	 * @property
	 * @type Number
	 * @memberOf jslgEngine.model.animation.Animation#
	 */
	p.delay = 0;
	
	/**
	 * コールバック関数
	 * 
	 * @name callback
	 * @property
	 * @type Function
	 * @memberOf jslgEngine.model.animation.Animation#
	 */
	p.callback = null;
	
	/**
	 * ロック状態
	 * 
	 * @name lock
	 * @property
	 * @type Boolean
	 * @memberOf jslgEngine.model.animation.Animation#
	 */
	p.lock = true;
		
	/**
	 * 座標を補間する
	 *
	 * @name interpolate
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.animation.Animation#
	 * @returns {Boolean}
	 */
	p.interpolate = function(positions, partitions) {
		var self = this;
		var data = [];
		var count = partitions;
		var newest = null;
		var before = null;
	
		if(count == 0) return positions;
	
		var push = function(position, before) {
			var dx = (position.x-before.x)/count;
			var dy = (position.y-before.y)/count;
			var dz = (position.z-before.z)/count;
			for(var i = 0; i <= count; i++) {
				data.push({
					x : before.x+dx*i,
					y : before.y+dy*i,
					z : before.z+dz*i
				});
			}
		};
	
		for(var i = 0; i < positions.length; i++) {
			before = newest;
			newest = positions[i];
			if(newest != null && before != null) {
				if(!(newest.x - before.x == 0 &&
						newest.y - before.y == 0 &&
						newest.z - before.z == 0))
					push(newest, before);
			}
		}
	
		if(data.length == 0 && newest) data.push(newest);
	
		//フェードの段階を設定
		self.fadeDegree = partitions - 3;
		
		return data;
	};
	
	/**
	 * 終了判定
	 *
	 * @name wasFinished
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.animation.Animation#
	 * @returns {Boolean}
	 */
	p.wasFinished = function(excepts) {
		var self = this;
		var isClear = true;
		var exceptKeys = excepts||[];
		for(var key in self.wasFinishedFlags) {
			if(!self.wasFinishedFlags[key]) {
				var ignore = false;
				for(var ex in exceptKeys) {
					if(exceptKeys[ex] === key) {
						ignore = true;
					}
				}
				if(!ignore) {
					isClear = false;
					//jslgEngine.log(self.iconKey+' is not finished');
				}
			}
		}
		return isClear;
	};

	/**
	 * アニメーションに終了通知を行う。
	 * 
	 * @name notifyFinish
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.animation.Animation#
	 */
	p.notifyFinish = function() {
		var self = this;
		var logLevel = 0;
	
		if(self.wasFinished()) {
			//jslgEngine.log('Finished Animation:'+self.iconKey, logLevel);
			
			if(self.callback) {
				self.callback();
				self.callback = null;
			}
		}
	};

	/**
	 * ロックを解除して再生状態する。
	 *
	 * @name notifyEndOfAnimation
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.animation.Animation#
	 **/
	p.notifyEndOfAnimation = function() {
		var self = this;
		
		jslgEngine.log('Call end of animation:'+self.iconKey, 0);
		self.wasFinishedFlags.animation = true;
		self.notifyFinish();
	};

	/**
	 * ロックを解除する
	 *
	 * @name unlock
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.animation.Animation#
	 */
	p.unlock = function() {
		var self = this;
		self.lock = false;
	};

	/**
	 * アニメーションを実行する。
	 *
	 * @name run
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.animation.Animation#
	 * @param {JSON} options
	 * <ul>
	 * <li>{jslgEngine.network.SynchronizeBase} network 直列処理クラス</li>
	 * </ul>
	 **/
	p.run = function(options) {
		var self = this;
		var position = null;
		var doUpdate = false;
		var logLevel = 4;
		var text = self.text;
	
		if(self.lock || self.wasFinished()) {
			jslgEngine.log('locked:'+self.iconKey, logLevel);
			return;
		}
	
        //jslgEngine.log('unlocked:'+self.iconKey);
		if(self.wasFinished(['delay'])) {
			if(self.delay <= 0) {
				self.wasFinishedFlags.delay = true;
				self.notifyFinish();
			} else {
				self.delay--;
			}
		}
		jslgEngine.log('Running Animation:'+self.iconKey+'... motion:'+
			self.wasFinishedFlags.motion+',pIndex:'+
			self.positionIndex+',fade:'+
			self.wasFinishedFlags.fade+',fadeType:'+
			self.fadeAnimationType+',fadeVal:'+
			self.fadeValue+',anime:'+
			self.wasFinishedFlags.animation, logLevel);
	
			// if(self.iconKey === 'w1.r1.s1.g3_0_0')
            //jslgEngine.log('key: '+self.iconKey+' fade:' +self.fadeValue);
			
		if(!self.wasFinishedFlags.motion) {
			position = self.positions[self.positionIndex];
			self.positionIndex++;
			if(self.positionIndex >= self.positions.length) {
				self.wasFinishedFlags.motion = true;
				self.notifyFinish();
			}
		}
		if(!self.wasFinishedFlags.textAnimation) {
			text = self.textList[self.textAnimationIndex];
			self.textAnimationIndex++;
			if(self.textAnimationIndex >= self.textList.length) {
				self.wasFinishedFlags.textAnimation = true;
				self.notifyFinish();
			}
		}
		if(!self.wasFinishedFlags.fade) {
			if (self.fadeValue > 0) {
				if(	self.fadeAnimationType == jslgEngine.model.animation.keys.fadeType.FADE_IN &&
					self.fadeValue >= 1.0) {
					//フェードインの場合、表示が完了すれば、状態維持
					self.wasFinishedFlags.fade = true;
					self.notifyFinish();
					self.fadeValue = 1.0;
				} else {
					var f = 1.0 / self.fadeDegree;
					self.fadeValue += f * self.fadeDirection;
					if(self.fadeValue >= 1.0) {
						self.fadeDirection = -1;
					}
				}
			} else {
				self.fadeValue = 0;
				self.wasFinishedFlags.fade = true;
				self.notifyFinish();
			}
		}
	
		options.iconController.update({
			key : self.iconKey,
			position : position,
			animeKey : !self.wasPlayedAnime ? self.animeKey : null,
			offset : self.offset,
			stop : self.stopAnimation,
			fadeValue : self.fadeValue,
			text : text
		});
		
		if(!self.wasFinishedFlags.animation && self.stopAnimation) {
			self.wasFinishedFlags.animation = true;
		}
		if(!self.wasPlayedAnime) self.wasPlayedAnime = true;
	};
	
	o.Animation = Animation;
}());
