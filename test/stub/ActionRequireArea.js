/*
 * @author cuckoo99
 */

(function() {
	var o = this.jslgEngine = this.jslgEngine||{};
	o = (o.mock = o.mock||{});
	
	var ActionRequireArea = jslgEngine.extend(
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
	var p = ActionRequireArea.prototype;

	p.className = 'ActionRequireArea';

	p._wasDone = false;

	p.dispose = function() {
	};

	p.find = function(connector, data, options) {
	}

	p.run = function(connector, data, options) {
		jslgEngine.log('Called StubActionRequireArea Run Method');
		this._wasDone = true;
		
		var localElements = data.localElements ? data.localElements : {};
		if(localElements[jslgEngine.model.logic.keys.PENDING]) {
			var variable = new jslgEngine.model.common.JSlgElementVariable({
				key : '$PENDING'
			}, options);
			var pending = new jslgEngine.model.issue.PendingCommand({
				key : 'obj'
			}, options);
			variable.addChild({
				obj : pending
			}, options);
			localElements[jslgEngine.model.logic.keys.PENDING] = variable;
		}
	};

	p.restore = function(connector, data, options) {
		jslgEngine.log('Called StubActionRequireArea Restore Method');
		this._wasDone = false;
	};

	p.run$ = function(connector, data, options) {
		jslgEngine.log('Called StubActionRequireArea Run$ Method');
		this._wasDone = true;
		connector.resolve();
	};

	p.restore$ = function(connector, data, options) {
		jslgEngine.log('Called StubActionRequireArea Restore$ Method');
		this._wasDone = false;
		connector.resolve();
	};

	p.setup = function(data, options) {
	};

	p.wasDone = function() {
		return this._wasDone;
	};

	p.review = function(result, data, options) {};

	o.ActionRequireArea = ActionRequireArea;
}());
