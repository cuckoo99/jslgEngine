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
		
		self._readAllElements(connector, data, options);
		connector.connects(function(connector_s, result_s) {
			var target = result_s[0];
			var isClose = result_s[1] ? result_s[1].value : null;
		
			// first, remove elements.
			// it has parameters, then make elements.
			// finally, update all icons.

			options.mainController.findElements(connector_s, {
				className : 'Menu'
			}, options);
			connector_s.connects(function(connector_ss, result_ss) {
				var elements = result_ss;

				for(var i = 0, len = elements.length; i < len; i++) {
					element = elements[i];

					var p = element.getParent(options);

					p.removeChild({
						obj : element
					});
				}
			})
			connector_s.connects(function(connector_ss) {
				if(target !== null && !isClose) {
					var children = target.getChildren();

					var menuCount = 0;
					for(var i = 0, len = children.length; i < len; i++) {
						var child = children[i];
						
						if(child.className === 'Item') {
							var count = child.getStatus('count');

							if(count && count.value === 0) {
								continue;
							}

							var name = child.getStatus('name');
							name = name ? name.value : '';

							var menu = new jslgEngine.model.stage.Menu({
								key : target.getKey()+i
							}, options);
							menu.setStatus('number', menuCount++, options);
							menu.setStatus('text', name, options);
							var target_id = child.getKeyData().getUniqueId();
							menu.setStatus('target', target_id, options);
							
							target.addChild({
								obj : menu
							}, options);
						}
					}
				}
				
				options.mainController.updateIconsAll(connector_ss, {}, options);
			});
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
