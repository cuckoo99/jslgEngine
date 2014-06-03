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
	 * @name _parents
	 * @property
	 * @type Object[]
	 * @memberOf jslgEngine.controller.ElementBinder#
	 **/
	p._parents = null;

	/**
	 * chache of elements has location
     *
	 * @name _elementsWithLocation
	 * @property
	 * @type Object[]
	 * @memberOf jslgEngine.controller.ElementBinder#
	 **/
	p._elementsWithLocation = null;

	/**
	 * chache of elements has key
     *
	 * @name _elementsWithKey
	 * @property
	 * @type Object[]
	 * @memberOf jslgEngine.controller.ElementBinder#
	 **/
	p._elementsWithKey = null;

	/**
	 * chache of elements has class name
     *
	 * @name _elementsWithClassName
	 * @property
	 * @type Object[]
	 * @memberOf jslgEngine.controller.ElementBinder#
	 **/
	p._elementsWithClassName = null;

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
        self._elementsWithClassName = [];
        self._elementsWithLocation = [];
        self._elementsWithKey = [];
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
            if(element.className) {
                if(!self._elementsWithClassName[element.className]) {
                    self._elementsWithClassName[element.className] = [];
                }
                self._elementsWithClassName[element.className][k] = element;
            }
            var ekey = element.getKey();
            if(ekey) {
                if(!self._elementsWithKey[ekey]) {
                    self._elementsWithKey[ekey] = [];
                }
                self._elementsWithKey[ekey][k] = element;
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
            var className = self._contents[k].className;
            if(self._elementsWithClassName[className]) {
                delete self._elementsWithClassName[className][k];
            }
            var ekey = self._contents[k].getKey();
            if(self._elementsWithKey[ekey]) {
                delete self._elementsWithKey[ekey][k];
            }
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
	p.setCache = function(connector, data, options) {
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
	p._replaceUselessKeywords = function(text, options) {
        var key = text;
        var sep = jslgEngine.config.elementSeparator;
        //parent()の重複除去
        for(var i = 0, len = key.length; i < len; i++) {
            var ftxt = sep+'parent()';
            var idx = key.indexOf(ftxt, i);
            if(idx !== -1) {
                var p_idx = key.lastIndexOf(sep, idx-1);
                if(p_idx !== -1) {
                    i = idx+ftxt.length;
                    key = key.substring(0,p_idx)+key.substring(idx+ftxt.length);
                    continue;
                }
            }
            break;
        }
        return key;
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
		
		var logLevel = 2;
        
        var key, keys, className;
        var target = data.target;
        key = data.key;
        className = data.className;
        
        var results = [];

        if(key) {
            //jslgEngine.log('find:'+key,logLevel);
            var key = self._replaceUselessKeywords(key);
            //パスを分解する。
            keys = key.split(jslgEngine.config.elementSeparator);
            
            var limit = 10;
            //TODO: 該当する要素をキーで検索
            var nwElms = [];
            for(var i = 0, len = results.length; i < len; i++) {
                nwElms.push({
                    target : results[i],
                    element : results[i]
                });
            }
            //キーの一致判定を順に行う
            results = self.analyzeKeys(keys, nwElms, [], limit, options);
        }
        if(className) {
            var nwResults = [];
            if(!key) {
                var caches = self._elementsWithClassName[className];
                for(var k in caches) {
                    nwResults.push({
                        target : caches[k],
                        element : caches[k]
                    });
                }
            } else {
                for(var i = 0, len = results.length; i < len; i++) {
                    if(results[i].element.className === className) {
                        nwResults.push(results[i]);
                    }
                }
            }
            results = nwResults;
        }
        //ターゲットが指定されている場合、ターゲット内の要素のみに絞り込む
        if(target) {
            var nwResults = [];
            for(var i = 0, len = results.length; i < len; i++) {
                if(self.existsInParent(results[i].element, target, options)) {
                    nwResults.push(results[i]);
                }
            }
            results = nwResults;
        }
        
        var nwResults = [];
        for(var i = 0, len = results.length; i < len; i++) {
            nwResults.push(results[i].element);
        }
        results = nwResults;
        
        //jslgEngine.log('number of result:'+results.length,logLevel);
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
	 * @name analyzeKeys
	 * @method
	 * @function
	 * @memberOf jslgEngine.controller.ElementBinder#
	 **/
	p.analyzeKeys = function(keys, elms, stk, lim, options) {
        var self = this;

        if(!lim) return elms;
        var key = keys.shift();
        var rs = [];
        var idx;
        var fstr = key.match(/find\((.*)\)/);
        var isLastKey = (elms.length === 0);
        
        if(key === 'parent()') {
            for(var i = 0, len = elms.length; i < len; i++) {
                var elm = elms[i];
                if(!elm.target) continue;
                var p = elm.target.getParent(options);
                rs.push({
                    target : p,
                    element : p
                });
            }
        } else if(fstr) {
            var className = RegExp.$1;
            jslgEngine.log(className);
            var caches = self._elementsWithClassName[className];
            if(elms.length > 0) {
                for(var i = 0, len = elms.length; i < len; i++) {
                    var elm = elms[i];
                    if(!elm.target) continue;
                    for(var k in caches) {
                        if(self.existsInParent(caches[k], elm.target, options)) {
                            rs.push({
                                target : caches[k],
                                element : caches[k]
                            });
                        }
                    }
                }
            } else {
                for(var k in caches) {
                    rs.push({
                        target : caches[k],
                        element : caches[k]
                    });
                }
            }
        } else {
            var isLocation = (key.split(jslgEngine.config.locationSeparator).length === 3);
            if(elms.length > 0) {
                for(var i = 0, len = elms.length; i < len; i++) {
                    var elm = elms[i];
                    if(!elm.target) continue;
                    var children = elm.target.getChildren();
                    for(var j = 0, len2 = children.length; j < len2; j++) {
                        if(children[j].equals({key : key})) {
                            jslgEngine.log('Matched:'+key);
                            rs.push({
                                target : children[j],
                                element : children[j]
                            });
                        }
                    }
                }
            } else {
                //TODO: 絶対パスとして検索しないなら、座標の検索は困難。
                if(isLocation) {
                    //jslgEngine.log('not available')
                    var caches = self._contents;
                    for(var k in caches) {
                        if(caches[k].getGlobalLocation && caches[k].equals({key : key})) {
                            rs.push({
                                target : caches[k],
                                element : caches[k]
                            });
                        }
                    }
                } else {
                    var caches = self._elementsWithKey[key];
                    for(var k in caches) {
                        rs.push({
                            target : caches[k],
                            element : caches[k]
                        });
                    }
                }
            }
        }
        if(keys.length === 0 || rs.length === 0) {
            return rs;
        }
        return self.analyzeKeys(keys, rs, stk, lim-1, options);
    };
    
	/**
	 * get element ID
     *
	 * @name existsInParent
	 * @method
	 * @function
	 * @memberOf jslgEngine.controller.ElementBinder#
	 **/
	p.existsInParent = function(target, parent, options) {
        var limit = 100;
        
        while(target && (limit--) > 0) {
            if(target === parent) {
                return true;
            }
            target = target.getParent(options);
        }
        return false;
    };
    
	/**
	 * get element ID
     *
	 * @name getUniqueId
	 * @method
	 * @function
	 * @memberOf jslgEngine.controller.ElementBinder#
	 **/
	p.getSerializedLocation = function(location, size) {
        return location.x+location.y*size.width+location.z*size.width*size.height;
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