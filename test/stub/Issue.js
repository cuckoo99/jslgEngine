/*
 * @author cuckoo99
 */

(function() {
	var o = this.jslgEngine = this.jslgEngine||{};
	o = (o.mock = o.mock||{});
	
	var Issue = function(data) {
		var dat = data||{};
	};
	
	/**
	 *
	 */
	var p = Issue.prototype;

	p.element = null;

	p._wasResolved = false;
	
	p.resolve = function(connector, obj, data, options) {
		jslgEngine.log('Called StubIssue Resolve Method');
		this._wasResolved = true;
		this.element = obj;
	}

	p.apply = function(connector, obj, data, options) {
		jslgEngine.log('Called StubIssue Apply Method');
		this._wasResolved = true;
		this.element = obj;
	};

	p.wasResolved = function() {
		return this._wasResolved;
	};

	p.getAppliedElement = function() {
		return this.element;
	};

	p.getPatterns = function() {
	};

	o.Issue = Issue;
}());
