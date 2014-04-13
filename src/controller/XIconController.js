/*
 * @author cuckoo99
 */

(function() {
	// namespace:
	var o = this.jslgEngine = this.jslgEngine||{};
	o = (o.controller = o.controller||{});

	/**
	 * <p>
	 * this class is abstact.<br />
     * it includes graphical objects managed.<br />
	 * it'sdepending on <em>easelJs</em>.<br />
	 * </p>
	 * @class
	 * @name XIconController
	 * @memberOf jslgEngine.controller
	 * @constructor
	 */
	var XIconController = jslgEngine.extend(
		jslgEngine.controller.IconControllerBase,
		function(options) {
			this.initialize(options);
		}
	);
	/**
	 *
	 */
	var p = XIconController.prototype;
	
	/**
	 * depending a object supports canvas images.
     * it is the third party so far.
	 *
	 * @private
	 * @name _graphicResource
	 * @property
	 * @type createjs.Stage
	 * @memberOf jslgEngine.controller.XIconController#
	 **/
	p._graphicResource = null;

	/**
	 * depending a object supports canvas images.
     * it is the third party so far.
	 *
	 * @private
	 * @name _camera
	 * @property
	 * @type createjs.Stage
	 * @memberOf jslgEngine.controller.XIconController#
	 **/
	p._camera = null;

	/**
	 * icons has the information about the graphicResource.
	 *
	 * @private
	 * @name _icons
	 * @property
	 * @type jslgEngine.model.common.JSlgElement
	 * @memberOf jslgEngine.controller.XIconController#
	 **/
	p._icons = null;

	/**
	 * size of canvas.
	 * 
	 * @private
	 * @name canvasSize
	 * @property
	 * @type Object
	 * @memberOf jslgEngine.controller.XIconController#
	 **/
	p.canvasSize = null;

	/**
	 * stage offset from the origin.
	 * 
	 * @private
	 * @name stageViewOffset
	 * @property
	 * @type Object
	 * @memberOf jslgEngine.controller.XIconController#
	 **/
	p.stageViewOffset = null;

	/**
	 * MainController class
	 *
	 * @private
	 * @name _mainController
	 * @property
	 * @type jslgEngine.controller.MainController
	 * @memberOf jslgEngine.controller.XIconController#
	 **/
	p._mainController = null;

	/**
     * set up.
     * 
	 * @name initialize
	 * @method
	 * @function
	 * @memberOf jslgEngine.controller.XIconController#
	 * @param {Object} options
	 **/
	p.initialize = function(options) {
		var self = this;
		
        // settings depending objects.
		var canvas = options.container;
		self._graphicResource = options.scene;
		self._camera = options.camera;
		
		self.canvasSize = {
			width : ~~canvas.getAttribute("width"),
			height : ~~canvas.getAttribute("height"),
			depth : 1
		};
        
        // other settings.
		self._icons = new jslgEngine.model.common.JSlgElement({
			key : '_',
			keyPathCodes : [jslgEngine.model.stage.keys.ROOT],
			keyCode : jslgEngine.model.stage.keys.ROOT
		});
		self._mainController = options ? options.mainController : null;
		self.iconFactory = options ? options.iconFactory : null;
		self.commandFactory = options ? options.commandFactory : null;
		self.stageViewOffset = options ? options.stageViewOffset : {x:0,y:0,z:0};
		
		self.converter = new jslgEngine.model.logic.Converter({
			isThree : true
		});
	};

	/**
	 * add the information like relationship SLG elements.
	 *
	 * @name addIconInformation
	 * @method
	 * @function
	 * @memberOf jslgEngine.controller.XIconController#
	 * @param {Object} options
	 **/
	p.addIconInformation = function(data) {
		var self = this;
		var key = data.key;
		var animation = data.animation;
		var onClick = data.onClick;
		var group = data.group;
		
		//TODO: 要素と１：１にすべきか
		var icon = self._icons.getChild({
			key : key
		});
        
		if(!icon) {
			icon = new jslgEngine.model.stage.Icon({
				key : key,
				keyPathCodes : [jslgEngine.model.stage.keys.ROOT],
				keyCode : jslgEngine.model.stage.keys.ROOT
			});
			icon.setStatus('animation', animation);
			icon.setStatus('onClick', onClick);
			icon.setStatus('group', group);
			self._icons.addChild({
				obj : icon
			});
		} else {
			jslgEngine.log('already exists its information.');
		}
	};
	
	/**
	 * add icon.
	 *
	 * @name add
	 * @method
	 * @function
	 * @memberOf jslgEngine.controller.XIconController#
	 * @param {jslgEngine.model.network.ConnectorBase} connector
	 * @param {Object} data
	 * <ul>
	 * 	<li>{String} key</li>
	 * 	<li>{String} imageKey</li>
	 * 	<li>{createjs.Graphics} graphics TODO</li>
	 * 	<li>{Number} alpha</li>
	 * 	<li>{Object} text</li>
	 * 	<ul>
	 * 	<li>{String} font</li>
	 * 	<li>{String} textValue</li>
	 * 	<li>{String} color</li>
	 * 	</ul>
	 * 	<li>{careatejs.Sprite} sprite TODO</li>
	 * 	<li>{jslgEngine.controller.MainController} mainController</li>
	 * </ul>
	 * @param {Object} options
	 **/
	p.add = function(connector, data, options) {
		var self = this;
		var key = data.key;
		var mainController = self._mainController;
		var args = {
			iconController : self,
			mainController : mainController,
		};

		if(!data) return false;

		if(self._graphicResource.getChildByName(key) != null) {
			jslgEngine.log(key + 'was already created.');
			return false;
		}
		
		//メッシュはインスタンスのようなものなので、メッシュ作成はここで行う。
		if(data.type === 'Model') {
			//モデル
			var geometry = data.geometry;
			var materials = data.materials;
			
			var faceMaterial = new THREE.MeshFaceMaterial( materials );
			var mesh = new THREE.MorphAnimMesh( geometry, faceMaterial );
			mesh.name = key;
			
			jslgEngine.log(key + 'add icon:'+geometry.name);
			
			if(geometry.animation && Object.keys(geometry.animation).length > 0) {
				THREE.AnimationHandler.add(geometry.animation);
				animation = new THREE.Animation(mesh, "ArmatureAction", THREE.AnimationHandler.CATMULLROM);
				data.animation = animation;
			}
			
			if(data.position) {
				//y-zを入れ替え
				data.position = self.getFlip(data.position);
				
				mesh.position.set(data.position.x, data.position.y, data.position.z);
			}
			
			//TODO: とりあえず拡大
			mesh.scale.set(5,5,5);
		} else if(data.type === 'Plane') {
			//平面モデル
			var material = data.material;
			var size = data.size;
			
			//スプライト
			var mesh = new THREE.Sprite( material );
			mesh.name = key;
			mesh.position.set(data.position.x, data.position.y, data.position.z);
			mesh.scale.set(size.width,size.height,1.0);
			//mesh.scale.set(50,50,1.0);
			
			jslgEngine.log(key + 'add icon:'+mesh.name);
		} else {
			jslgEngine.log('Failed to make a Icon');
			return false;
		}
		
		self.addIconInformation(data);

		self._graphicResource.add(mesh);
		
		//TODO: キャンバス上に設置できる座標か判定しなければならない。
	};

	/**
	 * remove icon.
	 *
	 * @name remove
	 * @method
	 * @function
	 * @memberOf jslgEngine.controller.XIconController#
	 * @param {Object} data
	 * <ul>
	 * 	<li>{String} key</li>
	 * </ul>
	 **/
	p.remove = function(data) {
		var self = this;
		var key = data.key;

		var obj = self._graphicResource.getChildByName(key);
		
		if(obj) {
			self._graphicResource.remove(obj);
			jslgEngine.log('removed icon:'+key);
		}

		return null;
	};
	
	/**
	 * update icon.
	 *
	 * @name update
	 * @method
	 * @function
	 * @memberOf jslgEngine.controller.XIconController#
	 * @param {Object} data
	 * <ul>
	 * 	<li>{String} key</li>
	 * 	<li>{String} animeKey</li>
	 * 	<li>{Number} fadeValue</li>
	 * 	<li>{Object} position</li>
	 * </ul>
	 **/
	p.update = function(data) {
		var self = this;
		var logLevel = 3;
		
		if(!data) {
            // only canvas update.
			self._graphicResource.update();
			return;
		}
		
		var key = data.key;
		var texture = data.position;
		var texture = data.texture;

		jslgEngine.log('update key:' + data.key + ', anime:' + data.animeKey, logLevel);
		self._graphicResource.traverse(function(obj) {
			if (obj instanceof THREE.Mesh && obj.name === key) {
				//TODO: オブジェクト内で操作できる対象
				// 各メッシュの座標、素材、テクスチャ
				// ボーンなど、回転
				
				//座標の書き換え
				obj.position = position||obj.position;
				
				//テクスチャの書き換え
				obj.material.map = texture||obj.material.map;
				
				//アルファ値
				obj.material.opacity =　ata.fadeValue||obj.material.opacity;
			}
		});
		
	};
	
	/**
	 * change visibility of a icon.
	 *
	 * @name changeVisibility
	 * @method
	 * @function
	 * @memberOf jslgEngine.controller.XIconController#
	 * @param {Object} key
	 * @param {Boolean} is_visible
	 * @param {Number} alpha
	 **/
	p.changeVisibility = function(key, is_visible, alpha) {
		var self = this;
		
		var obj = self._graphicResource.getChildByName(key);
		
		if(!obj) {
			jslgEngine.log(key + ' icon was not found');
			return;
		}
		
		obj.visible = is_visible;
        
		if(is_visible) {
			obj.alpha = alpha != null ? alpha : 1;
		}
	};
	
	/**
	 * get visibility of a icon.
	 *
	 * @name isVisible
	 * @method
	 * @function
	 * @memberOf jslgEngine.controller.XIconController#
	 * @param {Object} key
	 * @returns {Boolean}
	 **/
	p.isVisible = function(key) {
		var self = this;
		var obj = self._graphicResource.getChildByName(key);
		return obj ? obj.visible : false;
	};
	
	/**
	 * get the information icon exsist.
	 *
	 * @name hasKey
	 * @method
	 * @function
	 * @memberOf jslgEngine.controller.XIconController#
	 * @param {Object} key
	 * @returns {Boolean}
	 **/
	p.hasKey = function(key) {
		var self = this;
		return self._graphicResource.getChildByName(key) ? true : false;
	};
	
	/**
	 * get the information if a position is posssible to draw in the canvas tag. 
	 *
	 * @name existsInCanvas
	 * @method
	 * @function
	 * @memberOf jslgEngine.controller.XIconController#
	 * @param {Object} position 描画座標
	 * @param {Object} space オフセット
	 * @returns {Boolean}
	 **/
	p.existsInCanvas = function(position, space) {
		var self = this;
		var spaceOffset = space ? space : {width:0,height:0,depth:0};
		var canvasSize = self.canvasSize;
		return (	position.x >= 0 - spaceOffset.width &&
					position.x < canvasSize.width + spaceOffset.width &&
					position.y >= 0 - spaceOffset.height &&
					position.y < canvasSize.height + spaceOffset.height &&
					position.z >= 0 - spaceOffset.depth &&
					position.z < canvasSize.depth + spaceOffset.depth);
	};
	
	/**
	 * get icon keys by searching icon group name
	 *
	 * @name getKeysByGroup
	 * @method
	 * @function
	 * @memberOf jslgEngine.controller.XIconController#
	 * @param {Object} group
	 * @returns {String}
	 **/
	p.getKeysByGroup = function(group) {
		var self = this;
		
		var icons = self._icons;
		var keys = [];
		
		var children = icons.getChildren({});
		for(var i = 0; i < children.length; i++) {
			var child = children[i];
			
			if(child.getStatus('group').value == group) {
				keys.push(child.getKey());
			}
		}
		return keys;
	};
	
	/**
	 * remove icon.
	 *
	 * @name getFlip
	 * @method
	 * @function
	 * @memberOf jslgEngine.controller.XIconController#
	 * @param {Object} data
	 **/
	p.getFlip = function(pos) {
		return { x : pos.x, y : pos.z, z : pos.y };
	};
	
	/**
	 * remove icon.
	 *
	 * @name getIconSize
	 * @method
	 * @function
	 * @memberOf jslgEngine.controller.XIconController#
	 * @param {Object} data
	 **/
	p.getIconSize = function(key) {
		var self = this;
		
		var obj = self._graphicResource.getChildByName(key);
		
		return obj ? {
			x : obj.x,
			y : obj.y,
			width : obj.regX,
			height : obj.regY
		} : null;
	};
	
	/**
	 * remove icon.
	 *
	 * @name getPosition
	 * @method
	 * @function
	 * @memberOf jslgEngine.controller.XIconController#
	 * @param {Object} data
	 **/
	p.getPosition = function(data, options) {
		var self = this;
		var element = data.element;
		var opt = options||{};
		
		var rad = -Math.PI / 24 * 6.5;
		var location;
		//座標を強制的に設定できるようにする。
		//TODO: その座標の取得の役目は要素ではない気がするが。
		location = data.dummyLocation ? data.dummyLocation : element.getGlobalLocation();
		location = element._getRelativeLocation(location, data);
		var x = location.x;
		var y = location.y;
		var z = location.z;
		var canvasOffset = element.canvasOffset||{ x : 0, y : 0, z : 0 };
		var canvasParentsOffset = element.canvasParentsOffset||{ x : 0, y : 0, z : 0 };
		var offset = {
			x : canvasOffset.x + canvasParentsOffset.x,
			y : canvasOffset.y + canvasParentsOffset.y,
			z : canvasOffset.z + canvasParentsOffset.z};
		var disableRound = opt ? opt.disableRound : false;

		var round = !disableRound ? function(x) {
			return Math.round(x);
		} : function(x) {
			return x;
		};
		
		var drawingOptions = data.element.getStatus(jslgEngine.model.common.keys.DRAWING_OPTIONS).value;
		//TODO: キーで管理したい。
		//第１引数、モデルの情報
		var iconModelArgugemnts = drawingOptions[2];
		var modelKey = iconModelArgugemnts[0];
		
		var model = options.mainController.getController('Model').get(options.mainController.connector, {
			key : modelKey
		}, options);
		
		var size = model.geometry.boundingBox.size();
		
		return {
				x : size.x * x,
				y : size.y * y,
				z : 0 };
	};
	
	/**
	 * remove information.
	 *
	 * @name get
	 * @method
	 * @function
	 * @memberOf jslgEngine.controller.XIconController#
	 * @param {Object} options
	 **/
	p.get = function(data, options) {
		var self = this;
		var key = data.key;
		var info;
		
		var icons = self._icons;
		var children = icons.getChildren({});
		for(var i = 0; i < children.length; i++) {
			var child = children[i];
			
			if(child.getKey() === key) {
				info = {
					onClick : child.getStatus('onClick').value,
					animation : child.getStatus('animation').value
				};
				break;
			}
		}
		self._graphicResource.traverse(function(obj) {
			if (obj instanceof THREE.Mesh && obj.name === key) {
				data.callback({
					info : info,
					mesh : obj
				});
			}
		});
	};
	
	o.XIconController = XIconController;
}());