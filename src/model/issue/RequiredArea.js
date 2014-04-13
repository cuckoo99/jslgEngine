/*
 * @author cuckoo99
 */

(function() {
	// namespace:
	var o = this.jslgEngine = this.jslgEngine||{};
	o = (o.model = o.model||{});
	o = (o.issue = o.issue||{});

	/**
	 * <h4>範囲要求オブジェクト</h4>
	 * <p>
	 * 未解決の範囲入力の情報を管理します。
	 * applyによって、対象座標を適用させることで範囲が求まります。
	 * </p>
	 * @class
	 * @name RequiredArea
	 * @memberOf jslgEngine.model.issue
	 * @constructor
	 */
	var RequiredArea = jslgEngine.extend(
		jslgEngine.model.issue.Issue,
		function(options) {
			this.initialize(options);
		}
	);
	/**
	 *
	 */
	var p = RequiredArea.prototype;

	/**
	 * 初期化
	 *
	 * @name initialize
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.issue.RequiredArea#
	 **/
	p.initialize = function(options) {
		var self = this;
		var data = options;
		
		//TODO:今まで設定されていなかったのはなぜ？原点に対し、applyしてた。
		// 原点
		//self._origin = data.origin;
		// 適用座標からのオフセット値
		self._offset = data ? data.offset : null;
		// 現在のインデックス
		self._currentIndex = 0;
		// エリア作成テンプレート
		self._settings = data ? data.areaSettings : [];
		// 適用情報
		self._issueDataSets = [];
		// 適用可能要素名
		self.elementClassNames = options.elementClassNames;
	};
	
	/**
	 * クラス名
	 *
	 * @name className
	 * @property
	 * @type String
	 * @memberOf jslgEngine.model.issue.RequiredArea#
	 **/
	p.className = 'RequiredArea';

	/**
	 * 適用可能な要素
	 *
	 * @name elementClassNames
	 * @property
	 * @type jslgEngine.model.issue.Area[]
	 * @memberOf jslgEngine.model.issue.RequiredArea#
	 **/
	p.elementClassNames = null;

	/**
	 * 範囲の解決
	 *
	 * @name resolve
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.issue.RequiredArea#
	 * @param {Object} obj
	 * @param {Object} options
	 **/
	p.resolve = function(connector, obj, data, options) {
		var self = this;
		
		if(obj) {
			self.apply(connector, obj, data, options);
			connector.pipe(function(connector_s) {
				self.next();
				connector_s.resolve();
			});
			return true;
		} else {
			return false;
		}
	};
	
	/**
	 * 範囲の適用
	 *
	 * @name apply
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.issue.RequiredArea#
	 * @param {Object} obj
	 * @param {Object} options
	 **/
	p.apply = function(connector, obj, data, options) {
		var self = this;
		var location;
		var settings, locationsList, cache;
		var useForce = data.useForce;
		var succeed = true;
		
		//座標を持つ要素が与えられた場合、その要素から取得する。それ以外は自身が座標を持っていると判断
		location = obj.getGlobalLocation ? obj.getGlobalLocation() : obj;
		
		jslgEngine.log('applied RequiredArea:'+[location.x,location.y,location.z].join('_'));
		
		self.clear(self._currentIndex);
		
		//適用対象ならば続行、それ以外なら拒否
		var exists = false;
		var locations = self.getLastLocations()||[];
		for(var i = 0; i < locations.length; i++) {
			if(	location.x === locations[i].x &&
				location.y === locations[i].y &&
				location.z === locations[i].z) {
				exists = true;	
			}
		}
		if(!exists && self._currentIndex > 0) {
			jslgEngine.log('Not Found Valid Elements In RequiredArea');
			if(useForce) {
				jslgEngine.log('Forced Inserting Empty Element In RequiredArea');
				self._issueDataSets.push(new jslgEngine.model.issue.IssueDataSet({
					key : {
						layerIndex : self._currentIndex,
						splitIndex : 0
					}
				}));
				return true;
			}
			return false;
		}
		connector.pipe(function(connector_s) {
			locationsList = [];
			
			connector_s.resolve();
			
			//2013.12.24 最終的な適用座標に対応
			if(self._currentIndex === self._settings.length) {
				//最終適用要求の場合は、それ自身の座標のみを適用する。
				settings = { isMulti : false };
				locationsList = [[location]];
			} else {
				settings = self._settings[self._currentIndex];
				var region = options.mainController.getWorldRegion();
			
				var origin = [ location.x + (self._offset.x ? self._offset.x : 0),
				               location.y + (self._offset.y ? self._offset.y : 0),
				               location.z + (self._offset.z ? self._offset.z : 0) ];
	            
	            cache = [];
	            self.getAreaBySettings(connector_s, location, settings, {
	                region : region,
	                cache : cache,
	                result : locationsList
	            }, options);
			}
		}).pipe(function(connector_s) {
			for ( var i = 0; i < locationsList.length; i++) {
				var locations = locationsList[i];
				
				var issueDataSet = new jslgEngine.model.issue.IssueDataSet({
					key : {
						layerIndex : self._currentIndex,
						splitIndex : i
					},
					locations : locations,
					cache : cache,
					appliedLocation : location,
					appliedElement : obj,
					appliedKeyData : obj.getKeyData ? obj.getKeyData() : obj
				});
				self._issueDataSets.push(issueDataSet);
			}
			if(locationsList.length === 0) {
				jslgEngine.log('It was not applied any DataSet');
			}
			connector_s.resolve();
		});
		return succeed;
	};
	
	/**
	 * 互換性があれば、データセットを書き換える
	 *
	 * @name rewrite
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.issue.RequiredArea#
	 * @param {Object} obj
	 * @param {Object} options
	 **/
	p.rewrite = function(required_area) {
		var self = this;
		var requiredArea = required_area;
		
		//TODO: 範囲要求に互換性があるかチェックが必要
		self._issueDataSets = requiredArea._issueDataSets;
	};
	
	/**
	 * 範囲の取得
	 *
	 * @name getAreaBySettings
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.issue.RequiredArea#
	 * @param {Object} location
	 * @param {Object} settings
	 * @param {Object} data
	 * @param {Object} options
	 **/
	p.getAreaBySettings = function(connector, location, settings, data, options) {
        var cache = data.cache;
        var region = data.region;
        
        var backGroundWorker = options.mainController.getWebWorkers('Logic');
        
		region.findElements(connector, {
			className : 'Ground'
		}, options);
		connector.pipe(function(connector_s, result_s) {
			var elements = result_s;
			
			var effectsMap = [];
			for(var i = 0; i < elements.length; i++) {
				var element = elements[i];
				var elementLocation = element.getGlobalLocation();
				var effect = element.getStatus('effect').value;
				effectsMap.push({
					location : elementLocation,
					effect : effect
				});
			}
			
	        var obj = {
	        	type : 'Area',
	        	location : location,
		    	quantity : settings.quantity,
		    	positions : settings.positions,
		    	theta : settings.degrees.theta,
		    	phi : settings.degrees.phi,
		    	maskLength : settings.maskLength,
		    	effectsMap : effectsMap
	        };
	        
	        backGroundWorker.add(JSON.stringify(obj), function(obj) {
	        	for(var i = 0; i < obj.length; i++) {
	        		data.result.push(obj[i]);
				}
	        	connector_s.resolve();
	        });
		});
    };
    
	/**
	 * 範囲の適用座標の取得
	 *
	 * @name getCurrentAppliedLocation
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.issue.RequiredArea#
	 **/
	p.getCurrentAppliedLocation = function() {
		var self = this;
		
		var index = self._currentIndex;

		var length = self._issueDataSets.length;
		for(var i = 0; i < length; i++) {
			var issueDataSet = self._issueDataSets[i];
			
			if(issueDataSet.key.layerIndex == index) {
				return issueDataSet.appliedLocation;
			}
		}
	};
	
	/**
	 * キャッシュから取得
	 *
	 * @name getLastLocations
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.issue.RequiredArea#
	 * @param {Object} index
	 **/
	p.getLastLocations = function(index) {
		var self = this;
		return self.getLocations(self._currentIndex - 1);
	};
	
	/**
	 * 全ての要求が解決したかどうか確認する。
	 *
	 * @name wasResolved
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.issue.RequiredArea#
	 **/
	p.wasResolved = function() {
		var self = this;
	
		if(!self._issueDataSets) return false;

		//TODO: パターン範囲がある場合、この条件では解決しない。
		//設定数＋原点の設定で解決条件を満たす
		var count = 0;
		for(var i = 0; i < self._issueDataSets.length; i++) {
			var issueDataSet = self._issueDataSets[i];
			
			if(issueDataSet.key.layerIndex === self._settings.length) {
				return true;
			}
		}
		return false;
		//return self._issueDataSets.length === self._settings.length + 1;
	};

	/**
	 * キャッシュから取得
	 *
	 * @name getLocations
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.issue.RequiredArea#
	 * @param {Object} index
	 **/
	p.getLocations = function(index) {
		var self = this;
		var currentIndex = self._currentIndex != 0 ? self._currentIndex : 0;
		var targetIndex = index != null ? index : currentIndex;
		var locations = [];
		
		if(targetIndex == -1) {
			jslgEngine.log('No resolved locations');
			return null;
		}
		
		for(var i = 0; i < self._issueDataSets.length; i++) {
			var issueDataSet = self._issueDataSets[i];
			if(issueDataSet.key.layerIndex === targetIndex) {
				var locs = issueDataSet.locations;
				for(var j = 0; j < locs.length; j++) {
					var obj = self._convert(locs[j]);
					locations.push(obj);
				}
			}
		}
		
		return locations;
	};

	/**
	 * キャッシュから取得
	 *
	 * @name getLocationsAll
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.issue.RequiredArea#
	 **/
	p.getLocationsAll = function() {
		var self = this;
		var locations = [];
		
		for(var i = 0; i <= self._currentIndex; i++) {
			var result = self.getLocations(i);
			
			if(result) {
				locations = locations.concat(result);
			}
		}
		
		return locations;
	};

	/**
	 * 座標のキー文字列として取得
	 *
	 * @name toStringArea
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.issue.RequiredArea#
	 * @param {Object} width
	 * @param {Object} height
	 * @param {Object} ret
	 **/
	p.toStringArea = function(width, height, ret) {
		var self = this;
		var locations = self.getLocationsAll();
		var retText = ret||'\n';
		var line = '';
		for(var i = 0; i < height; i++) {
			for(var j = 0; j < width; j++) {
				var isMatch = false;
				for(var k = 0; k < locations.length; k++) {
					var location = locations[k];
					
					if(location.x == j && location.y == i) isMatch = true;
				}
				line += isMatch ? '■' : '□';
			}
			line += retText;
		}
		return line;
	};

	/**
	 * 必要があれば、配列から座標オブジェクトへ変換
	 *
	 * @name _convert
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.issue.RequiredArea#
	 **/
	p._convert = function(obj) {
		var self = this;
		
		if(obj instanceof Array && obj.length === 3) {
			return {
				x : obj[0],
				y : obj[1],
				z : obj[2]
			};
		}
		
		return obj;
	};
	
	/**
	 * 画面更新のためのプログラム
	 * TODO: ここでやるのも疑問か？
	 *
	 * @name update
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.issue.RequiredArea#
	 * @param {Object} data
	 * @param {Object} options
	 */
	p.update = function(connector, data, options) {
		var self = this;
		
		if(!data.isTest) {
			var animationKey;
			var wasSolved = data.wasSolved != null ? data.wasSolved : self.wasResolved();
			//解決前は現在の課題に対して反映し、解決後は全ての座標の反映を元に戻す。
			var locations = wasSolved ? self.getLocationsAll() : self.getLocations(self._currentIndex - 1);
			
			options.mainController.findElements(connector.resolve(), {
				className : 'Ground'
			}, options);
			connector.connects(function(connector_s, result_s) {
				var elements = result_s;
				
				jslgEngine.log('update area:');
				
				if(locations) {
					for(var i = 0; i < locations.length; i++) {
						var location = locations[i];
						for(var j = 0; j < elements.length; j++) {
							var element = elements[j];
							var eLocation = element.getLocation();
							if(	eLocation.x == location.x &&
								eLocation.y == location.y &&
								eLocation.z == location.z) {
								animationKey = !wasSolved ?
									element.getStatus('anime_show') :
									element.getStatus('anime_default');
								
								if(animationKey) {
									options.mainController.ticker.addAnimation({
										key : element.getKey(),
										animeKey : animationKey.value,
										stopAnimation : data.stopAnimation !== undefined ? data.stopAnimation : true
									}, options);
								} else {
									jslgEngine.log('animation key was not found');
								}
							}
						}
					}
				}
				
				options.mainController.ticker.unlockAnimation();
			});
		}
	};
	
	/**
	 * 全てのパターンを実行できるようにクローンを作成する<br />
	 * 座標から正負評価をし、設定する。<br />
	 *
	 * @name _getClone
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.issue.RequiredArea#
	 * @param {Object} count
	 * @param {Object} data
	 * @param {Object} options
	 **/
	p._getClone = function() {
		var self = this;
		
		var appliedElements = [];
		
		var length = self._issueDataSets.length;
		for(var i = 0; i < length; i++) {
			var issueDataSet = self._issueDataSets[i];
			
			appliedElements.push(issueDataSet.appliedElement);
			issueDataSet.appliedElement = null;
		}
		
		var clone = jslgEngine.getClone(self);
		
		for(var i = 0; i < length; i++) {
			var issueDataSet = self._issueDataSets[i];
			
			issueDataSet.appliedElement = appliedElements[i];
		}
		var length = clone._issueDataSets.length;
		for(var i = 0; i < length; i++) {
			var issueDataSet = clone._issueDataSets[i];
			
			issueDataSet.appliedElement = appliedElements[i];
		}
		return clone;
	};
	
	/**
	 * 全てのパターンを実行できるようにクローンを作成する<br />
	 * 座標から正負評価をし、設定する。<br />
	 *
	 * @name getPatterns
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.issue.RequiredArea#
	 * @param {Object} count
	 * @param {Object} data
	 * @param {Object} options
	 **/
	p.getPatterns = function(connector, count, data, options) {
		var self = this;
		var areasLength, locationsLength, targetsLength;
		var requiredArea = self;
		var positiveLocations = data.positiveLocations;
		var negativeLocations = data.negativeLocations;
		var limit = data.limit != null ? data.limit : 0;
		var numberOfResult = data.numberOfResult||1;
		var result = data.result||[];
		//全てのパターンを取得する、あるいは接近が期待できる要素を選ぶ
		var getAll = data.getAll||false;
		//経路探査により、正確な目標までの距離を測ることで期待できる候補を選ぶ（負荷増）
		var getRoute = data.getRoute||false;
		
		var areas = requiredArea.getLastDataSet();
		//評価基準となる原点を指定（未指定だと、初回に設定された座標を原点とする）
		var originLocation = data.originLocation||areas[0].appliedLocation;
		//一致した場合の評価値
		var matchCountDegree = self.getDistance(originLocation,
								originLocation, getRoute, options);
		var location;
		
		areasLength = areas.length;
		for(var i = 0; i < areasLength; i++) {
			var locations = areas[i].locations;
			locationsLength = locations.length;
			for(var j = 0; j < locationsLength; j++) {
				location = locations[j];
				var locationKey = location.join(jslgEngine.config.locationSeparator);
				
				//TODO: Groundに依存する事は避けたい。
				var elementClassNames = requiredArea.elementClassNames.length>0 ? requiredArea.elementClassNames : ['Ground'];

                //TODO: 現状対応する抽出要素はひとつのみ
				options.mainController.findElements(connector, {
					key : location.join(jslgEngine.config.locationSeparator),
					className : elementClassNames[0]
				}, options);
				connector.connects(function(connector_s, result_ss) {
					var element = result_ss[0];
					var point = count;
					
					if(element) {
						location = element.getGlobalLocation();
						targetsLength = positiveLocations.length;
						for(var k = 0; k < targetsLength; k++) {
							var pLocation = positiveLocations[k];
							
							var distance = self.getDistance(
								{ x : location.x, y : location.y, z : location.z },
								pLocation, getRoute, options);
							
							if(locationKey === pLocation.toString()) {
								data.wasReached = true;
							}
							//目的までの距離が長ければ減点
							point-=distance;
						}
						
						targetsLength = negativeLocations.length;
						for(var k = 0; k < targetsLength; k++) {
							var nLocation = negativeLocations[k];
							
							var distance = self.getDistance(
								{ x : location.x, y : location.y, z : location.z },
								nLocation, getRoute, options);
							
							//悲観的座標までの距離が長ければ加点
							point+=distance;
						}
						requiredArea.apply(connector_s, element, data, options);
						connector_s.connects(function(connector_ss) {
							if(!requiredArea.next()) {
								if((data.limit < point||result.length<numberOfResult) || getAll) {
									//TODO: 適用した要素の参照が切れる
									var cloneRequireArea = requiredArea._getClone();
									var castCount = 0;
									data.limit = point;
									
									if(result.length>=numberOfResult && !getAll) {
										//0番目の候補が一番評価が低いので切り捨てる
										result.splice(0,1);
									}
									result.push(cloneRequireArea);
								}
							} else {
								self.getPatterns(connector_ss, point, data, options);
								connector_ss.connects(function(connector_sss) {
									requiredArea.back();
								});
							}
						});
					}
				});
			}
		}
	};
	
	/**
	 * 全てのパターンを実行できるようにクローンを作成する<br />
	 * 座標から正負評価をし、設定する。<br />
	 *
	 * @name getDistance
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.issue.RequiredArea#
	 * @param {Object} count
	 * @param {Object} data
	 * @param {Object} options
	 **/
	p.getDistance = function(target, distination, on_astar, options) {
		if(on_astar) {
			var route = options.mainController.logic.getRouteByAstar(target,
				distination, {
					element : options.mainController.getWorldRegion()
				});
			return route.length;
		}
		
		return 	Math.abs(target.x - distination.x) +
				Math.abs(target.y - distination.y) +
				Math.abs(target.z - distination.z);
	};
	
	/**
	 * 1つの実行タスクの範囲入力の結果から、<br />
	 * 考えられる入力範囲を推測する。
	 * 
	 * @name getPromisingLocations
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.issue.RequiredArea#
	 * @param {Object} options
	 **/
	p.getPromisingLocations = function(location, options) {
		var self = this;
		var originLocation = location;
		var region = options.mainController.getWorldRegion();
        var cache = [];
		var result = [];
		
		var length = self._settings.length;
		for(var i = 0; i < length; i++) {
			settings = self._settings[i];
            
            locationsList = self.getAreaBySettings(location, settings, {
                region : region,
                cache : cache
            }, options);
            
            for(var j = 0; j < locationsList.length; j++) {
                var locations = locationsList[j];
                for(var k = 0; k < locations.length; k++) {
                    result.push(locations[k]);
                }
            }
		}
		
		//現在、重複削除は行っていない
		return result;
	};
	
	o.RequiredArea = RequiredArea;
}());
