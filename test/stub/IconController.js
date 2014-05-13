
var o = this.jslgEngine = this.jslgEngine||{};
o = (o.stub = o.stub||{});

jslgEngine.controller.IconController.prototype._initializeByStage = function() {
	var self = this;
	self._stage = new createjs.Stage();
	self._stage.enableMouseOver(10);
	self.canvasSize = {
		width : 640,
		height : 480,
		depth : 1
	};
};

o.IconController = (function() {
	var IconController = jslgEngine.extend(
		jslgEngine.controller.IconController,
		function(options) {
            this.list = [];
			this.initialize(options);
		}
	);

	var p = IconController.prototype;
	
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
		self.iconFactory = options ? options.iconFactory : null;
		self.commandFactory = options ? options.commandFactory : null;
		self.stageViewOffset = {x:0,y:0,z:0};
		self.converter = new jslgEngine.model.logic.Converter({});
    };
    
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
    
    p.list = null;
    
	p.add = function(connector, data, options) {
		var self = this;
		if(!data) return false;

		var key = data.key;
        
		self.list.push(key);
	};
    
    p.remove = function(data) {
		var self = this;
		var key = data.key;

        for(var i = 0; i < self.list.length; i++) {
            if(self.list[i] === key) {
                self.list.splice(i, 1);
                i--;
            }
        }
	};
    
	p.hasKey = function(key) {
		var self = this;
        for(var i = 0; i < self.list.length; i++) {
            if(self.list[i] === key) return true;
        }
        return false;
	};
	
    p.existsInCanvas = function(position, space) {
        return true;
    }
    
	return IconController;
}());

