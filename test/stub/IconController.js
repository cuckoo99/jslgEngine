/*
 * @author cuckoo99
 */

(function() {
	// namespace:
	var o = this.jslgEngine = this.jslgEngine||{};
	o = (o.stub = o.stub||{});

	var IconController = function(data) {
		var dat = data||{};
		this.converter = new jslgEngine.model.logic.Converter({});
		this._list = [];
		this.stageViewOffset = {x:0,y:0,z:0};
		this.iconFactory = dat.iconFactory||new jslgEngine.model.factory.JSlgIconFactory();
		this.commandFactory = dat.commandFactory||new jslgEngine.model.factory.JSlgCommandFactory();
		this.canvasSize = {
			width : 1,
			height : 1,
			depth : 1
		};
	};
	
	/**
	 *
	 */
	var p = IconController.prototype;

	p._list = null;

	p._initializeByStage = function() {	
		var self = this;
		self._stage = new createjs.Stage();
		self._stage.enableMouseOver(10);
		self.canvasSize = {
			width : 640,
			height : 480,
			depth : 1
		};
	}

	p.initialize = function(options) {	
		var self = this;
		
		// settings depending objects.
		var canvas = document.createElement("canvas");
		self._graphicResource = new createjs.Stage(canvas);

		// other settings.
		self._icons = new jslgEngine.model.common.JSlgElement({
			key : '_',
			keyPathCodes : [jslgEngine.model.stage.keys.ROOT],
			keyCode : jslgEngine.model.stage.keys.ROOT
		}, options);
		self._mainController = options ? options.mainController : null;
	}

	// Get Sample
	p.getSample = function(keys) {
		var iconController = new jslgEngine.stub.IconController({
			mainController : new jslgEngine.controller.MainController({
						 fileControllers : [new jslgEngine.controller.ImageFileController()]
					 })
		});

		var iconKeys = keys;

		for(var i = 0; i < iconKeys.length; i++) {
			iconController.add(iconController._mainController.connector, {
				key : iconKeys[i],
				graphics : {
					data : new createjs.Graphics(),
				clickFunc : function(e, obj) {
				}
				},
				position : { x : 0, y : 0, z : 0},
				alpha : 0
			});
		}

		return iconController;
	};
	
	p.add = function(connector, data, options) {
		var self = this;
		if(!data) return false;

		//var key = data.key;

		self._list.push(data);
	};

	p.remove = function(data) {
		var self = this;
		var key = data.key;

		for(var i = 0; i < self._list.length; i++) {
			if(self._list[i].key === key) {
				self._list.splice(i, 1);
				i--;
			}
		}
	};
	
	p.hasKey = function(key) {
		var self = this;
		for(var i = 0; i < self._list.length; i++) {
			if(self._list[i].key === key) return true;
		}
		return false;
	};

	p.existsInCanvas = function(position, space) {
		return true;
	}

	p.review = function(result, data, options) {};

	p.update = function() {
	};

	p.getKeysByGroup = function(group) {
		var self = this;
		var groupKeys = [];
		for(var i = 0; i < self._list.length; i++) {
			if(self._list[i].group === group) {
				groupKeys.push(self._list[i].key);
			}
		}
		return groupKeys;
	}

	o.IconController = IconController;
}());
