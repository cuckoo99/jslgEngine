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
     * Like elements parent data.
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
	 * serialized elements to fast search.
     *
	 * @name _contents
	 * @property
	 * @type Object[]
	 * @memberOf jslgEngine.controller.ElementBinder#
	 **/
	p._contents = null;

	/**
	 * Information of parent
     *
	 * @name _categorized
	 * @property
	 * @type Object[]
	 * @memberOf jslgEngine.controller.ElementBinder#
	 **/
	p._parents = null;

	/**
	 * Information of parent
     *
	 * @name _categorizedContents
	 * @property
	 * @type Object[]
	 * @memberOf jslgEngine.controller.ElementBinder#
	 **/
	p._categorizedContents = null;

	/**
	 * Set up
	 *
	 * @name initialize
	 * @method
	 * @function
	 * @memberOf jslgEngine.controller.ElementBinder#
	 **/
	p.initialize = function(options) {
		var self = this;
		self._contents = [];
        self._parents = [];
        self._categorizedContents = [];
	};

	/**
	 * Set elements relationship
	 *
	 * @name set
	 * @method
	 * @function
	 * @memberOf jslgEngine.controller.ElementBinder#
	 **/
	p.attachParent = function(key, element, options) {
		var self = this;
		
		var k = key;
		
		if(key instanceof jslgEngine.model.common.JSlgKey) {
			k = key.getKey();
		}
		
		if(element === null) {
			delete self._parents[k];
		} else {
			self._parents[k] = element;
		}
	};

	/**
	 * Get elements relationship
	 *
	 * @name getParent
	 * @method
	 * @function
	 * @memberOf jslgEngine.controller.ElementBinder#
	 **/
	p.getParent = function(key, data, options) {
		var self = this;
		var k = key;
		
		if(key instanceof jslgEngine.model.common.JSlgKey) {
			//TODO: キーが一意でなければならない。
			k = key.getKey();
		}
		
		return self._parents[k];
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
			self._contents[k] = element;
            if(self._categorizedContents[element.className]) {
                self._categorizedContents[element.className][k] = element;
            }
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
			delete self._parents[k];
			return true;
		}
		return false;
	};


	/**
	 * search elements in set elements
     *
	 * @name search
	 * @method
	 * @function
	 * @memberOf jslgEngine.controller.ElementBinder#
	 **/
	p.makeCache = function(connector, data, options) {
		var self = this;
        var arr = [];
        var key;
		
        if(data.className) {
            var className = data.className;
            var key = className;
            
            for(var key in self._contents) {
                var content = self._contents[key];
                if(content.className === className) {
                    arr.push(content);
                }
            }

        } else if(data.location) {
            var location = data.location;
            var key = [location.x,location.y,location.z].join(jslgEngine.config.locationSeparator);
            
            for(var key in self._contents) {
                var content = self._contents[key];
                if(content.location &&
                   content.location.x === location.x &&
                   content.location.y === location.y &&
                   content.location.z === location.z) {
                    arr.push(content);
                }
            }
        }
        
        self._categorizedContents[key] = arr;
	};
    
	/**
	 * search for elements in set elements
     *
	 * @name search
	 * @method
	 * @function
	 * @memberOf jslgEngine.controller.ElementBinder#
	 **/
	p.search = function(connector, data, options) {
		var self = this;
        var results = [];
		
        var keys, className, location;
        className = data.className ? data.className : null;
        var target = data.target||null;
        for(var key in self._contents) {
            var content = self._contents[key];
            
            var existInTarget = target ? (function(elm, tgt) {
                    if(elm === tgt) {
                        return true;
                    }
                    var p = self.getParent(self.getUniqueId(elm, options));
                    if(p) {
                        return arguments.callee(p, tgt);
                    }
                    return false;
                })(content, target) : true;
            if(existInTarget && (className ? content.equals({
                    className : className
                }) : true)) {
                results.push(content);
            }
        }
//        if(data.useCache) {
//            for(var key in self._contents) {
//                var content = self._contents[key];
//                if(content.equals(data)) {
//                    results.push(content);
//                }
//            }
//        } else {
//            // search for straight
//            var keys, className, location;
//            keys = data.key ? data.key.split(jslgEngine.config.elementSeparator) : [];
//            className = data.className ? data.className : null;
//            location = data.location ? [data.location.x,data.location.y,data.location.z] : null;
//            
//            for(var key in self._contents) {
//                var content = self._contents[key];
//                if(content.equals({
//                    key : keys[0],
//                    className : className,
//                    location : location
//                })) {
//                    var nKeys = [].concat(keys).slice(1);
//                    if(nKeys.length > 0) {
//                        content = (function(elm, ks) {
//                            var r;
//                            var k = ks.shift();
//                            if(k === 'parent()') {
//                                r = self._parents[self.getUniqueId(elm)];
//                            } else {
//                                r = elm.getChild({
//                                    key : k
//                                });
//                            }
//                            if(r && ks.length > 0) {
//                                return arguments.callee(r, ks);
//                            }
//                            return r;
//                        })(content, nKeys);
//                    }
//                    if(content) {
//                        //jslgEngine.log('get:'+content.getKey())
//                        results.push(content);
//                    }
//                }
//            }
//        }
//		
        if(connector) {
            connector.pipe(function(connector_s) {
                connector_s.resolve(results);
            });
        }
		return results;
		
	};
    
	/**
	 * get element ID
     *
	 * @name getUniqueId
	 * @method
	 * @function
	 * @memberOf jslgEngine.controller.ElementBinder#
	 **/
	p.getUniqueId = function(element, options) {
		var uniqueId = element.getKeyData().getUniqueId();
		var key = [element.getKey(),uniqueId].join(jslgEngine.config.elementSeparator);
        return key;
    };
    
	o.ElementBinder = ElementBinder;
}());