/*
 * @author cuckoo99
 */

(function() {
	// namespace:
	var o = this.jslgEngine = this.jslgEngine||{};
	o = (o.controller = o.controller||{});

	/**
	 * <h4>BackGroundWorker</h4>
	 * <p>
	 * This manages web workers,<br />
     * loads something to take high cost the method as other js files.<br />
	 * </p>
	 * @class
	 * @name BackGroundWorker
	 * @memberOf jslgEngine.controller
	 * @constructor
	 */
	var BackGroundWorker = function(data) {
		this.initialize(data);
	};
	/**
	 *
	 */
	var p = BackGroundWorker.prototype;

	/**
	 * Web workers.
     *
	 * @name _worker
	 * @property
	 * @type Object[]
	 * @memberOf jslgEngine.controller.BackGroundWorker#
	 **/
	p._worker = null;

	/**
	 * File path as default.
     * 
	 * @name _absolutePath
	 * @property
	 * @type String
	 * @memberOf jslgEngine.controller.BackGroundWorker#
	 **/
	p._absolutePath = null;

	/**
	 * Set up
	 *
	 * @name initialize
	 * @method
	 * @function
	 * @memberOf jslgEngine.controller.BackGroundWorker#
	 **/
	p.initialize = function(data) {
		var self = this;
		var absolutePath = data.absolutePath||'';
		absolutePath = [absolutePath,data.url].join('');
		self._absolutePath = absolutePath;
		self._worker = new Worker(absolutePath);
	};

	/**
	 * Add web workers.
	 *
	 * @name add
	 * @method
	 * @function
	 * @memberOf jslgEngine.controller.BackGroundWorker#
	 **/
	p.add = function(data, callback) {
		var self = this;
		var property = data.property||[];
		
		self._worker.onmessage = function(e) {
			var data = e.data;
			
			callback(data);
		};
		self._worker.postMessage(data);
	};

	o.BackGroundWorker = BackGroundWorker;
}());
