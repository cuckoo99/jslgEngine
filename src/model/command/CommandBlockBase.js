/*
 * @author cuckoo99
 */

(function() {
	// namespace:
	var o = this.jslgEngine = this.jslgEngine||{};
	o = (o.model = o.model||{});
	o = (o.command = o.command||{});

	/**
	 * <h4>イベントブロック・基本クラス</h4>
	 * <p>
	 * イベントをブロック単位に細分化したクラス。
	 * 実行とリストアを実装する。
	 * </p>
	 * @class
	 * @name CommandBlockBase
	 * @memberOf jslgEngine.model.command
	 * @constructor
	 */
	var CommandBlockBase = function() {
		this.initialize();
	};
	/**
	 *
	 */
	var p = CommandBlockBase.prototype;

	/**
	 * 初期化
	 *
	 * @name initialize
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.command.CommandBlockBase#
	 **/
	p.initialize = function() {
		var self = this;
		self._children = [];
	};

	/**
	 * クラス名
	 *
	 * @name className
	 * @property
	 * @type String
	 * @memberOf jslgEngine.model.command.CommandBlockBase#
	 **/
	p.className = 'CommandBlockBase';

	/**
	 * 要素のタイプ
	 *
	 * @name elementType
	 * @property
	 * @type String
	 * @memberOf jslgEngine.model.command.CommandBlockBase#
	 **/
	p.elementType = 'Element';

	/**
	 * 子要素
	 *
	 * @private
	 * @name _children
	 * @property
	 * @type Object[]
	 * @memberOf jslgEngine.model.command.CommandBlockBase#
	 **/
	p._children = null;

	/**
	 * 引数
	 *
	 * @name _expression
	 * @property
	 * @type jslgEngine.model.logic.Expression
	 * @memberOf jslgEngine.model.command.CommandBlockBase#
	 **/
	p._expressions = null;
	
	/**
	 * アクション実行フラグ
	 *
	 * @private
	 * @name _wasDone
	 * @property
	 * @type Boolean
	 * @memberOf jslgEngine.model.command.CommandBlockBase#
	 **/
	p._wasDone = null;

	/**
	 * 取得済みフラグ
	 *
	 * @private
	 * @name _wasFound
	 * @property
	 * @type Boolean
	 * @memberOf jslgEngine.model.command.CommandBlockBase#
	 **/
	p._wasFound = null;

	/**
	 * 子要素展開済みフラグ
	 *
	 * @private
	 * @name _wasExpanded
	 * @property
	 * @type Boolean
	 * @memberOf jslgEngine.model.command.CommandBlockBase#
	 **/
	p._wasExpanded = null;

	/**
	 * 非同期かどうか
	 *
	 * @private
	 * @name _isAsync
	 * @property
	 * @type Boolean
	 * @memberOf jslgEngine.model.command.CommandBlockBase#
	 **/
	p._isAsync = false;
	
	/**
	 * 新規インスタンス生成時の設定
	 *
	 * @name setup
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.command.CommandBlockBase#
	 * @param {Object} options
	 * <ul>
	 * <li>{jslgEngine.controller.IconController} iconController</li>
	 * <li>{jslgEngine.controller.mainController} mainController</li>
	 * </ul>
	 */
	p.setup = function(data, options) {
		var self = this;
		var length = self._children ? self._children.length : 0;
		var passingResult = null;

		for(var i = 0; i < length; i++) {
			var child = self._children[i];
			
			child.setup(data, options);
			
			if(passingResult && child instanceof jslgEngine.model.command.CommandBlockElseIF) {
				child.setPassingResult(passingResult);
			} else if(child instanceof jslgEngine.model.command.CommandBlockIF) {
				passingResult = {
					result : false
				};
				child.setPassingResult(passingResult);
			} else {
				passingResult = null;
			}
		}
	};
	
	/**
	 * データ取得
	 *
	 * @name find
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.command.CommandBlockBase#
	 * @param {Object} options
	 * <ul>
	 * <li>{jslgEngine.controller.IconController} iconController</li>
	 * <li>{jslgEngine.controller.mainController} mainController</li>
	 * </ul>
	 */
	p.find = function(connector, data, options, callback) {
		var self = this;
		self._find(connector, data, options, callback);
	};

	/**
	 * 初期化
	 *
	 * @name findElements
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.command.CommandBlockBase#
	 * @param {Object} options
	 **/
	p.findElements = function(connector, data, options) {
	};
	
	/**
	 * データ取得
	 *
	 * @private
	 * @name _find
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.command.CommandBlockBase#
	 * @param {Object} options
	 * <ul>
	 * <li>{jslgEngine.controller.IconController} iconController</li>
	 * <li>{jslgEngine.controller.mainController} mainController</li>
	 * </ul>
	 */
	p._find = function(connector, data, options, callback) {
		var self = this;
		var result = options.result||[];
		
		if(!self._expressions) {
			//jslgEngine.log('find:'+self.className);
			if(!self._arguments) {
				self._wasFound = true;
			} else {
				var expressions = self._makeExpressions(self._arguments, options, callback);
				self._expressions = expressions instanceof Array ? expressions : [expressions];
				
				jslgEngine.log('found out arguments in '+self.className);
				//TODO: 取得できていないのにフラグを変更している。
				self._wasFound = true;
			}
		}
		
		if(!self._children) return;
		
		var length = self._children.length;
		for(var i = 0; i < length; i++) {
			var child = self._children[i];

			child.find(connector, data, options, callback);
		}
	};
	
	/**
	 * データ取得
	 *
	 * @private
	 * @name _makeExpressions
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.command.CommandBlockBase#
	 * @param {Object} options
	 * <ul>
	 * <li>{jslgEngine.controller.IconController} iconController</li>
	 * <li>{jslgEngine.controller.mainController} mainController</li>
	 * </ul>
	 */
	p._makeExpressions = function(arguments, options, callback) {
		var self = this;
		var list = [];
		var result = options.result||[];
		var elementKeys = [];
		var connector = options.connector;
		
		var length = arguments.length;
		//jslgEngine.log('finding:'+self.className);
		for(var i = 0; i < length; i++) {
			var argument = arguments[i];
			if(argument instanceof Array) {
				var expressions = self._makeExpressions(argument, options, callback);
				list.push(expressions);
			} else {
				var expression = new jslgEngine.model.logic.Expression({
					commandKey : options.commandKey,
					code : argument
				});
				
				var args = expression.getJSlgElements();
				for(var j = 0; j < args.length; j++) {
					//TODO: 入れ子になってる場合がある？
					result.push(args[j]);
				}
				//result.push(expression.getJSlgElements());
				list.push(expression);
			}
		}
		
		return list;
	};

	/**
	 * 実行
	 *
	 * @name run
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.command.CommandBlockBase#
	 * @param {Object} options
	 * <ul>
	 * <li>{jslgEngine.controller.IconController} iconController</li>
	 * <li>{jslgEngine.controller.mainController} mainController</li>
	 * </ul>
	 */
	p.run = function(connector, data, options) {
		var self = this;
	
		if(self.run$) {
			connector.pipe(function(connector_s) {
				self.run$(
					connector_s,
					data,
					options);
				return connector_s;
			});
		} else {
			var length = self._children.length;
			for(var i = 0; i < length; i++) {
				var child = self._children[i];

				child.run(connector, data, options);
			}
			self._wasDone = true;
		}
	};

	/**
	 * リストア
	 *
	 * @name restore
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.command.CommandBlockBase#
	 * @param {Object} options
	 * <ul>
	 * <li>{jslgEngine.controller.IconController} iconController</li>
	 * <li>{jslgEngine.controller.mainController} mainController</li>
	 * </ul>
	 */
	p.restore = function(connector, data, options) {
		var self = this;
	
		if(self.restore$) {
			connector.pipe(function(connector_s) {
				self.restore$(
					connector_s,
					data,
					options);
				return connector_s;
			});
		} else {
			var length = self._children.length;
			for(var i = length - 1; i >= 0; i--) {
				var child = self._children[i];

				child.restore(connector, data, options);
			}
			self._wasDone = false;
		}
	};

	/**
	 * 依存する要素を全てテキスト形式で取得する。
	 *
	 * @private
	 * @name getDependencyElements
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.command.CommandBlockBase#
	 * @param {Object} options
	 */
	p.getDependencyElements = function(connector, data, options) {
		var self = this;
		
		if(!self._expressions) {
			//TODO: おそらく、まだ式の分割に対応していない。
			var elements = self._expressions.getJSlgElements();
			
			data.result = elements ? data.result.concat(elements) : data.result;
		}
		
		if(!self._children) return;
		
		var length = self._children.length;
		for(var i = 0; i < length; i++) {
			var child = self._children[i];

			child.getDependencyElements(connector, data, options);
		}
	};
	
	/**
	 * テスト実行
	 *
	 * @name test
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.command.CommandBlockBase#
	 * @param {Object} options
	 * <ul>
	 * <li>{jslgEngine.controller.IconController} iconController</li>
	 * <li>{jslgEngine.controller.mainController} mainController</li>
	 * </ul>
	 */
	p.test = function(connector, options) {
	};
	
	/**
	 * コード展開（TODO）
	 *
	 * @name expand
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.command.CommandBlockBase#
	 * @param {Object} options
	 * <ul>
	 * <li>{jslgEngine.controller.IconController} iconController</li>
	 * <li>{jslgEngine.controller.mainController} mainController</li>
	 * </ul>
	 */
	p.expand = function(options) {};

	/**
	 * 実行済みか確認
	 *
	 * @name wasDone
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.command.CommandBlockBase#
	 * @boolean is_back 逆実行するかどうか
	 */
	p.wasDone = function(options) {
		var self = this;
		return self._wasDone;
	};

	/**
	 * 取得済みか確認
	 *
	 * @name wasFound
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.command.CommandBlockBase#
	 * @boolean is_back 逆実行するかどうか
	 */
	p.wasFound = function(options) {
		var self = this;
		var wasFound = self._wasFound;
		var length = self._children ? self._children.length : 0;
		for(var i = 0; i < length; i++) {
			var child = self._children[i];
			wasFound = child.wasFound() ? wasFound : false;
		}
		return wasFound;
	};

	/**
	 * 子要素の取得
	 *
	 * @name getChildren
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.command.CommandBlockBase#
	 * @boolean is_back 逆実行するかどうか
	 */
	p.getChildren = function(options) {
		var self = this;
		return self._children;
	};

	/**
	 * 要素を探査したか確認
	 *
	 * @private
	 * @name _isAlreadyFound
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.command.CommandBlockBase#
	 * return {Boolean}
	 **/
	p._isAlreadyFound = function() {
		var self = this;
		//jslgEngine.log('Checking Already Found '+self.className);
		if(!self.wasFound()) {
			jslgEngine.log(self.className + ' still doesn\'t find elements.');
			return false;
		}
		return true;
	};
	
	/**
	 * イベント自身を取得する。
	 *
	 * @name setLocalElement
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.action.ActionBase#
	 * @param {Object} options
	 */
	p._readAllElements = function(connector, data, options) {
		var self = this;
		
		var count = self._expressions.length;
		var elements = [];
		
		for(var i = 0; i < count; i++) {
			self._getElement(connector, i, data, options);
			connector.connects(function(connector_s, result_s) {
				elements.push(result_s);
			});	
		}
		connector.pipe(function(connector_s, result_s) {
			connector_s.resolve(elements);
		});	
	};
	
	/**
	 * 初期化
	 *
	 * @name _getElements
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.command.CommandBlockBase#
	 * @param {JSON} options
	 * <ul>
	 * {jslgEngine.model.common.JSlgElementFinder} finder
	 * </ul>
	 * return 
	 **/
	p._getElement = function(connector, index, data, options) {
		var self = this;
		
		connector.pipe(function(connector_s, result_s) {
			if(!self._expressions) {
				jslgEngine.log('it was not still found out.');
				
				connector_s.resolve({ value : null });
				return;
			}
			
			connector_s.resolve();
			
			var element = self._expressions[index];
			if(element instanceof Array) {
				self._getElementByExpressions(connector_s, element, data, options);
			} else {
				element.getElement(connector_s, data, options);
			}
		});
	};
	
	/**
	 * データ取得
	 *
	 * @private
	 * @name _getElementByExpressions
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.command.CommandBlockBase#
	 * @param {Object} options
	 * <ul>
	 * <li>{jslgEngine.controller.IconController} iconController</li>
	 * <li>{jslgEngine.controller.mainController} mainController</li>
	 * </ul>
	 */
	p._getElementByExpressions = function(connector, expressions, data, options, callback) {
		var self = this;
		var list = [];
		
		connector.loop({
			elements : expressions,
			limit : 20
		}, function(connector_s, result_s) {
			var expression = result_s;
			if(expression instanceof Array) {
				self._getElementByExpressions(connector_s, expression, data, options, callback);
			} else {
				expression.getElement(connector_s, data, options);
			}
			connector_s.connects(function(connector_ss, result_ss) {
				list.push(result_ss);
			});
		});
		connector.pipe(function(connector_s, result_s) {
			connector_s.resolve(list);
		});
	};
	
	/**
	 * 子要素の設定
	 *
	 * @name addChild
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.command.CommandBlockBase#
	 * @param {Object} options
	 */
	p.addChild = function(data) {
		var self = this;
		
		self._children.push(data.obj);
	};
	
	/**
	 * XML文字列形式として返す
	 *
	 * @name toXML
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.command.CommandBlockBase#
	 * @param {Object} options
	 */
	p.toXML = function(options) {
		var self = this;
		var opts = options||{};
		opts.increment = opts.increment != null ? opts.increment : 0;
		var space = '\t';
		var inc = opts.increment+1;
		var getIncrement = function(cnt, has_ret) {
			var retCode = has_ret ? '\r' : '';
			return retCode + jslgEngine.utility.getRepeatedText(space, cnt);
		}
		var limit = 10;
		var className = ['<className>',self.className,'</className>'].join('');
		var type = ['<type>',self.elementType,'</type>'].join('');
		var params = '';
		
		var getNestedProperties = function(cnt, tgt, name) {
			if(cnt > limit) return '';
			var tx = '';
			if(tgt instanceof Array) {
				var stk = [];
				for(var i = 0; i < tgt.length; i++) {
					stk.push(arguments.callee(cnt+1, tgt[i], name));
				}
				tx = stk.join(getIncrement(inc+cnt+1, true));
				return ['<'+name+'>',tx].join(getIncrement(inc+cnt+1, true))+
						getIncrement(inc+cnt, true)+'</'+name+'>';
			} else {
				tx = tgt;
				return '<'+name+'>'+tx+'</'+name+'>';
			}
		};
		
		if(self._arguments) {
			params = getNestedProperties(0, self._arguments, 'arguments');
		}
		
		var childrenWords = [];
		var length = self._children.length;
		for(var i = 0; i < length; i++) {
			var child = self._children[i];
			childrenWords.push(child.toXML({increment : inc}));
		}
		var targets = [type,className,params,childrenWords.join(getIncrement(inc, true))];
		var t, nw = [];
		while ((t = targets.shift()) !== undefined) {
			if (t !== "") nw.push(t);
		}
		getNestedProperties = null;
		var text = ['<element>',nw.join(getIncrement(inc, true))].join(getIncrement(inc, true))+
					getIncrement(inc-1, true)+'</element>';
		return text;
	};
	
	o.CommandBlockBase = CommandBlockBase;
}());
