onmessage = function(command) {
    var results;
    var data = command.data;
    
    if(data) {
    	var obj = JSON.parse(data);
    	
    	if(obj) {
    		//要素が展開される。
    		var result = [];
    		var data = {
    			obj : obj.findTargets,
    			result : result
    		};
    		var options = {
    		};
    		
    		findElements(obj.elements, data, options);
    		
    		//座標
    		// var key = obj.key;
    		// var className = obj.className;
	    	// var location = obj.location;

	    	results = data.result;
    	} else {
    		jslgEngine.log('failed to parse JSON in FindingElementsWorker.');
    	}
    } else {
    	jslgEngine.log('No Worker Parameters.');
    }
    postMessage(results);
};

var locationSeparator = '_';

var findElements = function(element, data, options) {
	var self = element;
	var child = null;

	if(!data) return false;
	data.result = data.result||[];
	var parents = data.parents||[];
	
	var obj = data.obj;
	if(obj.length == 0) return data.result;
	
	var target;
	
	var target = obj.shift();
	var children = self.children;
	
	target.data.index = data.index;
	if(isMatched(self, target.data)) {
		if(obj.length === 0) {
			data.result.push(self);
		} else {
			var resultChild = [];
			
			var specialData = {
				obj : obj,
				parents : parents,
				result : data.result
			};
			
			var exElement = _getElementFromParentKey(self, specialData, options);
			children =　exElement ? exElement.children : [];
			
			if(obj.length == 0) {
				return data.result;
			}
			
			for(var i = 0; i < children.length; i++) {
				var child = children[i];
				
				findElements(child, {
					index : i,
					obj : [].concat(obj),
					parents : [].concat(parents),
					result : data.result
				}, options);
			}
		}
	}
	
	for(var i = 0; i < children.length; i++) {
		var child = children[i];
		
		if(target.type === 'find') {
			
			findElements(child, {
				index : i,
				obj : [].concat(target).concat(obj),
				parents : [].concat(parents).concat(self),
				result : data.result
			}, options);
		}
	}
	
	return data.result;
};

var _getElementFromParentKey = function(element, data, options) {
	var self = element;
	var obj = data.obj;
	var next = obj.shift();
	
	if(next.type === 'parent') {
		var parent = data.parents.pop();
	
		if(obj.length == 0) {
			data.result.push(parent);
			return parent;
		}
		
		return _getElementFromParentKey(parent, data, options);
	} else {
		obj.unshift(next);
		data.parents.push(element);
		return element;
	}
};

var isMatched = function(element, data, options) {
	var self = element;
	var key = data.key;
	var location = data.key ? data.key : null;
	//var location = data.key ? data.key.split(locationSeparator) : null;
	//location = location ? { x : location[0],  y : location[1], z : location[2] } : null;
	var index = data.index;
	var className = data.className;
	
	if(key && self.key !== key) {
		if(location && !exists(self, location)) {
			if(!index || (index && key !== index)) {
				return false;
			}
		}
	}
	if(className && self.className !== className) {
		return false;
	}
	
	return (key||location||index||className);
};

var exists = function(element, location) {
	var eLocation = element.location||{};
	if(!eLocation) return false;
	return ([eLocation.x,eLocation.y,eLocation.z].join(locationSeparator) === location);
};
