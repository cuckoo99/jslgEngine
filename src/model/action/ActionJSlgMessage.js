/*
 * @author cuckoo99
 */

(function() {
	// namespace:
	var o = this.jslgEngine = this.jslgEngine||{};
	o = (o.model = o.model||{});
	o = (o.action = o.action||{});

	/**
	 * <h4>コード処理・メッセージクラス（SLG固有要素）</h4>
	 * <p>
	 * メッセージを呼び出す。<br />
	 * また未解決の選択要素を追加する。<br />
	 * </p>
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
	 * クラス名
	 *
	 * @name className
	 * @property
	 * @type String
	 * @memberOf jslgEngine.model.action.ActionJSlgMessage#
	 **/
	p.className = 'ActionJSlgMessage';

	/**
	 * 非同期かどうか
	 *
	 * @private
	 * @name _isAsync
	 * @property
	 * @type Boolean
	 * @memberOf jslgEngine.model.action.ActionJSlgMessage#
	 **/
	p._isAsync = true;

	/**
	 * 実行
	 *
	 * @name run
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.action.ActionJSlgMessage#
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
		connector.connects(function(connector_s, result_s) {
			var message = result_s[0].value;
			var property = result_s[1];
			var imageData = property[0];
			var selection = property[1];
			
			//メッセージをアニメーションで表示する。
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
			imageData = {
				key : imageData[0].value,
				width : imageData[1].value,
				height : imageData[2].value
			};
			var selectionName = jslgEngine.ui.keys.MESSAGE_BOARD_SELECTION;
			for(var i = 0; i < selection.length; i++) {
				selection[i] = {
					key : selectionName+i,
					text : selection[i].value
				};
			}
			
			settings.push({
				message : message,
				imageData : imageData,
				selection : selection
			});
			
			requiredMessage = new jslgEngine.model.issue.RequiredMessage({
				settings : settings
			}, options);
			requiredMessage.makeMessageElement(connector, selection, data, options);
			
		});
		region.findElements(connector, {
			key : [pendingVariableKey,pendingKey].join(jslgEngine.config.elementSeparator)
		}, options);
		connector.connects(function(connector_s, result_s) {
			pendingCommand = result_s[0]||new jslgEngine.model.issue.PendingCommand({
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
	 * リストア
	 *
	 * @name restore
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.action.ActionJSlgMessage#
	 * @param {Object} options
	 */
	p.restore = function(connector, data, options) {
		var self = this;

		if(!self.isReadyToRestore(connector, options)) return;
	};


	/**
	 * 展開する
	 *
	 * @name expand
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.action.ActionJSlgMessage#
	 * @param {Object} options
	 * <ul>
	 * <li>{jslgEngine.controller.IconController} iconController</li>
	 * <li>{jslgEngine.controller.mainController} mainController</li>
	 * </ul>
	 */
	p.expand = function(options) {};

	o.ActionJSlgMessage = ActionJSlgMessage;
}());
