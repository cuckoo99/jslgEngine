/*
 * @author cuckoo99
 */

(function() {
	// namespace:
	var o = this.jslgEngine = this.jslgEngine||{};
	o = (o.model = o.model||{});
	o = (o.action = o.action||{});

	/**
	 * <h4>ActionJSlgMessage</h4>
	 * <p>
	 * This shows the message to canvas.<br />
     * It accepts following parameters
	 * </p>
     * <ul>
     * <li>Messages[]
     *  <ul>
     *  <li>Text</li>
     *  <li>ImageData
     *   <ul>
     *   <li>FilePath</li>
     *   <li>Width</li>
     *   <li>Height</li>
     *   </ul>
     *  </li>
     *  <li>Selection[]
     *   <ul>
     *   <li>Text</li>
     *   </ul>
     *  </li>
     *  </ul>
     * </li>
     * </ul>
	 * @class
	 * @name ActionJSlgMessage
	 * @memberOf jslgEngine.model.action
	 * @constructor
	 */
	var ActionJSlgMessage = jslgEngine.extend(
		jslgEngine.model.action.ActionBase,
		function(options) {
			this.initialize(options);
		}
	);
	/**
	 *
	 */
	var p = ActionJSlgMessage.prototype;
	
	/**
	 * Class name
	 *
	 * @name className
	 * @property
	 * @type String
	 * @memberOf jslgEngine.model.action.ActionJSlgMessage#
	 **/
	p.className = 'ActionJSlgMessage';

	/**
	 * As if async function
	 *
	 * @private
	 * @name _isAsync
	 * @property
	 * @type Boolean
	 * @memberOf jslgEngine.model.action.ActionJSlgMessage#
	 **/
	p._isAsync = true;

	/**
	 * Fire this program.
	 *
	 * @name run$
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.action.ActionJSlgMessage#
	 * @param {jslgEngine.model.network.ConnectorBase} connector
	 * @param {Object} data
	 * @param {Object} options
	 */
	p.run$ = function(connector, data, options) {
		var self = this;

		if(!self.isReadyToRun(connector, options)) return;
		
		connector.resolve();
		
		var requiredMessage;
		var region = options.mainController.getWorldRegion();
		var settings = [];
		
		var pendingVariableKey = jslgEngine.model.logic.keys.PENDING;
		var pendingKey = jslgEngine.model.logic.keys.PEND_OBJ;
		
		self._readAllElements(connector, data, options);
		connector.pipe(function(connector_s, result_s) {
            self.validate(connector_s, {
                parameters : result_s
            }, options);
        });
		connector.connects(function(connector_s, result_s) {
            var messages = result_s;
            
			var groupName = 'message';
			if(!data.isTest) {
				var removeKeys = options.iconController.getKeysByGroup(groupName);
			
				if(removeKeys.length > 0) {
					for(var i = 0; i < removeKeys.length; i++) {
						// 現在のメッセージを優先して表示
						options.mainController.ticker.addAnimation({
							key : removeKeys[i],
							fadeType : jslgEngine.model.animation.keys.fadeType.FADE_OUT,
							group : groupName
						}, options);
					}
					connector_s.pipe(function(connector_ss) {
						options.mainController.ticker.addAnimationGroup({
							key : groupName+'Group',
							groupKeys : removeKeys,
							callback : function() {
								for(var i = 0; i < removeKeys.length; i++) {
									options.iconController.remove({
										key : removeKeys[i]
									});
								}
								connector_ss.resolve();
							}
						}, options);
						
						options.mainController.ticker.unlockAnimation();
					});
				}
			}
			
			requiredMessage = new jslgEngine.model.issue.RequiredMessage({
				settings : messages
			}, options);
			//requiredMessage.makeMessageElement(connector, messages[0].selection, data, options);
		});
		region.findElements(connector, {
			key : [pendingVariableKey,pendingKey].join(jslgEngine.config.elementSeparator)
		}, options);
		connector.connects(function(connector_s, result_s) {
            var pendingVariable = data.localElements[pendingVariableKey];
            var pendingCommand = pendingVariable ? pendingVariable.getChild({ key : pendingKey }) : null;
			
            pendingCommand = pendingCommand||new jslgEngine.model.issue.PendingCommand({
				key : jslgEngine.model.logic.keys.PEND_OBJ,
				commandKey : options.commandKey,
				callback : function() {
				}
			}, options);
			pendingCommand.addIssue(requiredMessage);
			
			var variable = new jslgEngine.model.common.JSlgElementVariable({
				key : pendingVariableKey,
				isArray : true
			}, options);
			variable.addChild({
				obj : pendingCommand
			}, options);
			self.setLocalElement(connector_s, pendingVariableKey, variable, data, options);
		});
	};

	/**
	 * Restore data before running.
	 *
	 * @name restore
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.action.ActionJSlgMessage#
	 * @param {jslgEngine.model.network.ConnectorBase} connector
	 * @param {Object} data
	 * @param {Object} options
	 */
	p.restore = function(connector, data, options) {
		var self = this;

		if(!self.isReadyToRestore(connector, options)) return;
	};

	/**
	 * Validates parameters, and returns reformatted parameters.
	 *
	 * @name validate
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.action.ActionJSlgMessage#
	 * @param {jslgEngine.model.network.ConnectorBase} connector
	 * @param {Object} data
	 * @param {Object} options
	 */
	p.validate = function(connector, data, options) {
		var self = this;

        var messages = data.parameters;
        var result = [];
        
        for(var i = 0; i < messages.length; i++) {
            var message = messages[i];
            var text = message[0].value;
            var imageData = message[1];
            var selection = message[2];
            
            if(imageData && imageData.length) {
                imageData = {
                    key : imageData[0].value,
                    regX : imageData[1].value,
                    regY : imageData[2].value,
                    width : imageData[3].value,
                    height : imageData[4].value
                };
            } else {
                imageData = null;
            }
            
            var selectionName = jslgEngine.ui.keys.MESSAGE_BOARD_SELECTION;
            if(selection) {
                if(selection.value) {
                    selection = [selection];
                }
                for(var j = 0; j < selection.length; j++) {
                    selection[j] = {
                        key : selectionName+j,
                        text : selection[j].value
                    };
                }
            } else {
                selection = [{
                    key : selectionName+0,
                    text : 'OK'
                }];
            }
            result.push({
                message : text,
                imageData : imageData,
                selection : selection
            });
        }
        connector.resolve(result);
	};

	o.ActionJSlgMessage = ActionJSlgMessage;
}());
