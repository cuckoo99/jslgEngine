/*
 * @author cuckoo99
 */

(function() {
	// namespace:
	var o = this.jslgEngine = this.jslgEngine||{};
	o = (o.model = o.model||{});
	o = (o.logic = o.logic||{});

	/**
	 * <h4>Converter</h4>
	 * <p>
     * makes JSlgElement from outer file XML or JSON.
	 * </p>
	 * @class
	 * @name Converter
	 * @memberOf jslgEngine.model.logic
	 * @constructor
	 */
	var Converter = function(data) {
		this.initialize(data);
	};
	/**
	 *
	 */
	var p = Converter.prototype;

	/**
	 * set up.
	 *
	 * @name initialize
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.logic.Converter#
	 **/
	p.initialize = function(data) {
		var self = this;
		
		var isThree = data ? data.isThree : false;
		
		self._models = {
			frames : {
				'StageFrame' : jslgEngine.model.stage.StageFrame,
				'GroundFrame' : isThree ? jslgEngine.model.stage.XGroundFrame : jslgEngine.model.stage.GroundFrame,
				'CastFrame' : isThree ? jslgEngine.model.stage.XCastFrame : jslgEngine.model.stage.CastFrame,
				'ItemFrame' : jslgEngine.model.stage.ItemFrame,
				'MindFrame' : jslgEngine.model.mind.MindFrame
			},
			generics : {
				'Icon' : jslgEngine.model.stage.Icon,
				'Command' : jslgEngine.model.command.Command,
				'CommandBlockIF' : jslgEngine.model.command.CommandBlockIF,
				'CommandBlockElseIF' : jslgEngine.model.command.CommandBlockElseIF,
				'CommandBlockFOR' : jslgEngine.model.command.CommandBlockFOR,
				'ActionAdd' : jslgEngine.model.action.ActionAdd,
				'ActionRemove' : jslgEngine.model.action.ActionRemove,
				'ActionSet' : jslgEngine.model.action.ActionSet,
				'ActionAudio' : jslgEngine.model.action.ActionAudio,
				'ActionAnime' : jslgEngine.model.action.ActionAnime,
				'ActionCall' : jslgEngine.model.action.ActionCall,
				'ActionRequireMessage' : jslgEngine.model.action.ActionJSlgMessage,
				'ActionRequireArea' : jslgEngine.model.action.ActionRequireArea,
				'ActionPending' : jslgEngine.model.action.ActionPending,
				'ActionMind' : jslgEngine.model.action.ActionMind,
				'ActionIcon' : jslgEngine.model.action.ActionIcon,
				'ActionLog' : jslgEngine.model.action.ActionLog,
				'ActionUpdate' : jslgEngine.model.action.ActionUpdate,
				'ActionVariable' : jslgEngine.model.action.ActionVariable,
				'ActionJSlgMessage' : jslgEngine.model.action.ActionJSlgMessage,
				'ActionJSlgMove' : jslgEngine.model.action.ActionJSlgMove,
				'ActionJSlgScroll' : jslgEngine.model.action.ActionJSlgScroll,
				'ActionJSlgMenu' : jslgEngine.model.action.ActionJSlgMenu,
				'ActionJSlgUpdateArea' : jslgEngine.model.action.ActionJSlgUpdateArea,
				'ActionJSlgText' : jslgEngine.model.action.ActionJSlgText,
				'ActionJSlgProfile' : jslgEngine.model.action.ActionJSlgProfile,
				'ActionJSlgEffect' : jslgEngine.model.action.ActionJSlgEffect,
				'Status' : jslgEngine.model.common.JSlgElementStatus,
				'Stage' : jslgEngine.model.stage.Stage,
				'Ground' : isThree ? jslgEngine.model.stage.XGround : jslgEngine.model.stage.Ground,
				'Cast' : isThree ? jslgEngine.model.stage.XCast : jslgEngine.model.stage.Cast,
				'Item' : jslgEngine.model.stage.Item,
				'Mind' : jslgEngine.model.mind.Mind,
				'LocalRegion' : jslgEngine.model.area.LocalRegion
			}
		};
		
		self._sources = {
			'Stage' : jslgEngine.model.stage.StageFrame,
			'Ground' : isThree ? jslgEngine.model.stage.XGroundFrame : jslgEngine.model.stage.GroundFrame,
			'Cast' : isThree ? jslgEngine.model.stage.XCastFrame : jslgEngine.model.stage.CastFrame,
			'Item' : jslgEngine.model.stage.ItemFrame,
			'Mind' : jslgEngine.model.mind.MindFrame,
		};
	};

	/**
	 * 生成可能なモデル
	 *
	 * @name _models
	 * @property
	 * @type String[]
	 * @memberOf jslgEngine.model.logic.Converter#
	 **/
	p._models = null;

	/**
	 * 生成元の存在するモデル
	 *
	 * @name _sources
	 * @property
	 * @type String[]
	 * @memberOf jslgEngine.model.logic.Converter#
	 **/
	p._sources = null;

	/**
	 * 外部へ作成可能な要素の情報を提供する。
	 *
	 * @name getElementInformation
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.logic.Converter#
	 * @param {JSON} options
	 **/
	p.getElementInformation = function(connector, options) {
        var self = this;
        var result = [];
        var list = self._models.generics;
        
        for(var key in list) {
            var obj = list[key];
            var className = obj.prototype.className;
            result.push({
                className : obj.prototype.className,
                hasSize : obj.prototype.hasSize,
                hasLocation : obj.prototype.hasLocation
            });
        }
        return result;
	};
    
	/**
	 * 文字列からインスタンスを返す
	 *
	 * @name _getFrames
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.logic.Converter#
	 * @param {JSON} options
	 **/
	p._getFrames = function(connector, options) {
		var self = this;
		var frames = [];
		var frameNames = self._models.frames;
		for(var key in frameNames) {
			options.mainController.findElements(connector, {
				className : key
			}, options);
			connector.connects(function(connector_s, result_s) {
				var elements = result_s;
				
				frames = frames.concat(elements);
			});
		}
		connector.pipe(function(connector_s, result_s) {
			connector_s.resolve(frames);
		});
	};

	/**
	 * 文字列からインスタンスを返す
	 *
	 * @name _getCommands
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.logic.Converter#
	 * @param {JSON} options
	 **/
	p._getCommands = function(connector, options) {
		options.mainController.findElements(connector, {
			className : 'Command'
		}, options);
	};
	
	/**
	 * 文字列からインスタンスを返す
	 *
	 * @name getFromTextOfXml
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.logic.Converter#
	 * @param {JSON} options
	 **/
	p.getFromTextOfXml = function(connector, text, options) {
		var self = this;
		
		var element;
		var frames;
		self._getFrames(connector, options);
		connector.connects(function(connector_s, result_s) {
			frames = result_s;
		});
		var commands;
		self._getCommands(connector, options);
		connector.connects(function(connector_s, result_s) {
			commands = result_s;
			
			var createdElements = frames.concat(commands);
			
			var parser = new DOMParser();
			var xmlDoc;
			xmlDoc = parser.parseFromString(text.replace(/>[ |\t|\r|\n]*</g, "><"),
					"text/xml");
			
			element = self.getElementsFromXmlDocument(
			{
				data : xmlDoc.firstChild,
				element : null,
				createdElements : createdElements,
				mainController : options.mainController
			});
		});
		connector.pipe(function(connector_s, result_s) {
			connector_s.resolve(element);
		});
	};
	
	/**
	 * 文字列からインスタンスを返す
	 *
	 * @name getModel
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.logic.Converter#
	 * @param {JSON} options
	 * <ul>
	 * <li>{String} type SLG要素の型</li>
	 * <li>{String} key SLG要素のキー</li>
	 * </ul>
	 **/
	p.getModel = function(data, options) {
		var self = this;
		var models = self._models;
		var sources = self._sources;
		
		var property = data.property;
		
		if(models.frames[property.className]) {
			var frame;
			var factory = models.frames[property.className];

			if(factory) {
				frame = new factory(property, options);
				data.createdElements.push(frame);
			}
			return frame;
		} else if(property.className === "Resource") {
			var resource = new jslgEngine.model.common.ResourceElement(property, options);
			data.createdElements.push(resource);
            
            //TODO: 返すべきか。
            return resource;
		} else if(models.generics[property.className]) {
			var sourceFrame;
			
			var factory = models.generics[property.className];
			var sourceType = sources[property.className];
			var sourceFrame = self._getElementFromCreations(property.source, sourceType, data.createdElements);
			
			if(sourceFrame) {
				return sourceFrame.generate(property, options);
			} else if(factory) {
				return new factory(property, options);
			}
		}
		return null;
	};
		
	/**
	 * 要素の取得
	 * TODO: 使う必要ないかも
	 *
	 * @name _getElementFromCreations
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.logic.Converter#
	 * @param {JSON} options
	 * <ul>
	 * </ul>
	 **/
	p._getElementFromCreations = function(key, type, elements) {
		if(!type) return false;
		
		for(var i = 0; i < elements.length; i++) {
			var element =  elements[i];

			if(element.getKey() === key && element instanceof type) {
				return element;
			}
		}
		return false;
	};
	
	/**
	 * 要素の取得
	 * TODO: 使う必要ないかも
	 *
	 * @name getElements
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.logic.Converter#
	 * @param {JSON} options
	 * <ul>
	 * </ul>
	 **/
	p.getElements = function(path, obj, options) {
		var self = this;
		var list = [];
		var pathIndex = path.indexOf('.');
		var key;
		if(pathIndex == -1) {
			key = path.substring(0);
		} else {
			key = path.substring(0, pathIndex);
		}

		var length = list.length;
		for(var i = 0; i < length; i++) {
			var before = list[i];

			var element = before.getChild({
				key : key
			});
			
			list.push(element);
		}

		list = list.concat(self.getElement(path.substring(pathIndex+1), options));
		return list;
	};

	/**
	 * SLG要素のマッピング
	 *
	 * @name map
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.logic.Converter#
	 * @param {JSON} options
	 * <ul>
	 *
	 * </ul>
	 **/
	p.map = function(options) {
		var self = this;
		var obj;
		var mainController = options.mainController;
		var child;
		var createdElements = [];

		if(options.data instanceof window.XMLDocument) {
			obj = self.getElementsFromXmlDocument({
				data : options.data.firstChild,
				element : null,
				createdElements : createdElements,
				mainController : options.mainController
			});
		} else {
			obj = self.getElementsFromJson({
				data : options.data,
				element : null,
				createdElements : createdElements,
				mainController : options.mainController
			});
		}

		mainController.getWorldRegion().addChild({
			obj : obj
		}, options);
		
		var resources = [];
		for(var i = 0; i < createdElements.length; i++) {
			var element = createdElements[i];
			if(element.className === 'Resource') {
				resources.push(element);
			}
		}
		
		mainController.addResourceElements({
			resources : resources
		});
	};

	/**
	 * SLG要素をJSONから作成し、返す
	 *
	 * @name getElementsFromJson
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.logic.Converter#
	 * @param {JSON} options
	 * <ul>
	 *
	 * </ul>
	 **/
	p.getElementsFromJson = function(options) {
		var self = this;
		var frames = [];
		var obj;

		var data = options.data;
		data.parent = options.element;
		data.mainController = options.mainController;

		//TODO: arguments must be changed parameters
		data.arguments = data.parameters||data.arguments;
		
		obj = self.getModel({
			property : data,
			createdElements : options.createdElements,
		}, options);

		if(data.children) {
			var elementsLength = data.children.length;
			for(var j = 0; j < elementsLength; j++) {
				var element = data.children[j];
	
				var child = self.getElementsFromJson({
					data : element,
					element : obj,
					createdElements : options.createdElements,
					mainController : options.mainController
				});
	
                if(!child) continue;
			
				obj.addChild({
					obj : child
				}, options);
			}
		}

		return obj;
	};

	/**
	 * SLG要素をXmlDocumentから作成し、返す
	 * 前提条件：要素生成前にFrameはあらかじめ定義されていなければならない。
	 *
	 * @name getElementsFromXmlDocument
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.logic.Converter#
	 * @param {JSON} options
	 * <ul>
	 *
	 * </ul>
	 **/
	p.getElementsFromXmlDocument = function(options) {
		var self = this;
		var frames = [];
		var node = options.data;
		var obj;

		var property = {};
		var arguments = [];
		var children = [];

		var childNodes = node.childNodes;
		var length = childNodes.length;
		for(var i = 0; i < length; i++) {
			var childNode = childNodes[i];

			switch(childNode.nodeName) {
				case 'value': {
					property[childNode.nodeName] = self._getArrayOfArguments(childNode, true);
					break;
				}
				case 'location': {
					var x, y, z;
					var locationNodes = childNode.childNodes;
					var locationLength = locationNodes.length;
					for(var j = 0; j < locationLength; j++) {
						var locationNode = locationNodes[j];
	
						switch(locationNode.nodeName) {
							case 'x': {
								x = parseInt(locationNode.textContent);
								break;
							}
							case 'y': {
								y = parseInt(locationNode.textContent);
								break;
							}
							case 'z': {
								z = parseInt(locationNode.textContent);
								break;
							}
							default: {
								break;
							}
						}
					}
					var argument = new jslgEngine.model.area.Location({x:x,y:y,z:z});
					property[childNode.nodeName] = argument;
					break;
				}
				case 'size': {
					var width, height, depth;
					var locationNodes = childNode.childNodes;
					var locationLength = locationNodes.length;
					for(var j = 0; j < locationLength; j++) {
						var locationNode = locationNodes[j];
	
						switch(locationNode.nodeName) {
							case 'width': {
								width = parseInt(locationNode.textContent);
								break;
							}
							case 'height': {
								height = parseInt(locationNode.textContent);
								break;
							}
							case 'depth': {
								depth = parseInt(locationNode.textContent);
								break;
							}
							default: {
								break;
							}
						}
					}
					var argument = new jslgEngine.model.area.Size({width : width, height : height, depth : depth});
					property[childNode.nodeName] = argument;
					break;
				}
				case 'argument': {
					arguments.push(self._getArrayOfArguments(childNode));
					//arguments.push(childNode.textContent);
					break;
				}
				case 'element': {
					children.push(childNode);
					break;
				}
				default: {
					property[childNode.nodeName] = self._getArrayOfArguments(childNode, true);
					//property[childNode.nodeName] = childNode.textContent;
					break;
				}
			}
		}
		
		property.arguments = arguments;
		property.parent = options.element;
		property.mainController = options.mainController;

		obj = self.getModel({
			property : property,
			createdElements : options.createdElements
		}, options);

		var passingResult = null;

		children.reverse();
		while(childNode = children.pop()) {
			var child = self.getElementsFromXmlDocument({
					data : childNode,
					element : obj,
					createdElements : options.createdElements,
					mainController : options.mainController
			});
			
			if(!child) continue;
			
			if(passingResult && child.className === 'CommandBlockElseIF') {
				child.setPassingResult(passingResult);
			} else if(child.className === 'CommandBlockIF') {
				passingResult = {
					id : options.mainController.getUniqueId(),
					result : false
				};
				child.setPassingResult(passingResult);
			} else {
				passingResult = null;
			}
			
			obj.addChild({
				obj : child
			}, options);
		}

		return obj;
	};
	
	
	/**
	 * 文字列を配列化する
	 * TODO: どこかへ移動すべき
	 *
	 * @name getArrayOfElement
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.logic.Converter#
	 * @param line コード
	 * @param nest 深度
	 * @returns {Object[]} 配列化された要素
	 */
	p._getArrayOfArguments = function(node, is_argument) {
		var self = this;
		var nodeName = is_argument ? 'argument' : node.nodeName;
		var result;
		
		switch(nodeName) {
		case 'argument':
			var list = [];
			var childNodes = node.childNodes;
			var length = childNodes.length;
			var hasArguments = false;
			
			result = [];
			for(var i = 0; i < length; i++) {
				var childNode = childNodes[i];
				var args = self._getArrayOfArguments(childNode);
				if(childNode.nodeName === 'argument') {
					hasArguments = true;
				}
				result.push(args);
			}
			if(result instanceof Array && result.length === 1 &&
				typeof(result[0]) !== 'object' && !hasArguments) {
				result = result[0];
			}
			break;
		default:
			result = isNaN(node.textContent) ? node.textContent : parseInt(node.textContent);
			
			break;
		}
		return result;
	};
	
	o.Converter = Converter;
}());