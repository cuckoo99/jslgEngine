/*
 * @author cuckoo99
 */

(function() {
	// namespace:
	var o = this.jslgEngine = this.jslgEngine||{};
	o = (o.model = o.model||{});
	o = (o.action = o.action||{});

	/**
	 * <h4>コード処理・削除クラス</h4>
	 * <p>
	 * SLG要素の子要素を削除する。
	 * </p>
	 * @class
	 * @name ActionJSlgUpdateArea
	 * @memberOf jslgEngine.model.action
	 * @constructor
	 */
	var ActionJSlgUpdateArea = jslgEngine.extend(
		jslgEngine.model.action.ActionBase,
		function(options) {
			this.initialize(options);
		}
	);
	/**
	 *
	 */
	var p = ActionJSlgUpdateArea.prototype;
	
	/**
	 * クラス名
	 *
	 * @name className
	 * @property
	 * @type String
	 * @memberOf jslgEngine.model.action.ActionJSlgUpdateArea#
	 **/
	p.className = 'ActionJSlgUpdateArea';

	/**
	 * 実行
	 *
	 * @name run
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.action.ActionJSlgUpdateArea#
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
		
		self._readAllElements(connector, data, options);
		connector.connects(function(connector_s, result_s) {
			var locations = result_s[0];
			
			if(locations === null) {
				jslgEngine.log(self.className + ' has no enough arguments.');
				return;
			}
	
			var animationKey = 'area0';
			var length = locations.length;
			
			for(var i = 0; i < locations.length; i++) {
				//TODO: connects内で使用できないはず。
				var location = locations[i];
				
				//Groundの選択状態を示す。
				options.mainController.findElements(connector, {
					className : 'Ground'
				});
				connector.connects(function(connector_s, result_s) {
					var elements = result_s;
					
					for(var j = 0; j < elements.length; j++) {
						var element = elements[j];
						var eLocation = element.getLocation();
						if(eLocation.x == location.x && eLocation.y == location.y && eLocation.z == location.z) {
							options.mainController.ticker.addAnimation({
								key : element.getPath(),
								animeKey : animationKey
							}, options);
						}
					}
				});
			}
			
			connector.connects(function(connector_s) {
				options.mainController.ticker.unlockAnimation();
			});
		});
	};

	/**
	 * リストア
	 *
	 * @name restore
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.action.ActionJSlgUpdateArea#
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
	 * @memberOf jslgEngine.model.action.ActionJSlgUpdateArea#
	 * @param {Object} options
	 * <ul>
	 * <li>{jslgEngine.controller.IconController} iconController</li>
	 * <li>{jslgEngine.controller.mainController} mainController</li>
	 * </ul>
	 */
	p.expand = function(options) {};

	o.ActionJSlgUpdateArea = ActionJSlgUpdateArea;
}());
