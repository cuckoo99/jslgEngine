/*
 * @author cuckoo99
 */

(function() {
	// namespace:
	var o = this.jslgEngine = this.jslgEngine||{};
	o = (o.model = o.model||{});
	o = (o.action = o.action||{});

	/**
	 * <h4>コード処理・メニュークラス（SLG固有要素）</h4>
	 * <p>
	 * メニューを呼び出す。<br />
	 * </p>
	 * @class
	 * @name ActionJSlgMenu
	 * @memberOf jslgEngine.model.action
	 * @constructor
	 */
	var ActionJSlgMenu = jslgEngine.extend(
		jslgEngine.model.action.ActionBase,
		function(options) {
			this.initialize(options);
		}
	);
	/**
	 *
	 */
	var p = ActionJSlgMenu.prototype;
	
	/**
	 * クラス名
	 *
	 * @name className
	 * @property
	 * @type String
	 * @memberOf jslgEngine.model.action.ActionJSlgMenu#
	 **/
	p.className = 'ActionJSlgMenu';

	/**
	 * 実行
	 *
	 * @name run
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.action.ActionJSlgMenu#
	 * @param {Object} options
	 */
	p.run$ = function(connector, data, options) {
		var self = this;

		if(!self.isReadyToRun(connector, options)) return;
		
		if(data.isTest) {
			connector.resolve();
			return;
		}
		
		self._wasDone = true;
		
		var iconGroupName = 'menu';
		
		connector.resolve();
		
		var target;
		
		self._readAllElements(connector, data, options);
		connector.connects(function(connector_s, result_s) {
			target = result_s[0];
			var isClose = result_s[1] ? result_s[1].value : null;
			
			var removeKeys = options.iconController.getKeysByGroup(iconGroupName);
			if(removeKeys.length > 0) {
				for(var i = 0; i < removeKeys.length; i++) {
					options.mainController.ticker.addAnimation({
						key : removeKeys[i],
						fadeType : jslgEngine.model.animation.keys.fadeType.FADE_OUT,
						group : 'menu'
					}, options);
				}
				connector_s.pipe(function(connector_ss) {
					options.mainController.ticker.addAnimationGroup({
						key : 'menuGroup',
						groupKeys : removeKeys,
						callback : function() {
							for(var i = 0; i < removeKeys.length; i++) {
								options.iconController.remove({
									key : removeKeys[i]
								});
							}
							connector_ss.resolve();
						}
					});
					
					options.mainController.ticker.unlockAnimation();
				}, options);
			}
		});
		connector.connects(function(connector_s, result_s) {
			//開くメニューが指定されている場合
			if(target != null) {
				//TODO: これは一時的な対策
				target = target.value != null ? target.value : target;
				
				//現時点で制約を排除したら、イベントの場合に描画座標が必要になった。
				if(	//true
					target.className === 'Cast' ||
					target.className === 'Item' ||
					target.className === 'Icon'
					) {
					connector_s.pipe(function(connector_ss) {
						var children = target.getChildren();
						var menuItems = [];
						
						for(var i = 0; i < children.length; i++) {
							var child = children[i];
									
							if(	child.className === 'Icon' ||
								child.className === 'Item') {
								var count = child.getStatus('count');
								if(!count || count.value > 0) {
									menuItems.push({
										view : child.getStatus('name').value,
										obj : child
									});
								}
							}
						}
						
						var slgIconFactory = options.iconController.iconFactory;
							
						slgIconFactory.makeMenu({
							position : target.getPosition({
								stageViewOffset : options.iconController.stageViewOffset
							}, options),
							menuItems : menuItems,
							cast : target
						}, options);
						
						connector_ss.resolve();
					});
				}
			}
		});
		
	};

	/**
	 * リストア
	 *
	 * @name restore
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.action.ActionJSlgMenu#
	 * @param {Object} options
	 * <ul>
	 * <li>{jslgEngine.controller.IconController} iconController</li>
	 * <li>{jslgEngine.controller.mainController} mainController</li>
	 * </ul>
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
	 * @memberOf jslgEngine.model.action.ActionJSlgMenu#
	 * @param {Object} options
	 * <ul>
	 * <li>{jslgEngine.controller.IconController} iconController</li>
	 * <li>{jslgEngine.controller.mainController} mainController</li>
	 * </ul>
	 */
	p.expand = function(options) {};

	o.ActionJSlgMenu = ActionJSlgMenu;
}());
