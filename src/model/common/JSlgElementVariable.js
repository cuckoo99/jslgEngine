/*
 * @author cuckoo99
 */

(function() {
	// namespace:
	var o = this.jslgEngine = this.jslgEngine||{};
	o = (o.model = o.model||{});
	o = (o.common = o.common||{});

	/**
	 * <h4>SLG要素</h4>
	 * <p>
	 * ゲームに用いられる、全ての物理的要素。
	 * </p>
	 * @class
	 * @name JSlgElementVariable
	 * @memberOf jslgEngine.model.common
	 * @constructor
	 */
	var JSlgElementVariable = jslgEngine.extend(
		jslgEngine.model.common.JSlgElementBase,
		function(data, options) {
			this.initialize(data, options);
			
			this._isArray = data.isArray ? true : false;
		}
	);
	/**
	 *
	 */
	var p = JSlgElementVariable.prototype;

	/**
	 * クラス名
	 *
	 * @name className
	 * @property
	 * @type String
	 * @memberOf jslgEngine.model.common.JSlgElementVariable#
	 **/
	p.className = 'ElementVariable';

	/**
	 * 対象キーコード
	 *
	 * @name keyCode
	 * @property
	 * @type String
	 * @memberOf jslgEngine.model.common.JSlgElementVariable#
	 **/
	p._keyCode = jslgEngine.model.stage.keys.VARIABLE;

	/**
	 * どこにでも着脱可能かどうか
	 *
	 * @name _isFloat
	 * @property
	 * @type Boolean
	 * @memberOf jslgEngine.model.common.JSlgElementVariable#
	 **/
	p._isFloat = true;

	/**
	 * 配列かどうか
	 *
	 * @name _isArray
	 * @property
	 * @type Boolean
	 * @memberOf jslgEngine.model.common.JSlgElementVariable#
	 **/
	p._isArray = true;

	/**
	 * 子要素の取得
	 *
	 * @name _findElements
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.common.JSlgElementVariable#
	 * @param {Object} options
	 * <ul>
	 * <li>{jslgEngine.model.network.ConnectorBase} connector</li>
	 * <li>{jslgEngine.model.common.JSlgElementFinder} finder</li>
	 * <li>{String} filter</li>
	 * </ul>
	 */
	p._findElements = function(connector, data, options) {
		var self = this;
		var child = null;

		if(!data) return false;
		data.result = data.result||[];
		
		var obj = self._getObjectToFind(data, options);
		if(obj.length == 0) return data.result;
		
		var target, element;
		
		//TODO:
		var target = obj.shift();
		var children = self.getChildren();
		
		//自身に一致した場合に、子要素キーが存在しない場合、自身を返す
		//子要素キーが存在する場合、配列ならばそれぞれ自身の一致した状態から検索
		//配列でなければ、通常の要素として変数を扱う。
		target.data.index = data.index;
		if(self.equals(target.data)) {
			if(obj.length === 0) {
				data.result.push(self);
			} else {
				for(var i = 0; i < children.length; i++) {
					var child = children[i];
					
					// 変数が単数要素であれば、次回はそれ自身から参照する。
					var next = [];
					next = !self._isArray ? next.concat({
							type : 'get',
							data : {
								key : child.getKey()
							}
					}) : next;
					next = next.concat(obj);
					
					child.findElements(connector, {
						index : i,
						obj : next,
						result : data.result
					}, options);
					
				}
			}
		}
		
		//Findはこれ以上下位を調べない
		
		return data.result;
	};
	
	/**
	 * 数値としての取得
	 *
	 * @name getNumber
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.common.JSlgElementVariable#
	 * @param {Object} options
	 */
	p.getNumber = function(options) {
		var self = this;
		
	};
	
	/**
	 * 子要素の設定
	 *
	 * @name addChild
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.common.JSlgElementVariable#
	 * @param {Object} options
	 * <ul>
	 * <li>{jslgEngine.model.network.ConnectorBase} connector</li>
	 * <li>{jslgEngine.model.common.JSlgElementFinder} finder</li>
	 * </ul>
	 */
	p.addChild = function(data, options) {
		var self = this;
		
		var obj = self.getChild({
			key : data.obj.getKey()
		});

		if(obj) {
			//暫定で既存のものがあれば、置き換え
			self.removeChild({ obj : obj});		
		}
		
		if(self.hasCircularReference(data.obj)) {
			jslgEngine.log('Could not add element because of Circular Reference');
			return false;
		}
		
		//子要素が変数でない場合を除いて、キーの書き換えは行わない
		if((data.obj instanceof jslgEngine.model.common.JSlgElementVariable)) {
			if(data.obj._isFloat) {
				data.obj.setKeyPathCodes(self);
			}
			data.obj.resetKey(self);
		}
		self._children.push(data.obj);
	};
	
	
	/**
	 * 子要素の設定
	 *
	 * @name removeChild
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.common.JSlgElementVariable#
	 * @param {Object} data
	 * <ul>
	 * <li>{jslgEngine.model.network.ConnectorBase} connector</li>
	 * <li>{jslgEngine.model.common.JSlgElementFinder} finder</li>
	 * </ul>
	 */
	p.removeChild = function(data, options) {
		var self = this;
		
		var key = data.key;

		var length = self._children.length;
		for(var i = 0; i < length; i++) {
			var child = self._children[i];
			var wasMatchedPath = (data.obj ? child.getPath() === data.obj.getPath() : false);
			if(wasMatchedPath || (key && child.getKey() === key)) {
				//子要素が変数でない場合を除いて、キーの書き換えは行わない
				if((data.obj instanceof jslgEngine.model.common.JSlgElementVariable)) {
					data.obj.resetKey(null);
				}
				self._children.splice(i, 1);
				length = self._children.length;
			}
		}
	};
	
	/**
	 * 子要素の設定
	 *
	 * @name clearChild
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.common.JSlgElementVariable#
	 * @param {Object} options
	 * <ul>
	 * <li>{jslgEngine.model.network.ConnectorBase} connector</li>
	 * <li>{jslgEngine.model.common.JSlgElementFinder} finder</li>
	 * </ul>
	 */
	p.clearChildren = function(options) {
		var self = this;

		//TODO: 暫定で単純に消す
		self._children = [];
	};
	
	/**
	 * キーの書き換え（再帰処理）
	 *
	 * @name resetKey
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.common.JSlgElementVariable#
	 * @param {jslgEngine.model.common.JSlgElementBase} element キー書き換え元要素
	 */
	p.resetKey = function(element) {
		var self = this;
		
		if(self._isFloat) {
			//追加する要素が不変のパスコードだった場合、パスコードを書き直す。
			self.setKeyPathCodes(element);
		}
		
		var keyCode = self._keyCode;
		if(!element) {
			var keyElements = self.getKeyData().getKeyElements();
			var resetKeyElements = {};
			//書き換え要素が存在しない場合（要素が削除された時など）、
			//自身のキーコード以外を空文字で埋める。
			for(var key in keyElements) {
				if(key !== self._keyCode) {
					resetKeyElements[key] = '';
				}
			}
			self._key.rewrite(resetKeyElements);
		} else {
			//親要素が存在する場合、親のキーで自信のキーに上書きする
			var slgKey = element.getKeyData();
			self._key.rewrite(slgKey.getKeyElements());
		}
		if(self._children) {
			//子要素が変数の場合、同様の処理を行う。
			var length = self._children.length;
			for(var i = 0; i < length; i++) {
				var child = self._children[i];
				if((child instanceof jslgEngine.model.common.JSlgElementVariable)) {
					child.resetKey(self);
				}
			}
		}
	};

	/**
	 * 子要素の取得
	 *
	 * @name getChild
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.common.JSlgElementVariable#
	 * @param {Object} options
	 * <ul>
	 * <li>{jslgEngine.model.network.ConnectorBase} connector</li>
	 * <li>{jslgEngine.model.common.JSlgElementFinder} finder</li>
	 * <li>{String} filter</li>
	 * </ul>
	 */
	p.getChild = function(options) {
		var self = this;
		
		// if(self._children.length == 1) {
			// return self._children[0]._getChild(options);
		// } else {
			return self._getChild(options);
		//}
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
		
		if(!self._isArray) {
			var targetChild = self._children[0];
			var appliedElements = [targetChild];
			var length = appliedElements.length;
			
			for(var i = 0; i < length; i++) {
				var child = appliedElements[i];
				//適用要素は除外する
				data.obj.keys = [].concat(child.getKey()).concat(keys);
				var element = child.getElementFromSimpleElement(data, options);
				if(element) return element;
			}
		} else {
			if(keys.length > 0) {
				for(var i = 0; i < self._children.length; i++) {
					var child = self._children[i];
					data.obj.keys = [].concat(keys);
					var element = child.getElementFromSimpleElement(data, options);
					if(element) return element;
				}
			} else {
				return self;
			}
		}
		
		return null;
	};
	
	/**
	 * 検索用のJSON形式として返す
	 *
	 * @name toSimpleElements
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.common.JSlgElementVariable#
	 * @returns {JSON}
	 */
	p.toSimpleElements = function(data, options) {
		var self = this;
		var element = {};
		var keys = data.keys||[];
		
		if(!self._isArray) {
			var targetChild = self._children[0];
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
		} else {
			return self.__super__.toSimpleElements.apply(self, [data, options]);
		}
		return element;
	};
    
	/**
	 * XML文字列形式として返す
	 *
	 * @name toXML
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.common.JSlgElementVariable#
	 * @returns {String}
	 */
	p.toXML = function(options) {
        return '';
    };
    
	o.JSlgElementVariable = JSlgElementVariable;
}());
