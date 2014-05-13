/**
 * 2014.4.4
 * 
 */

(function($) {
	
	// Tool window for making a clone of element, and dropping to tool bar to put it in.
	$.fn.draggableJSlgElement = function(options){
		var opts = options||{};
		
		var toolInfo = jslgPicker.getToolItemInfo(opts.className);
		
		$(this).css({
			"position" : 'absolute',
			"left" : opts.position.x,
			"top" : opts.position.y,
            'zIndex' : ($.jslgPicker.zIndex++)
		});
		$('#tmpl_drag_area').tmpl({
			id : jslgPicker.getUniqueId(),
			className : opts.className,
			position : opts.position,
			elements : opts.elements,
            target : opts.target,
            hasAddButton : opts.hasAddButton === undefined || opts.hasAddButton === true ? true : false,
			toolTargetInfo : JSON.stringify({
				key : opts.key,
				parentId : opts.parentWindowId
			})
		}, $.jslgPicker.modelAccessor.accessor).appendTo(this);
		
		$(this).draggable({
			containment : $(this).parent(),
			handle : $(this).find('.header_text'),
            start : function() {
                $(this).css('zIndex', ($.jslgPicker.zIndex++));
            }
		});
        $(this).find('.resize_area').resizable().css({
            overflow:'hidden',
            width:opts.windowSize.width,
            height:opts.windowSize.height
        });
		$(this).find('.content_panel > li > div').draggable({
            helper : 'clone',
            revert: false,
            appendTo: 'body',
			cursorAt : {
				top : 0,
				left : 0
			},
			zIndex : 1000,
		});
		
		var dragModel = DraggableList(opts);
		$(this).find('.tool_area').data('viewModel', dragModel);
		
		jslgPicker.bindElements();
	};
	
	// Tool window receive the element picked up by draggableJSlgElement.
	$.fn.droppableJSlgElement = function(options){
		var opts = options||{};
		
		var toolInfo = jslgPicker.getToolItemInfo(opts.className);
		
		var dropModel = toolInfo.hasSize ? DroppableArea(opts) : DroppableList(opts);
		var viewData = dropModel.prototype.getViewData.apply(dropModel, [$(this), options]);
        
		$(this).css({
			"position" : 'absolute',
			"left" : opts.position.x,
			"top" : opts.position.y,
            'zIndex' : ($.jslgPicker.zIndex++)
		});
		$('#tmpl_drop_area').tmpl(viewData, $.jslgPicker.modelAccessor.accessor).appendTo(this);
		
		$(this).draggable({
			containment : $(this).parent(),
			handle : $(this).find('.header'),
            start : function() {
                $(this).css('zIndex', ($.jslgPicker.zIndex++));
            }
		});
        $(this).find('.resize_area').resizable().css({
            width:opts.windowSize.width,
            height:opts.windowSize.height
        });
		$(this).find('.content').droppable({
			drop: function (event, ui) {
	            var target = $(ui.draggable);
	            
	            //ビューモデルのドロップ処理を行う。
	            var dropModel = $(this).closest('.tool_area').data('viewModel');
	            
				dropModel.prototype.drop.apply(dropModel, [$(this), event, target]);
	        }
		});
		$(this).find('.tool_area').data('viewModel', dropModel);
		
		jslgPicker.bindElements();
		
		dropModel.prototype.update.apply(dropModel, [$(this).find('.content'), true]);
	};
	
	//public
	$.jslgPicker = {
        zIndex : 100,
		loadElements : function(data, callback) {
			var self = this;
			//TODO:
			//read tool bar element data on the server.
			
			//attach elements.
			var elements = sample.elements;
			
			var localRegion = self.modelAccessor.parseModel(data, elements);
			jslgPicker.model = localRegion;
			
			callback();
		},
		// depend on jslgEngine
		modelAccessor : {
			mainController : null,
			workersPath : './src/',
			accessor : $.extend({
				bindWithUniqueId : function(obj) {
					var id = 'e'+jslgPicker.getUniqueId();
					jslgPicker.binds['#'+id] = obj;
					return id;
				},
                isVisible : function(obj) {
                    var key = obj.getKey ? obj.getKey() : null;
					return (key && obj.className !== 'ElementVariable');
				}
			}, jslgEngine.jslgModelAccessor),
			parseModel : function(data, obj, make_root) {
				var mainController = new jslgEngine.controller.MainController({
					workersPath : this.workersPath,
                    fileControllers : data.fileControllers
				});
				var converter = new jslgEngine.model.logic.Converter();
				
				converter.map({
					data : obj,
					mainController : mainController
				});
				
				var localRegion = mainController.getWorldRegion().getChildren()[0];
				this.mainController = mainController;
				
				return localRegion;
			},
			findElements : function(obj, target, callback) {
				//var connector = new jslgEngine.model.network.ConnectorOnline();
				var connector = null;
				var result = jslgPicker.model.findElements(connector, target, {
					mainController : this.mainController
				});
				callback(result);
				// connector.pipe(function(connector_s, result_s) {
					// callback(result_s);
				// });
			},
			generate : function(obj, data) {
				var self = this;
				var generation = obj.generate(data, {
					mainController : self.mainController
				});
                self.disableExportOption(generation);
                return generation;
			},
			disableExportOption : function(target) {
                var self = this;
                var children = target.getChildren();
                
                for(var i = 0; i < children.length; i++) {
                    var child = children[i];
                    self.accessor.setExportOption(child, false);
                    
//                    if(child.className === 'Status') {
//                        self.accessor.setExportStatusOption(target, child.getKey(), false);
//                    }
                }
			},
			addElement : function(target, child) {
				target.addChild({
					obj : child
				});
			},
			removeElement : function(target, child) {
				target.removeChild({
					obj : child
				});
			},
			getResourceElements : function() {
				var region = this.mainController.getWorldRegion();
                
                var resourceElements = (function(tgt) {
                    var res = [];
                    var children = tgt.getChildren();
                    for(var i = 0; i < children.length; i++) {
                        var child = children[i];
                        
                        if(child.getImageData) {
                            var dt = child.getImageData();
                            
                            if(dt.key) {
                                res.push();
                            }
                        }
                    }
                })(region);
                
			},
			getAccessor : function() {
				return this.accessor;
			},
			toXML : function(callback) {
				var region = this.mainController.getWorldRegion();
                var localRegion = this.findElements(region, {
                    className : 'LocalRegion'
                }, function(result) {
                    var xmlText = result[0].toXML();
				
				    callback('<?xml version="1.0" encoding="UTF-8" ?>\n'+xmlText);
                });
			},
		}
	};
	
	// private
	var jslgPicker = {
		idCount : 0,
		model : null,
		binds : [],
		getUniqueId : function() {
			return 'id'+(this.idCount++);
		},
		bindElements : function($self) {
			var elements = [];
			for(var key in this.binds) {
				var target = this.binds[key];
				console.log('bind '+key);
				$(key).data('data', target);
			}
			this.binds = [];
		},
		getModel : function($self) {
			var $tool = $self.closest('.tool_area');
			var info = JSON.parse($tool.find('.tool_target_info').attr('value'));
		},
		getPath : function($self) {
			var $tool = $self.closest('.tool_area');
			var info = JSON.parse($tool.find('.tool_target_info').attr('value'));
			
		},
		toJSON : function($self) {
			var $tool = $self.closest('.tool_area');
			var info = JSON.parse($tool.find('.tool_target_info').attr('value'));
			var parentId = info.viewData.id;
			
			var $parentTool = $('#'+parentId);
			toJSON($parentTool);
		},
		addIcon : function($target, className) {
			var self = this;
			var $tool = $target.closest('.tool_area');
            
            var element = $tool.data('data');
            var toolInfo = jslgPicker.getToolItemInfo(element.className);
            var accepted = false;
            for(var i = 0; i < toolInfo.accept.length; i++) {
                if(toolInfo.accept[i] === className) {
                    accepted = true;
                }
            }
            if(toolInfo.type !== 'Frame' && !accepted) {
                return;
            }
            
            var creation = $.jslgPicker.modelAccessor.accessor.getNewElement({
                property : {
                    key : 'NewElement'+self.getUniqueId(),
                    className : className,
                }
            });
            $.jslgPicker.modelAccessor.addElement(element, creation);
            $.jslgPicker.modelAccessor.accessor.setThumbnail(creation, toolInfo.defaultThumbnail);
            
			var viewModel = $tool.data('viewModel');
			if(viewModel) {
				viewModel.prototype.make.call(viewModel, $tool, $target, creation);
			}
		},
		removeIcon : function($target) {
			var self = this;
			var $tool = $target.closest('.tool_area');
			var viewModel = $tool.data('viewModel');
			if(viewModel) {
				viewModel.prototype.remove.call(viewModel, $tool, $target);
			}
		},
		getElementTemplateData : function($self, info) {
			var target = $self;
            var targetTool = $self.closest('.tool_area');
            
            var targetType = info.mainData.type;
            var toolTargetInfo = JSON.parse(targetTool.find('.tool_target_info').attr('value'));
            var toolInfo = jslgPicker.getToolItemInfo(toolTargetInfo.viewData.type);
			
			var passed = false;
			for(var i = 0; i < toolInfo.accept.length; i++) {
				if(targetType === toolInfo.accept[i]) {
					passed = true;
				}
			}
			if(passed) {
				return toolInfo.template;
			}
			return null;
		},
		showMenu : function(target_id, position, menu_items) {
			var self = this;
			
			//メニューは描画情報なので、描画モデルが格納すべきだが、情報は固定なのでツールモデルが格納する。
			var menuItems = menu_items;
			
			if(menuItems) {
				var toolMenu = $('.tool_menu');
				if(toolMenu) {
					toolMenu.remove();
				}
				
                var items = [];
				for(var i = 0; i < menuItems.length; i++) {
					var menuItem = menuItems[i];
					items.push({
						id : menuItem.value,
                        name : menuItem.name,
                        information : menuItem.name
					});
				}
				$('#tmpl_tool_menu').tmpl({
					items : items,
					targetId : target_id
				}).appendTo($('#container'));
				var toolMenu = $('.tool_menu:last-child');
				toolMenu.css({
					"position" : 'absolute',
					"left" : position.x,
					"top" : position.y,
					'zIndex' : 9999
				});
			}
		},
		getToolItemInfo : function(key) {
			var itemsInformation = toolItemInfo;
			
			for(var i = 0; i < itemsInformation.length; i++) {
				var info = itemsInformation[i];
				if(info.className === key) {
					return info;
				}
			}
			return null;
		},
		checkAcceptedClassName : function(tool_key, key) {
			var toolInfo = this.getToolItemInfo(tool_key);
			
			if(!toolInfo) return false;
			
			for(var i = 0; i < toolInfo.accept.length; i++) {
				var info = toolInfo.accept[i];
				if(info === key) {
					return true;
				}
			}
			return false;
		},
		openPropertyEditor : function($self, position, element) {
			var editTarget = $('<div></div>');
			editTarget.appendTo('#container');
			
			editTarget.draggableJSlgElement({
				className : element.className,
				position : position,
				windowSize : {width:300,height:200},
                hasAddButton : false
			});
			
			var content = editTarget.find('.content .scroll_wrapper');
			
			content.jslgElementPropertyEditor(element);
		},
		edit : function($self, position, element) {
			var self = this;
			
			//プロパティを編集する。要素、親ウィンドウの情報が必要
			var toolInfo = self.getToolItemInfo(element.className);
			
			if(toolInfo) {
				var editTarget = $('<div></div>');
				editTarget.addClass('edit_window');
				editTarget.appendTo('body');
				
                var size = $.jslgPicker.modelAccessor.accessor.getSize(element);
                size = size||{width:1,height:1};
				editTarget.droppableJSlgElement({
					className : element.className,
					position : position,
					size : size,
					windowSize : {width:400,height:200},
					target : element,
					parentWindowId : '',
				});
			}
			
			return null;
		},
		closeToolWindow : function($self) {
			var $tool = $self.closest('.tool_area');
			
			$tool.remove();
		}
	};
	
	// event
	$(document).on('click', '.content.drop canvas', function(e) {
		var $content = $(this).parent();
		var loc = $content.offset();
		
		var $toolWindow = $(this).closest('.tool_area');
		var dropModel = $toolWindow.data('viewModel');
		var items = dropModel.items;
		
		var matched = [];
		
		for(var i = 0; i < items.length; i++) {
			var item = items[i];
			
			var viewData = item;
			var x = loc.left + viewData.x - $content.scrollLeft() - $(window).scrollLeft();
			var y = loc.top + viewData.y - $content.scrollTop() - $(window).scrollTop();
			if(	x < e.clientX &&
				y < e.clientY &&
				x + viewData.width > e.clientX &&
				y + viewData.height > e.clientY) {
				
				matched.push(item);
			}
		}
		if(matched.length <= 0) return;
		var info = matched[0];
		
		var element = $('#'+info.elementId).data('data');
		var toolInfo = jslgPicker.getToolItemInfo(element.className);
		var position = {x : e.clientX + $(window).scrollLeft(), y : e.clientY + $(window).scrollTop()};
		jslgPicker.showMenu(info.elementId, position, toolInfo.menuItems);
	});
	$(document).on('click', '.header_icon.edit', function(e) {
		var element = $(this).closest('.tool_area').data('data');
		jslgPicker.openPropertyEditor($(this), {x:0, y:0}, element);
	});
	$(document).on('click', '.content_panel li:not(".add") div', function(e) {
		var position = {
            x : e.clientX + $(window).scrollLeft(),
            y : e.clientY + $(window).scrollTop()
        };
		var $toolWindow = $(this).closest('.tool_area');
		var target = $(this).closest('.element');
		// 実際の要素を取得して、型を取得する。
		var element = target.data('data');
		var toolInfo = jslgPicker.getToolItemInfo(element.className);
		
		// 型から、ツール情報を取得する。
		jslgPicker.showMenu(target.attr('id'), position, toolInfo.menuItems);
	});
	$(document).on('click', '.content_panel li.add div', function(e) {
		var position = {
            x : e.clientX + $(window).scrollLeft(),
            y : e.clientY + $(window).scrollTop()
        };
		var $tool = $(this).closest('.tool_area');
		var targetWindow = $(this).closest('.tool_area');
		var element = targetWindow.data('data');
        var id = targetWindow.attr('id');
		
		var toolInfo = jslgPicker.getToolItemInfo(element.className);
        
		jslgPicker.showMenu(id, position, toolInfo.addingMenuItems);
	});
	$(document).on('click', '.tool_menu_item', function() {
		var id = $(this).attr('id');
		var menuInfo = $(this).children('.menu_information').val();
		var $target = $('#'+$(this).parent().children('.menu_target_id').attr('value'));
		var element = $target.data('data');
		
		switch(id) {
			case 'edit': {
				jslgPicker.edit($target, {x:0, y:0}, element);
				break;
			}
			case 'remove' : {
				jslgPicker.removeIcon($target);
				break;
			}
			case 'add' : {
				jslgPicker.addIcon($target, menuInfo);
				break;
			}
			default : {
				break;
			}
		}
		$(this).closest('.tool_menu').remove();
	});
	$(document).on('click', '.header_close', function() {
		jslgPicker.closeToolWindow($(this));
	});
	$(document).on('click', '#export_xml', function() {
		var id = '#export';
		$.jslgPicker.modelAccessor.toXML(function(result) {
            var xmlText = result;
            var date = new Date();
            var fileName = ['data',date.getTime(),'.xml'].join('');
            var blob = new Blob([ xmlText ], { "type" : "text/plain" });
    
            if (window.navigator.msSaveBlob) {
                window.navigator.msSaveBlob(blob, 'BlobFile.xml');
            } else {
                var url = window.URL.createObjectURL(blob);
                var $target = $(this);
                $target.attr("href", url);
                //$target.attr("download", fileName);
                //$target.click();
                window.open(url, null);
            }
        });
        return true;
	});
	
	// ------------------------------------------
	// Model of droppableJSlgElement
	// ------------------------------------------
	var DraggableList = function(data) {
		var self = {};
		self.data = data
		self.prototype = {
			getViewData : function($self, data) {},
			make : function($self, $target, creation) {
                $('#tmpl_tool_content').tmpl(creation, $.jslgPicker.modelAccessor.accessor).insertBefore($self.find('.content ul:first > li:last'));
                jslgPicker.bindElements();
			},
			remove : function($self, $target) {
				var $tool = $target.closest('.tool_area');
				var toolElement = $tool.data('data');
				var element = $target.data('data');
                $.jslgPicker.modelAccessor.removeElement(toolElement, element);
                
				$target.remove();
			},
			update: function($self, data) {
			}
		}
		return self;
	};
	var DroppableList = function(data) {
		var self = {};
		self.data = data
		self.prototype = {
			getViewData : function($self, data) {
				var key, children = [];
				if(data.target) {
					key = $.jslgPicker.modelAccessor.accessor.getKey(data.target);
					var chldrn = $.jslgPicker.modelAccessor.accessor.getChildren(data.target);
					for(var i = 0; i < chldrn.length; i++) {
						if(chldrn[i].className !== 'Status' && chldrn[i].elementType !== 'Frame') {
							children.unshift(chldrn[i]);
						}
					}
				}
				
			    return {
					id : jslgPicker.getUniqueId(),
					position : data.position,
					className : data.className,
					elements : data.elements,
					target : data.target,
					windowSize : data.windowSize,
                    hasAddButton : true,
					elements : children,
					toolTargetInfo : JSON.stringify({
						key : key,
						parentId : data.parentWindowId
					})
				};
			},
			make : function($self, $target, creation) {
                $('#tmpl_tool_content').tmpl(creation, $.jslgPicker.modelAccessor.accessor).insertBefore($self.find('.content ul:first > li:last'));
                jslgPicker.bindElements();
			},
			remove : function($self, $target) {
				var $tool = $target.closest('.tool_area');
				var toolElement = $tool.data('data');
				var element = $target.data('data');
                $.jslgPicker.modelAccessor.removeElement(toolElement, element);
				$target.remove();
			},
			drop : function($self, event, target, data) {
				
				var element = $self.closest('.tool_area').data('data');
				var targetElement = target.data('data');
				
				if(!targetElement || !jslgPicker.checkAcceptedClassName(element.className, targetElement.className)) return;
	            
				var creation = $.jslgPicker.modelAccessor.generate(targetElement, {
					key : 'NewElement'+jslgPicker.getUniqueId()
				});
				$.jslgPicker.modelAccessor.addElement(element, creation);
				
				var $clone = target.clone();
				var elementId = jslgPicker.getUniqueId();
				$clone.attr('id', elementId);
                $self.find('.content_panel').append('<li></li>');
            	$clone.appendTo($self.find('.content_panel li:last'))
            	$clone.data('data', creation);
			},
			update: function($self, data) {
			}
		}
		return self;
	};
	var DroppableArea = function(data) {
		var self = {};
		
		// 描画に関する情報のみ格納し、後は実際のモデルに格納する。
		self.elementSize = null;
		self.offset = null;
		self.imageData = {};
		self.items = [];
		self.prototype = {
			initialize : function(data) {
				var self = this;
				var size = data.size;
				self.size = data.size;
				self.elementSize = {
					width : 80,
					height : 80
				};
				var p = self.prototype;
				var ox = 10;
		        var tp = p.getPositionAsAffineTransform(size.width, 0,
		        	self.elementSize.width, self.elementSize.height, ox, 0);
		        var oy = -parseInt(tp.y);
				self.offset = {
					x : ox,
					y : oy
				};
			},
			getViewData : function($self, data) {
				var self = this;
				var p = self.prototype;
				var size = data.size;
				var windowSize = data.size;
				
				var key;
				if(data.target) {
					key = $.jslgPicker.modelAccessor.accessor.getKey(data.target);
				}
				
			    return {
					id : jslgPicker.getUniqueId(),
					position : data.position,
					className : data.className,
					elements : data.elements,
					target : data.target,
					windowSize : data.windowSize,
                    hasAddButton : true,
					area : {
						canvasSize : {
							width : self.offset.x+(self.elementSize.width*size.width),
							height : (self.offset.y*2)
						}
					}
				};
			},
			geItemByLocation : function(location) {
                var self = this;
                var items = self.items;
                for(var i = 0; i < items.length; i++) {
                    var item = items[i];
                    if( item.location.x === location.x &&
                        item.location.y === location.y &&
                        item.location.z === location.z) {
                        return item;
                    }
                }
                return null;
            },
			drop : function($self, event, target, data) {
				var self = this;
				
				var element = $self.closest('.tool_area').data('data');
				var targetElement = target.data('data');
			
	            if(!targetElement || !jslgPicker.checkAcceptedClassName(element.className, targetElement.className)) return;
	            
				var w = self.elementSize.width;
				var h = self.elementSize.height;
				var ox = self.offset.x;
				var oy = self.offset.y;
				
                var $scrollArea = $self.find('.scroll_wrapper');
	            var position = $self.offset();
	            var ePos = {
	            	x : event.clientX - position.left + $scrollArea.scrollLeft() + $(window).scrollLeft(),
	            	y : event.clientY - position.top + $scrollArea.scrollTop() + $(window).scrollTop()
	            }
	            var pos = self.prototype.getPositionAsPlane(ePos.x, ePos.y, w, h, ox, oy);
				var location = {
					x : parseInt(pos.x),
					y : parseInt(pos.y),
					z : 0
				};
                
                if(self.prototype.geItemByLocation.call(self, location)) return;
	            var mPos = self.prototype.getPositionAsAffineTransform(location.x, location.y, w, h, ox, oy);
                
				var param = {
					key : 'NewElement'+jslgPicker.getUniqueId(),
					location : location
				};
				var creation = $.jslgPicker.modelAccessor.generate(targetElement, param);
				$.jslgPicker.modelAccessor.addElement(element, creation);
				
	            var $canvas = $self.find('canvas');
	            var canvas = $canvas[0];
	            var ctx = canvas.getContext('2d');
	            
				self.prototype.addChild.call(self, $self, location, creation);
				
				self.prototype.update.call(self, $self);
			},
			addChild : function($self, location, element) {
				var self = this;
				var id = $self.closest('.tool_area').attr('id');
				var toolElement = $self.closest('.tool_area').data('data');
				var locationKey = [location.x,location.y,0].join('_');
				var imageKey = id+locationKey;
				
				var w = self.elementSize.width;
				var h = self.elementSize.height;
				var ox = self.offset.x;
				var oy = self.offset.y;
	            var mPos = self.prototype.getPositionAsAffineTransform(location.x, location.y, w, h, ox, oy);
				
				var $element = $self.find('.'+locationKey);
				var elementId = $element.attr('id');
				
				var size = $.jslgPicker.modelAccessor.accessor.getSize(toolElement);
				
				var img = new Image();
				img.src = $.jslgPicker.modelAccessor.accessor.getThumbnail(element);
				self.prototype.addImageData.apply(self, [imageKey, img]);
				
				if(!$element.size()) {
					elementId = jslgPicker.getUniqueId();
					$element = $('<div style="display:none"></div>')
					$element.attr('id', elementId);
					$element.addClass(locationKey);
					$element.appendTo($self);
					
					var zIndex = (size.width-location.x)*(location.y+10);
					self.items.push({
						imageKey :imageKey,
						x : mPos.x, y : mPos.y,
						width : w, height : h, zIndex : zIndex,
                        location : location,
						elementId : elementId
					});
				}
				$element.data('data', element);
				
				return elementId;
			},
			orderBySecondDimension : function(w, h, callback) {
				var list = [];
		
				for ( var i = 0; i < w; i++) {
					for ( var j = 0; j < h; j++) {
						var pt = ((w - i) + j) * (w + h) + j;
						list.push([ pt, { x : i, y : j, z : 0} ]);
					}
				}
		
				list.sort(function(a, b) {
					return a[0] - b[0];
				});
		
				for ( var i = 0; i < list.length; i++) {
					callback(list[i][0], list[i][1]);
				}
			},
			getPositionAsAffineTransform : function(x, y, width, height, ox, oy) {
				var imageSize = {
					width : width,
					height : height
				};
				var rad = -Math.PI / 24 * 6.5;
				var round = function(x) {
					return x;
				};
				
				var w = imageSize.width/2;
				var h = imageSize.height/2;
				
				var position = { x : round(w * x * Math.cos(rad)) - 
								round(h * y * Math.sin(rad)) + ox,
						 y : round(w * x * Math.sin(rad)) +
						 		round(h * y * Math.cos(rad)) + oy,
						 z : 0};
				return position;
			},
			getPositionAsPlane : function(x, y, width, height, ox, oy) {
				var imageSize = {
					width : width,
					height : height
				};
				var rad = -Math.PI / 24 * 6.5;
				var round = function(x) {
					return Math.round(x);
				};
				
				var mx = x - ox;
				var my = y - oy;
				var w = imageSize.width/2;
				var h = imageSize.height/2;
				
				var px = (Math.sin(rad) * my + Math.cos(rad) * mx) / w;
				var py = (my - (w * px * Math.sin(rad))) / (h * Math.cos(rad));
				var position = { x : px,
						 y : py,
						 z : 0};
				return position;
			},
			updateChildren : function($self) {
				var self = this;
				var $tool = $self.closest('.tool_area');
				var element = $tool.data('data');
				
				var children = $.jslgPicker.modelAccessor.accessor.getChildren(element);
				for(var i = 0; i < children.length; i++) {
					var location = $.jslgPicker.modelAccessor.accessor.getLocation(children[i]);
					if(location) {
						self.prototype.addChild.call(self, $self, location, children[i]);
					}
				}
			},
			update : function($self, update_children) {
				var self = this;
				var $content = $self;
				var $tool = $self.closest('.tool_area');
				var element = $tool.data('data');
				
				var canvas = $self.find('canvas')[0];
				if(!canvas) return;
				
				if(update_children) {
					self.prototype.updateChildren.call(self, $self);
				}
				
				var size = $.jslgPicker.modelAccessor.accessor.getSize(element);
				var w = self.elementSize.width;
				var h = self.elementSize.height;
				var ox = self.offset.x;
				var oy = self.offset.y;
				
	            var ctx = canvas.getContext('2d');
		        ctx.fillStyle = 'rgb(255, 255, 255)';
				ctx.fillRect(0, 0, canvas.width, canvas.height);
				
				ctx.fillStyle = 'rgb(200, 200, 200)'; // 緑
		        for(var i = 0; i < size.width; i++) {
			        for(var j = 0; j < size.height; j++) {
		        		var p = self.prototype.getPositionAsAffineTransform(i, j, w, h, ox, oy);
			    		ctx.rect(p.x, p.y, w, h);
			        }
		        }
				ctx.stroke();
				var infoSet = self.items;
				var sorted = infoSet.sort(function(a, b) {
					return a.zIndex - b.zIndex;
				});
				for(var i = 0; i < infoSet.length; i++) {
					var viewData = infoSet[i];
					var img = self.imageData[viewData.imageKey];
					
					if(img) {
						ctx.drawImage(img, viewData.x, viewData.y, viewData.width, viewData.height);
					}
				}
			},
			remove : function($self, $target) {
				var self = this;
				var $tool = $target.closest('.tool_area');
				var toolElement = $tool.data('data');
				var element = $target.data('data');
				var id = $target.attr('id');
				for ( var i = 0; i < self.items.length; i++) {
					var item = self.items[i];
					if(item.elementId == id) {
						self.items.splice(i, 1);
						$.jslgPicker.modelAccessor.removeElement(toolElement, element);
						
						$target.remove();
						
						self.prototype.update.call(self, $tool.find('.content'));
						return;
					}
				}
			},
			addImageData : function(key, image) {
				this.imageData[key] = image;
			}
		}
		self.prototype.initialize.apply(self, [data]);
		return self;
	};
	
})(jQuery);

$(function() {
	
});