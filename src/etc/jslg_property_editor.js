(function($) {
	
	// private
	var jslgElementPropertyEditor = {
		accessor : jslgEngine.jslgModelAccessor,
        converter : null,
		tmplPropertiesOptions : $.extend({
			getSelection : function(type) {
                var propertyModel = ActionProperty();
				return propertyModel.prototype.getActionData.call(propertyModel, type, true);
			},
			getSelectionItem : function(type) {
                var propertyModel = ActionProperty();
				var selectionData = propertyModel.prototype.getActionData.call(propertyModel, type, false);
				selectionData = selectionData ? selectionData : {
					hasChild : false,
					hasParameters : false,
					isEmpty : true
				};
				return selectionData;
			},
			getObjectParameters : function(element) {
				var parameters = jslgEngine.jslgModelAccessor.getParameters(element);
				parameters = jslgElementPropertyEditor.convertArrayToObject(parameters);
				return parameters;
			},
			getConvertedObject : function(element) {
				var obj = jslgElementPropertyEditor.convertArrayToObject(element);
				return obj;
			}
		}, jslgEngine.jslgModelAccessor),	
		build : function($self, data) {
			var self = this;
			
			var elementType = data.className;
			var name = self.accessor.getKey(data);
			var properties = self.accessor.getChildren(data);
			
			properties = [];
            //パラメータの取得
            var propertyObject = ArrayProperty();
            var parameters = propertyObject.prototype.getTargets.call(propertyObject, data);
			if(parameters) {
				parameters = self.convertArrayToObject(parameters);
				
				properties.push({
					name : 'パラメータ',
					templateId : "#tmpl_array_editor",
					data : [parameters],
					additionalClass : 'array_property'
				});
			}
            var propertyObject = StatusProperty();
            var status = propertyObject.prototype.getTargets.call(propertyObject, data);
			if(status.length) {
				//self.convertAllParametersToObject('value', status);
				
				properties.push({
					name : 'ステータス',
					templateId : "#tmpl_status_wrapper_editor",
					data : [status],
					additionalClass : 'status_property'
				});
			}
            var propertyObject = ActionProperty();
            var actions = propertyObject.prototype.getTargets.call(propertyObject, data);
			if(propertyObject.prototype.hasPermittionToEdit(data)) {
				self.convertAllParametersToObject('parameters', actions);
				
				properties.push({
					name : 'アクション',
					templateId : "#tmpl_action_wrapper_editor",
					data : [actions],
					additionalClass : 'action_property'
				});
			}
			
			$('#tmpl_property_editor').tmpl({
				name : name,
				properties : properties
			}).appendTo($self);
			
			for(var i = 0; i < properties.length; i++) {
				var property = properties[i];
				var $properties = $self.find('.properties');
				$("#tmpl_property_header").tmpl(property, self.tmplPropertiesOptions).appendTo($properties);
			}
			$self.data('data', data);
		},
		convertAllParametersToObject : function(param_key, obj) {
			var self = this;
			var target = obj;

			if(target instanceof Array) {
				for(var i = 0; i < target.length; i++) {
					self.convertAllParametersToObject(param_key, target[i]);
				}
			} else if(typeof(target) === 'object') {
				for(var key in target) {
					if(key === param_key) {
						target[key] = self.convertArrayToObject(target[key]);
					} else {
						self.convertAllParametersToObject(param_key, target[key]);
					}
				}
			}
		},
		getPropertyObject : function($self) {
			
			if($self.hasClass('array_property')) {
				return ArrayProperty();
			} else if($self.hasClass('status_property')) {
				return StatusProperty();
			} else if($self.hasClass('action_property')) {
				return ActionProperty();
			}
			return null;
		},
		toJSON : function($self, data) {
			var self = this;
			//Element type
			var type = $self.find('.element_type').val();
			//Key
			var key = $self.find('.element_name').val();
			
			//Parameters
			var parameters = self.getSubProperties(
				$self.find('.property_head.array_property > ul > li > .property > ul > li'),
				{
					getObject : function($item) {
						var parameter = $item.children('.parameter');
						return {
							value : parameter.find('.parameter_value').val()
						};
					}
				});
			//Status
			var status = self.getSubProperties(
				$self.find('.property_head.status_property > ul > li > .property > ul > li'),
				{
					getObject : function($item) {
						var parameter = $item.children('.parameter');
						var $addition = $item.find('.additional_parameters:first > ul > li > .sub_parameters > ul > li');
						var addition = self.getSubProperties($addition, {
							getObject : function($item) {
								var parameter = $item.children('.parameter');
								return {
									value : parameter.find('.parameter_value').val()
								};
							}
						});
						addition = self.convertObjectToArray(addition);
						return {
							addition : addition,
							key : parameter.find('.parameter_key').val()
						};
					}
				});
			//Action
			var action = self.getSubProperties(
				$self.find('.property_head.action_property > ul > li > .property > ul > li'),
				{
					getObject : function($item) {
						var parameter = $item.children('.parameter');
						var $addition = $item.find('.additional_parameters:first > ul > li > .sub_parameters > ul > li');
						var addition = self.getSubProperties($addition, {
							getObject : function($item) {
								var parameter = $item.children('.parameter');
								return {
									value : parameter.find('.parameter_value').val()
								};
							}
						});
						addition = self.convertObjectToArray(addition);
						return {
							addition : addition,
							type : parameter.find('.parameter_in select').val()
						};
					}
				});
			return {
				type : type,
				name : key,
				properties : {
					parameters : parameters,
					status : status,
					action : action
				}
			};
		},
		getSubProperties : function($self, data) {
			var self = this;
			var obj = {};
			obj.children = [];
			$self.each(function() {
				var targetChildren = $(this).children('.property').children('ul').children('li');
				var child = data.getObject($(this));
				if(targetChildren.size()) {
					child.children = self.getSubProperties(targetChildren, data).children;
				}
				obj.children.push(child);
			});
			return obj;
		},
		convertArrayToObject : function(param) {
			var self = this;
			var obj = {};
			obj.children = [];
			if(param instanceof Array) {
				for(var i = 0; i < param.length; i++) {
					var data = self.convertArrayToObject(param[i]);
					obj.children.push(data);
				}
				return obj;
			} else {
				return {
					value : param
				};
			}
		},
		convertObjectToArray : function(param) {
			var self = this;
			var arr = [];
			if(param instanceof Array) {
				for(var i = 0; i < param.length; i++) {
					var data = self.convertObjectToArray(param[i]);
					arr.push(data);
				}
			} else if(typeof(param) === 'object') {
				if(!param.children) {
					return param.value;
				}
				for(var i = 0; i < param.children.length; i++) {
					var data = self.convertObjectToArray(param.children[i]);
					arr.push(data);
				}
				return arr;
			} else {
				return param;
			}
			return obj;
		},
		updateElement : function($self) {
			var self = this;
			var element = $self.data('data');

            var key = $self.find('.element_name').val();
            
            jslgElementPropertyEditor.accessor.setKey(element, key);
            
			$self.find('.property_head').each(function() {
				var propertyModel = self.getPropertyObject($(this));
                propertyModel.prototype.updateElement($(this), element);
			});
		},
        getActionDataList : function() {
            var result = [];
            var info = this.accessor.converter.getElementInformation();
            for(var i = 0; i < info.length; i++) {
                var className = info[i].className;
                var isAction = className.indexOf('Action');
                if( className.indexOf('CommandBlock') != -1 ||
                    isAction != -1) {
                    info[i].hasChild = isAction != -1 ? false : true;
                    info[i].hasParameters = true;
                    info[i].isSelected = false;
                    info[i].isEmpty = false;
                    result.push(info[i]);
                }
            }
            return result;
        }
	};
	
	$.fn.jslgElementPropertyEditor = function(options){
		return this.each(function() {
        	jslgElementPropertyEditor.build($(this), options);
        });
	};
	
	$(document).on('change', '.element_type', function() {
		// When this editor can be changed type of the element,
		// it would refresh all own properties.
		var target = $(this).closest('.property');
		var property = jslgElementPropertyEditor.getPropertyObject(target);
		
		property.prototype.selectElementType.call(property, $(this));
	});
	$(document).on('click', '.parameter .add', function() {
		// Get Property object.
		var target = $(this).closest('.property');
		var property = jslgElementPropertyEditor.getPropertyObject(target);
		// Add new sub property to this.
		property.prototype.add.apply(null, [$(this)]);
	});
	$(document).on('click', '.parameter .remove', function() {
		// Get Property object.
		var target = $(this).closest('.property');
		var property = jslgElementPropertyEditor.getPropertyObject(target);
		
		// Remove this property clicked.
		property.prototype.remove.apply(null, [$(this)]);
	});
	$(document).on('change', '.parameter_in select', function() {
		// Get Property object.
		// Call change function.
	});
	$(document).on('click', '.update', function() {
		// Get  JSlgPropertyEditor object.
		// When clicked update button,
		// returns changed result to parent jQuery selector.
		var editor = $(this).closest('.frame_form').parent();
		jslgElementPropertyEditor.updateElement(editor);
	});
	$(document).on('click', '.restore', function() {
		// Get Property object.
		// When clicked update button,
		// returns changed result to parent jQuery selector.
		var target = $(this).closest('.frame_form').parent();
		var str = $(this).parent().children('.data').val();
		var obj = JSON.parse(str);
		target.empty();
		methods.build(target, {
			subData : obj
		});
	});
	$(document).on('focus', '.status_property input:not(.parameter_key)', function() {
		var target = $(this).closest('.parameters_list').parent().closest('.parameters_list').find('.parameter_key:first');
		var form = $(this).closest('.frame_form').parent();
        var data = form.data('data');
        var key = target.val();
        
		jslgElementPropertyEditor.accessor.setStatusExportOption(data, key, true);
	});
	
	// -----------------------------------
	// JSlgElementPropertyEditor -
	// it has information about overall properties.
	// -----------------------------------
	var JSlgPropertyEditor = function() {
		var self = this;
		// parent selector.
		
		this.prototype = {
		};
		
	};
	
	// -----------------------------------
	// Property Classes -
	// Let it be put in the editor as different behavior
	// -----------------------------------
	var ArrayProperty = function(data) {
		var self = {};
		self.data = data
		self.prototype = {
			add : function($self, data) {
				var target = $self.closest('.parameters_list');
				var targetParent = target.parent().closest('.parameters_list');

				$('#tmpl_array_editor').tmpl({
				}).appendTo(target.children('.property').children('ul'));
				
				$self.closest('.parameter').children('.parameter_in').hide();
				target.children('.additional_parameters').hide();
			},
			remove : function($self, data) {
				var target = $self.closest('.parameters_list');
				var targetParent = target.parent().closest('.parameters_list');
				
				var currentChildren = $self.closest('.property').children('ul').children('li');
				if(currentChildren.size() <= 1) {
					targetParent.children('.parameter').children('.parameter_in').show();
					targetParent.children('.additional_parameters').show();
				}
				
				target.remove();
			},
			getProperty : function($self, limit) {
                var self = this;
                var $tgt = $self;
                var value = $tgt.find('.parameter:first .parameter_value').val();
                
                if(limit < 0) return null;
                
                var $properties = $tgt.find('.property:first:has(ul li)');
                if($properties.size()) {
                    var result = [];
                    $properties.find('ul:first > li').each(function() {
                        var ret = self.prototype.getProperty.call(self, $(this), limit-1);
                        if(ret) {
                            result.push(ret);
                        }
                    });
                    return result;
                } else {
                    return value;
                }
			},
			hasPermittionToEdit : function(element) {
                return true;
            },
			getTargets : function(element) {
                var self = this;
                
                return jslgElementPropertyEditor.accessor.getParameters(element);
                var status = [];
                var actions = [];
                for(var i = 0; i < properties.length; i++) {
                    var child = properties[i];
                    
                    if(child.className.indexOf('Status') != -1) {
                        status.push(child);
                    } else if(	child.className.indexOf('Action') != -1) {
                        actions.push(child);
                    }
                }
                
			},
			updateElement : function($self, element) {
                var self = this;
				var parameters = self.prototype.getProperty($self, 30);
				
				jslgElementPropertyEditor.accessor.setParameters(element, parameters);
			}
		}
		return self;
	};
	var StatusProperty = function(data) {
		var self = {};
		self.data = data
		self.prototype = {
			build : function() {
				
			},
			add : function($self, data) {
				var target = $self.closest('.parameters_list');
				var targetParent = target.parent().closest('.parameters_list');

				$('#tmpl_status_editor').tmpl({
					key : '',
					value : ''
				}, jslgElementPropertyEditor.tmplPropertiesOptions).appendTo(target.children('.property').children('ul'));
			},
			remove : function($self, data) {
				var target = $self.closest('.parameters_list');
				var targetParent = target.parent().closest('.parameters_list');
				
				target.remove();
			},
			hasPermittionToEdit : function(element) {
                return true;
            },
			getTargets : function(element) {
                var self = this;
                
                var properties = jslgElementPropertyEditor.accessor.getChildren(element);
                var status = [];
                for(var i = 0; i < properties.length; i++) {
                    var child = properties[i];
                    
                    if(child.className.indexOf('Status') != -1) {
                        status.push(child);
                    }
                }
                return status;
			},
			updateElement : function($self, element) {
                jslgElementPropertyEditor.accessor.removeAllStatus(element);
                
				$self.find('.status_property ul:first > li').each(function() {
					var key = $(this).find('.parameter:first .parameter_key').val();
					var value;
					$(this).find('.additional_parameters:first').each(function() {
						var target = $(this);
						var property = jslgElementPropertyEditor.getPropertyObject(target);
						
						value = property.prototype.getProperty.call(property, $(this), 30);
					});
					
					jslgElementPropertyEditor.accessor.setStatus(element, key, value);
				});
				
			}
		};
		return self;
	};
	var ActionProperty = function(data) {
		var self = {};
		self.data = data;
        self.actionData = [{
                className : '',
                hasParameters : false,
                hasChild : false,
                isSelected : true,
                isEmpty : true
            }].concat(jslgElementPropertyEditor.getActionDataList());
		self.prototype = {
			build : function() {
				
			},
			add : function($self, data) {
				var target = $self.closest('.parameters_list');
				var targetParent = target.parent().closest('.parameters_list');

				$('#tmpl_action_editor').tmpl({
					className : ''
				}, jslgElementPropertyEditor.tmplPropertiesOptions).appendTo(target.children('.action_property').children('ul'));
			},
			remove : function($self, data) {
				var target = $self.closest('.parameters_list');
				var targetParent = target.parent().closest('.parameters_list');
				
				target.remove();
			},
			selectElementType : function($self, data) {
				var self = this;
				var target = $self.closest('.parameters_list');
				var targetParent = target.parent().closest('.parameters_list');
				
				var optionTarget = $self.children('option:selected');
				var additionalTargets = target.children('.additional_parameters').children('ul');
				var className = optionTarget.val();
				var actionData = self.prototype.getActionData.call(self, className, false);
				
				if(actionData) {
					var addIcon = $self.closest('.parameter').find('.add');
					if(actionData.hasChild) {
						addIcon.removeClass('invisible');
					} else {
						addIcon.addClass('invisible');
						target.children('.action_property').children('ul').empty();
					}
					
					if(!actionData.hasParameters) {
						additionalTargets.children('li').remove();
					} else if(!additionalTargets.children('li').size()) {
						$('#tmpl_array_editor').tmpl({
						}).appendTo(additionalTargets);
					}
				}
			},
			updateProperty : function($self, element, limit) {
                var self = this;
                var $tgt = $self;
                
                if((limit--) < 0) return null;
                
                var parameters;
                var className = $tgt.find('.parameter:first option:selected').val();
                $tgt.find('.additional_parameters:first:has(li)').each(function() {
                    var target = $(this);
                    var property = jslgElementPropertyEditor.getPropertyObject(target);
                    
				    parameters = property.prototype.getProperty.call(property, $(this), 30);
                });
                
				var element = jslgElementPropertyEditor.accessor.addModel(element, {
                    property : {
                        type : 'Element',
                        className : className,
                        parameters : parameters
                    }
                });
                var $properties = $tgt.find('.action_property:first:has(ul li)');
                if($properties.size()) {
                    result = [];
                    $properties.each(function() {
                        var ret = self.updateProperty($(this), element, limit-1);
                        if(ret) {
                            result.push(ret);
                        }
                    });
                }
			},
			hasPermittionToEdit : function(element) {
                return element.className === 'Command';
            },
			getTargets : function(element) {
                var self = this;
                
                var properties = jslgElementPropertyEditor.accessor.getChildren(element);
                var actions = [];
                for(var i = 0; i < properties.length; i++) {
                    var child = properties[i];
                    
                    var result = self.prototype.getActionData.call(self, child.className);
                    if(result) {
                        actions.push(child);
                    }
                }
                return actions;
			},
			updateElement : function($self, element) {
                var self = this;
                
                jslgElementPropertyEditor.accessor.removeAllActions(element);
                
                var actions = self.updateProperty($self.find('.property:first:has(ul li)'), element, 30);
			},
            getActionData : function(class_name, is_all) {
                var self = this;
                var selection = [];
                var actionData = self.actionData;
    
                for(var i = 0; i < actionData.length; i++) {
                    if(!is_all && class_name !== actionData[i].className) {
                        continue;
                    }
                    
                    selection.push({
                        value : actionData[i].className,
                        hasChild : actionData[i].hasChild,
                        hasParameters : actionData[i].hasParameters,
                        isSelected : class_name === actionData[i].className
                    });
                }
                
                if(!is_all) {
                    return selection[0];
                }
                
                return selection;
            }
		};
		return self;
	};
})(jQuery);
