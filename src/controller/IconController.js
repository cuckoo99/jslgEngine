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
	 * @name IconController
	 * @memberOf jslgEngine.controller
	 * @constructor
	 */
	var IconController = jslgEngine.extend(
		jslgEngine.controller.IconControllerBase,
		function(options) {
			this.initialize(options);
		}
	);
	/**
	 *
	 */
	var p = IconController.prototype;
	
	/**
	 * MainController class
	 *
	 * @private
	 * @name _mainController
	 * @property
	 * @type jslgEngine.controller.MainController
	 * @memberOf jslgEngine.controller.IconController#
	 **/
	p._mainController = null;

	/**
	 * 変換・オブジェクト
	 *
	 * @name converter
	 * @property
	 * @type jslgEngine.model.logic.Converter
	 * @memberOf jslgEngine.controller.IconController#
	 **/
	p.converter = null;
	
	/**
     * set up.
     * 
	 * @name initialize
	 * @method
	 * @function
	 * @memberOf jslgEngine.controller.IconController#
	 * @param {Object} options
	 **/
	p.initialize = function(options) {
		var self = this;
		
        // settings depending objects.
		var canvas = document.getElementById("stage");
		self._graphicResource = new createjs.Stage(canvas);
		self._graphicResource.enableMouseOver(10);
		self.canvasSize = {
			width : ~~canvas.getAttribute("width"),
			height : ~~canvas.getAttribute("height"),
			depth : 1
		};
        
        // other settings.
		self._icons = [];
		self._mainController = options ? options.mainController : null;
		self.iconFactory = options ? options.iconFactory : null;
		self.commandFactory = options ? options.commandFactory : null;
		self.stageViewOffset = options ? options.stageViewOffset : {x:0,y:0,z:0};
		
		self.converter = new jslgEngine.model.logic.Converter({});
	};

	/**
	 * waiting for input text.
	 * it depends on jquery UI.
	 *
	 * @name requireInputText
	 * @method
	 * @function
	 * @memberOf jslgEngine.controller.IconController#
	 * @param {Object} options
	 **/
	p.requireInputText$ = function(connector, data, options) {
		var self = this;
		var id = 'dialog';
		
		$('#'+id).dialog({
			autoOpen : true,
			title : data.title,
			closeOnEscape : false,
			modal : true,
			open : function(e) {
				$(this).find('.message').text(data.message);
			},
			buttons : {
				'OK' : function() {
					var text = $(this).find('input').val();
					$(this).dialog('close');
					connector.resolve(text);
				},
				'Cancell' : function() {
					$(this).dialog('close');
					connector.resolve(null);
				}
			}
		});
	};

	/**
	 * add the information like relationship SLG elements.
	 *
	 * @name addIconInformation
	 * @method
	 * @function
	 * @memberOf jslgEngine.controller.IconController#
	 * @param {Object} options
	 **/
	p.addIconInformation = function(data, options) {
		var self = this;
		var key = data.key;
		var sprite = data.sprite;
		var group = data.group;
		
		var icon = self._icons[key];
        
		if(!icon) {
			self._icons[key] = {
				group : group
			};
		} else {
			jslgEngine.log('already exists its information.');
		}
	};
	
	/**
	 * remove icon.
	 *
	 * @name remove
	 * @method
	 * @function
	 * @memberOf jslgEngine.controller.IconController#
	 * @param {Object} data
	 * <ul>
	 * 	<li>{String} key</li>
	 * </ul>
	 **/
	p._getMouseClickForListener = function(sprite, data, options) {
		return function(e) {
			sprite.onClick(e, options);
		};
	};
	
	/**
	 * remove icon.
	 *
	 * @name remove
	 * @method
	 * @function
	 * @memberOf jslgEngine.controller.IconController#
	 * @param {Object} data
	 * <ul>
	 * 	<li>{String} key</li>
	 * </ul>
	 **/
	p._getMouseMoveForListener = function(sprite, data, options) {
		return function(e) {
			sprite.onMouseMove(e, options);
		};
	};

	p.removeAll = function(options) {
		var self = this;
		jslgEngine.dispose(self._icons);
		self._icons = [];
		self._graphicResource.removeAllChildren();
		self._graphicResource.update();
	};

	p.getNegationList = function(list) {
		var self = this;
		var result = [];

		var children = self._graphicResource.children;
		
		for(var i = 0, len = children.length; i < len; i++) {
			var child = children[i];

			var exists = false;
			for(var j = 0, len2 = list.length; j < len2; j++) {
				var key = list[j];

				if(child.name === key) {
					exists = true;
					break;
				}
			}

			if(exists) {
				continue;
			}

			result.push(child.name);
		}

		return result;
	}

	/**
	 * add icon.
	 *
	 * @name add
	 * @method
	 * @function
	 * @memberOf jslgEngine.controller.IconController#
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
		//var args = options;
		if(!data) return false;

		if(self._graphicResource.getChildByName(key) != null) {
			jslgEngine.log(key + 'was already created.');
			return false;
		}
		
		var position = data.position||{};

		self.addIconInformation(data);

		if(data.graphics) {
			// Graphics Object
			var obj = new createjs.Shape(data.graphics.data);
			obj.name = key;
			obj.x = position.x;
			obj.y = position.y;
			obj.alpha = data.alpha||1;

			obj.addEventListener("click",
				self._getMouseClickForListener(data.graphics, {}, args));

			jslgEngine.log('add ' + key);
			self._graphicResource.addChild(obj);
		}
		else if (data.text) {
			// Text Object
			var text = data.text;
			if(!text) return false;

			var font = text.font||"bold 12px Arial";
			txt = new createjs.Text(text.textValue, font, text.color);
			txt.name = key;
			txt.textAlign = 'left';
			txt.x = position.x;
			txt.y = position.y;
			txt.alpha = data.alpha||1;

			jslgEngine.log('add ' + key);
			self._graphicResource.addChild(txt);
		}
		else if (data.sprite) {
			// Image Object
			var imageKey = data.imageKey;
			
			mainController.load(connector, {
				fileType : 'Image',
				contentKeys : [imageKey],
				callback : function(image) {
					var sprite = data.sprite;
					if(!sprite) return false;

					sprite.images = [ image ];

					var obj = new createjs.Sprite(
							new createjs.SpriteSheet(sprite));

					obj.name = key;
					obj.x = position.x;
					obj.y = position.y;
					
					obj.gotoAndPlay("default");

					obj.addEventListener("animationend", function(e) {
						if(e.name == 'default') {
							return;
						}
						jslgEngine.log(' fired! animationend');
						
						var name = e.target.name;

						mainController.ticker.notifyEndOfAnimation(name, true);
						e.target.gotoAndPlay('default');
					});

					if(sprite.onClick) {
						obj.addEventListener("click",
							self._getMouseClickForListener(sprite, {}, args));
					}
					if(sprite.onMouseMove) {
						obj.addEventListener("mouseover",
							self._getMouseMoveForListener(sprite, {}, args));
					}

					if (data.atIndex) {
						jslgEngine.log('add at' + atIndex);
						self._graphicResource.addChildAt(obj, atIndex);
					} else {
						jslgEngine.log('add ' + key);
						self._graphicResource.addChild(obj);
					}
				}
			});
		}
		
		if(!self.existsInCanvas(position)) {
			//Z座標がないと非表示にされるので注意。
			//jslgEngine.log(key+'is invisible.');
			self.changeVisibility(key, false);
		}
		
		self._graphicResource.update();
	};

	/**
	 * remove icon.
	 *
	 * @name remove
	 * @method
	 * @function
	 * @memberOf jslgEngine.controller.IconController#
	 * @param {Object} data
	 * <ul>
	 * 	<li>{String} key</li>
	 * </ul>
	 **/
	p.remove = function(data) {
		var self = this;
		var key = data.key;

		var obj = self._graphicResource.getChildByName(key);
		self._graphicResource.removeChild(obj);
		
		jslgEngine.log('removed icon:'+key);

		return null;
	};

	/**
	 * update icon.
	 *
	 * @name update
	 * @method
	 * @function
	 * @memberOf jslgEngine.controller.IconController#
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
		var logLevel = 4;
		
		if(!data) {
            // only canvas update.
			self._graphicResource.update();
			return;
		}
		
		var key = data.key;

		jslgEngine.log('update key:' + data.key + ', anime:' + data.animeKey, logLevel);
		var obj = self._graphicResource.getChildByName(key);

		if(obj) {
			if(data.fadeValue >= 0) {
				obj.alpha = data.fadeValue;
			}

			var position = data.position||{x:obj.x,y:obj.y};
			jslgEngine.log('x:' + position.x + ', y:' + position.y, logLevel);
			
			obj.x = position.x;
			obj.y = position.y;
			if(obj.text != null) {
				obj.text = data.text != null ? data.text : obj.text;
			}

			if(data.animeKey) {
				if(data.stop) {
					obj.gotoAndStop(data.animeKey);
				} else {
					obj.gotoAndPlay(data.animeKey);
				}
			}
		}
	};

	/**
	 * change visibility of a icon.
	 *
	 * @name changeVisibility
	 * @method
	 * @function
	 * @memberOf jslgEngine.controller.IconController#
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
	 * @memberOf jslgEngine.controller.IconController#
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
	 * @memberOf jslgEngine.controller.IconController#
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
	 * @memberOf jslgEngine.controller.IconController#
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
	 * @memberOf jslgEngine.controller.IconController#
	 * @param {Object} group
	 * @returns {String}
	 **/
	p.getKeysByGroup = function(group) {
		var self = this;
		
		var keys = [];
		
		for(var key in self._icons) {
			var child = self._icons[key];
			
			if(child.group == group) {
				keys.push(key);
			}
		}
		return keys;
	};
	
	/**
	 * remove icon.
	 *
	 * @name getIconSize
	 * @method
	 * @function
	 * @memberOf jslgEngine.controller.IconController#
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
	 * @memberOf jslgEngine.controller.IconController#
	 * @param {Object} data
	 **/
	p.getPosition = function(key) {
		var self = this;
		
		var obj = self._graphicResource.getChildByName(key);
		
		return obj ? {
			x : obj.x,
			y : obj.y,
			width : obj.regX,
			height : obj.regY
		} : null;
	};
	
	o.IconController = IconController;
}());
