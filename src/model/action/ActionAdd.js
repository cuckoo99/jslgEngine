/*
 * @author cuckoo99
 */

(function() {
	// namespace:
	var o = this.jslgEngine = this.jslgEngine||{};
	o = (o.model = o.model||{});
	o = (o.action = o.action||{});

	/**
	 * <h4>ActionAdd</h4>
	 * <p>
	 * add JSlg element.
	 * </p>
	 * @class
	 * @name ActionAdd
	 * @memberOf jslgEngine.model.action
	 * @constructor
	 */
	var ActionAdd = jslgEngine.extend(
		jslgEngine.model.action.ActionBase,
		function(options) {
			this.initialize(options);
		}
	);
	/**
	 *
	 */
	var p = ActionAdd.prototype;
	
	/**
	 * class name
	 *
	 * @name className
	 * @property
	 * @type String
	 * @memberOf jslgEngine.model.action.ActionAdd#
	 **/
	p.className = 'ActionAdd';

	/**
	 * run
	 *
	 * @name run
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.action.ActionAdd#
	 * @param {jslgEngine.model.network.ConnectorBase} connector
	 * @param {Object} data
	 * @param {Object} options
	 */
	p.run$ = function(connector, data, options) {
		var self = this;
		
		if(!self.isReadyToRun(connector, options)) return;
		
		connector.resolve();
		
		var target, key, addedElement;
		self._readAllElements(connector, data, options);
		connector.connects(function(connector_s, result_s) {
			var target = result_s[0];
			var key = result_s[1];
			var addedElement = result_s[2];
			
			if(target === null || key === null || addedElement === null) {
				jslgEngine.log(self.className + ' has no enough arguments.');
				return;
			}
			
			self._wasDone = true;
			
			target.addChild({
				obj : addedElement.generate({ key : key.value }, options)
			}, options);
			
			self.checkPending(connector, {
				place : target,
				key : key,
				target : addedElement
			}, data, options);
			
			if(!self.runSubCommand(connector, 'onAdd', target, data, options)) {
			}
		});
	};

	/**
	 * restore
	 *
	 * @name restore
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.action.ActionAdd#
	 * @param {jslgEngine.model.network.ConnectorBase} connector
	 * @param {Object} data
	 * @param {Object} options
	 */
	p.restore$ = function(connector, data, options) {
		var self = this;
		
		if(!self.isReadyToRestore(connector, options)) return;
		
		self._wasDone = false;
		
		if(!self.restoreSubCommand(connector, data, options)) {
			connector.resolve();
		}
		//TODO: 副イベントでPendingが発生すると受け取れないので、restoreDataで保持
		self._readAllElements(connector, data, options);
		connector.connects(function(connector_s, result_s) {
			var target = result_s[0];
			var key = result_s[1];
			var addedElement;
		
			if(target === null || addedElement === null) {
				jslgEngine.log(self.className + ' has no enough arguments.');
				return;
			}
		
	        addedElement = target.getChild({
				key : key.value
			});
	
			target.removeChild({
				obj : addedElement
			}, options);
			connector_s.resolve();
		});
	};

	/**
	 * get value for Mind priority.
	 *
	 * @name review
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.action.ActionAdd#
	 * @param {Object} data
	 * @param {Object} options
	 */
	p.review = function(result, data, options) {
		//Mindから得た情報を元に評価を行う
		var reputation = 0;
		
		reputation = result.family.length - result.enemy.length;
		return {
			point : reputation
		};
	};

	o.ActionAdd = ActionAdd;
}());
