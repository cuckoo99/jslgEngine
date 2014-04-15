/*
 * @author cuckoo99
 */

(function() {
	// namespace:
	var o = this.jslgEngine = this.jslgEngine||{};
	o = (o.controller = o.controller||{});

	/**
	 * <h4>ElementBinder</h4>
	 * <p>
	 * This manages relationship of JSLG element.<br />
     * Likes elements parent data.
	 * </p>
	 * @class
	 * @name ElementBinder
	 * @memberOf jslgEngine.controller
	 * @constructor
	 */
	var ElementBinder = function() {
		this.initialize();
	};
	/**
	 *
	 */
	var p = ElementBinder.prototype;

	/**
	 * Information of parent
     *
	 * @name _contents
	 * @property
	 * @type Object[]
	 * @memberOf jslgEngine.controller.ElementBinder#
	 **/
	p._contents = null;

	/**
	 * Set up
	 *
	 * @name initialize
	 * @method
	 * @function
	 * @memberOf jslgEngine.controller.ElementBinder#
	 **/
	p.initialize = function() {
		var self = this;
		self._contents = [];
	};

	/**
	 * Set elements relationship
	 *
	 * @name set
	 * @method
	 * @function
	 * @memberOf jslgEngine.controller.ElementBinder#
	 **/
	p.set = function(key, element, options) {
		var self = this;
		
		var k = key;
		
		if(key instanceof jslgEngine.model.common.JSlgKey) {
			k = key.getKey();
		}
		
		if(element === null) {
			self.remove(k);
		} else {
			//TODO: キーが一意でなければならない。
			self._contents[k] = element;
		}
	};

	/**
	 * Remove elements relationship
	 *
	 * @name remove
	 * @method
	 * @function
	 * @memberOf jslgEngine.controller.ElementBinder#
	 **/
	p.remove = function(key, options) {
		var self = this;
		var k = key;
		
		if(key instanceof jslgEngine.model.common.JSlgKey) {
			k = key.getKey();
		}
		
		if(self._contents[k]) {
			jslgEngine.log('Remove Binding : '+k);
			delete self._contents[k];
			return true;
		}
		return false;
	};

	/**
	 * Get elements relationship
	 *
	 * @name get
	 * @method
	 * @function
	 * @memberOf jslgEngine.controller.ElementBinder#
	 **/
	p.get = function(key, data, options) {
		var self = this;
		var k = key;
		
		if(key instanceof jslgEngine.model.common.JSlgKey) {
			//TODO: キーが一意でなければならない。
			k = key.getKey();
		}
		
		return self._contents[k];
	};

	o.ElementBinder = ElementBinder;
}());