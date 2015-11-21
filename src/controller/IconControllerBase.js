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
	 * </p>
	 * @class
	 * @name IconControllerBase
	 * @memberOf jslgEngine.controller
	 * @constructor
	 */
	var IconControllerBase = function(options) {
		this.initialize(options);
	};
	/**
	 *
	 */
	var p = IconControllerBase.prototype;
	
	/**
	 * depending a object supports canvas images.
     * it is the third party so far.
	 *
	 * @private
	 * @name _graphicResource
	 * @property
	 * @type createjs.Stage
	 * @memberOf jslgEngine.controller.IconControllerBase#
	 **/
	p._graphicResource = null;

	/**
	 * icons has the information about the graphicResource.
	 *
	 * @private
	 * @name _icons
	 * @property
	 * @type jslgEngine.model.common.JSlgElement
	 * @memberOf jslgEngine.controller.IconControllerBase#
	 **/
	p._icons = null;

	/**
	 * size of canvas.
	 * 
	 * @private
	 * @name canvasSize
	 * @property
	 * @type Object
	 * @memberOf jslgEngine.controller.IconControllerBase#
	 **/
	p.canvasSize = null;

	/**
	 * stage offset from the origin.
	 * 
	 * @private
	 * @name stageViewOffset
	 * @property
	 * @type Object
	 * @memberOf jslgEngine.controller.IconControllerBase#
	 **/
	p.stageViewOffset = null;

	/**
	 * 依存アイコン作成クラス
	 *
	 * @private
	 * @name iconFactory
	 * @property
	 * @type jslgEngine.controller.MainController
	 * @memberOf jslgEngine.controller.IconController#
	 **/
	p.iconFactory = null;

	/**
	 * 依存イベント作成クラス
	 *
	 * @private
	 * @name commandFactory
	 * @property
	 * @type jslgEngine.controller.MainController
	 * @memberOf jslgEngine.controller.IconController#
	 **/
	p.commandFactory = null;

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
	 * MainController class
	 *
	 * @private
	 * @name _mainController
	 * @property
	 * @type jslgEngine.controller.MainController
	 * @memberOf jslgEngine.controller.IconControllerBase#
	 **/
	p._mainController = null;

	/**
     * set up.
     * 
	 * @name initialize
	 * @method
	 * @function
	 * @memberOf jslgEngine.controller.IconControllerBase#
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
		self._icons = new jslgEngine.model.common.JSlgElement({
			key : '_',
			keyPathCodes : [jslgEngine.model.stage.keys.ROOT],
			keyCode : jslgEngine.model.stage.keys.ROOT
		}, options);
		self._mainController = options ? options.mainController : null;
		self.stageViewOffset = options ? options.stageViewOffset : {x:0,y:0,z:0};
	};

	/**
	 * add the information like relationship SLG elements.
	 *
	 * @name addIconInformation
	 * @method
	 * @function
	 * @memberOf jslgEngine.controller.IconControllerBase#
	 * @param {Object} options
	 **/
	p.addIconInformation = function(data, options) {};
	
	/**
	 * remove information.
	 *
	 * @name removeIconInformation
	 * @method
	 * @function
	 * @memberOf jslgEngine.controller.IconControllerBase#
	 * @param {Object} options
	 **/
	p.removeIconInformation = function(data) {
		var self = this;
		var key = data.key;
		var sprite = data.sprite;
		var group = data.group;
		
		var icon = self._icons.removeChild({
			key : key
		});
		jslgEngine.log('removed icon info');
	};
	
	/**
	 * get icon keys by searching icon group name
	 *
	 * @name getKeysByGroup
	 * @method
	 * @function
	 * @memberOf jslgEngine.controller.IconControllerBase#
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
	 * add icon.
	 *
	 * @name add
	 * @method
	 * @function
	 * @memberOf jslgEngine.controller.IconControllerBase#
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
	};

	/**
	 * remove icon.
	 *
	 * @name remove
	 * @method
	 * @function
	 * @memberOf jslgEngine.controller.IconControllerBase#
	 * @param {Object} data
	 * <ul>
	 * 	<li>{String} key</li>
	 * </ul>
	 **/
	p.remove = function(data) {
	};

	/**
	 * update icon.
	 *
	 * @name update
	 * @method
	 * @function
	 * @memberOf jslgEngine.controller.IconControllerBase#
	 * @param {Object} data
	 * <ul>
	 * 	<li>{String} key</li>
	 * 	<li>{String} animeKey</li>
	 * 	<li>{Number} fadeValue</li>
	 * 	<li>{Object} position</li>
	 * </ul>
	 **/
	p.update = function(data) {
	};

	/**
	 * change visibility of a icon.
	 *
	 * @name changeVisibility
	 * @method
	 * @function
	 * @memberOf jslgEngine.controller.IconControllerBase#
	 * @param {Object} key
	 * @param {Boolean} is_visible
	 * @param {Number} alpha
	 **/
	p.changeVisibility = function(key, is_visible, alpha) {
	};
	
	/**
	 * get visibility of a icon.
	 *
	 * @name isVisible
	 * @method
	 * @function
	 * @memberOf jslgEngine.controller.IconControllerBase#
	 * @param {Object} key
	 * @returns {Boolean}
	 **/
	p.isVisible = function(key) {
	};
	
	/**
	 * get the information icon exsist.
	 *
	 * @name hasKey
	 * @method
	 * @function
	 * @memberOf jslgEngine.controller.IconControllerBase#
	 * @param {Object} key
	 * @returns {Boolean}
	 **/
	p.hasKey = function(key) {
	};
	
	/**
	 * get the information if a position is posssible to draw in the canvas tag. 
	 *
	 * @name existsInCanvas
	 * @method
	 * @function
	 * @memberOf jslgEngine.controller.IconControllerBase#
	 * @param {Object} position 描画座標
	 * @param {Object} space オフセット
	 * @returns {Boolean}
	 **/
	p.existsInCanvas = function(position, space) {};
	
	/**
	 * remove icon.
	 *
	 * @name getIconSize
	 * @method
	 * @function
	 * @memberOf jslgEngine.controller.IconControllerBase#
	 * @param {Object} data
	 **/
	p.getIconSize = function(key) {
	};
	
	/**
	 * remove icon.
	 *
	 * @name getPosition
	 * @method
	 * @function
	 * @memberOf jslgEngine.controller.IconControllerBase#
	 * @param {Object} data
	 **/
	p.getPosition = function(data, options) {};
	
	o.IconControllerBase = IconControllerBase;
}());
