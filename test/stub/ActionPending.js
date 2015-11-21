/*
 * @author cuckoo99
 */

(function() {
	var o = this.jslgEngine = this.jslgEngine||{};
	o = (o.mock = o.mock||{});
	
	var ActionPending = jslgEngine.extend(
		jslgEngine.mock.Action,
		function(data) {
			var dat = data||{};
			this.run = dat.run||this.run;
			this.className = data.className||this.className;
		}
	);
	
	/**
	 *
	 */
	var p = ActionPending.prototype;

	p.className = 'ActionPending';

	p._wasDone = false;

	p.dispose = function() {
	};

	p.find = function(connector, data, options) {
	}

	p.run = function(connector, data, options) {
		jslgEngine.log('Called StubActionPending Run Method');
		this._wasDone = true;

		
		var localElements = data.localElements ? data.localElements : {};
		
		var pendingVariableKey = jslgEngine.model.logic.keys.PENDING;
		var pendingKey = jslgEngine.model.logic.keys.PEND_OBJ;
		var pendingVariable = localElements[pendingVariableKey];
		if(pendingVariable) {
			var pendingCommand = pendingVariable.getChild({ key : pendingKey });
			jslgEngine.log('Found Pending Object');

			if(data.isTest) {
				data.resolveFunc(connector, pendingCommand, {}, options);
			}
		}
	};

	p.restore = function(connector, data, options) {
		jslgEngine.log('Called StubActionPending Restore Method');
		this._wasDone = false;
	};

	p.run$ = function(connector, data, options) {
		jslgEngine.log('Called StubActionPending Run$ Method');
		this._wasDone = true;
		connector.resolve();
	};

	p.restore$ = function(connector, data, options) {
		jslgEngine.log('Called StubActionPending Restore$ Method');
		this._wasDone = false;
		connector.resolve();
	};

	p.setup = function(data, options) {
	};

	p.wasDone = function() {
		return this._wasDone;
	};

	p.review = function(result, data, options) {};

	o.ActionPending = ActionPending;
}());
