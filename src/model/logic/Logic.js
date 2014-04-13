/*
 * @author cuckoo99
 */

(function() {
	// namespace:
	var o = this.jslgEngine = this.jslgEngine||{};
	o = (o.model = o.model||{});
	o = (o.logic = o.logic||{});

	/**
	 * <h4>ロジッククラス</h4>
	 * <p>
	 * 数学的な処理を実装する。
	 * </p>
	 * @class
	 * @name Logic
	 * @memberOf jslgEngine.model.logic
	 * @constructor
	 */
	var Logic = function() {
		this.initialize();
	};
	/**
	 *
	 */
	var p = Logic.prototype;

	/**
	 * アクセスされたデータを格納
	 * 
	 * @name _accessedElements
	 * @property
	 * @type String[]
	 * @memberOf jslgEngine.model.logic.Logic#
	 **/
	p._accessedElements = [];

	/**
	 * 範囲に影響を与える要素ステータスのキー
	 *
	 * @name effectKey
	 * @property
	 * @type String
	 * @memberOf jslgEngine.model.logic.Logic#
	 **/
	p.effectKey = 'effect';

	/**
	 * 予め読み込んでおく影響データ
	 *
	 * @name effectCache
	 * @property
	 * @type Number[]
	 * @memberOf jslgEngine.model.logic.Logic#
	 **/
	p._effectCache = [];

	/**
	 * 予め読み込んでおく範囲
	 *
	 * @name cacheSize
	 * @property
	 * @type String
	 * @memberOf jslgEngine.model.logic.Logic#
	 **/
	p._cacheSize = { width : 10, height : 10, depth : 10 };

	/**
	 * ログレベル
	 *
	 * @private
	 * @name _loglevel
	 * @property
	 * @type String
	 * @memberOf jslgEngine.model.logic.Logic#
	 **/
	p._loglevel = 4;

	/**
	 * 依存する空間を示すクラス名
	 *
	 * @name classNameOfArea
	 * @property
	 * @type String
	 * @memberOf jslgEngine.model.logic.Logic#
	 **/
	p.classNameOfArea = 'Ground';

	/**
	 * 初期化
	 *
	 * @name initialize
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.logic.Logic#
	 **/
	p.initialize = function() {};

	/**
	 * 範囲の取得（拡散）
	 *
	 * @name getAreaBySpread
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.logic.Logic#
	 * @param {Object} from 原点
	 * @param {Number} val 影響力
	 * @param {Object} options
	 * @returns {Object[]} 座標を格納した配列
	 */
	p.getAreaBySpread = function(from, val, options) {
		var self = this;
	
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
		
		//キャッシュを作成
		//self._cacheSize.width = self._cacheSize.height = self._cacheSize.depth = val+1;
		self._attachCache(start, self._cacheSize, options);
		
		var openFunc = self._getAreaBySpreadOpen;
		
		var data = {
			o_list : o_list,
			c_list : c_list,
			spreadValue : val, //補正
			onHeuristic : false
		};
		
		self.setOpen(active, data, openFunc, options);
		self.setOpenSides(active, data, openFunc, options);
		o_list.splice(0, 1);
		
		var cnt = val;
		while(cnt > 0) {
			var length = o_list.length;
			for(var i = 0; i < length; i++) {
				active = o_list[i];
				jslgEngine.log('active:'+[active.x,active.y,active.z].join('_'), self._loglevel);
				if(active == null) break;
				self.setOpenSides(active, data, openFunc, options);
			}
			o_list.splice(0, length);
			cnt--;
		}
	
		var area = [];
		for(var closed in c_list) {
			if(c_list[closed] != null) area.push(self.getArrayOfLocation(closed));
		}
		
		return area;
	};

	/**
	 * 範囲の取得（拡散）
	 *
	 * @private
	 * @name getAreaBySpreadOpen
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.logic.Logic#
	 * @param {Object} target
	 * @param {Number} data
	 * @param {Object} options
	 */
	p._getAreaBySpreadOpen = function(target, data, options) {
		var self = this;
		var astarLocation = target;
		var o_list = data.o_list;
		var c_list = data.c_list;
		var lKey = self.getIndexOfArray(astarLocation.x, astarLocation.y, astarLocation.z);
		
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
	
	/**
	 * 範囲を返す（パターン）
	 *
	 * @name getAreaByPattern
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.logic.Logic#
	 * @param {Object} from 原点
	 * @param {Object} pattern パターン
	 * @param {Number} degreeTheta 角度1
	 * @param {Number} degreePhi 角度2
	 * @param {Object} options
	 * @returns {Object[]} 各パターンごとに作成される座標配列
	 */
	p.getAreaByPattern = function(from, pattern, degreeTheta, degreePhi, options) {
		var self = this;
		var rad = Math.PI / 180 * degreeTheta;
		var location = {
			x : from.x,
			y : from.y,
			z : from.z
		};

		//キャッシュを作成
		self._attachCache(location, self._cacheSize, options);
		
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
	
	/**
	 * 範囲を返す（総合）<br />
	 * ※ただし、返されるオブジェクトは配列で覆われている。
	 *
	 * @name getArea
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.logic.Logic#
	 * @param {JSON} options
	 * <ul>
	 * </ul>
	 * @param from
	 * @param val
	 * @param pattern
	 * @param degreeTheta
	 * @param degreePhi
	 * @param maskVal
	 * @param options
	 * @returns {Array}
	 */
	p.getArea = function(from, val, pattern, degreeTheta, degreePhi, maskVal, options) {
		var self = this;
	
		var wrap = [];
		var area = null;
		
		//var start=new Date().getTime();
		if(val != null && val != 0) {
			area = self.getAreaBySpread(from, val, options);
			wrap.push(area);
		}
		else if(pattern != null && degreeTheta != null && degreePhi != null) {
			wrap = self.getAreaByPattern(from, pattern, degreeTheta, degreePhi, options);
		}
		if(maskVal != null && maskVal != 0) {
			var mask = self.getAreaBySpread(from, maskVal, options);
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

	
	/**
	 * Aスター・アルゴリズムによる、経路の取得
	 *
	 * @name getRouteByAstar
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.logic.Logic#
	 * @param {Object} from 原点
	 * @param {Object} to 目的地
	 * @param {Object} options
	 * <ul>
	 * </ul>
	 **/
	p.getRouteByAstar = function(from, to, options) {
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
		start.heuristic = self.getHueristic(start,start,end);
		
		var o_list = [];
		var c_list = [];
		
		var active = start;

		//キャッシュを作成
		self._attachCache(start, self._cacheSize, options);

		var data = {
			o_list : o_list,
			c_list : c_list,
			start : start,
			end : end,
			onHeuristic : true
		};

		var openFunc = self._getRouteByAstarOpen;
		
		this.setOpen(active, data, openFunc, options);
	
		var limit = 50;
		while((limit--) > 0 && active) {
			jslgEngine.log('list length:'+o_list.length, self._loglevel);
			active = self.getMinimumCostLocation(data);

			if(active) {
				jslgEngine.log('active(Astar):'+[active.x,active.y,active.z].join('_')+', cost:'+active.cost+', h:'+active.heuristic, self._loglevel);
				
				self.setOpenSides(active, data, openFunc, options);
			}
		}
		if(limit <= 0) {
			jslgEngine.log('!!interrupt getRouteByAstar', self._loglevel);
		}
		jslgEngine.log('getRoute:', self._loglevel);
		return self.getRoute(data, options);
	};

	/**
	 * 範囲の取得（拡散）
	 *
	 * @private
	 * @name _getRouteByAstarOpen
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.logic.Logic#
	 */
	p._getRouteByAstarOpen = function(target, data, options) {
		var self = this;
		var astarLocation = target;
		var o_list = data.o_list;
		var c_list = data.c_list;
		var lKey = self.getIndexOfArray(astarLocation.x, astarLocation.y, astarLocation.z);
		var cost, r_cost;
		cost = astarLocation.cost+astarLocation.heuristic;
		
		//始点からのコスト
		var closed = c_list[lKey];
		
		if(closed) {
			r_cost = closed.cost+closed.heuristic;
			
			jslgEngine.log('try:'+lKey+',cost (closed): at,'+cost+' target,'+r_cost, self._loglevel);
			
			if(cost < r_cost) {
				//クローズド・リストに上書き
				c_list[lKey] = astarLocation;
			}
		} else {
			for(var i = 0; i < o_list.length; i++) {
				var opened = o_list[i];
				var key = self.getIndexOfArray(opened.x, opened.y, opened.z);
				if(key == lKey) {
					r_cost = opened.cost+opened.heuristic;
					
					jslgEngine.log('try:'+lKey+',cost (opened): at,'+cost+' target,'+r_cost, self._loglevel);

					r_cost = opened.cost+opened.heuristic;
					if(cost < r_cost) {
						o_list.splice(i, 1);
						o_list.push(astarLocation);
					}
					return;
				}
			}

			jslgEngine.log('try:'+lKey+',cost : at,'+cost, self._loglevel);

			jslgEngine.log('open:'+[astarLocation.x,astarLocation.y,astarLocation.z].join('_'), self._loglevel);
			//jslgEngine.log('open:'+[astarLocation.x,astarLocation.y,astarLocation.z].join('_'));
			o_list.push(astarLocation);
		}
	};
	
	/**
	 * A* 最小のコストを探し、返す。
	 *
	 * @name getMinimumCostLocation
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.logic.Logic#
	 * @param {JSON} options
	 * <ul>
	 * </ul>
	 * @param o_list
	 * @param c_list
	 * @param start
	 * @param end
	 * @param options
	 * @returns
	 */
	p.getMinimumCostLocation = function(data, options) {
		var self = this;
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
	
	/**
	 * ステージ・オブジェクトから座標を取得
	 *
	 * @name getLocationByElement
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.logic.Logic#
	 * @param {JSON} options
	 * <ul>
	 * </ul>
	 * @param pos
	 * @param options
	 * @returns {jslgEngine.model.area.AstarLocation}
	 */
	p.getLocationByElement = function(astar_location, data, options) {
		var self = this;
		var MAX_VAL = 9999;
		var location = astar_location;
		var separator = jslgEngine.config.locationSeparator;
		var cost = self._getStatus(self.effectKey,
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
	
	/**
	 * 座標をオープンにする
	 *
	 * @name setOpen
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.logic.Logic#
	 * @param {JSON} options
	 * <ul>
	 * </ul>
	 * @param pos
	 * @param o_list
	 * @param c_list
	 * @param start
	 * @param end
	 * @param useHueristic
	 * @param options
	 */
	p.setOpen = function(astar_location, data, open_func, options) {
		var self = this;
		var astarLocation = astar_location;
		if(self.setIsNotOveredArea(astarLocation, options)) {
			var target = self.getLocationByElement(astarLocation, data, options);
			
			//範囲選択、A*で振る舞いを変更する
			open_func.apply(self, [target, data, options]);
		}
	};
	
	/**
	 * 隣接するマップをオープンにする
	 *
	 * @name setOpenSides
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.logic.Logic#
	 * @param {JSON} options
	 * <ul>
	 * </ul>
	 * @param astar_location
	 * @param o_list
	 * @param c_list
	 * @param start
	 * @param end
	 * @param useHueristic
	 * @param options
	 */
	p.setOpenSides = function(astar_location, data, open_func, options) {
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

	/**
	 * 値が範囲を超えている場合、falseを返す。
	 *
	 * @name setIsNotOveredArea
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.logic.Logic#
	 * @param {JSON} options
	 * <ul>
	 * </ul>
	 * @param pos
	 * @param options
	 * @returns {Boolean}
	 */
	p.setIsNotOveredArea = function(astar_location, options) {
		var self = this;
		var astarLocation = astar_location;
			
		var separator = jslgEngine.config.locationSeparator;
		
		//要素が存在すれば、範囲内
		var obj = self._getElement(
			[astarLocation.x, astarLocation.y, astarLocation.z].join(separator), options);
		
		return (obj != null);
	};
	
	/**
	 * ヒューリスティック値を得る
	 *
	 * @name getHueristic
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.logic.Logic#
	 * @param {JSON} options
	 * <ul>
	 * </ul>
	 * @param start
	 * @param from
	 * @param to
	 * @returns
	 */
	p.getHueristic = function(start, at, end) {
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
	
	/**
	 * 最短ルートの座標リストを取得する。
	 *
	 * @name getRoute
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.logic.Logic#
	 * @param {JSON} options
	 * <ul>
	 * </ul>
	 * @param c_list
	 * @param start
	 * @param end
	 * @param options
	 * @returns
	 */
	p.getRoute = function(data, options) {
		var self = this;
		var parent, key;
		var c_list = data.c_list;
		var end = data.end;
		var tracks = [];
		var endKey = self.getIndexOfArray(end.x, end.y, end.z);
		if(c_list[endKey] != null) {
			var limit = 15;
			var target = c_list[endKey];
			while((limit--) > 0 && target) {
				key = self.getIndexOfArray(target.x, target.y, target.z);
				target = c_list[key];
				
				tracks.push([target.x, target.y, target.z]);
				jslgEngine.log('route:'+[target.x,target.y,target.z].join('_'), self._loglevel);
				//jslgEngine.log(limit);
				
				target = target.parent;
			}
			if(limit <= 0) {
				jslgEngine.log('!!interrupt getRoute', self._loglevel);
			}
		}
		return tracks;
	};

	
	/**
	 * 読み込んだキャッシュを取得する。
	 *
	 * @name getCache
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.logic.Logic#
	 * @param {JSON} options
	 * @returns {Array}
	 */
	p.getCacheData = function(data, options) {
		var self = this;
		
		return self._effectCache;
	};

	/**
	 * 再実行時、キャッシュのデータから再度取得が必要かどうか判定する。<br />
	 * 必要があれば、再計算の必要がある。<br />
	 * 
	 * @name hasAvailableCache
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.logic.Logic#
	 * @param {JSON} options
	 * @returns {Array}
	 */
	p.hasAvailableCache = function(key, cache, options) {
		var self = this;
		
		for(var key in cache) {
			var status = self._effectCache[key];
			var actual = self._getStatus(key, key, element);
			if(status !== actual) return false;
		}
		return true;
	};
	
	/**
	 * ３軸座標から１次元の配列インデックスを取得する。
	 *
	 * @name getIndexOfArray
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.logic.Logic#
	 * @param {Number} x
	 * @param {Number} y
	 * @param {Number} z
	 * @param options
	 * @returns {String}
	 */
	p.getIndexOfArray = function(x, y, z) {
		var self = this;
		return [x,y,z].join('_');
	};
	
	/**
	 * １次元の配列インデックスから３軸座標を取得する。
	 *
	 * @name getArrayOfLocation
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.logic.Logic#
	 * @param {JSON} options
	 * <ul>
	 * </ul>
	 * @param val
	 * @param options
	 * @returns {Array}
	 */
	p.getArrayOfLocation = function(val) {
		var self = this;
		var data = val.split('_');
		var x = parseInt(data[0]);
		var y = parseInt(data[1]);
		var z = parseInt(data[2]);
		return [x, y, z];
	};
	
	/**
	 * オブジェクトからステータスを取得する。
	 *
	 * @name _getStatus
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.logic.Logic#
	 * @param {JSON} options
	 */
	p._getStatus = function(key, location_key, options) {
		var self = this;
		//TODO:　格納すべき
		var element = options;
		
		var status = self._effectCache[location_key];
		if(status) {
			//jslgEngine.log('exist cache:'+location_key);
			return status;
		}
		
		var obj = self._getElement(location_key, options);
		status = obj ?  obj.getStatus(key) : null;
		status = status ? status.value : null;

		//キャッシュに積む（仕様変更があれば変える）
		self._effectCache[location_key] = status;
		
		return status;
	};
	
	/**
	 * オブジェクトからステータスを取得する。
	 *
	 * @name _getElement
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.logic.Logic#
	 * @param {JSON} options
	 */
	p._getElement = function(location_key, options) {
		var self = this;
		var element = options.element;
		var className = self.classNameOfArea;
		//TODO: Workersに委譲したので使わないかも。
		var connector = null;
		
		//キャッシュに存在しない座標なら取得する必要はない
		var status = self._effectCache[location_key];
		if(status === undefined) return null;
		
		objs = element.findElements(connector, {
			key : location_key,
			className : className
		})[0];

		return objs;
	};

	/**
	 * あらかじめ、原点周辺のデータを読み込んでおく。
	 *
	 * @name attachCache
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.logic.Logic#
	 * @param {JSON} options
	 * <ul>
	 * </ul>
	 **/
	p._attachCache = function(location, size, options) {
		var self = this;
		var separator = jslgEngine.config.locationSeparator;
		//TODO: z軸も行うべき
		for(var i = -size.width; i < size.width; i++) {
			for(var j = -size.height; j < size.height; j++) {
				var x = location.x - i;
				var y = location.y - j;
				var z = location.z;
				if(x < 0 || y < 0) continue;
				var locationKey = [x, y, z].join(separator);
				
				var value = self._getStatus(self.effectKey,
						locationKey, options);
				self._effectCache[locationKey] = value;
			}
		}
	};
	
	/**
	 * 文字列を配列化する
	 * TODO: どこかへ移動すべき
	 *
	 * @name getArrayOfElement
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.logic.Logic#
	 * @param line コード
	 * @param nest 深度
	 * @returns {Object[]} 配列化された要素
	 */
	p.getArrayOfText = function(line, nest) {
		var cnt = 0;
		var start = 0;
		var end = 0;
		var set = [];
		var code = line + ',';
		for(var i = 0; i < code.length; i++) {
			var ch = code.charAt(i);
			if(ch == '[') {
				if(cnt == 0) start = i + 1;
				cnt++;
			}
			else if(ch == ']') {
				cnt--;
				if(cnt == 0) end = i;
			}
			else if(ch == ',' && cnt == 0) {
				if(end <= start) end = i;
				var args = line.substr(start, end - start);
				if(args.indexOf(',') != -1) {
					set.push(this.getArrayOfText(args, nest+1));
				} else {
					set.push(args);
				}
				start = i + 1;
			}
		}
		return set;
	};
	
	o.Logic = Logic;
}());