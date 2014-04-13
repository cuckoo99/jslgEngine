/*
 * @author cuckoo99
 */

(function() {
	// namespace:
	var o = this.jslgEngine = this.jslgEngine||{};
	o = (o.model = o.model||{});
	o = (o.logic = o.logic||{});

	/**
	 * <h4>式クラス</h4>
	 * <p>
	 * 式を管理するクラス。
	 * </p>
	 * @class
	 * @name Expression
	 * @memberOf jslgEngine.model.logic
	 * @constructor
	 */
	var Expression = function(options) {
		this.initialize(options);
	};
	/**
	 *
	 */
	var p = Expression.prototype;

	/**
	 * ポーランド記法で分割されたデータ
	 *
	 * @private
	 * @name _arguments
	 * @property
	 * @type String[]
	 * @memberOf jslgEngine.model.logic.Expression#
	 **/
	p._arguments = null; 

	/**
	 * イベントのキー
	 *
	 * @private
	 * @name _commandKey
	 * @property
	 * @type jslgEngine.model.common.JSlgKey
	 * @memberOf jslgEngine.model.logic.Expression#
	 **/
	p._commandKey = null;
	
	/**
	 * 演算子リスト
	 *
	 * @private
	 * @name _operatorsList
	 * @property
	 * @type jslgEngine.model.common.JSlgKey
	 * @memberOf jslgEngine.model.logic.Expression#
	 **/
	p._operatorsList = [{
		"*" : 3 ,
		"/" : 3 ,
		"+" : 2 ,
		"-" : 2 ,
		"<" : 1 ,
		">" : 1 
	}, {
		"<=" : 1 ,
		">=" : 1 ,
		"==" : 1 ,
		"!=" : 1 
	}];
	
	/**
	 * 初期化
	 *
	 * @name initialize
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.logic.Expression#
	 **/
	p.initialize = function(options) {
		var self = this;
		var code = options.code;
		
		//var code = self.getPolandStatement(options.code);
		self._arguments = self.getFormattedArguments(code, options);
		self._commandKey = options.commandKey;
	};

	/**
	 * フォーマットされたコードの取得
	 *
	 * @name getFormattedArguments
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.logic.Expression#
	 * @param {Object} options
	 * <ul>
	 * <li>{jslgEngine.controller.IconController} iconController</li>
	 * <li>{jslgEngine.controller.mainController} mainController</li>
	 * </ul>
	 */
	p.getFormattedArguments = function(source, options) {
		var self = this;
		var code = (""+source);
		
		// 自身を参照するコードは、自身の絶対パスに書き換え
		if(options._commandKey) {
			var selfCode = jslgEngine.model.logic.keys.SELF;
			code = code.replace(selfCode, options._commandKey.getPath());
		}
		
		return self.getPolandArguments(code);
		//code = code.replace(/(\+|\-|\*|\/|==|!=|<=|>=|<|>|&&)/g, " $1");
		//return code.split(' ');
	};

	/**
	 * 全SLG要素の取得
	 * ・区切り文字の有無で判断する。
	 *
	 * @name getJSlgElements
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.logic.Expression#
	 * @param {Object} options
	 * <ul>
	 * <li>{jslgEngine.controller.IconController} iconController</li>
	 * <li>{jslgEngine.controller.mainController} mainController</li>
	 * </ul>
	 */
	p.getJSlgElements = function(options) {
		var self = this;
		var elements = [];
		var length = self._arguments.length;
		for(var i = 0; i < length; i++) {
			var argument = self._arguments[i];
			if(argument.indexOf(jslgEngine.config.elementSeparator)) {
				elements.push(argument);
			}
		}
		return elements;
	};
	
	/**
	 * ポーランド記法で数式を取得
	 *
	 * @name getPolandStatement
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.logic.Expression#
	 * @param {JSON} options
	 * <ul>
	 * </ul>
	 * @param code
	 * @returns
	 */
	p.getPolandStatement = function(code) {
	    var sb = code;
		var old = ' ';
		var l_index = code.length-1;
		var e_index = l_index, c_index = l_index, cnt = 0;
		for(var i = l_index ; i >= 0 ; i--){
	    	var ch = sb.charAt(i);
			if(ch == ')') {
				if(cnt == 0) {
					c_index = i;
				}
				cnt++;
			} else if(ch == '(') {
				cnt--;
				if(cnt == 0) {
					var tmp = this.getPolandStatement(sb.substring(i+1, c_index));
					sb = jslgEngine.utility.replaceStr(sb, i+1, c_index, tmp);
					//文字列が伸びた分だけ修正
					e_index+=tmp.length-(c_index-(i+1));
				}
			}
			if(cnt == 0) {
				if(ch == '/' || ch == '*') {
					sb = jslgEngine.utility.insertStr(sb, e_index+1, ""+ch);
					sb = jslgEngine.utility.replaceStr(sb, i, i+1, " ");
				}
				if(ch == '/' || ch == '*' || ch == '+' || ch == '-' || ((ch == '=' || ch == '!' || ch == '<') && old == '=') || (ch == '&' && old == '&')) {
					e_index = i-1;
				}
			}
			old = ch;
		}
		sb = this.getPolandReplacedOperator(sb, ["+", "-"], ["&&", "!=", "<", ">", "<=", ">=", "=="]);
		sb = this.getPolandReplacedOperator(sb, ["!=", "<", ">", "<=", ">=", "=="], ["&&"]);
		sb = this.getPolandReplacedOperator(sb, ["&&"], []);
		return sb;
	};
	
	/**
	 * ポーランド記法で数式を取得
	 *
	 * @name getPolandArguments
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.logic.Expression#
	 * @param {JSON} options
	 * <ul>
	 * </ul>
	 * @param code
	 * @returns
	 */
	p.getPolandArguments = function(code) {
		var self = this;
	    var text = code;
		var length = text.length-1;
		var cIndex = 0; //括弧終端
		var bracketName = null;
		var cnt = 0;
		var arguments = [];
		var opStack = []; //演算子の蓄積リスト
		var operatorsList = self._operatorsList;
		
		//テキストをループさせる
		for(var i = 0 ; i <= length ; i++) {
	    	var ch = text.charAt(i);
			if(ch == '(') {
				if(cnt == 0) {
					bracketName = text.substring(cIndex, i);
					if(bracketName.length == 0) {
						cIndex = i+1;
					}
				}
				cnt++;
			} else if(ch == ')') {
				cnt--;
				if(cnt == 0) {
					if(bracketName.length == 0) {
						var childText = text.substring(cIndex, i);
						var childArguments = this.getPolandArguments(childText);
						for(var j = 0; j < childArguments.length; j++) {
							arguments.push(childArguments[j]);
						}
						cIndex = i+1;
					}
					bracketName = null;
				}
			}
			if(cnt == 0) {
				var p = 0; //インデックス補正
				var oKey = null;
				var priority = null;
				
				for(j = operatorsList.length - 1; j >= 0; j--) {
					var operators = operatorsList[j];
					var operatorLength = j+1;
					if(i+operatorLength > length) continue;
					
					var temp = text.substring(i, i+operatorLength);
					if((priority = operators[temp])) {
						oKey = temp;
						p = operatorLength;
						break;
					}
				}
				if(oKey) {
					var oldOp = opStack.pop();
					if(i-cIndex > 0) {
						//文字をパラメータとして追加
						//複数文字の場合、インデックス位置を調整する。
						var one = text.substring(cIndex, i);
						arguments.push(one);
					}
					
					if(oldOp && operators[oldOp] >= priority) {
						//現在の方が優先度が低いの場合、現在のものをスタックに積み、古い演算子を配列に追加する。
						//(先に計算させる)
						arguments.push(oldOp);
					} else {
						opStack.push(oldOp);
					}
					opStack.push(oKey);
					
					cIndex = i+oKey.length;
					ch = null;
				}
			}
		}
		if(length-cIndex >= 0) {
			arguments.push(text.substring(cIndex));
		}
		var temp;
		while((temp=opStack.pop())) {
			arguments.push(temp);
		}
		
		return arguments;
	};
	
	/**
	 * 演算子をポーランド記法に変換
	 *
	 * @name getPolandReplacedOperator
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.logic.Expression#
	 * @param {JSON} options
	 * <ul>
	 * </ul>
	 * @param code
	 * @param operators
	 * @param ex_operators
	 * @returns
	 */
	p.getPolandReplacedOperator = function(code, operators, ex_operators) {
		var ope = operators;
		var ex_ope = ex_operators;
	
	    var sb = code;
		var l_index = sb.length-1;
		var e_index = l_index;
		var cnt = 0;
		var old = ' ';
	
		// 2文字まで対応
		for(var i = l_index ; i >= 0 ; i-- ) {
	    	var ch = sb.charAt(i);
			if(ch == ')') cnt++;
			else if(ch == '(') cnt--;
			if(cnt == 0) {
				for(var j = 0; j < ope.length; j++) {
					if((ope[j].length == 1 && ch == ope[j]) || (ope[j].length == 2 && ch+old == ope[j])) {
						sb = jslgEngine.utility.insertStr(sb, e_index+1, ope[j]);
						sb = jslgEngine.utility.replaceStr(sb, i, i+ope[j].length, " ");
						e_index = i-1;
					}
				}
				for(var j = 0; j < ex_ope.length; j++) {
					if((ex_ope[j].length == 1 && ch == ex_ope[j]) || (ex_ope[j].length == 2 && ch+old == ex_ope[j])) {
						e_index = i-1;
					}
				}
			}
			old = ch;
		}
		return sb;
	};
	
	/**
	 * 計算
	 *
	 * @name makeElement
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.logic.Expression#
	 * @param {JSON} options
	 * <ul>
	 * </ul>
	 **/
	p.makeElement = function(options) {
		return new jslgEngine.model.common.JSlgElementStatus({
			key : options.key,
			value : options.value,
			location : options.location,
			parent : options.parent
		});
	};

	/**
	 * 式を計算する。
	 *
	 * @name getElement
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.logic.Expression#
	 * @param {JSON} options
	 * <ul>
	 * </ul>
	 * @param evaluate
	 * @param converter
	 * @param region
	 * @param filter
	 * @returns
	 */
	p.getElement = function(connector, data, options) {
		var self = this;
		var operatorsList = self._operatorsList;
		var stack = [];
		
		connector.loop({
			elements : self._arguments,
			limit : 20
		}, function(connector_s, result_s) {
			var argument = result_s;
			
			var isOperator = false;
			for(var j = 0; j < operatorsList.length; j++) {
				var operators = operatorsList[j];
				if(operators[argument]) isOperator = true;
			}
			
			if(isOperator) {
				var to = stack.pop();
				var from = stack.pop();
				var result = self.calculate(from, to, argument);
				stack.push(result);
				connector_s.resolve();
			} else {
				//jslgEngine.log('...'+argument);
				var obj;
				
				var index = argument.indexOf(jslgEngine.config.elementSeparator);
				var firstKey = argument.substring(0, index != -1 ? index : argument.length);
				var afterPath = argument.substring(index != -1 ? index + 1 : argument.length);
				
				var target = data.localElements ? data.localElements[firstKey] : null;
				
				if(target) {
					argument = afterPath.length > 0 ? [target.getKey(),afterPath].join(jslgEngine.config.elementSeparator) : '';
				} else {
					target = options.mainController.getWorldRegion();
				}
				
				if(argument.length > 0) {
					target.findElements(connector_s.resolve(), {
						key : argument
					}, options);
					connector_s.pipe(function(connector_ss, result_ss) {
						var elements = result_ss;
						obj = elements.length > 1 ? elements : elements[0];
						connector_ss.resolve(obj);
					});
				} else {
					connector_s.pipe(function(connector_ss, result_ss) {
						connector_ss.resolve(target);
					});
				}
				connector_s.connects(function(connector_ss, result_ss) {
					obj = result_ss;
					obj = self.makeSpecialElement({
						key : argument,
						value : obj,
						mainController : options.mainController
					});
					if(obj === undefined) {
						// 未定義はnullとして扱う
						obj = self.makeElement({
							value : null
						});
					}
									
					if(!obj) {
						jslgEngine.log(argument + ' Missing Element.');
					}
					stack.push(obj);
				});
			}
		}, function(connector_s, result_s) {});
		
		connector.pipe(function(connector_s) {
		    if(stack.length != 1){
		    	jslgEngine.log('Illegal exoression');
				connector_s.resolve(null);
				return;
		    }
	
		    element = stack.pop();
	
			connector_s.resolve(element);
		});
	};
	
	/**
	 * 特殊文字を置き換えて返す。
	 *
	 * @name getSpecialKey
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.logic.Expression#
	 * @param {JSON} options
	 * <ul>
	 * </ul>
	 * @returns
	 */
	p.getSpecialElementKey = function(key, options) {
		
	};
	
	/**
	 * 要素をステータス要素として取得する。<br />
	 * <br />
	 * オブジェクト：そのまま返す<br />
	 * ステータス：そのまま返す<br />
	 * 数値、文字列：ステータスの要素として返す<br />
	 * 
	 * @name getSpecialElement
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.logic.Expression#
	 * @param {JSON} options
	 * <ul>
	 * </ul>
	 * @param evaluate
	 * @param converter
	 * @param region
	 * @param filter
	 * @returns
	 */
	p.makeSpecialElement = function(options) {
		var self = this;
		var key = options.key;
		switch(key) {
		case 'null':
			return self.makeElement({
				value : null
			});
		case 'true':
			return self.makeElement({
				value : true
			});
		case 'false':
			return self.makeElement({
				value : false
			});
		default:
			if(key.match(/^\".*\"$/)) {
				//文字列要素
				return self.makeElement({
					value : key.substring(1, key.length - 1)
				});
			}
			var number;
			// 数値の場合
			number = parseInt(key);
			number = !isNaN(number) ? number : null;
			
			if(number !== null && !options.value) {
				return self.makeElement({
					value : number
				});
			}
		}
		
		return options.value;
	};
	
	/**
	 * 計算
	 *
	 * @name calculate
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.logic.Expression#
	 * @param {JSON} options
	 * <ul>
	 * </ul>
	 **/
	p.calculate = function(from, to, operator) {
		var self = this;
		var list = [];
		var fromObj = null;
		var toObj = null;
	
		var wasCoordinated = false;
		
		var fromSrc = from instanceof Array ? from : [from];
		var toSrc = to instanceof Array ? to : [to];
		
		if(fromSrc.length === toSrc.length || (fromSrc.length === 1 || toSrc.length === 1)) {
			
			if(to instanceof Array && from instanceof Array) {
				if(to.length > from.length) {
					fromSrc = [];
					for(var i = 0; i < to.length; i++) {
						fromSrc.push(from[0]);
					}
				} else if(to.length < from.length) {
					var toSrc = [];
					for(var i = 0; i < from.length; i++) {
						toSrc.push(to[0]);
					}
				}
			}
			
			if(fromSrc.length != toSrc.length) return new self.makeElement({ value : null });
			
			var length = fromSrc.length;
			for(var i = 0; i < length; i++) {
		        fromObj = fromSrc[i];
		        toObj = toSrc[i];
	
		        // from op to
				switch(operator) {
				case '+':
		            list.push(self.plus(fromObj, toObj));
					break;
				case '-':
		            list.push(self.subtract(fromObj, toObj));
					break;
				case '*':
		            list.push(self.multiply(fromObj, toObj));
					break;
				case '/':
		            list.push(self.division(fromObj, toObj));
					break;
				case '<':
		            list.push(self.lessThan(toObj, fromObj));
					break;
				case '>':
		            list.push(self.lessThan(fromObj, toObj));
					break;
				case '<=':
		            list.push(self.lessThanOrEqual(toObj, fromObj));
					break;
				case '>=':
		            list.push(self.lessThanOrEqual(fromObj, toObj));
					break;
				case '==':
		            list.push(self.equals(fromObj, toObj));
					break;
				case '!=':
		            var valElement = self.equals(fromObj, toObj);
		            valElement.value = !valElement.value;
		            list.push(valElement);
					break;
				default:
					jslgEngine.log('不正な演算子です。：'+operator);
					break;
				}
			}
		} else {
			jslgEngine.log('配列オブジェクト同士の計算ではありません。');
		}
	
		return list;
	};
	
	/**
	 * 加算
	 *
	 * @name plus
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.logic.Expression#
	 * @param {JSON} options
	 * <ul>
	 * </ul>
	 **/
	p.plus = function(from, to) {
		var self = this;
		var fromValue = from && from.getNumber ? from.getNumber() : from;
		fromValue = from && typeof(from.value) === 'string' ? from.value : fromValue;
		var toValue = to && to.getNumber ? to.getNumber() : to;
		toValue = to && typeof(to.value) === 'string' ? to.value : toValue;
		return self.makeElement({
			value : (fromValue !== null && toValue !== null) ? fromValue + toValue : null
		});
	};

	/**
	 * 減算
	 *
	 * @name subtract
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.logic.Expression#
	 * @param {JSON} options
	 * <ul>
	 * </ul>
	 **/
	p.subtract = function(from, to) {
		var self = this;
		var fromValue = from && from.getNumber ? from.getNumber() : from;
		var toValue = to && to.getNumber ? to.getNumber() : to;
		return self.makeElement({
			value : (fromValue !== null && toValue !== null) ? fromValue - toValue : null
		});
	};

	/**
	 * 乗算
	 *
	 * @name multiply
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.logic.Expression#
	 * @param {JSON} options
	 * <ul>
	 * </ul>
	 **/
	p.multiply = function(from, to) {
		var self = this;
		var fromValue = from && from.getNumber ? from.getNumber() : from;
		var toValue = to && to.getNumber ? to.getNumber() : to;
		return self.makeElement({
			value : (fromValue !== null && toValue !== null) ? fromValue * toValue : null
		});
	};

	/**
	 * 除算
	 *
	 * @name division
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.logic.Expression#
	 * @param {JSON} options
	 * <ul>
	 * </ul>
	 **/
	p.division = function(from, to) {
		var self = this;
		var fromValue = from && from.getNumber ? from.getNumber() : from;
		var toValue = to && to.getNumber ? to.getNumber() : to;
		return self.makeElement({
			value : (fromValue !== null && toValue !== null) ? fromValue / toValue : null
		});
	};

	/**
	 * 比較・一致判定
	 *
	 * @name equals
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.logic.Expression#
	 * @param {JSON} options
	 * <ul>
	 * </ul>
	 **/
	p.equals = function(from, to) {
		var self = this;
		var isObj = from && to && typeof(from) === 'object' && typeof(to) === 'object';
		var isElement = isObj ? (from.type !== undefined && from.type === to.type) : false;
		var hasValue = isObj ? from.value !== undefined && to.value !== undefined : false;
		if(hasValue) {
			if(!isNaN(from.value) && !isNaN(to.value)) {
				return self.makeElement({
					value : (from.getNumber() === to.getNumber())
				});
			} else {
				return self.makeElement({
					value : (from.value === to.value)
				});
			}
		}
		return self.makeElement({
			value : (from === to)
		});
	};

	/**
	 * 比較・From未満
	 *
	 * @name lessThan
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.logic.Expression#
	 * @param {JSON} options
	 * <ul>
	 * </ul>
	 **/
	p.lessThan = function(from, to) {
		var self = this;
		var fromValue = from && from.getNumber ? from.getNumber() : from;
		var toValue = to && to.getNumber ? to.getNumber() : to;
		return self.makeElement({
			value : (fromValue > toValue)
		});
	};

	/**
	 * 比較・From以下
	 *
	 * @name lessThanOrEqual
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.logic.Expression#
	 * @param {JSON} options
	 * <ul>
	 * </ul>
	 **/
	p.lessThanOrEqual = function(from, to) {
		var self = this;
		var fromValue = from && from.getNumber ? from.getNumber() : from;
		var toValue = to && to.getNumber ? to.getNumber() : to;
		return self.makeElement({
			value : (fromValue >= toValue)
		});
	};

	o.Expression = Expression;
}());
