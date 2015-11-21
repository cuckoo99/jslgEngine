/*
 * @author cuckoo99
 */

(function() {
	var o = this.jslgEngine = this.jslgEngine||{};
	o = (o.mock = o.mock||{});
	
	var Action = function(data) {
		var dat = data||{};
		this.run = dat.run||this.run;
		this.className = data.className||this.className;
	};
	
	/**
	 *
	 */
	var p = Action.prototype;

	p.className = 'Action';

	p._wasDone = false;

	p.dispose = function() {
	};

	p.find = function(connector, data, options) {
	}

	p.run = function(connector, data, options) {
		jslgEngine.log('Called StubAction Run Method');
		this._wasDone = true;
	};

	p.restore = function(connector, data, options) {
		jslgEngine.log('Called StubAction Restore Method');
		this._wasDone = false;
	};

	p.run$ = function(connector, data, options) {
		jslgEngine.log('Called StubAction Run$ Method');
		this._wasDone = true;
		connector.resolve();
	};

	p.restore$ = function(connector, data, options) {
		jslgEngine.log('Called StubAction Restore$ Method');
		this._wasDone = false;
		connector.resolve();
	};

	p.setup = function(data, options) {
	};

	p.wasDone = function() {
		return this._wasDone;
	};

	p.review = function(result, data, options) {};

	o.Action = Action;
}());
