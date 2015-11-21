onmessage = function(dt) {
    var results;
    var data = dt.data;
    
    if(!data) {
    	postMessage('not found data');
	return;
    }

    var obj = JSON.parse(data);
    
    if(!obj) {
    	postMessage('parse error');
	return;
    }
    
    var data = {
	    obj : obj.findTargets,
	    getOne : data.getOne,
	    result : []
    };

    findElements(obj.elements, data, {});

    results = data.result;

    //results = log;

    postMessage(results);
};

var log = '';

var locationSeparator = '_';

var findElements = function(element, data, options) {
	var self = element;
	var child = null;

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
	
	if(target.type === 'find') {
		
		for(var i = 0; i < children.length; i++) {
			var child = children[i];

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
	var id = data.id != null ? data.id : null;
	var key = data.key;
	var location = data.key ? data.key : null;
	var index = data.index;
	var className = data.className;
	
	log = id;
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
	if((id != null) && self.id !== id) {
		return false;
	}
	
	return (key||location||index||className||(id != null));
};

var exists = function(element, location) {
	var eLocation = element.location||{};
	if(!eLocation) return false;
	return ([eLocation.x,eLocation.y,eLocation.z].join(locationSeparator) === location);
};
