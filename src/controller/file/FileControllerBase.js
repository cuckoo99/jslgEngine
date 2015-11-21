/*
 * @author cuckoo99
 */

(function() {
	// namespace:
	var o = this.jslgEngine = this.jslgEngine||{};
	o = (o.controller = o.controller||{});

	/**
	 * <h4>FileControllerBase</h4>
	 * <p>
	 * This handles the file,<br />
     * and implements methods to access content loaded.<br />
	 * </p>
	 * @class
	 * @name FileControllerBase
	 * @memberOf jslgEngine.controller
	 * @constructor
	 */
	var FileControllerBase = function() {
		this.initialize();
	};
	/**
	 *
	 */
	var p = FileControllerBase.prototype;

	/**
	 * Access key.
	 * 
	 * @name _key
	 * @property
	 * @type String
	 * @memberOf jslgEngine.controller.FileControllerBase#
	 **/
	p._key = null;

	/**
	 * Reserved objects has key and url to load.
     *
	 * @name _stock
	 * @property
	 * @type Object[]
	 * @memberOf jslgEngine.controller.FileControllerBase#
	 **/
	p._stock = null;

	/**
	 * Loaded contents.
	 *
	 * @name _contents
	 * @property
	 * @type Object[]
	 * @memberOf jslgEngine.controller.FileControllerBase#
	 **/
	p._contents = null;

	/**
	 * Set up
	 *
	 * @name initialize
	 * @method
	 * @function
	 * @memberOf jslgEngine.controller.FileControllerBase#
	 * @param {Object} data
	 **/
	p.initialize = function(data) {
		var self = this;
		//self._key = data ? data.key : '';
		self._contents = [];
		self._stock = [];
	};

	p.removeAll = function() {
		var self = this;
		jslgEngine.dispose(self._contents);
		self.initialize();
	};

	/**
	 * Get key.
	 *
	 * @name initialize
	 * @method
	 * @function
	 * @memberOf jslgEngine.controller.FileControllerBase#
	 **/
	p.getKey = function() {
		var self = this;
		return self._key;
	};

	/**
	 * Add reservation for loading the content.
	 *
	 * @name add
	 * @method
	 * @function
	 * @memberOf jslgEngine.controller.FileControllerBase#
	 * @param {Object} data
	 **/
	p.add = function(data) {
		var self = this;
		self._stock.push({
			key : data.key,
			url : data.url
		});
	};

	/**
	 * Get content.
	 *
	 * @name get
	 * @method
	 * @function
	 * @memberOf jslgEngine.controller.OBJFileController#
	 * @param {jslgEngine.model.network.ConnectorBase} connector
	 * @param {Object} data
	 * @param {Object} options 
	 * @param {Function} callback 
	 **/
	p.get = function(connector, data, options, callback) {
		var self = this;
		
		if(self._contents[data.key]) {
			if(callback) {
				callback(self._contents[data.key]);
			} else {
				return self._contents[data.key];
			}
		}
		
		for(var i = 0; i < self._stock.length; i++) {
			var one = self._stock[i];
			
			if(one.key === data.key) {
				if(callback) {
					self.load(connector, {
						contentKeys : [data.key],
						callback : function(content) {
							callback(content);
						}
					}, options);
					break;
				} else {
					return null;
				}
			}
		}
	};

	/**
	 * Load content.
	 *
	 * @name load
	 * @method
	 * @function
	 * @memberOf jslgEngine.controller.FileControllerBase#
	 * @param {jslgEngine.model.network.ConnectorBase} connector
	 * @param {Object} data
	 * @param {Object} options 
	 **/
	p.load = function(connector, data, options) {
	};

	o.FileControllerBase = FileControllerBase;
}());
