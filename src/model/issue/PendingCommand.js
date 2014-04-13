/*
 * @author cuckoo99
 */

(function() {
	// namespace:
	var o = this.jslgEngine = this.jslgEngine||{};
	o = (o.model = o.model||{});
	o = (o.issue = o.issue||{});

	/**
	 * <h4>問題オブジェクト</h4>
	 * <p>
     * it includes something of Issue information about the input.<br />
     * when Issue resolved, parmit next procedure of Command.<br />
	 * アクション、イベントなどで必要な要素が不足している場合、<br />
	 * 値を与えることで処理を解決する。<br />
	 * </p>
	 * @class
	 * @name PendingCommand
	 * @memberOf jslgEngine.model.issue
	 * @constructor
	 */
	var PendingCommand = jslgEngine.extend(
		jslgEngine.model.common.JSlgElementVariable,
		function(data, options) {
			this.initialize(data, options);
			
			if(!data) return;
			
			this.commandKey = data.commandKey;
			this.callback = data.callback;
			this._issues = [];
			this._currentIndex = 0;
			this.reputations = [];
		}
	);
	/**
	 *
	 */
	var p = PendingCommand.prototype;

	/**
	 * クラス名
	 *
	 * @name className
	 * @property
	 * @type String
	 * @memberOf jslgEngine.model.issue.PendingCommand#
	 **/
	p.className = 'PendingCommand';

	/**
	 * どこにでも着脱可能かどうか
	 *
	 * @name _isFloat
	 * @property
	 * @type Boolean
	 * @memberOf jslgEngine.model.issue.PendingCommand#
	 **/
	p._isFloat = true;

	/**
	 * 対象キーコード
	 *
	 * @name keyCode
	 * @property
	 * @type String
	 * @memberOf jslgEngine.model.issue.PendingCommand#
	 **/
	p._keyCode = jslgEngine.model.stage.keys.PENDING_EVENT;

	/**
	 * イベント・キー
	 *
	 * @private
	 * @name commandKey
	 * @property
	 * @type String
	 * @memberOf jslgEngine.model.issue.PendingCommand#
	 **/
	p.commandKey = null;

	/**
	 * コールバック
	 *
	 * @private
	 * @name callback
	 * @property
	 * @type Function
	 * @memberOf jslgEngine.model.issue.PendingCommand#
	 **/
	p.callback = null;

	/**
	 * 直列化クラス
	 *
	 * @private
	 * @name connector
	 * @property
	 * @type jslgEngine.model.network.ConnectorOnline
	 * @memberOf jslgEngine.model.issue.PendingCommand#
	 **/
	p.connector = null;

	/**
	 * resolveを実装したオブジェクト
	 *
	 * @private
	 * @name issues
	 * @property
	 * @type Object[]
	 * @memberOf jslgEngine.model.issue.PendingCommand#
	 **/
	p._issues = null;

	/**
	 * 現在の問題インデックス
	 *
	 * @name _currentIndex
	 * @property
	 * @type Number
	 * @memberOf jslgEngine.model.issue.PendingCommand#
	 **/
	p._currentIndex = null;

	/**
	 * 評価情報
	 *
	 * @name reputations
	 * @property
	 * @type Object[]
	 * @memberOf jslgEngine.model.issue.PendingCommand#
	 **/
	p.reputations = null;

	/**
	 * 子要素の取得
	 *
	 * @name _findElements
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.issue.PendingCommand#
	 * @param {Object} options
	 * <ul>
	 * <li>{jslgEngine.model.network.ConnectorBase} connector</li>
	 * <li>{jslgEngine.model.common.JSlgElementFinder} finder</li>
	 * <li>{String} filter</li>
	 * </ul>
	 */
	p._findElements = function(connector, data, options) {
		var self = this;
		var obj = data.obj||[];
		var target = obj.shift();
		
		var issue = self.getCurrentIssue();
		var element = issue.getAppliedElement();
		
		//解決済みの要素が存在し、キーが一致する場合、その要素内と一致させた状態から、
		//さらに内部を探査
		if(element instanceof jslgEngine.model.common.JSlgKey) {
			var path = element.getPath();
			
			element = options.mainController.findElements(connector, {
				key : path
			}, options)[0];
		
			if(self.getKey() === target.data.key && obj.length == 0) {
				data.result.push(element);
				return data.result;
			}
			
			element.findElements(connector, {
				index : 0,
				obj : [].concat({
						type : 'get',
						data : {
							key : element.getKey()
						}
				}).concat(obj),
				result : data.result
			}, options);
		}
		
		return data.result;
	};
	
	/**
	 * イベントを実行する。
	 *
	 * @name addIssue
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.issue.PendingCommand#
	 * @param {Object} options
	 **/
	p.addIssue = function(obj, options) {
		var self = this;
		
		self._issues.push(obj);
	};

	/**
	 * プロパティを再設定する
	 *
	 * @name reset
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.issue.PendingCommand#
	 **/
	p.reset = function(data) {
		var self = this;
	
		self._issues = data.issues;
		self._currentIndex = 0;
	};
	
	/**
	 * 指定インデックスの要素をクリアする
	 *
	 * @name clear
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.issue.PendingCommand#
	 **/
	p.clear = function(index) {
		var self = this;
	
		var length = self._issues.length;
		for(var i = 0; i < length; i++) {
			var area = self._issues[i];
			
			if(area.splitIndex == index) {
				self._issues.splice(i, 1);
			}
		}
	};
	
	/**
	 * 次の問題に進む。
	 *
	 * @name next
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.issue.PendingCommand#
	 * @param {Object} options
	 **/
	p.next = function(options) {
		var self = this;
		
		if (self._issues.length - 1 > self._currentIndex) {
			self._currentIndex++;
			return self._currentIndex;
		}
		return false;
	};

	/**
	 * 前の問題に戻る
	 *
	 * @name back
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.issue.PendingCommand#
	 * @param {Object} options
	 **/
	p.back = function(options) {
		var self = this;
		
		if (0 < self._currentIndex) {
			self.clear(self._currentIndex);
			self._currentIndex--;
			return true;
		}
		self.clear(self._currentIndex);
		return false;
	};

	/**
	 * 内部の問題を解決する。
	 *
	 * @name resolve
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.issue.PendingCommand#
	 * @param {Object} options
	 **/
	p.resolve = function(connector, obj, data, options, callback) {
		var self = this;
		
		jslgEngine.log('call resolve pending command');
		connector.pipe(function(connector_s) {
			//TODO: 現在はひとつの問題のみ対応
			var issue = self._issues[self._currentIndex];
			var result = issue.resolve(connector_s.resolve(), obj, data, options);
			if(result) {
				self.addChild({
					obj : obj
				}, options);
				
				connector_s.pipe(function(connector_ss) {
					//画面更新
					issue.update(connector_ss, {
					}, options);
					//connector_ss.resolve();
				}).connects(function(connector_ss) {
					if(self.connector) {
						self.connector.resolve();
					}
				});
			}
		});
	};

	/**
	 * 内部の問題を解決する。
	 *
	 * @name wasResolved
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.issue.PendingCommand#
	 * @param {Object} options
	 **/
	p.wasResolved = function() {
		var self = this;
		var resolved = true;
		
		for(var i = 0; i < self._issues.length; i++) {
			var issue = self._issues[i];
			
			resolved = issue.wasResolved() ? resolved : false;
		}
		return resolved;
	};

	/**
	 * 次の問題に進む。
	 *
	 * @name getIssues
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.issue.PendingCommand#
	 * @param {Object} options
	 **/
	p.getIssues = function(options) {
		var self = this;
		
		return self._issues;
	};
	
	/**
	 * 次の問題に進む。
	 *
	 * @name getCurrentIssue
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.issue.PendingCommand#
	 * @param {Object} options
	 **/
	p.getCurrentIssue = function(options) {
		var self = this;
		
		if (self._issues.length > self._currentIndex) {
			return self._issues[self._currentIndex];
		}
		return false;
	};
	
	/**
	 * 次の問題に進む。
	 *
	 * @name setCurrentIssue
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.issue.PendingCommand#
	 **/
	p.setCurrentIssue = function(issue) {
		var self = this;
		
		if (self._issues.length > self._currentIndex) {
			self._issues[self._currentIndex] = issue;
		}
		return false;
	};
	
	/**
	 * 次の問題に進む。
	 *
	 * @name addReputation
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.issue.PendingCommand#
	 * @param {Object} options
	 **/
	p.addReputation = function(data, options) {
		var self = this;
		
		self.reputations.push(data);
	};
	
	/**
	 * 次の問題に進む。
	 *
	 * @name getReputations
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.issue.PendingCommand#
	 * @param {Object} options
	 **/
	p.getReputations = function() {
		var self = this;
		
		return self.reputations;
	};
	
	/**
	 * 考えられる入力範囲を推測する。
	 * 
	 * @name getPromisingLocations
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.issue.PendingCommand#
	 **/
	p.getPromisingLocations = function(origin, options) {
		var self = this;
		var originLocation = origin;
		
		var locations = [];
		
		var length = self._issues.length;
		for(var i = 0; i < length; i++) {
			var issue = self._issues[i];
			
			var tempLocations = issue.getPromisingLocations(options);
			for(var k = 0; k < tempLocations.length; k++) {
				var temp = tempLocations[k];
				
				locations.push({
					x : originLocation.x + temp.x, 
					y : originLocation.y + temp.y,
					z : originLocation.z + temp.z 
				});
			}
		}
		
		return locations;
	};
	
	/**
	 * 移動処理が期待できるか
	 * 
	 * @name hasExpectedMoving
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.issue.PendingCommand#
	 * @param {Object} location
	 **/
	p.hasExpectedMoving = function(locations) {
		var self = this;
		
		var length = self.reputations.length;
		for(var i = 0; i < length; i++) {
			var reputation = self.reputations[i];
			
			//TODO: 移動に依存してしまっている。が、もう移動は基本的な仕様にした方がいいかもしれない。
			if(reputation.type === issuejslgEngine.model.action.keys.SLG_MOVE) {
				return true;
			}
		}
		return false;
	};
	
	/**
	 * 入力待機の回数を取得する
	 *
	 * @name getDataSet
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.issue.PendingCommand#
	 **/
	p.getPendingCount = function() {
		var self = this;
		var count = 0;
		
		var length = self._issues.length;
		for(var i = 0; i < length; i++) {
			var issue = self._issues[i];
			
			count += issue.getPendingCount();
		}
		return count;
	};
	
	/**
	 * 検索用のJSON形式として返す
	 *
	 * @name toSimpleElements
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.issue.PendingCommand#
	 * @returns {JSON}
	 */
	p.getElementFromSimpleElement = function(data, options) {
		var self = this;
		var element = {};
		var keys = data.obj.keys||[];
		var key = keys.shift();
		var matched = self.getKey() === key;
		
		if(!matched) return null;
		
		var issue = self.getCurrentIssue();
		var targetChild = issue.getAppliedElement();
		var appliedElements = [targetChild];
		var length = appliedElements.length;
		
		for(var i = 0; i < length; i++) {
			var child = appliedElements[i];
			//適用要素は除外する
			data.obj.keys = [].concat(child.getKey()).concat(keys);
			var element = child.getElementFromSimpleElement(data, options);
			if(element) return element;
		}
		return null;
	};
	
	/**
	 * 検索用のJSON形式として返す
	 *
	 * @name toSimpleElements
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.issue.PendingCommand#
	 * @returns {JSON}
	 */
	p.toSimpleElements = function(data, options) {
		var self = this;
		var element = {};
		var keys = data.keys||[];
		
		var issue = self.getCurrentIssue();
		var targetChild = issue.getAppliedElement();
		if(targetChild) {
			var appliedElements = [targetChild];
			var length = appliedElements.length;
		
			var children = [];
			for(var i = 0; i < length; i++) {
				var child = appliedElements[i];
				var nextKeys = [].concat(keys);
				data.index = i;
				data.keys = nextKeys;
				if(child.toSimpleElements) {
					data.key = self.getKey();
					children.push(child.toSimpleElements(data, options));
				}
			}
			
			//TODO: 適用対象が１つのみ、それ自身を示す。
			element = children[0];
			element['key'] = self.getKey();
		}
		return element;
	};
	
	o.PendingCommand = PendingCommand;
}());
