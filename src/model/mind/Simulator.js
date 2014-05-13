/*
 * @author cuckoo99
 */

(function() {
	// namespace:
	var o = this.jslgEngine = this.jslgEngine||{};
	o = (o.model = o.model||{});
	o = (o.mind = o.mind||{});

	/**
	 * <h4>シミュレートクラス</h4>
	 * <p>
	 * イベントをテストして、最適な答えを導き出す。<br />
	 * <br />
	 * SLG固有のシステムに依存する。<br />
	 * </p>
	 * @class
	 * @name Simulator
	 * @memberOf jslgEngine.model.mind
	 * @constructor
	 */
	var Simulator = jslgEngine.extend(
		jslgEngine.model.common.JSlgElementBase,
		function(data, options) {
			this.initialize(data, options);
		}
	);
	/**
	 *
	 */
	var p = Simulator.prototype;

	/**
	 * Mindから引き継がれるパラメータ
	 * 
	 * @private
	 * @name _arguments
	 * @property
	 * @type Object
	 * @memberOf jslgEngine.model.mind.Simulator#
	 **/
	p._arguments = null;

	/**
	 * 仮定イベントドライバを作成するかどうか。
	 * 
	 * @private
	 * @name _hasFakeCommandDriver
	 * @property
	 * @type Object
	 * @memberOf jslgEngine.model.mind.Simulator#
	 **/
	p._hasFakeCommandDriver = true;

	/**
	 * 初期化
	 *
	 * @name initialize
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.mind.Simulator#
	 * @param {Object} options
	 * <ul>
	 * </ul>
	 **/
	p.initialize = function(data, options) {
        var self = this;
        
        self._arguments = data.arguments;
    };
    
	/**
	 * 実行（結果をresultに格納）
	 *
	 * @name run
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.mind.Simulator#
	 * @param {Object} options
	 * <ul>
	 * </ul>
	 **/
	p.run = function(connector, data, options) {
		var self = this;
        
		var commandKey = data.commandKey;
		var commandValue = data.commandValue;
		var me = data.me;
		var family = data.family;
		var enemy = data.enemy;
		var result = data.result;
		
		var commandDriversList = [];
		var selection = [];
		var availableCommands = [];
		
        // 目標までの作用線を得る。
		var originLocation = me.getGlobalLocation();
		var distinations = [];
		for(var i = 0; i < enemy.length; i++) {
			var target = enemy[i];
			//対象の座標を取得する。
			var targetLocation = target.getGlobalLocation();
			
			distinations.push({
				x : targetLocation.x - originLocation.x,
				y : targetLocation.y - originLocation.y,
				z : targetLocation.z - originLocation.z,
			});
		}
        
		me.findElements(connector, { className : 'Item' }, options);
		connector.connects(function(connector_s, result_s) {
			var commands = [];
			var tempCommands = result_s;
			for(var i = 0; i < tempCommands.length; i++) {
				var key = tempCommands[i].getKey();
				if(key !== 'onClick' && key !== 'onChange') {
					commands.push(tempCommands[i]);
				}
			}
			
			availableCommands = (commandKey && commandValues) ? self._pickUpElements(
				commandKey,
				commandValues,
				commands,
				options
				) : commands;
			for(var i = 0; i < availableCommands.length; i++) {
				//TODO: いつか破棄しないといけない。
				availableCommands[i] = availableCommands[i].getRunnableCommand({}, options);
			}
			
	        //イベント単位でまとまったイベントドライバ
	        
	        var mindInfo = {
	            commands : availableCommands,
	            me : me,
	            family : family,
	            enemy : enemy,
	            distinations : distinations,
	            driversList : commandDriversList
	        };
	        
	        //単体テストによりヒントを得る。
			self._getCommandDriversByUnitTest(connector_s, mindInfo, options);
		}).connects(function(connector_s) {
            //影響力のある順にソートをかける。
            self._sortCommandDriverOrderByEffect({
            	driversList : commandDriversList
            });
            
			//最も影響力のあるとされるイベントドライバをリストから取得
			self._getMostEffectiveCommandDriversList(
				connector_s, commandDriversList, data, selection, options);
		}).connects(function(connector_s) {
			if(selection.length > 0) {
				//影響力のある順にソートをかける。
	            self._sortCommandDriverOrderByEffect({
	            	driversList : selection
	            });
	            
				//TODO: 暫定で0番目
				var commandDrivers = selection[0].drivers;
				
				result.push(commandDrivers);
			}
		}).pipe(function(connector_s) {
			for(var i = 0; i < availableCommands.length; i++) {
				//TODO: いつか破棄しないといけない。
				jslgEngine.dispose(availableCommands[i]);
			}
			jslgEngine.log('Simulator works were finished.');
			connector_s.resolve();
		});
	};

	/**
	 * 単体テストを行い、個別にイベントドライバを取得する。
	 * 再帰的に処理する
	 *
	 * @name _getCommandDriversByUnitTest
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.mind.Simulator#
	 * @param {Object} options
	 * <ul>
	 * </ul>
	 **/
	p._getCommandDriversByUnitTest = function(connector, data, options) {
        var self = this;
        var availableCommands = data.commands;
        var me = data.me;
        var family = data.family;
        var enemy = data.enemy;
        var driversList = data.driversList;
        var drivers = [];

        connector.loop({
        	elements : availableCommands,
        	limit : 3
        }, function(connector_s, result_s) {
        	var availableCommand = result_s;

			self._test(connector_s.resolve(), {
				command : availableCommand,
				me : me,
				family : family,
				enemy : enemy
			}, drivers, options);
			
			connector_s.connects(function(connector_ss) {
				//イベント単位でイベントドライバを作成
				driversList.push({
					drivers : drivers
				});
				drivers = [];
				
				//テスト結果の掃除
				connector_ss.clearProperty();
			});
        });
    };
    
	/**
	 * イベントの単体テストを行う
	 *
	 * @name _test
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.mind.Simulator#
	 * @param {Object} options
	 * <ul>
	 * </ul>
	 **/
	p._test = function(connector, data, out, options) {
		var self = this;
		var availableCommand = data.command;
		var me = data.me;
		var family = data.family;
		var enemy = data.enemy;
		var numberOfResult = 1;
		var innerFunc = data.innerFunc;
		var pendingCommands = data.pendingCommands;
		
		jslgEngine.log('★Test next :'+availableCommand.getPath());

		connector.pipe(function(connector_s) {
			availableCommand.test(connector_s.resolve(), {
				resolveFunc : function(connector_ss, pending, data, options) {
					//パターンをコールバックに引き渡す。
					data.family = family;
					data.enemy = enemy;
					self._resolveInTest(connector_ss, pending, data, options);
				},
				innerFunc : innerFunc,
				checkFunc : function(pending, data, review_func, options) {
					//情報を渡してActionに評価をしてもらう。
					return self._checkInTest({
                            pendingCommand : pending,
                            me : me,
                            family : family,
                            enemy : enemy,
                            inputData : data
                        }, review_func, options);
				},
				testIndex : data.testIndex,
				numberOfResult : numberOfResult
			}, options);
			connector_s.pipe(function(connector_ss) {
				jslgEngine.log('End mind test:');
				var commandDrivers = connector_ss.getProperty(jslgEngine.model.command.keys.EVENT_DRIVERS);
				
				if(commandDrivers) {
					var best = 0, reputation = 0;
					for(var i = 0; i < commandDrivers.length; i++) {
						var commandDriver = commandDrivers[i];
						
						out.push(commandDriver);
					}
				}
				connector_ss.setProperty(jslgEngine.model.command.keys.EVENT_DRIVERS, null);

				connector_ss.resolve();
			});
		});
	};
    
	/**
	 * 最も影響力のある順にイベントドライバをソートする。
	 *
	 * @name _sortCommandDriverOrderByEffect
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.mind.Simulator#
	 * @param {Object} options
	 **/
	p._sortCommandDriverOrderByEffect = function(data, options) {
        var driversList = data.driversList;
        
        //影響範囲の多い順にソートする。
		for(var i = 0; i < driversList.length; i++) {
			var commandDrivers = driversList[i].drivers;
		
			commandDrivers.sort(function(a, b) {
				//影響度の大きい順にソート
				return a.getReview() - b.getReview();
			});
		}
		driversList.sort(function(a, b) {
			//影響度の大きいイベント順にソート
			return a.drivers[0].getReview() - b.drivers[0].getReview();
		});
        return driversList;
    }
    
	/**
	 * 最も影響力のあるイベントドライバを探す。
	 *
	 * @name _getMostEffectiveCommandDriver
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.mind.Simulator#
	 * @param {Object} options
	 * <ul>
	 * </ul>
	 **/
	p._getMostEffectiveCommandDriversList = function(connector, drivers_list, data,　out, options) {
		var self = this;
		var driversList = drivers_list;
		var result = [];
		var driverStack = [];
		var selection = [];
		
		//TODO: 総当りの組み合わせによる抽出をやめて、
		//		再帰的にテストすることにした。
		
		//候補となる順列結果の数
		var numberOfResult = 3;
		//無限ループ抑止
		var killingLoopCount = 1;
		
		//ドライバの順列は一つだけ取得。
		data.numberOfResult = 1;
		
		jslgEngine.log('-- Search CommandDriver Patterns --');
		
		while(numberOfResult > 0 && (killingLoopCount--) > 0) {
			connector.pipe(function(connector_s) {
				//順列を作成する
		        for(var i = 0; i < driversList.length; i++) {
					var drivers = driversList[i].drivers;
					//最高の評価のドライバを一つずつ組み合わせる。
					driverStack.push(drivers[0]);
				}
				connector_s.resolve();
			}).pipe(function(connector_s) {
				
				//テストによりドライバの順列を作成。
				self._testCommandDrivers(connector_s, driverStack, data, selection, options);
			}).pipe(function(connector_s) {
				connector_s.clearProperty();
				
				//結果として返す。
				out.push({
					drivers : selection
				});
				numberOfResult = out.length;
				selection = [];
				
				connector_s.resolve();
			});
		}
		
		return result;
	};
	
	/**
	 * イベントドライバの結合テストを行う。
	 *
	 * @name _testCommandDrivers
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.mind.Simulator#
	 * @param {Object} options
	 * <ul>
	 * </ul>
	 **/
	p._testCommandDrivers = function(connector, drivers, data, out, options) {
		var self = this;
		var driver = drivers.pop();
		
		//TODO: 先に実行させておくべき
		connector.resolve();
		
		if(driver) {
			driver.getCommand(connector, options);	
			connector.connects(function (connector_s, result_s) {
				var availableCommand = result_s[0];
				
				if(availableCommand) {
					//TODO: 後始末をしなければならない。
					availableCommand = availableCommand.getRunnableCommand();
					
					self._test(connector_s, {
						command : availableCommand,
						me : data.me,
						family : data.family,
						enemy : data.enemy,
						innerFunc : function(connector_ss, data_s, options_s) {
							//TODO
							data.testIndex = data_s.testIndex;
							
							self._testCommandDrivers(connector_ss, drivers, data, out, options_s);
						},
						numberOfResult : data.numberOfResult,
						testIndex : data.testIndex
					}, out, options);
				}
			});
		}
	};
	
	/**
	 * 任意の座標に一致するイベントドライバを抽出する。
	 *
	 * @name _getCommandDriverPairsByLocations
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.mind.Simulator#
	 * @param {Object} options
	 * <ul>
	 * </ul>
	 **/
	p._getCommandDriverPairsByLocations = function(connector, drivers_list, data, options) {
        var self = this;
		var driversList = drivers_list;
        var distinations = data.distinations;
		var maxNumberOfJoint = 2; //最大結合数
		var driverStack = [];
		var result = [];
		
		//イベントの順列を抽出する。
		self._chooseEachCommands(0, driversList.length, [], driversList, [], driverStack);
		
		//イベント・ドライバの順列を抽出する。
        //self._chooseEachCommandDriverPairs(0, maxNumberOfJoint, driverStack, [], []);
		
		for(var i = 1; i < maxNumberOfJoint; i++) {
			
			var numberOfJoint = i;
			var commandArrangements = [];
			var distinationArrangements = [];
			
			//指定された結合数のイベントの順列を網羅する。
			chooseEachCommands(0, numberOfJoint, [], driversList, [], commandArrangements);
			
			for(var j = 0; j < commandArrangements.length; j++) {
				var　arrangements = commandArrangements[j];
				
				//指定されたイベントの順列から、イベントドライバの順列を求める。
				chooseEachCommandDriverPairs(0, numberOfJoint, arrangements, distinations, [], distinationArrangements);
				result = result.concat(distinationArrangements);
			}
		}
		
		return result;
	};
	    	
	/**
	 * イベントの結合テストを行う
	 *
	 * @name _testJoin
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.mind.Simulator#
	 * @param {Object} options
	 * <ul>
	 * </ul>
	 **/
	p._testJoin = function(connector, data, options) {
        //TODO: 結合テストが未完成
    };
    
	/**
	 * 指定されたステータスを持つ要素を取り出す
	 *
	 * @name _pickUpElements
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.mind.Simulator#
	 * @param {Object} options
	 * <ul>
	 * </ul>
	 **/
	p._pickUpElements = function(key, values, objs, options) {
		var length, objsLength;
		var elements = [];
		length = values.length;
		for(var i = 0; i < length; i++) {
			var value = values[i];
			objsLength = objs.length;
			for(var j = 0; j < objsLength; j++) {
				var obj = objs[j];
				var status = obj.getStatus(key);
				if(status && status.value === value) {
					elements.push(obj);
				}
			}
		}
		return elements;
	};
	
	/**
	 * テスト中に発生した未解決の問題要素の組み合わせを全て探し出し、解決する
	 *
	 * @name _resolveInTest
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.mind.Simulator#
	 * @param {Object} options
	 * <ul>
	 * </ul>
	 **/
	p._resolveInTest = function(connector, pending, data, options) {
		var self = this;
		
		var pendingCommand = pending;
		var commandKey = options.commandKey;
		var family = data.family;
		var enemy = data.enemy;
		
		if(pendingCommand) {
			var positiveLocations = [], negativeLocations = [];
			
			//TODO: これは攻撃の場合
			for(var j = 0; j < family.length; j++) {
				negativeLocations.push(family[j].getGlobalLocation());
			}
			for(var j = 0; j < enemy.length; j++) {
				positiveLocations.push(enemy[j].getGlobalLocation());
			}
			
			var beforeIssueSetList = [];
			
			self._calculatePatterns(connector, {
				pendingCommand : pending,
				negativeLocations : negativeLocations,
				positiveLocations : positiveLocations,
				beforeIssueSetList : beforeIssueSetList
			}, options);
			
			for(var i = 0; i < beforeIssueSetList.length; i++) {
				data.result.push(beforeIssueSetList[i]);
			}
		} else {
			jslgEngine.log('mind:'+self.getPath()+' has no pendingCommand.');
		}
	};

	/**
	 * 問題が解決するまでループ
	 *
	 * @name _calculatePatterns
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.mind.Simulator#
	 * @param {Object} options
	 * <ul>
	 * </ul>
	 **/
	p._calculatePatterns = function(connector, data, options) {
		var self = this;
		var pendingCommand = data.pendingCommand;
		var negativeLocations = data.negativeLocations;
		var positiveLocations = data.positiveLocations;
		var beforeIssueSetList = data.beforeIssueSetList||[];
		
		var requiredArea = pendingCommand.getCurrentIssue();
		var issueSet = [];
		
		requiredArea.getPatterns(connector, 0, {
			positiveLocations : positiveLocations,
			negativeLocations : negativeLocations,
			getAll : false, //全てのパターンを取得する,
			limit : 0, //初期値
			numberOfResult : 1, //TODO:
			result : issueSet
		}, options);
		
		connector.pipe(function(connector_s) {
			var limit = jslgEngine.config.loopLimit;
			//解決できなかった場合、強制的に解決する。
			connector_s.resolve();
			while(!requiredArea.wasResolved() && (limit--)) {
				requiredArea.resolve(connector_s, {}, { useForce : true }, options);
			}
		}).pipe(function(connector_s) {
			//評価順にソートされているはずなので、先頭の要素を適用する。
			var bestRequiredArea = issueSet.pop();
			if(bestRequiredArea) {
				requiredArea.rewrite(bestRequiredArea);
			}
			
			//TODO: 非常に良くない。
			// 総当りで、要求要素全て、前回の総数*現在の総数分のパターンを作成する
			var temporary = [];
			for(var i = 0; i < issueSet.length; i++) {
				var issue = issueSet[i];
				var before = null;
				for(var j = 0; j < beforeIssueSetList.length; j++) {
					beforeIssueSet = beforeIssueSetList[j];
					beforeIssueSet.push(issue);
				}
			}
			if(beforeIssueSetList.length == 0 && issueSet.length > 0) {
				beforeIssueSetList.push(issueSet);
			}
			connector_s.resolve();
		}).pipe(function(connector_s) {
			connector_s.resolve(beforeIssueSetList);
			if(pendingCommand.next()) {
				self._calculatePatterns(connector, data, options);
			}
		});
	};
	
	/**
	 * テスト中に発生した未解決の問題要素の影響を測定する
	 * （Add、Remove、Setなどが発生するたびにチェックする）
	 *
	 * @name _checkInTest
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.mind.Simulator#
	 * @param {Object} options
	 * <ul>
	 * </ul>
	 **/
	p._checkInTest = function(data, review_func, options) {
		var self = this;
        var pending = data.pendingCommand;
        var me = data.me;
        var family = data.family;
        var enemy = data.enemy;
        var inputData = data.inputData;
		var arguments = self._arguments;
		var resultFamily = [], resultEnemy = [];
		var targets = inputData.target instanceof Array ? inputData.target : [inputData.target];

		//それが敵なのか、味方なのか抜き出して伝える。
		var targetFamily = self._pickUpElements(
			arguments.memberKey,
			arguments.familyMemberNames,
			targets,
			options
			);
		var targetEnemy = self._pickUpElements(
			arguments.memberKey,
			arguments.enemyMemberNames,
			targets,
			options
			);
		
		for(var i = 0; i < targetFamily.length; i++) {
			var cast = targetFamily[i];
			var distance = self._getDistanceOfLocation(me.getGlobalLocation(), cast.getGlobalLocation());
			resultFamily.push({
				data : cast,
				distance : distance
			});
		}
		for(var i = 0; i < targetEnemy.length; i++) {
			var cast = targetEnemy[i];
			var distance = self._getDistanceOfLocation(me.getGlobalLocation(), cast.getGlobalLocation());
			resultEnemy.push({
				data : cast,
				distance : distance
			});
		}
		
		var mindResult = {
			me : me,
			family : resultFamily,
			enemy : resultEnemy,
			measureFunc : self._getDistanceOfLocation
		};
	
		var reputation = review_func(mindResult, inputData, options);
		pending.addReputation(reputation);
	};

	/**
	 * 座標の距離を測る
	 * TODO: Locationに移すべきだが、現在全てがLocationオブジェクトになっているわけではないので実装すべきでない。
	 *
	 * @name _getDistanceOfLocation
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.mind.Simulator#
	 * @param {Object} options
	 * <ul>
	 * </ul>
	 **/
	p._getDistanceOfLocation = function(a, b) {
		return (Math.abs(a.x-b.x)+Math.abs(a.y-b.y)+Math.abs(a.z-b.z));
	};

	o.Simulator = Simulator;
}());