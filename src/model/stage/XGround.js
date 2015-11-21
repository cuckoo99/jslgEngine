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
	 * @name XGround
	 * @memberOf jslgEngine.model.stage
	 * @constructor
	 */
	var XGround = jslgEngine.extend(
		jslgEngine.model.common.XJSlgElement,
		function(data, options) {
			this.initialize(data, options);
		}
	);
	/**
	 *
	 */
	var p = XGround.prototype;

	/**
	 * クラス名
	 *
	 * @name className
	 * @property
	 * @type String
	 * @memberOf jslgEngine.model.stage.XGround#
	 **/
	p.className = 'Ground';

	/**
	 * パスのキーコード
	 *
	 * @name keyPathCode
	 * @property
	 * @type String[]
	 * @memberOf jslgEngine.model.stage.XGround#
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
	 * @memberOf jslgEngine.model.stage.XGround#
	 **/
	p._keyCode = jslgEngine.model.stage.keys.GROUND;

	/**
	 * 座標を持つかどうか
	 *
	 * @name hasLocation
	 * @property
	 * @type Boolean
	 * @memberOf jslgEngine.model.stage.XGround#
	 **/
	p.hasLocation = true;

	/**
	 * 描画オフセット
	 *
	 * @name canvasOffset
	 * @property
	 * @type jslgEngine.model.area.Location
	 * @memberOf jslgEngine.model.stage.XGround#
	 **/
	p.canvasOffset = jslgEngine.config.groundOffset;

	/**
	 * アイコンを作成する
	 *
	 * @name makeIcon
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.stage.XGround#
	 */
	p.makeIcon = function(factory, options) {
		var self = this;
		var imageKey = self.getStatus('imageKey').value;
		
		//TODO: フレームとアニメーションは暫定。ステータスに設定すべきだが、配列で格納しなければならない。
		factory.makeGround({
			iconController : options.iconController,
			mainController : options.mainController,
			key : self.getPath(),
			imageKey : imageKey,
			position : self.getPosition({
				stageViewOffset : options.iconController.stageViewOffset,
			}, options),
			sprite : {
				frames : {
					width : 160,
					height : 160,
					regX : 0,
					regY : 0
				},
				animations : {
					'default' : [ 0, 0, "default" ],
					'area0' : [ 4, 5, "area0" ],
					'area1' : [ 8, 8, "area1" ]
				}
			},
			stage : null,
			ground : self
		});
	};

	/**
	 * 実体要素取得
	 *
	 * @name getPosition
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.stage.XGround#
	 **/
	p.getPosition = function(data, options) {
		var self = this;
		
		//描画領域のオフセット
		var stageViewOffset = data.stageViewOffset||options.iconController.stageViewOffset;
		var location = data.dummyLocation||self.getLocation();
		var x = location.x-stageViewOffset.x;
		var y = location.y-stageViewOffset.y;
		var z = location.z-stageViewOffset.z;
		//TODO: 実際のモデルの縮尺から取得するべき
		var scale = 10;
		
		var parent = self.getParent(options)||{};
		var parentsPosition = parent.getPosition(data, options)||{x:0,y:0,z:0};
		
		var position = { x : x * scale,
				 y : y * scale,
				 z : z };
		
		return { x : parentsPosition.x + position.x,
				 y : parentsPosition.y + position.y,
				 z : parentsPosition.z + position.z };
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

	o.XGround = XGround;
}());
