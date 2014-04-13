/*
 * @author cuckoo99
 */

(function() {
	// namespace:
	var o = this.jslgEngine = this.jslgEngine||{};
	o = (o.model = o.model||{});
	o = (o.action = o.action||{});

	/**
	 * <h4>コード処理・スクロールクラス（SLG固有要素）</h4>
	 * <p>
	 * 指定された座標まで、画面をスクロールする。
	 * </p>
	 * @class
	 * @name ActionJSlgScroll
	 * @memberOf jslgEngine.model.action
	 * @constructor
	 */
	var ActionJSlgScroll = jslgEngine.extend(
		jslgEngine.model.action.ActionBase,
		function(options) {
			this.initialize(options);
		}
	);
	/**
	 *
	 */
	var p = ActionJSlgScroll.prototype;
	
	/**
	 * クラス名
	 *
	 * @name className
	 * @property
	 * @type String
	 * @memberOf jslgEngine.model.action.ActionJSlgScroll#
	 **/
	p.className = 'ActionJSlgScroll';

	/**
	 * 実行
	 *
	 * @name run
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.action.ActionJSlgScroll#
	 * @param {Object} options
	 * <ul>
	 * <li>{jslgEngine.controller.IconController} iconController</li>
	 * <li>{jslgEngine.controller.mainController} mainController</li>
	 * </ul>
	 */
	p.run$ = function(connector, data, options) {
		var self = this;

		if(!self.isReadyToRun(connector, options)) return;
		
		connector.resolve();
		
		var removeKeys = [];
		var addKeys = [];
		var afterStageOffset;
		
		self._readAllElements(connector, data, options);
		connector.pipe(function(connector_s, result_s) {
			afterStageOffset = result_s[0];
			var beforeStageOffset = options.iconController.stageViewOffset;
			
			var from;
	
			var groundKeys = options.iconController.getKeysByGroup('ground');
			var castKeys =  options.iconController.getKeysByGroup('cast');
			
			var region = options.mainController.getWorldRegion();
			var elements = [];
	
			self._wasDone = true;
			
			var findElements = function(connector_ss, keys, list, class_name, options_ss) {
				var element = options_ss.mainController.findElements(connector_ss, {
					className : class_name
				}, options);
				connector_ss.pipe(function(connector_sss, result_sss) {
					var elements = result_sss;
					
					for(var i = 0; i < keys.length; i++) {
						for(var j = 0; j < elements.length; j++) {
							var element = elements[j];
							
							//一意キーが前提となる
							if(element.getKey() === keys[i]) {
								list.push(element);
							}
						}
					}
					connector_sss.resolve();
				});
			};
			
			connector_s.resolve();
			
			findElements(connector_s, groundKeys, elements, 'Ground', options);
			findElements(connector_s, castKeys, elements, 'Cast', options);
			
			connector_s.connects(function(connector_ss) {
				afterStageOffset = {
					x : afterStageOffset[0].value,
					y : afterStageOffset[1].value,
					z : afterStageOffset[2].value
				};
				
				jslgEngine.log('afterStageOffset:'+afterStageOffset.x+','+afterStageOffset.y+','+afterStageOffset.z);
				
				for(var i = 0; i < elements.length; i++) {
					var element = elements[i];
					
					var location = element.getGlobalLocation();
					
					//ステータスの修正
					from = {
						x : location.x,
						y : location.y,
						z : location.z
					};
					
					var beforePosition = element.getPosition({
						stageViewOffset : beforeStageOffset
					}, options);
					
					var afterPosition = element.getPosition({
						stageViewOffset : afterStageOffset
					}, options);
					
					var key = element.getKey();
					var fadeType = null;
					var space = {width:0,height:0,depth:0};
					space = null;
					var exists = options.iconController.existsInCanvas(afterPosition,space);
					var wasIn = options.iconController.existsInCanvas(beforePosition,space);
					if(!exists) {
						if(options.iconController.isVisible(key)) {
							fadeType = jslgEngine.model.animation.keys.fadeType.FADE_OUT;
							removeKeys.push(key);
						} else {
							continue;
						}
					} else if(exists) {
						if(!options.iconController.isVisible(key)) {
						// if(true) {
							fadeType = jslgEngine.model.animation.keys.fadeType.FADE_IN;
							options.iconController.changeVisibility(key, true, 0);
							addKeys.push(key);
						}
					}
					options.mainController.ticker.addAnimation({
						key : key,
						positions : [beforePosition, afterPosition],
						partitions : 5,
						fadeType : fadeType,
						group : 'scroll'
					}, options);
				}
			});
		});
		connector.pipe(function(connector_s) {
			options.mainController.ticker.addAnimationGroup({
				key : 'removeByScroll',
				groupKeys : removeKeys,
				callback : function(options) {
					for(var i = 0; i < removeKeys.length; i++) {
						// options.iconController.remove({
							// key : removeKeys[i]
						// });
						options.iconController.changeVisibility(removeKeys[i], false);
						//jslgEngine.log('hide icon:'+removeKeys[i]);
					}
					for(var i = 0; i < addKeys.length; i++) {
						//jslgEngine.log('show icon:'+addKeys[i]);
					}
					
					options.iconController.stageViewOffset = {
						x:afterStageOffset.x,
						y:afterStageOffset.y,
						z:afterStageOffset.z
					};
					jslgEngine.log('*afterStageOffset:'+afterStageOffset.x+','+afterStageOffset.y+','+afterStageOffset.z);
		
					connector_s.resolve();
				}
			}, options);
			
			options.mainController.ticker.unlockAnimation();
		});
		
	};

	/**
	 * リストア
	 *
	 * @name restore
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.action.ActionJSlgScroll#
	 * @param {Object} options
	 * <ul>
	 * <li>{jslgEngine.controller.IconController} iconController</li>
	 * <li>{jslgEngine.controller.mainController} mainController</li>
	 * </ul>
	 */
	p.restore = function(connector, data, options) {
		var self = this;
	};


	/**
	 * 展開する
	 *
	 * @name expand
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.action.ActionJSlgScroll#
	 * @param {Object} options
	 * <ul>
	 * <li>{jslgEngine.controller.IconController} iconController</li>
	 * <li>{jslgEngine.controller.mainController} mainController</li>
	 * </ul>
	 */
	p.expand = function(options) {};

	o.ActionJSlgScroll = ActionJSlgScroll;
}());
