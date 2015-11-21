/*
 * @author cuckoo99
 */

(function() {
	// namespace:
	var o = this.jslgEngine = this.jslgEngine||{};
	o = (o.model = o.model||{});
	o = (o.stage = o.stage||{});

	/**
	 * <h4>マップ土台クラス</h4>
	 * <p>
	 * ステージ上に配置できる要素。
	 * </p>
	 * @class
	 * @name Ground
	 * @memberOf jslgEngine.model.stage
	 * @constructor
	 */
	var Ground = jslgEngine.extend(
		jslgEngine.model.common.JSlgElement,
		function(data, options) {
			this.initialize(data, options);
		}
	);
	/**
	 *
	 */
	var p = Ground.prototype;

	/**
	 * クラス名
	 *
	 * @name className
	 * @property
	 * @type String
	 * @memberOf jslgEngine.model.stage.Ground#
	 **/
	p.className = 'Ground';

	/**
	 * パスのキーコード
	 *
	 * @name keyPathCode
	 * @property
	 * @type String[]
	 * @memberOf jslgEngine.model.stage.Ground#
	 **/
	p._keyPathCodes = [	jslgEngine.model.stage.keys.WORLD_REGION,
						jslgEngine.model.stage.keys.LOCAL_REGION,
	                   	jslgEngine.model.stage.keys.STAGE,
	                   	jslgEngine.model.stage.keys.GROUND];

	/**
	 * 対象キーコード
	 *
	 * @name keyCode
	 * @property
	 * @type String
	 * @memberOf jslgEngine.model.stage.Ground#
	 **/
	p._keyCode = jslgEngine.model.stage.keys.GROUND;

	/**
	 * 座標を持つかどうか
	 *
	 * @name hasLocation
	 * @property
	 * @type Boolean
	 * @memberOf jslgEngine.model.stage.Ground#
	 **/
	p.hasLocation = true;

	/**
	 * 描画オフセット
	 *
	 * @name canvasOffset
	 * @property
	 * @type jslgEngine.model.area.Location
	 * @memberOf jslgEngine.model.stage.Ground#
	 **/
	p.canvasOffset = jslgEngine.config.groundOffset;

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
		
		//描画領域のオフセット
		var stageViewOffset = data.stageViewOffset||options.iconController.stageViewOffset;
		var location = data.dummyLocation||self.getLocation();
		var x = location.x-stageViewOffset.x;
		var y = location.y-stageViewOffset.y;
		var z = location.z-stageViewOffset.z;
		
		var imageSize = self.getImageSize();
		var offset = jslgEngine.config.groundOffset;
		
		var parent = self.getParent(options)||{};
		var parentsPosition = parent.getPosition ? parent.getPosition(data, options) : {x:0,y:0,z:0};
		var scale;
		
		var rad = -Math.PI / 24 * 6.5;
		var offset = jslgEngine.config.groundOffset;
		var round = !data.disableRound ? function(x) {
			return Math.round(x);
		} : function(x) {
			return x;
		};
		
		var position = { x : round(imageSize.width/2 * x * Math.cos(rad)) - 
						round(imageSize.height/2 * y * Math.sin(rad))
						+ offset.x,
				 y : round(imageSize.width/2 * x * Math.sin(rad)) +
				 		round(imageSize.height/2 * y * Math.cos(rad))
						+ offset.y,
				 z : z + offset.z };
		
		return { x : parentsPosition.x + position.x,
				 y : parentsPosition.y + position.y,
				 z : parentsPosition.z + position.z };
	};
    
	/**
	 * 実体要素取得
	 *
	 * @name getPosition
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.stage.Ground#
	 **/
	p.getImageSize = function() {
		var self = this;
		
		var drawingKey = jslgEngine.model.common.keys.DRAWING_OPTIONS;
		var _graphics = self.getStatus(drawingKey);
		_graphics = _graphics ? _graphics.value : null;
		
		var width = _graphics ? _graphics[0][3] : 0;
		var height = _graphics ? _graphics[0][4] : 0;
		
		return {
			width : width,
			height : height,
		};
	};
	
	p.createIcon = function(connector, data, options) {
		var self = this;

		var iconInfo = self.getIconInfo({
			group : 'ground'
		}, options);
		
		options.iconController.add(connector, iconInfo);
	};

	p.updateIcon = function(connector, data, options) {
		var self = this;
		var position = self.getPosition({}, options);
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
	};


	o.Ground = Ground;
}());
