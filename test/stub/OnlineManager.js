/*
 * @author cuckoo99
 */

(function() {
	// namespace:
	var o = this.jslgEngine = this.jslgEngine||{};
	o = (o.stub = o.stub||{});

	/**
	 * <p>
	 * this class is abstact.<br />
	 * it includes graphical objects managed.<br />
	 * </p>
	 * @class
	 * @name OnlineManager
	 * @memberOf jslgEngine.controller
	 * @constructor
	 */
	var OnlineManager = function(options) {
		this.initialize(options);
	};
	/**
	 *
	 */
	var p = OnlineManager.prototype;

	p.initialize = function(options) {
		var self = this;
	};

	p.url =  'http:localhost:8888/home/games/';

	p.userAlias =  'w1.r1';

	p.isOnline = false;

	p.changeNetworkingMode = function(connector, data, options) {
		var self = this;

		self.isOnline = data.isOnline;

		self.fetchElements(connector, data, options);
	};

	/**
	 * send request to update elements on the client.
	 * 
	 * @name fetchElements
	 * @method
	 * @function
	 * @memberOf jslgEngine.controller.OnlineManager#
	 * @param {Object} options
	 **/
	p.fetchElements = function(connector, data, options) {
		jslgEngine.log('called fetch elements');
	};

	/**
	 * send request to update elements on the client.
	 * 
	 * @name fetchElements
	 * @method
	 * @function
	 * @memberOf jslgEngine.controller.OnlineManager#
	 * @param {Object} options
	 **/
	p.run = function(connector, data, options) {
	};

	/**
	 * sort elements by lowest dependence.
	 * 
	 * @name attachElements
	 * @method
	 * @function
	 * @memberOf jslgEngine.controller.OnlineManager#
	 * @param {Object} options
	 **/
	p.sortElements = function(a, b) {	
	};

	/**
	 * merge existing elements between client and arguments.
	 * 
	 * @name attachElements
	 * @method
	 * @function
	 * @memberOf jslgEngine.controller.OnlineManager#
	 * @param {Object} options
	 **/
	p.attachElements = function(connector, elements, options) {
	};

	o.OnlineManager = OnlineManager;
}());
