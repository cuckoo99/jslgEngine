/*
 * @author cuckoo99
 */

(function() {
	// namespace:
	var o = this.jslgEngine = this.jslgEngine||{};
	o = (o.model = o.model||{});
	o = (o.action = o.action||{});

	/**
	 * <h4>コード処理・メッセージクラス（SLG固有要素）</h4>
	 * <p>
	 * メッセージを呼び出す。<br />
	 * また未解決の選択要素を追加する。<br />
	 * </p>
	 * @class
	 * @name ActionJSlgEffect
	 * @memberOf jslgEngine.model.action
	 * @constructor
	 */
	var ActionJSlgEffect = jslgEngine.extend(
		jslgEngine.model.action.ActionBase,
		function(options) {
			this.initialize(options);
		}
	);
	/**
	 *
	 */
	var p = ActionJSlgEffect.prototype;
	
	/**
	 * クラス名
	 *
	 * @name className
	 * @property
	 * @type String
	 * @memberOf jslgEngine.model.action.ActionJSlgEffect#
	 **/
	p.className = 'ActionJSlgEffect';

	/**
	 * 実行
	 *
	 * @name run
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.action.ActionJSlgEffect#
	 * @param {Object} options
	 */
	p.run$ = function(connector, data, options) {
		var self = this;

		if(!self.isReadyToRun(connector, options)) return;
		
		connector.resolve();
		
		self._readAllElements(connector, data, options);
		connector.connects(function(connector_s, result_s) {
			//画像、座標、アニメキー、個数、フレーム・アニメーション情報、オプション
			var target = result_s[0];
			var animeKey = result_s[1].value;
			var particleCount = result_s[2].value;
			
			//スプライト情報
			//TODO: ActionIconも同様の処理に書き換える。共通化する。
			var spriteProperties = result_s[3];
			var framesProperties = spriteProperties[0];
			var imageKey, frames;
			if(framesProperties instanceof Array) {
				imageKey = framesProperties[0].value;
				var frames = {
					regX : framesProperties[1].value,
					regY : framesProperties[2].value,
					width : framesProperties[3].value,
					height : framesProperties[4].value
				};
			}
			var animationsProperties = spriteProperties[1];
			var animations;
			if(animationsProperties instanceof Array) {
				animations = {};
	
				var length = animationsProperties.length;
				for(var i = 0; i < length; i++) {
					var animePropaties = animationsProperties[i];
					if(animePropaties[0]) {
						animations[animePropaties[0].value] = [
							animePropaties[1].value, animePropaties[2].value, animePropaties[0].value];
					}
				}
			}
			
			var groupName = 'effects';
			
			if(!data.isTest) {
				var removeKeys = options.iconController.getKeysByGroup(groupName);
			
				if(removeKeys.length > 0) {
					for(var i = 0; i < removeKeys.length; i++) {
						// 現在のメッセージを優先して表示
						options.mainController.ticker.addAnimation({
							key : removeKeys[i],
							fadeType : jslgEngine.model.animation.keys.fadeType.FADE_OUT,
							group : groupName
						}, options);
					}
					connector_s.pipe(function(connector_ss) {
						options.mainController.ticker.addAnimationGroup({
							key : groupName+'Group',
							groupKeys : removeKeys,
							callback : function() {
								for(var i = 0; i < removeKeys.length; i++) {
									options.iconController.remove({
										key : removeKeys[i]
									});
								}
								connector_ss.resolve();
							}
						}, options);
						
						options.mainController.ticker.unlockAnimation();
					});
				}
				var slgIconFactory = options.iconController.iconFactory;
				
				var key = 'ef';
				
				var position = target.getPosition({}, options);
				
				slgIconFactory.makeEffects(connector_s, {
					key : key,
					imageKey : imageKey,
					particleCount : particleCount,
					frames : frames,
					animations : animations,
					position : position
				}, options);
				connector_s.pipe(function(connector_ss) {
					//アイコン・アニメーション発生
					var targetKeys = [];
					
					for(var i = 0; i < particleCount; i++) {
						var targetKey = [key,i].join(jslgEngine.config.elementSeparator);
						options.mainController.ticker.addAnimation({
							key : targetKey,
							animeKey : animeKey,
							stopAnimation : false
						}, options);
						targetKeys.push(targetKey);
					}
					
					options.mainController.ticker.addAnimationGroup({
						key : groupName+'GroupMaking',
						groupKeys : targetKeys,
						callback : function() {
							for(var i = 0; i < targetKeys.length; i++) {
								options.iconController.remove({
									key : targetKeys[i]
								});
							}
							connector_ss.resolve();
						}
					}, options);
					
					options.mainController.ticker.unlockAnimation();
				});
			}
		});
	};

	/**
	 * リストア
	 *
	 * @name restore
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.action.ActionJSlgEffect#
	 * @param {Object} options
	 */
	p.restore = function(connector, data, options) {
		var self = this;

		if(!self.isReadyToRestore(connector, options)) return;
	};


	/**
	 * 展開する
	 *
	 * @name expand
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.action.ActionJSlgEffect#
	 * @param {Object} options
	 * <ul>
	 * <li>{jslgEngine.controller.IconController} iconController</li>
	 * <li>{jslgEngine.controller.mainController} mainController</li>
	 * </ul>
	 */
	p.expand = function(options) {};

	o.ActionJSlgEffect = ActionJSlgEffect;
}());
