/*
 * @author cuckoo99
 */

(function() {
	// namespace:
	var o = this.jslgEngine = this.jslgEngine||{};
	o = (o.model = o.model||{});
	o = (o.stage = o.stage||{});

	/**
	 * <h4>NetworkButton</h4>
	 * <p>
	 * this is icon class.
	 * it has one fixed status key.
	 * </p>
	 * @class
	 * @name NetworkButton
	 * @memberOf jslgEngine.model.stage
	 * @constructor
	 */
	var NetworkButton = jslgEngine.extend(
		jslgEngine.model.common.JSlgElement,
		function(data, options) {
			this.initialize(data, options);
		}
	);
	/**
	 *
	 */
	var p = NetworkButton.prototype;

	/**
	 * クラス名
	 *
	 * @name className
	 * @property
	 * @type String
	 * @memberOf jslgEngine.model.stage.NetworkButton#
	 **/
	p.className = 'NetworkButton';

	/**
	 * パスのキーコード
	 *
	 * @name keyPathCode
	 * @property
	 * @type String[]
	 * @memberOf jslgEngine.model.stage.NetworkButton#
	 **/
	p._keyPathCodes = null;

	/**
	 * 対象キーコード
	 *
	 * @name keyCode
	 * @property
	 * @type String
	 * @memberOf jslgEngine.model.stage.NetworkButton#
	 **/
	p._keyCode = jslgEngine.model.stage.keys.NetworkButton;

	/**
	 * 実体要素取得
	 *
	 * @name getPosition
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.stage.Ground#
	 **/
	p.getPosition = function(data, options) {
		var self = this;
		
		return { x : 30, y : 10, z : 0 };
	};
	
	p.onClick = function(e, options) {
		var connector = new jslgEngine.model.network.ConnectorOnline();

		var onlineManager = options.mainController.getOnlineManager();

		onlineManager.changeNetworkingMode(connector, {
			isOnline : true
		}, options);
	};

	p.createIcon = function(connector, data, options) {
		var self = this;

		var iconInfo = self.getIconInfo({
			group : 'networkButton'
		}, options);
		
		options.iconController.add(connector, iconInfo);
	};

	p.updateIcon = function(connector, data, options) {
		var self = this;
		var position = self.getPosition({}, options);
		var key = self.getKeyData().getUniqueId();

		if(!options.iconController.hasKey(key)) {
			self.createIcon(connector, data, options);
		}

		if(data.groupKeys) {
			data.groupKeys.push(key);
		}
	};

	o.NetworkButton = NetworkButton;
}());
