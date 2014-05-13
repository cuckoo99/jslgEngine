/*
 * @author cuckoo99
 */

(function() {
	// namespace:
	var o = this.jslgEngine = this.jslgEngine||{};
	o = (o.stub = o.stub||{});

	var Action = function(options) {
        var opts = options||{};
        //this.initialize(options);
        this.run = opts.run||this.run;
    };
	/**
	 *
	 */
	var p = Action.prototype;
	
	p.className = 'Action';

	p._wasDone = false;
    
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
