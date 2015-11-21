/*
 * @author cuckoo99
 */

(function() {
	// namespace:
	var o = this.jslgEngine = this.jslgEngine||{};
	o = (o.model = o.model||{});
	o = (o.command = o.command||{});

	/**
	 * <h4>イベント実行クラス</h4>
	 * <p>
	 * 解決された未解決要素を含む、一連の処理をまとめて実行できるオブジェクト。
	 * </p>
	 * @class
	 * @name CommandDriver
	 * @memberOf jslgEngine.model.command
	 * @constructor
	 */
	var CommandDriver = function(options) {
		this.initialize(options);
	};
	
	/**
	 *
	 */
	var p = CommandDriver.prototype;

	/**
	 * クラス名
	 *
	 * @name className
	 * @property
	 * @type String
	 * @memberOf jslgEngine.model.command.CommandDriver#
	 **/
	p.className = 'CommandDriver';

	/**
	 * 実行するイベントのキー
	 *
	 * @name _commandKey
	 * @property
	 * @type String
	 * @memberOf jslgEngine.model.command.CommandDriver#
	 **/
	p._commandKeyData = null;

	/**
	 * 未解決問題（実行には解決済みである必要がある）
	 *
	 * @name _resolvedPendingCommands
	 * @property
	 * @type String
	 * @memberOf jslgEngine.model.command.CommandDriver#
	 **/
	p._resolvedPendingCommands = null;

	/**
	 * 初期化
	 *
	 * @name initialize
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.command.CommandDriver#
	 **/
	p.initialize = function(options) {
		var self = this;
		self._commandKeyData = options.commandKeyData;
		self._resolvedPendingCommands = options.pendingCommands;
	};
	
	/**
	 * 実行
	 *
	 * @name run
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.command.CommandDriver#
	 * @param {Object} options
	 */
	p.run = function(connector, data, options) {
		var self = this;
		
		self.getCommand(connector, options);
		connector.connects(function(connector_s, result_s) {
			var element = result_s[0];
		
			if(element) {
				jslgEngine.log('★Drive Command next :'+element.getPath());
	
				element = element.getRunnableCommand();
				
				element.run(connector_s, {
					resolveFunc : function(connector_ss, pending, data, options) {
						connector_ss.pipe(function(connector_sss) {
							if(self._resolvedPendingCommands) {
								var pendingCommand = self._resolvedPendingCommands.shift();
								issues = pendingCommand.getIssues();
								
								var hasMessage = false;
								for(var i = 0; i < issues.length; i++) {
									if(issues[i].className === 'RequiredMessage') {
										hasMessage = true;
									}
								}
								if(!hasMessage) {
                                    // 実際に実行する場合、ユーザーにメッセージは選択させる。
									pending.reset({ issues : issues });
								}
							} else {
								jslgEngine.log('Not Found Pending Commands for CommandDriver');
							}
							connector_sss.resolve({ result : [] });
						});
					}
				}, options);
				connector_s.connects(function(connector_ss) {
					jslgEngine.dispose(element);
					element = null;
				});
			}
		});
	};

	/**
	 * イベントを取得
	 *
	 * @name getCommand
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.command.CommandDriver#
	 **/
	p.getCommand = function(connector, options) {
		var self = this;
		
		connector.connects(function(connector_s, result_s) {
			options.mainController.findElements(connector_s, {
				key : self._commandKeyData.getPath()
			}, options);
		});
	};
	
	/**
	 * 原点の座標を取得
	 *
	 * @name getOriginLocation
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.command.CommandDriver#
	 **/
	p.getOriginLocation = function(options) {
		var self = this;
		var key = self._commandKeyData.getPath();
		var index = key.length;
		
		//イベントから絶対座標を拾うため、親を辿る。
		while((index = key.lastIndexOf('.', index)) !== -1) {
			var element = options.mainController.findElements(connector, {
				key : key.substring(0, index)
			})[0];
			
			if(element.getGlobalLocation !== undefined) {
				return element.getGlobalLocation();
			}
			index--;
		}
		
		jslgEngine.log('Not found origins location');
		return null;
	};
	
	/**
	 * 適用される全ての範囲から作用線を取得する
	 * （範囲とは未解決範囲の事）
	 *
	 * @name getAllActiveVectors
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.command.CommandDriver#
	 **/
	p.getAllActiveVectors = function(options) {
		var self = this;
		var originLocation = self.getOriginLocation(options);
		
		var locations = [];
		
		var length = self._resolvedPendingCommands.length;
		for(var i = 0; i < length; i++) {
			var pendingCommand = self._resolvedPendingCommands[i];
			var issues = pendingCommand.getIssues();
			for(var j = 0; j < issues.length; j++) {
				var issue = issues[j];
				
				var tempLocations = issue.getLocationsAll();
				for(var k = 0; k < tempLocations.length; k++) {
					var temp = tempLocations[k];
					
					locations.push({
						x : originLocation.x + temp.x, 
						y : originLocation.y + temp.y,
						z : originLocation.z + temp.z 
					});
				}
			}
		}
		
		//重複削除
		return self._getRemovingDuplicate(locations);
	};
	
	/**
	 * 1つの実行タスクの範囲入力の結果から、<br />
	 * 考えられる入力範囲を推測する。
	 * 
	 * @name getPromisingLocations
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.command.CommandDriver#
	 **/
	p.getPromisingLocations = function(options) {
		var self = this;
		var originLocation = self.getOriginLocation(options);
		
		var locations = [];
		
		var length = self._resolvedPendingCommands.length;
		for(var i = 0; i < length; i++) {
			var pendingCommand = self._resolvedPendingCommands[i];
			var issues = pendingCommand.getIssues();
			for(var j = 0; j < issues.length; j++) {
				var issue = issues[j];
				
				var tempLocations = issue.getPromisingLocations(originLocation, options);
				for(var k = 0; k < tempLocations.length; k++) {
					var temp = tempLocations[k];
					
					locations.push({
						x : originLocation.x + temp.x, 
						y : originLocation.y + temp.y,
						z : originLocation.z + temp.z 
					});
				}
			}
		}
		
		//重複削除
		return self._getRemovingDuplicate(locations);
	};
	
	/**
	 * 1つの実行結果から仮定のイベントドライバを生成し、取得する。
     * 重複する座標の場合、どちらかを削除する方がいい？
	 * 
	 * @name getPromisingCommandDrivers
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.command.CommandDriver#
	 **/
	p.getPromisingCommandDrivers = function(data, options) {
		var self = this;
		//制限
		var limit = 5;
		var originLocation = self.getOriginLocation(options);
		
        var drivers = [];
		var locations = [];
		
        var selectIssue = function(index, issues) {
			for(var j = index; j < issues.length; j++) {
				var issue = issues[j];
				
                //入力可能なパターンを全て網羅
				var tempLocations = issue.getPromisingLocations(originLocation, options);
				for(var k = 0; k < tempLocations.length; k++) {
					var temp = tempLocations[k];
					
					locations.push({
						x : originLocation.x + temp.x, 
						y : originLocation.y + temp.y,
						z : originLocation.z + temp.z 
					});
				}
			}
        };
		var pendingCommands = [];
        
		var length = self._resolvedPendingCommands.length;
		for(var i = 0; i < length; i++) {
			var pendingCommand = self._resolvedPendingCommands[i];
			var isPengingMoving = pendingCommand.hasExpectedMoving();
			var issues = pendingCommand.getIssues();
            //selectIssue(0, issues);
            
			for(var j = 0; j < issues.length; j++) {
				var requiredArea = issues[j];
				
				//最も距離が近いことの期待できるパターンを幾つか取得
				requiredArea.getPatterns(0, {
					positiveLocations : data.destinations,
					negativeLocations : null,
					getAll : false,
					useForce : true,
					numberOfResult : limit,
					result : issueSet
				}, options);
			}
			
			if(isPengingMoving) {
				//最終的
			}
		}
        var commandDriver = new jslgEngine.model.command.CommandDriver({
            commandKeyData : self._commandKeyData,
            pendingCommands : pendingCommands
        });
	};
	
	
	/**
	 * 重複を削除する、
	 * 
	 * @name _getRemovingDuplicate
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.command.CommandDriver#
	 * @param {Object} location
	 **/
	p._getRemovingDuplicate = function(locations) {
		var self = this;

		for(var j = 0; j < locations.length; j++) {
			var location = locations[j];
			for(var k = 0; k < locations.length; k++) {
				var old = locations[k];
				if( j != k &&
					old.x === location.x &&
					old.y === location.y &&
					old.z === location.z) {
					locations.splice(k, 1);
					k--;
				}
			}
		}
		return locations;
	};
	
	/**
	 * 他イベントを停止されるコードを含むか確認
	 *
	 * @name hasKillCommand
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.command.CommandDriver#
	 * @param {Object} command
	 * @param {Object} options
	 **/
	p.hasKillCommand = function(command, options) {
		var self = this;
		
		var length = self._resolvedPendingCommands.length;
		for(var i = 0; i < length; i++) {
			var pendingCommand = self._resolvedPendingCommands[i];
			
			var kills = pendingCommand.getKillCommands();
			for(var j = 0; j < kills.length; j++) {
				if(kills[j] === command.getPath()) {
					return true;
				}
			}
		}
		return false;
	};
	
	/**
	 * 指定された座標が参照されるかどうかチェックする
	 *
	 * @name exists
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.command.CommandDriver#
	 * @param {Object} location
	 * @param {Object} options
	 **/
	p.exists = function(location, options) {
		var self = this;
		
		var locations = self.getAllActiveVectors(options);
		
		var length = locations.length;
		for(var i = 0; i < length; i++) {
			if(	locations[i].x === location.x &&
				locations[i].y === location.y &&
				locations[i].z === location.z) return true;
		}
		return false;
	};
	
	/**
	 * 移動による最終的な座標を取得する。
	 * 
	 * @name getLastMovingLocation
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.command.CommandDriver#
	 * @param {Object} options
	 **/
	p.getLastMovingLocation = function(options) {
		var self = this;
		var location = null;
		
		var length = self._resolvedPendingCommands.length;
		for(var i = 0; i < length; i++) {
			var pendingCommand = self._resolvedPendingCommands[i];
			var reputations = pendingCommand.getReputations();
			
			for(var j = 0; j < reputations.length; j++) {
				var reputation = reputations[j];
				if(reputation.type === jslgEngine.model.action.keys.SLG_MOVE) {
					//最終的な座標を求める
					location = reputation.location;
				}
			}
		}
		return location;
	};
	
	/**
	 * イベント実行による評価値を得る
	 * 
	 * @name getReview
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.command.CommandDriver#
	 * @param {Object} options
	 **/
	p.getReview = function(options) {
		var self = this;
		var point = 0;
		
		if(!self._resolvedPendingCommands) return point;
		
		var length = self._resolvedPendingCommands.length;
		for(var i = 0; i < length; i++) {
			var pendingCommand = self._resolvedPendingCommands[i];
			var reputations = pendingCommand.getReputations();
			
			for(var j = 0; j < reputations.length; j++) {
				var reputation = reputations[j];
				point += reputation.point;
			}
		}
		return point;
	};
    
	/**
	 * 他イベントを停止されるコードを含むか確認
	 *
	 * @name getTextOfResolvedLocations
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.command.CommandDriver#
	 **/
	p.getText = function() {
		var self = this;
		var text = '';
		
		//テスト出力用
		var length = self._resolvedPendingCommands.length;
		for(var i = 0; i < length; i++) {
			var pendingCommand = self._resolvedPendingCommands[i];
			
			var issues = pendingCommand.getIssues();
			for(var j = 0; j < issues.length; j++) {
				var location = issues[j].getCurrentAppliedLocation();
				
				text += ['[',location.x,location.y,location.z,']\n'].join();
			}
		}
		return text;
	};
	
	o.CommandDriver = CommandDriver;
}());
