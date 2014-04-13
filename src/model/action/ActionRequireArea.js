/*
 * @author cuckoo99
 */

(function() {
	// namespace:
	var o = this.jslgEngine = this.jslgEngine||{};
	o = (o.model = o.model||{});
	o = (o.action = o.action||{});

	/**
	 * <h4>コード処理・範囲要求クラス</h4>
	 * <p>
	 * 未解決の範囲選択要素を追加する。<br />
	 * この要素はPendingによって入力待機状態のうちに、<br />
	 * 座標を持つ要素で解決しなければならない。<br />
	 * </p>
	 * @class
	 * @name ActionRequireArea
	 * @memberOf jslgEngine.model.action
	 * @constructor
	 */
	var ActionRequireArea = jslgEngine.extend(
		jslgEngine.model.action.ActionBase,
		function(options) {
			this.initialize(options);
		}
	);
	/**
	 *
	 */
	var p = ActionRequireArea.prototype;
	
	/**
	 * クラス名
	 *
	 * @name className
	 * @property
	 * @type String
	 * @memberOf jslgEngine.model.action.ActionRequireArea#
	 **/
	p.className = 'ActionRequireArea';

	/**
	 * 実行
	 *
	 * @name run
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.action.ActionRequireArea#
	 * @param {Object} options
	 */
	p.run$ = function(connector, data, options) {
		var self = this;

		if(!self.isReadyToRun(connector, options)) return;
		
		// 引数：（[オフセット]、[[複数選択可能か、量、距離、[適用座標]]...]、内側のマスク領域、[平面座標上の角度,立体座標上の角度]）
		var offset = {}, areaSettings = [];
		var base, arguments, elementClassNames;
		
		var requiredArea;
		var pendingVariableKey = jslgEngine.model.logic.keys.PENDING;
		var pendingKey = jslgEngine.model.logic.keys.PEND_OBJ;
		
		connector.resolve();
		
		self._readAllElements(connector, data, options);
		connector.connects(function(connector_s, result_s) {
			base = result_s[0];
			var arguments = [result_s[1], result_s[2]];
			elementClassNames = result_s[3];
			
			if(arguments === null) {
				jslgEngine.log(self.className + ' has no enough arguments.');
				return;
			}
	
			self._wasDone = true;
			
			if(!arguments[0] instanceof Array || !arguments[0] instanceof Array) {
				jslgEngine.log(self.className + 'has illegal object.');
				return;
			}
			offset.x = arguments[0][0].value;
			offset.y = arguments[0][1].value;
			offset.z = arguments[0][2].value;
			for(var i = 0; i < arguments[1].length; i++) {
				var argument = arguments[1][i];
				var positions = [];
				for(var j = 0; j < argument[3].length; j++) {
					positions.push({
						x : argument[3][j][0].value,
						y : argument[3][j][1].value,
						z : argument[3][j][2].value
					});
				}
				areaSettings.push({
					isMulti : argument[0].value,
					quantity : argument[1].value,
					length : argument[2].value,
					positions : positions,
					maskLength : argument[4].value,
					degrees : {
						theta : argument[5][0].value,
						phi : argument[5][0].value
					}
				});
			}
			
			//選択可能なクラス名
			var names = [];
			if(!elementClassNames) {
				//TODO: Groundに依存するのが難点
				elementClassNames = [{value:'Ground'}];
			} else if(!(elementClassNames instanceof Array)) {
				elementClassNames = [elementClassNames];
			}
			for(var i = 0; i < elementClassNames.length; i++) {
				if(elementClassNames[i] &&
					typeof(elementClassNames[i].value) == 'string') {
					names.push(elementClassNames[i].value);
				}
			}
			
			requiredArea = new jslgEngine.model.issue.RequiredArea({
				offset : offset,
				areaSettings : areaSettings,
				elementClassNames : names
			});
		});
		options.mainController.findElements(connector, {
			key : [pendingVariableKey,pendingKey].join(jslgEngine.config.elementSeparator)
		}, options);
		connector.connects(function(connector_s, result_s) {
			pendingCommand = result_s[0]||new jslgEngine.model.issue.PendingCommand({
				key : jslgEngine.model.logic.keys.PEND_OBJ,
				commandKey : options.commandKey,
				callback : function() {
				}
			}, options);
			
			//var selfElement = self.getSelfElement(connector_s, data, options);
			var selfElement = base;
			
			if(selfElement) {
				//TODO: クラス名は一つのみ対応
				var targetClassName = elementClassNames[0].value;
				var targetApplied = selfElement;
				var limit = 100;
				
				while((targetApplied = targetApplied.getParent(options)) && (limit--) > 0) {
					if(targetApplied.className === targetClassName) {
						if(!targetApplied.getGlobalLocation) break;
						requiredArea.resolve(connector_s, targetApplied, {}, options);
						break;
					}
				}
			} else {
				jslgEngine.log('Not Found Self Element: cound not apply location in RequiredArea');
			}
		}).connects(function(connector_s) {
			pendingCommand.addIssue(requiredArea);
			
			var pendingVariableKey = jslgEngine.model.logic.keys.PENDING;
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
	 * @memberOf jslgEngine.model.action.ActionRequireArea#
	 * @param {Object} options
	 */
	p.restore$ = function(connector, data, options) {
		var self = this;

		if(!self.isReadyToRestore(connector, options)) return;
		
		self._wasDone = false;
		
		connector.resolve();
	};

	o.ActionRequireArea = ActionRequireArea;
}());
