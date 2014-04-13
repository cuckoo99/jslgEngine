onmessage = function(command) {
    var results;
    var data = command.data;
    
    if(data) {
    	var obj = JSON.parse(data);
    	
    	if(obj) {
    		
    		var type = obj.type;
    		switch(type) {
	    		case 'Area' : {
	    			var location = obj.location;
			    	var quantity = obj.quantity;
			    	var positions = obj.positions;
			    	var theta = obj.degrees ? obj.degrees.theta : null;
			    	var phi = obj.degrees ? obj.degrees.phi : null;
			    	var maskLength = obj.maskLength;
			    	var effectsMap = obj.effectsMap;
			    	
			    	results = getArea(location, quantity, positions, theta, phi, maskLength, {
			            effectsMap : effectsMap
			        });
			        break;
	    		}
	    		case 'Route' : {
	    			var from = obj.from;
			    	var to = obj.to;
			    	var effectsMap = obj.effectsMap;
			    	
			    	results = getRouteByAstar(from, to, {
			    		effectsMap : effectsMap
			    	});
			        break;
	    		}
    		}
    	} else {
    		//jslgEngine.log('failed to parse JSON in Worker.');
    	}
    } else {
    	//jslgEngine.log('No Worker Parameters.');
    }
    postMessage(results);
};

var classNameOfArea = 'Ground';
var locationSeparator = '_';

var getAreaBySpread = function(from, val, options) {
	var start = {
		x : from.x,
		y : from.y,
		z : from.z,
		cost : 0,
		parent : null
	};
	var end = {
		x : from.x,
		y : from.y,
		z : from.z,
		cost : 0,
		parent : null
	};
	var o_list = [];
	var c_list = [];
	
	var active = start;
	
	var openFunc = _getAreaBySpreadOpen;
	
	var data = {
		o_list : o_list,
		c_list : c_list,
		spreadValue : val,
		onHeuristic : false
	};
	
	setOpen(active, data, openFunc, options);
	setOpenSides(active, data, openFunc, options);
	o_list.splice(0, 1);
	
	var cnt = val;
	while(cnt > 0) {
		var length = o_list.length;
		for(var i = 0; i < length; i++) {
			active = o_list[i];
			log('active:'+[active.x,active.y,active.z].join('_'));
			if(active == null) break;
			setOpenSides(active, data, openFunc, options);
		}
		o_list.splice(0, length);
		cnt--;
	}

	var area = [];
	for(var closed in c_list) {
		if(c_list[closed] != null) area.push(getArrayOfLocation(closed));
	}
	
	return area;
};

var _getAreaBySpreadOpen = function(target, data, options) {
	var astarLocation = target;
	var o_list = data.o_list;
	var c_list = data.c_list;
	var lKey = getIndexOfArray(astarLocation.x, astarLocation.y, astarLocation.z);
	
	//駆動力がコストを上回る場合は書き換える。
	var isLowerCost = astarLocation.cost < data.spreadValue;
	//クローズされている場合は書き換えない。
	var wasClosed = c_list[lKey];

	if(!wasClosed && isLowerCost) {
		//TODO: 障害物を乗り越えられる場合はCost+1でなくてCostでいい。
		var npos = {
			x : astarLocation.x,
			y : astarLocation.y,
			z : astarLocation.z,
			cost : astarLocation.cost+1,
			parent : astarLocation.parent
		};
		//jslgEngine.log('open:'+[astarLocation.x,astarLocation.y,astarLocation.z].join('_'));
		o_list.push(npos);
		//クローズ・リストを有効な座標の配列として記録しておく。
		c_list[lKey] = astarLocation;
	}
};

var getAreaByPattern = function(from, pattern, degreeTheta, degreePhi, options) {
	var self = this;
	var rad = Math.PI / 180 * degreeTheta;
	var location = {
		x : from.x,
		y : from.y,
		z : from.z
	};

	var wrap = [];
	var area = [];
	var around = Math.PI * 2;
	for(var i = 0; i < around; i+=rad) {
		area = [];
		for(var j = 0; j < pattern.length; j++) {
			var x = pattern[j].x;
			var y = pattern[j].y;
			var z = pattern[j].z;

			area.push([location.x+Math.round(x*Math.cos(i)-y*Math.sin(i)),
						location.y+Math.round(x*Math.sin(i)+y*Math.cos(i)),
						location.z+z]);
		}
		wrap.push(area);
	}
	return wrap;
};

//座標配列から範囲を取り出す。
var getArea = function(from, val, pattern, degreeTheta, degreePhi, maskVal, options) {
	var wrap = [];
	var area = null;
	
	//var start=new Date().getTime();
	if(val != null && val != 0) {
		area = getAreaBySpread(from, val, options);
		wrap.push(area);
	}
	else if(pattern != null && degreeTheta != null && degreePhi != null) {
		wrap = getAreaByPattern(from, pattern, degreeTheta, degreePhi, options);
	}
	if(maskVal != null && maskVal != 0) {
		var mask = getAreaBySpread(from, maskVal, options);
		for(var i = 0; i < mask.length; i++) {
			for(var j = 0; j < wrap.length; j++) {
				for(var k = 0; k < wrap[j].length; k++) {
					if(mask[i][0] == wrap[j][k][0] && mask[i][1] == wrap[j][k][1] && mask[i][2] == wrap[j][k][2]) {
						wrap[j].splice(k, 1);
					}
				}
			}
		}
	}
	//jslgEngine.log('pending time:' +((new Date().getTime())-start));
	
	return wrap;
};

//最短距離を取得する。
var getAreaByPattern = function(from, pattern, degreeTheta, degreePhi, options) {
	var self = this;
	var rad = Math.PI / 180 * degreeTheta;
	var location = {
		x : from.x,
		y : from.y,
		z : from.z
	};

	var wrap = [];
	var area = [];
	var around = Math.PI * 2;
	for(var i = 0; i < around; i+=rad) {
		area = [];
		for(var j = 0; j < pattern.length; j++) {
			var x = pattern[j].x;
			var y = pattern[j].y;
			var z = pattern[j].z;

			area.push([location.x+Math.round(x*Math.cos(i)-y*Math.sin(i)),
						location.y+Math.round(x*Math.sin(i)+y*Math.cos(i)),
						location.z+z]);
		}
		wrap.push(area);
	}
	return wrap;
};

var getRouteByAstar = function(from, to, options) {
	var self = this;
	var useHueristic = true;

	var start = {
		x : from.x,
		y : from.y,
		z : from.z,
		cost : 0,
		heuristic: null,
		parent : null
	};
	var end = {
		x : to.x,
		y : to.y,
		z : to.z,
		cost : 0,
		heuristic: null,
		parent : null
	};
	start.heuristic = getHueristic(start,start,end);
	
	var o_list = [];
	var c_list = [];
	
	var active = start;

	var data = {
		o_list : o_list,
		c_list : c_list,
		start : start,
		end : end,
		onHeuristic : true
	};

	var openFunc = _getRouteByAstarOpen;
	
	this.setOpen(active, data, openFunc, options);

	var limit = 50;
	while((limit--) > 0 && active) {
		active = getMinimumCostLocation(data);

		if(active) {
			setOpenSides(active, data, openFunc, options);
		}
	}
	return getRoute(data, options);
};

var _getRouteByAstarOpen = function(target, data, options) {
	var astarLocation = target;
	var o_list = data.o_list;
	var c_list = data.c_list;
	var lKey = getIndexOfArray(astarLocation.x, astarLocation.y, astarLocation.z);
	var cost, r_cost;
	cost = astarLocation.cost+astarLocation.heuristic;
	
	//始点からのコスト
	var closed = c_list[lKey];
	
	if(closed) {
		r_cost = closed.cost+closed.heuristic;
		
		if(cost < r_cost) {
			//クローズド・リストに上書き
			c_list[lKey] = astarLocation;
		}
	} else {
		for(var i = 0; i < o_list.length; i++) {
			var opened = o_list[i];
			var key = getIndexOfArray(opened.x, opened.y, opened.z);
			if(key == lKey) {
				r_cost = opened.cost+opened.heuristic;
				
				//jslgEngine.log('try:'+lKey+',cost (opened): at,'+cost+' target,'+r_cost, self._loglevel);

				r_cost = opened.cost+opened.heuristic;
				if(cost < r_cost) {
					o_list.splice(i, 1);
					o_list.push(astarLocation);
				}
				return;
			}
		}

		o_list.push(astarLocation);
	}
};

var getMinimumCostLocation = function(data, options) {
	var MAX_VALUE = 9999;
	var o_list = data.o_list;
	var c_list = data.c_list;
	var end = data.end;
	var active, next;
	var cost, min = MAX_VALUE;
	var index;

	var length = o_list.length;
	for(var i = 0; i < length; i++) {
		active = o_list[i];
		cost = active.cost+active.heuristic;
		if(cost < min) {
			min = cost;
			next = active;
			index = i;
		}
	}
	
	if(!next) return null;

	o_list.splice(index,1);
	var lKey = self.getIndexOfArray(next.x, next.y, next.z);
	c_list[lKey] = next;

	if(next.x == end.x && next.y == end.y && next.z == end.z) {
		return null;
	}
	return next;
};

var getRoute = function(data, options) {
	var parent, key;
	var c_list = data.c_list;
	var end = data.end;
	var tracks = [];
	var endKey = getIndexOfArray(end.x, end.y, end.z);
	if(c_list[endKey] != null) {
		var limit = 15;
		var target = c_list[endKey];
		while((limit--) > 0 && target) {
			key = getIndexOfArray(target.x, target.y, target.z);
			target = c_list[key];
			
			tracks.push([target.x, target.y, target.z]);
			
			target = target.parent;
		}
	}
	return tracks;
};

var setOpen = function(astar_location, data, open_func, options) {
	var astarLocation = astar_location;
	if(setIsNotOveredArea(astarLocation, options)) {
		var target = getLocationByElement(astarLocation, data, options);
		
		//範囲選択、A*で振る舞いを変更する
		open_func.apply(self, [target, data, options]);
	}
};
	
var setOpenSides = function(astar_location, data, open_func, options) {
	var self = this;
	var location = astar_location;
	var locations = [
		{ x : location.x + 1, y : location.y, z : location.z },
		{ x : location.x - 1, y : location.y, z : location.z },
		{ x : location.x, y : location.y + 1, z : location.z },
		{ x : location.x, y : location.y - 1, z : location.z }
		];
	
	for(var i = 0; i < locations.length; i++) {
		self.setOpen({
			x : locations[i].x,
			y : locations[i].y,
			z : locations[i].z,
			cost : location.cost,
			parent : location
		}, data, open_func, options);
	}
};

var setIsNotOveredArea = function(astar_location, options) {
	var astarLocation = astar_location;
		
	var separator = locationSeparator;
	
	//要素が存在すれば、範囲内
	var obj = _getElement(
		[astarLocation.x, astarLocation.y, astarLocation.z].join(separator), options);
	
	return (obj != null);
};

var _getStatus = function(key, location_key, options) {
	var self = this;
	//TODO:　格納すべき
	var element = options;
	
	var obj = _getElement(location_key, options);
	var status = obj;

	return status;
};

var _getElement = function(location_key, data, options) {
	var effectsMap = data.effectsMap;
	
	for(var i = 0; i < effectsMap.length; i++) {
		var obj = effectsMap[i];
		var effectLocationKey = [obj.location.x,
			obj.location.y,obj.location.z].join(locationSeparator);
		if(effectLocationKey === location_key) {
			return obj.effect;			
		}
	}

	return null;
};

var getLocationByElement = function(astar_location, data, options) {
	var self = this;
	var MAX_VAL = 9999;
	var location = astar_location;
	var separator = locationSeparator;
	var cost = _getStatus(self.effectKey,
		[location.x, location.y, location.z].join(separator), options);
	//蓄積する
	cost = astar_location.cost + cost;
	var heuristic = data.onHeuristic ? self.getHueristic(data.start, location, data.end) : 0;
	return {
			x : location.x,
			y : location.y,
			z : location.z,
			cost : cost,
			heuristic : heuristic,
			parent : location.parent
	};
};

var getIndexOfArray = function(x, y, z) {
	return [x,y,z].join('_');
};

var getHueristic = function(start, at, end) {
	var x = Math.abs(end.x - at.x);
	var y = Math.abs(end.y - at.y);
	var z = Math.abs(end.z - at.z);
	var sx = Math.abs(start.x - at.x);
	var sy = Math.abs(start.y - at.y);
	var sz = Math.abs(start.z - at.z);
	var val = Math.sqrt(x*x+y*y+z*z)+Math.sqrt(sx*sx+sy*sy+sz*sz);
	val *= 5.0; //影響力を高める
	return val;
};

var getArrayOfLocation = function(val) {
	var self = this;
	var data = val.split('_');
	var x = parseInt(data[0]);
	var y = parseInt(data[1]);
	var z = parseInt(data[2]);
	return [x, y, z];
};

var log = function(text) {
	//console.log(text);
};