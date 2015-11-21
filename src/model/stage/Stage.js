/*
 * @author cuckoo99
 */

(function() {
	// namespace:
	var o = this.jslgEngine = this.jslgEngine||{};
	o = (o.model = o.model||{});
	o = (o.stage = o.stage||{});

	/**
	 * <h4>ステージクラス</h4>
	 * <p>
	 * マップ土台を保有する要素。
	 * </p>
	 * @class
	 * @name Stage
	 * @memberOf jslgEngine.model.stage
	 * @constructor
	 */
	var Stage = jslgEngine.extend(
		jslgEngine.model.common.JSlgElement,
		function(data, options) {
			this.initialize(data, options);
		}
	);
	/**
	 *
	 */
	var p = Stage.prototype;

	/**
	 * クラス名
	 *
	 * @name className
	 * @property
	 * @type String
	 * @memberOf jslgEngine.model.stage.Stage#
	 **/
	p.className = 'Stage';

	/**
	 * パスのキーコード
	 *
	 * @private
	 * @name keyPathCode
	 * @property
	 * @type String[]
	 * @memberOf jslgEngine.model.stage.Stage#
	 **/
	p._keyPathCodes = [	jslgEngine.model.stage.keys.WORLD_REGION,
						jslgEngine.model.stage.keys.LOCAL_REGION,
	                   	jslgEngine.model.stage.keys.STAGE];

	/**
	 * 対象キーコード
	 *
	 * @private
	 * @name keyCode
	 * @property
	 * @type String
	 * @memberOf jslgEngine.model.stage.Stage#
	 **/
	p._keyCode = jslgEngine.model.stage.keys.STAGE;

	/**
	 * 座標を持つかどうか
	 *
	 * @name hasLocation
	 * @property
	 * @type Boolean
	 * @memberOf jslgEngine.model.stage.Stage#
	 **/
	p.hasLocation = true;

	/**
	 * 大きさを持つかどうか
	 *
	 * @name hasSize
	 * @property
	 * @type Boolean
	 * @memberOf jslgEngine.model.stage.Stage#
	 **/
	p.hasSize = true;

	p.createIcon = function(connector, data, options) {
		var self = this;

		var iconInfo = self.getIconInfo({
			group : 'stage'
		}, options);
	
		if(!iconInfo) return null;

		options.iconController.add(connector, iconInfo);
	};

	p.updateIcon = function(connector, data, options) {
		var self = this;
		var key = self.getKeyData().getUniqueId();

		var onlineManager = options.mainController.getOnlineManager();
		if(onlineManager.isOnline && !self.wasRewrited) {
			self.remove(connector, data, options);
			return;
		}

		if(!options.iconController.hasKey(key)) {
			self.createIcon(connector, data, options);
		}

		if(data.groupKeys) {
			data.groupKeys.push(key);
		}

		var children = [].concat(self._children);

		var size = self.getSize();

		if(children) {
			var grounds = [];
			var casts = [];
			var others = [];

			var child;
			while(child = children.shift()) {
			
				if(child.className !== 'Ground') {
					others.push(child);
					continue;
				}

				grounds.push(child);

				var subChildren = child.getChildren();
				for(var j = 0, len2 = subChildren.length; j < len2; j++) {
					var sub = subChildren[j];
					
					if(sub.className === 'Cast') {
						casts.push(sub);
					}
				}
			}

			var grounds = options.mainController.sortBySecondDimension(grounds, size.width, size.height);
		
			var ground;
			while(ground = grounds.shift()) {
				ground.updateIcon(connector, data, options);
			}

			var casts = options.mainController.sortBySecondDimension(casts, size.width, size.height);
		
			var cast;
			while(cast = casts.shift()) {
				cast.updateIcon(connector, data, options);
			}
		
			var other;
			while(other = others.shift()) {
				other.updateIcon(connector, data, options);
			}
		}
	};

	o.Stage = Stage;
}());
