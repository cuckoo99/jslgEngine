/*
 *
 */

(function() {
	// namespace:
	var o = this.jslgEngine = this.jslgEngine||{};
	o = (o.model = o.model||{});
	o = (o.action = o.action||{});

	/**
	 * <h4>コード処理・基本クラス</h4>
	 * <p>
	 * ステージを操作する命令を実行するクラス。
	 * </p>
	 * @class
	 * @name ActionPending
	 * @memberOf jslgEngine.model.action
	 * @constructor
	 */
	var ActionPending = jslgEngine.extend(
		jslgEngine.model.action.ActionBase,
		function(options) {
			this.initialize(options);
			this.issueSetStack =[];
		}
	);
	/**
	 *
	 */
	var p = ActionPending.prototype;

	/**
	 * クラス名
	 *
	 * @name className
	 * @property
	 * @type String
	 * @memberOf jslgEngine.model.action.ActionPending#
	 **/
	p.className = 'ActionPending';

	/**
	 * 未解決の処理<br />
	 * （複数の分岐が発生する場合格納し、リストア時に再実行する）
	 *
	 * @name issueSetStack
	 * @property
	 * @type jslgEngine.model.common.Issue[]
	 * @memberOf jslgEngine.model.action.ActionPending#
	 **/
	p.issueSetStack = null;

	/**
	 * 複数の分岐処理を作成したかどうか
	 *
	 * @private
	 * @name _wasMadePendingStack
	 * @property
	 * @type Boolean
	 * @memberOf jslgEngine.model.action.ActionPending#
	 **/
	p._wasMadePendingStack = false;

	/**
	 * 非同期かどうか
	 *
	 * @private
	 * @name _isAsync
	 * @property
	 * @type Boolean
	 * @memberOf jslgEngine.model.action.ActionPending#
	 **/
	p._isAsync = true;

	/**
	 * 実行
	 *
	 * @name run
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.action.ActionPending#
	 * @param {Object} options
	 * <ul>
	 * <li>{jslgEngine.controller.IconController} iconController</li>
	 * <li>{jslgEngine.controller.mainController} mainController</li>
	 * </ul>
	 */
	p.run$ = function(connector, data, options) {
		var self = this;
		
		if(!self.isReadyToRun(connector, options)) return;
		
		self._wasDone = true;
		
		connector.resolve();
		
		// 入力待機情報の取得
		var pendingVariableKey = jslgEngine.model.logic.keys.PENDING;
		var pendingKey = jslgEngine.model.logic.keys.PEND_OBJ;
		var pendingVariable = data.localElements[pendingVariableKey];
		var pendingCommand = pendingVariable.getChild({ key : pendingKey });
		
		if(!pendingCommand) {
			jslgEngine.log('there is no pending commands.');
			return;
		}
		
        pendingCommand.removeResolvedIssues();
        
		if(data.resolveFunc) {
			//即時に要求要素を解決するメソッドが用意されている場合。
			var issues;
			
			if(!self._wasMadePendingStack) {
				//最初の問題解決パターン生成が行われていない場合
				connector.pipe(function(connector_s) {
					data.resolveFunc(connector_s.resolve(), pendingCommand, {}, options);
				}).connects(function(connector_s, result_s) {
					self.issueSetStack = result_s;
					
					issues = pendingCommand.getIssues();
					var elmData = pendingCommand.getCurrentIssue().getAppliedElement();
					if(elmData) {
						var issueSetStack = self.issueSetStack||{};
						var outputText = elmData.getPath ? elmData.getPath() : [elmData.x,elmData.y,elmData.z].join('_');
						jslgEngine.log('Next Pending(New):'+outputText+'..arg('+issueSetStack.length+')');
					}
					
					if(self.issueSetStack.length > 0) self._wasMadePendingStack = true;
					connector_s.resolve();
				});
                
                if(!data.isTest) {
                    // 解決されたとしても、問題は何だったのか描画する。
                    connector.pipe(function(connector_s) {
                        self._updateDisplay(connector_s, pendingCommand, {
                            wasSolved : false
                        }, options);
                    });
                }
			} else {
				//パターン生成後の場合
				if(data.isTest) {
					var issues = self.issueSetStack.shift();
					
					//次の候補を設定する。
					pendingCommand.reset({ issues : issues });
					//TODO: 座標確認を行っているがメッセージなどの場合もある。
					var loc = issues[0].getCurrentAppliedLocation();
					jslgEngine.log('Next Pending:'+[loc.x,loc.y,loc.z].join('_')+'..arg('+self.issueSetStack.length+')');

					if(self.issueSetStack.length == 0) {
						//分岐する候補がない場合、再び分岐の候補を再作成できるようにする。
						jslgEngine.log('close pending:');
						self._wasMadePendingStack = false;
					}
				}
			}
			
			if(data.isTest) {
				connector.pipe(function(connector_s) {
					//要求への対応をスタックに格納していく。
	                var pendingPropertyKey = jslgEngine.model.command.keys.PENDING_STACK+data.testIndex;
					if(!data[pendingPropertyKey]) {
						data[pendingPropertyKey] = [];
					}
					
					//PENDINGを新たに追加してリストに加える
					pendingCommand = new jslgEngine.model.issue.PendingCommand({
						key : jslgEngine.model.logic.keys.PEND_OBJ
					}, options);
					pendingCommand.reset({ issues : issues });
					
					data[pendingPropertyKey].push(pendingCommand);
					connector_s.resolve();
				});
			}
		}
        
        if(!data.isTest) {
            connector.pipe(function(connector_s) {
                connector_s.resolve();
                //入力待機状態にする。
                self._requireInputAgain(connector_s, pendingCommand, options);
            });
        }

		return false;
	};


	/**
	 * 入力を再要求する
	 *
	 * @name _requireInputAgain
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.action.ActionPending#
	 * @param {Object} options
	 * <ul>
	 * <li>{jslgEngine.controller.IconController} iconController</li>
	 * <li>{jslgEngine.controller.mainController} mainController</li>
	 * </ul>
	 */
	p._requireInputAgain = function(connector, pending, options) {
		var self = this;
		var pendingCommand = pending;

        connector.pipe(function(connector_s) {
            self._updateDisplay(connector_s, pendingCommand, {
            }, options);
        });
		
        if(!pendingCommand.wasResolved()) {
			connector.pipe(function(connector_s) {
				//入力待機
				jslgEngine.log('Waiting for PendingCommand...');
				pendingCommand.connector = connector_s;
				options.mainController.pendingCommand = pendingCommand;
			}).connects(function(connector_s) {
				self._requireInputAgain(connector_s, pendingCommand, options);
			}).pipe(function(connector_s) {
				jslgEngine.log('resolved PendingCommand'+connector_s._index);
				connector_s.resolve();
			});
		}
	};
	
	/**
	 * リストア
	 *
	 * @name _updateDisplay
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.action.ActionPending#
	 * @param {Object} options
	 * <ul>
	 * <li>{jslgEngine.controller.IconController} iconController</li>
	 * <li>{jslgEngine.controller.mainController} mainController</li>
	 * </ul>
	 */
	p._updateDisplay = function(connector, pending, data, options) {
		var issue = pending.getCurrentIssue();
		
		issue.update(connector, data, options);
	};

	/**
	 * リストア
	 *
	 * @name restore
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.action.ActionPending#
	 * @param {Object} options
	 * <ul>
	 * <li>{jslgEngine.controller.IconController} iconController</li>
	 * <li>{jslgEngine.controller.mainController} mainController</li>
	 * </ul>
	 */
	p.restore$ = function(connector, data, options) {
		var self = this;
		var doneTest = false;

		if(!self.isReadyToRestore(connector, options)) return;

		self._wasDone = false;
		
		connector.resolve();
		
		if(data.isTest && self.issueSetStack && self.issueSetStack.length > 0) {
			//テストの場合、復元時に異なる結果を得るため再実行（テスト）を行う。
			var command = self.getSelfElement(connector, data, options);
			
			if(!command) {
				jslgEngine.log('This Pending Command has no Command key');
				return;
			}
			
			var retryCountKey = jslgEngine.model.command.keys.RETRY_COUNT+data.testIndex;
			var retryCount = connector.getProperty(retryCountKey);
			retryCount = retryCount != null ? retryCount : 0;
			var numberOfResult = data.numberOfResult||1;
			
			if(retryCount < numberOfResult - 1) {
				//復元すると追加した要求への対応を一つ戻す。
				var pendingStack = data[jslgEngine.model.command.keys.PENDING_STACK+data.testIndex];
				
				if(pendingStack) {
					pendingStack.pop();

					jslgEngine.log('再実行：'+jslgEngine.testCount);
					//TODO: ConnectorではなくてLocalElementsを経由すべき
					connector.setProperty(retryCountKey, retryCount+1);
					doneTest = true;
					
					command = command.getRunnableCommand();
					command.test(connector, data, options);
					connector.connects(function(connector_s) {
						jslgEngine.dispose(command);
					});
				} else {
					jslgEngine.log('Not found pendingStack');
				}
			} else {
				jslgEngine.log('!!Occured Command Test Limit:'+jslgEngine.testCount);
			}
		}
	};

	o.ActionPending = ActionPending;
}());
