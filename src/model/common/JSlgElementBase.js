/*
 * @author cuckoo99
 */

(function() {
	// namespace:
	var o = this.jslgEngine = this.jslgEngine||{};
	o = (o.model = o.model||{});
	o = (o.common = o.common||{});

	/**
	 * <h4>SLG要素・基本クラス</h4>
	 * <p>
	 * ゲームに用いられる、全ての物理的要素。
	 * </p>
	 * @class
	 * @name JSlgElementBase
	 * @memberOf jslgEngine.model.common
	 * @constructor
	 */
	var JSlgElementBase = function(data, options) {
		this.initialize(data, options);
	};
	/**
	 *
	 */
	var p = JSlgElementBase.prototype;

	/**
	 * 初期化
	 *
	 * @name initialize
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.common.JSlgElementBase#
	 **/
	p.initialize = function(data, options) {
		var self = this;
		var baseOptions = data||{};

		//TODO:パスは完全にキーに委譲するべき
		var keyPathCodes = self._keyPathCodes||baseOptions.keyPathCodes;
		
		var keyCode = self._keyCode||baseOptions.keyCode;
		self._key = new jslgEngine.model.common.JSlgKey({
			keyCode : keyCode,
			keys : keyPathCodes
		}, options);
		if(baseOptions.key) {
			self.setKey(baseOptions.key);
		}
		self._children = [];
	};

	/**
	 * 要素のタイプ
	 *
	 * @name elementType
	 * @property
	 * @type String
	 * @memberOf jslgEngine.model.common.JSlgElementBase#
	 **/
	p.elementType = 'Element';

	/**
	 * キー
	 *
	 * @private
	 * @property _key
	 * @type jslgEngine.model.common.JSlgKey
	 * @memberOf jslgEngine.model.common.JSlgElementBase#
	 **/
	p._key = null;

	/**
	 * パスのキーコード
	 *
	 * @name keyPathCodes
	 * @property
	 * @type String[]
	 * @memberOf jslgEngine.model.common.JSlgElementBase#
	 **/
	p._keyPathCodes = null;

	/**
	 * 対象キーコード
	 *
	 * @name keyCode
	 * @property
	 * @type String
	 * @memberOf jslgEngine.model.common.JSlgElementBase#
	 **/
	p._keyCode = null;

	/**
	 * どこにでも着脱可能かどうか
	 *
	 * @name _isFloat
	 * @property
	 * @type Boolean
	 * @memberOf jslgEngine.model.common.JSlgElementBase#
	 **/
	p._isFloat = false;

	/**
	 * 子要素
	 *
	 * @private
	 * @name _children
	 * @property
	 * @type jslgEngine.model.common.JSlgElementBase[]
	 * @memberOf jslgEngine.model.common.JSlgElementBase#
	 **/
	p._children = null;

	/**
	 * 追加時発生イベント
	 *
	 * @name onAdd
	 * @property
	 * @type jslgEngine.model.command.Command
	 * @memberOf jslgEngine.model.common.JSlgElementBase#
	 **/
	p.onAdd = null;

	/**
	 * 削除時発生イベント
	 *
	 * @name onRemove
	 * @property
	 * @type jslgEngine.model.command.Command
	 * @memberOf jslgEngine.model.common.JSlgElementBase#
	 **/
	p.onRemove = null;

	/**
	 * ステータス変更時発生イベント
	 *
	 * @name onChange
	 * @property
	 * @type jslgEngine.model.command.Command
	 * @memberOf jslgEngine.model.common.JSlgElementBase#
	 **/
	p.onChange = null;

	/**
	 * メインイベントの実行
	 *
	 * @name run
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.common.JSlgElementBase#
	 * @param {Object} options
	 */
	p.run = function(options) {};

	/**
	 * メインイベントのリストア
	 *
	 * @name restore
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.common.JSlgElementBase#
	 * @param {Object} options
	 */
	p.restore = function(options) {};

	/**
	 * キーの書き換え
	 *
	 * @name rewrite
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.common.JSlgElementBase#
	 * @param {Object | String[] | String} keys キーの値
	 */
	p.rewrite = function(keys) {};

	/**
	 * クローンが作成された場合など、初期設定を行う。
	 *
	 * @name setup
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.common.JSlgElementBase#
	 * @param {Object} options
	 */
	p.setup = function(data, options) {
		var self = this;
		var length = self._children ? self._children.length : 0;

		self.getKeyData().resetUniqueId(options);
		if(data.parent) {
			options.mainController.bindElement(self, data.parent);
		}
		
		for(var i = 0; i < length; i++) {
			var child = self._children[i];
			
			data.parent = self;
			child.setup(data, options);
		}
	};

	/**
	 * キーの書き換え（再帰処理）<br />
	 *
	 * @name resetKey
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.common.JSlgElementBase#
	 * @param {jslgEngine.model.common.JSlgElementBase} element キー書き換え元要素
	 */
	p.resetKey = function(element) {
		var self = this;
		self._resetKey(element);
	};

	/**
	 * キーの書き換え（再帰処理）<br />
	 * <br />
	 * 追加など行った場合、子要素すべてのキーを再設定する。<br />
	 * 
	 * @private
	 * @name _resetKey
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.common.JSlgElementBase#
	 * @param {jslgEngine.model.common.JSlgElementBase} element キー書き換え元要素
	 */
	p._resetKey = function(element) {
		var self = this;
		
		if(self._isFloat) {
			//追加する要素が不変のパスコードだった場合、パスコードを書き直す。
			self.setKeyPathCodes(element);
		}
		
		var keyCode = self._key.getKeyCode();
		if(!element) {
			var keyElements = self.getKeyData().getKeyElements();
			var resetKeyElements = {};
			//書き換え要素が存在しない場合（要素が削除された時など）、
			//自身のキーコード以外を空文字で埋める。
			for(var key in keyElements) {
				if(key !== keyCode) {
					resetKeyElements[key] = '';
				}
			}
			self._key.rewrite(resetKeyElements);
		} else {
			//対象要素のキーコードのクローンを作成し、自身のキーコードに上書きする。
			var slgKey = element.getKeyData();
			self._key.rewrite(slgKey.getKeyElements());
		}
		if(self._children) {
			//子要素に対して同様の処理を行う。
			var length = self._children.length;
			for(var i = 0; i < length; i++) {
				self._children[i].resetKey(self);
			}
		}
	};
	
	/**
	 * キーの設定
	 *
	 * @name setKey
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.common.JSlgElementBase#
	 * @param {String} key_code 対象キー
	 * @param {String} value キーの値
	 */
	p.setKey = function(key) {
		var self = this;
		var keyCode = self._key.getKeyCode();
		self._key.setKey(keyCode, key);
	};

	/**
	 * キーの取得
	 *
	 * @name getKey
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.common.JSlgElementBase#
	 * @param {String} key_code 対象キー
	 */
	p.getKey = function(key_code) {
		var self = this;
		var keyCode = key_code||self._key.getKeyCode();
		return self._key.getKey(keyCode);
	};

	/**
	 * キー・オブジェクトの取得
	 *
	 * @name getKeyData
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.common.JSlgElementBase#
	 * @param {String} key_code 対象キー
	 */
	p.getKeyData = function() {
		var self = this;
		return self._key;
	};

	/**
	 * キー・オブジェクトの設定
	 *
	 * @name setKeyData
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.common.JSlgElementBase#
	 * @param {String} key_code 対象キー
	 */
	p.setKeyData = function(keydata) {
		var self = this;
		self._key = keydata;
	};

	/**
	 * キーのパス取得
	 *
	 * @name getPath
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.common.JSlgElementBase#
	 */
	p.getPath = function(obj) {
		var self = this;
		
		var keyCodes;
		
		if(obj instanceof Array) {
			//フルパスの場合
			var keyPathCodes = obj;
		} else {
			var keyPathCodes = self.getKeyPathCodes();
			
			if(obj != null) {
				var key = obj;
				var wasMatch = false;
				for(var i = 0; i < keyPathCodes.length; i++) {
					if(keyPathCodes[i] == key) {
						keyPathCodes = keyPathCodes.slice(0,i+1);
						wasMatch = true;
						break;
					}
				}
				if(!wasMatch) return null;
			}
		}
		return self._key.getPath(keyPathCodes);
	};

	/**
	 * パスのキーコード取得
	 *
	 * @name getKeyPathCodes
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.common.JSlgElementBase#
	 */
	p.getKeyPathCodes = function() {
		var self = this;
		return self._key.getKeyPathCodes();
	};

	/**
	 * キーのパスコード書き換え<br />
	 *
	 * @private
	 * @name _setKeyPathCodes
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.common.JSlgElementStatus#
	 * @param {jslgEngine.model.common.JSlgElementBase} element キー書き換え元要素
	 */
	p.setKeyPathCodes = function(parent) {
		var self = this;
		if(!parent) return;
		
		var statusPathCodes = [];
		var keyPathCodes = parent.getKeyPathCodes();
		var exKeyCode = '@';
		var nwKeyCode = self._key.getKeyCode();
		var key = self.getKey();
		
		var myKeyPathCodes = self._key.getKeyPathCodes();
		myKeyPathCodes.splice(0, myKeyPathCodes.length);
		var length = keyPathCodes.length;
		for(var i = 0; i < length; i++) {
			var keyCode = keyPathCodes[i];
			if(keyCode == nwKeyCode) {
				self._key.setKey(nwKeyCode, null);
				//キーコードが重複した場合は、特殊文字を付与
				nwKeyCode = nwKeyCode+exKeyCode;
			}
			myKeyPathCodes.push(keyCode);
		}
		
		//20149114 親キーと一致した場合でもキーを書き換える。
		if(parent.getKeyData().getKeyCode() == nwKeyCode) {
			self._key.setKey(nwKeyCode, null);
			nwKeyCode = nwKeyCode+exKeyCode;
		}
		
		myKeyPathCodes.push(nwKeyCode);
		self._key.setKeyCode(nwKeyCode);
		self._key.setKey(nwKeyCode, key);
	};
	
	
	/**
	 * 親要素の取得
	 *
	 * @name getParent
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.common.JSlgElement#
	 * @param {Object} options
	 */
	p.getParent = function(options) {
		var self = this;
		
		//親管理オブジェクトから取得
		var parent = options.mainController.getElementFromBinder(self);
		return parent;
	};
	
	/**
	 * 子要素の設定
	 *
	 * @name addChild
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.common.JSlgElementBase#
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

		// if(obj) {
			// //暫定で既存のものがあれば、置き換え
			// self.removeChild({ obj : obj}, options);		
		// }
		
		if(self.hasCircularReference(data.obj)) {
			jslgEngine.log('Could not add element because of Circular Reference');
			return false;
		}
		
		//追加する要素のパスコードを親要素のパスコードで書き換える。
		data.obj.resetKey(self);
		self._children.push(data.obj);
		if(options) {
			options.mainController.bindElement(data.obj, self);
		} else {
			//jslgEngine.log('No Bind: '+self.getPath()+' to '+data.obj.getKey());
		}
	};

	/**
	 * イベントの設定
	 *
	 * @name addCommandListner
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.common.JSlgElementBase#
	 * @param {Object} options
	 * <ul>
	 * <li>{jslgEngine.model.network.ConnectorBase} connector</li>
	 * <li>{jslgEngine.model.common.JSlgElementFinder} finder</li>
	 * </ul>
	 */
	p.addCommandListner = function(key, command, options) {
		var self = this;

		self.addChild({
			obj : command
		}, options);
	};


	/**
	 * 子要素の取得
	 *
	 * @name getChild
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.common.JSlgElementBase#
	 * @param {Object} options
	 * <ul>
	 * <li>{jslgEngine.model.network.ConnectorBase} connector</li>
	 * <li>{jslgEngine.model.common.JSlgElementFinder} finder</li>
	 * <li>{String} filter</li>
	 * </ul>
	 */
	p.getChild = function(options) {
		var self = this;
		return self._getChild(options);
	};
	
	/**
	 * 子要素の取得
	 *
	 * @name _getChild
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.common.JSlgElementBase#
	 * @param {Object} options
	 * <ul>
	 * <li>{jslgEngine.model.network.ConnectorBase} connector</li>
	 * <li>{jslgEngine.model.common.JSlgElementFinder} finder</li>
	 * <li>{String} filter</li>
	 * </ul>
	 */
	p._getChild = function(options) {
		var self = this;
		var child = null;

		if(!options || !options.key) return false;

		var key = options.key;

		var length = self._children.length;
		for(var i = 0; i < length; i++) {
			var element = self._children[i];
			var location = element.location||{};
			location = location.toString({ offset : element.offset})||null;

			// CommandBlock対策
			if(!element.getKey) continue;

			if(element.getKey() === key||location === key) {
				child = element;
				
				if(!child) {
					if(options.finder) options.finder.find(key);
					return null;
				}
			}
			
			if(child) break;
		}
		return child||null;
	};

	/**
	 * 子要素の取得
	 *
	 * @name findElements
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.common.JSlgElementBase#
	 * @param {Object} options
	 * <ul>
	 * <li>{jslgEngine.model.network.ConnectorBase} connector</li>
	 * <li>{jslgEngine.model.common.JSlgElementFinder} finder</li>
	 * <li>{String} filter</li>
	 * </ul>
	 */
	p.findElements = function(connector, data, options) {
		var self = this;
		var baseElement = options.mainController.getWorldRegion();
		if(connector) {
			connector.pipe(function(connector_s) {
				var backGroundWorker = options.mainController.getWebWorkers('FindElements');
	        
	        	var elm = self, parent, limit = 100;
	        	var keysStrip = [];
	        	var findTargets;
	        	
	        	while((parent = elm.getParent(options)) != null && (limit--) > 0) {
	        		keysStrip.push(parent.getKey());
	        		elm = parent;
	        	}
	        	var elementSeparator = jslgEngine.config.elementSeparator;
	        	if(keysStrip.length > 0) {
	        		//TODO: 現在data.objには対応していない
		        	if(data.key) {
		    			//親が存在する場合、親の取得が考えられるので完全パスを取得
		        		var fullpath = [keysStrip.reverse().join(elementSeparator), data.key].join(elementSeparator);
			        	data.key = fullpath;
		        	} else if(data.className) {
		        		findTargets = baseElement._getObjectToFind({
							key : keysStrip.reverse().join(elementSeparator)
						}, options);
						findTargets.push(baseElement._getObjectToFind({
							className : data.className
						}, options)[0]);
		        	}
	        	} else {
		        	baseElement = self;
	        	}
	        	
				//var elements = self.toSimpleElements({});
				var elements = baseElement.toSimpleElements({});
				findTargets = findTargets||self._getObjectToFind(data, options);
				
				var obj = {
					elements : elements,
					findTargets : findTargets
				};
				
		        backGroundWorker.add(JSON.stringify(obj), function(result) {
		        	connector_s.resolve(result);
		        });
	        
			}).pipe(function(connector_s, result_s) {
				var elements = [];
				for(var i = 0; i < result_s.length; i++) {
					if(result_s[i]) {
						elements.push(baseElement.getElementFromSimpleElement({
				        	obj : result_s[i]
				        }));
					}
				}
		        connector_s.resolve(elements);
			});	
		} else {
			return self._findElements(connector, data, options);
		}
	};
	
	/**
	 * 子要素の取得
	 *
	 * @name _findElements
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.common.JSlgElementBase#
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
		
		target.data.index = data.index;
		if(self._isMatched(target.data)) {
			if(obj.length === 0) {
				data.result.push(self);
			} else {
				var resultChild = [];
				var specialData = {
					obj : obj,
					result : data.result
				};
				var exElement = self._getElementFromParentKey(self, specialData, options);
				children = exElement.getChildren();
				
				if(obj.length == 0) {
					return data.result;
				}
				
				for(var i = 0; i < children.length; i++) {
					var child = children[i];
					
					child.findElements(connector, {
						index : i,
						obj : [].concat(obj),
						result : data.result
					}, options);
				}
			}
		}
		
		for(var i = 0; i < children.length; i++) {
			var child = children[i];
			
			if(target.type === 'find') {
				child.findElements(connector, {
					index : i,
					obj : [].concat(target).concat(obj),
					result : data.result
				}, options);
			}
		}
		
		return data.result;
	};
	
	/**
	 * 子要素の取得
	 *
	 * @name _getElementFromParentKey
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.common.JSlgElementBase#
	 * @param {Object} options
	 */
	p._getElementFromParentKey = function(element, data, options) {
		var self = this;
		var obj = data.obj;
		var next = obj.shift();
		
		if(next.type === 'parent') {
			var parent = element.getParent(options);
		
			if(obj.length == 0) {
				data.result.push(parent);
				return parent;
			}
			
			return self._getElementFromParentKey(parent, {
				obj : obj,
				result : data.result
			}, options);
		} else {
			obj.unshift(next);
			return element;
		}
	};
	
	/**
	 * 子要素の取得
	 *
	 * @name _getObjectToFind
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.common.JSlgElementBase#
	 * @param {Object} options
	 */
	p._getObjectToFind = function(data, options) {
		var self = this;
		
		//　検索フォーマットに変換
		var obj = data.obj||[];
		if(data.className) {
			obj.push({
				type : 'find',
				data : {
					key : data.key,
					className : data.className
				}
			});
		} else if(data.key) {
			var keys = data.key.split(jslgEngine.config.elementSeparator);
			
			for(var i = 0; i < keys.length; i++) {
				var key = keys[i];
				
				var cIndex = key.indexOf('(');
				var clIndex = key.indexOf(')');
				var methodName = key.substring(0, cIndex != -1 ? cIndex : key.length);
				
				switch(methodName) {
				case 'parent':
					obj.push({
						type : 'parent',
						data : {}
					});
					break;
				case 'find':
					obj.push({
						type : 'find',
						data : {
							key : null,
							className : key.substring(cIndex+1, clIndex)
						}
					});
					break;
				default:
					obj.push({
						type : 'get',
						data : {
							key : keys[i]
						}
					});
					break;
				}
			}
		}
		
		return obj;
	};
	
	/**
	 * 座標が同一か
	 *
	 * @name _isMatched
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.common.JSlgElementBase#
	 * @param {Object} options
	 * <ul>
	 * <li>{jslgEngine.model.network.ConnectorBase} connector</li>
	 * <li>{jslgEngine.model.common.JSlgElementFinder} finder</li>
	 * <li>{String} filter</li>
	 * </ul>
	 */
	p._isMatched = function(data, options) {
		var self = this;
		var key = data.key;
		var location = data.key ? data.key.split(jslgEngine.config.locationSeparator) : null;
		location = location ? { x : location[0],  y : location[1], z : location[2] } : null;
		var index = data.index;
		var className = data.className;
		
		if(key && self.getKey() !== key) {
			if(location && !self.exists(location)) {
				if(!index || (index && key !== index)) {
					return false;
				}
			}
		}
		if(className && self.className !== className) {
			return false;
		}
		
		return (key||location||index||className);
	};
	
	/**
	 * 全子要素の取得
	 *
	 * @name getChildren
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.common.JSlgElementBase#
	 * @param {Object} options
	 * <ul>
	 * <li>{jslgEngine.model.network.ConnectorBase} connector</li>
	 * <li>{jslgEngine.model.common.JSlgElementFinder} finder</li>
	 * <li>{String} filter</li>
	 * </ul>
	 */
	p.getChildren = function(options) {
		var self = this;
		return self._children;
	};
	
	/**
	 * 子要素の設定
	 *
	 * @name removeChild
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.common.JSlgElementBase#
	 * @param {Object} options
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
				data.obj.resetKey(null);
				self._children.splice(i, 1);
				if(options) {
					options.mainController.bindElement(data.obj, null);
				} else {
					//jslgEngine.log('No Removing Bind: '+self.getPath()+' to '+data.obj.getKey());
				}
				length = self._children.length;
			}
		}
	};
	
	/**
	 * 子要素の設定
	 *
	 * @name clearChildren
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.common.JSlgElementBase#
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
//		var length = self._children.length;
//		for(var i = 0; i < length; i++) {
//			var child = self._children[i];
//			self.removeChild({
//				obj : child
//			});
//		}
	};

	/**
	 * ステータスの設定
	 *
	 * @name setStatus
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.common.JSlgElementBase#
	 * @param {Object} options
	 * <ul>
	 * <li>{jslgEngine.model.network.ConnectorBase} connector</li>
	 * </ul>
	 */
	p.setStatus = function(key, value, options) {
		var self = this;
		var optionsStatus = options||{};
		var status = self.getChild({
			key : key
		});
		if(!status) {
			status = new jslgEngine.model.common.JSlgElementStatus({
				key : key,
				value : value,
				parent : self
			});

			optionsStatus.obj = status;
			self.addChild(optionsStatus, options);
		} else {
			if(status instanceof jslgEngine.model.common.JSlgElementStatus) {
				status.value = value;
			} else {
				jslgEngine.log('ステータスの値書き換え失敗：オブジェクトの型が不一致');
			}
		}
	};

	/**
	 * ステータスの取得
	 *
	 * @name getStatus
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.common.JSlgElementBase#
	 * @param {Object} options
	 * <ul>
	 * <li>{jslgEngine.model.network.ConnectorBase} connector</li>
	 * </ul>
	 */
	p.getStatus = function(key, options) {
		var self = this;
		var optionsStatus = options||{};
		optionsStatus.key = key;
		return self.getChild(optionsStatus);
	};

	/**
	 * 全ステータスの取得
	 *
	 * @name getAllStatus
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.common.JSlgElementBase#
	 * @param {Object} options
	 * <ul>
	 * </ul>
	 */
	p.getAllStatus = function(options) {
		var self = this;
		var children = [];

		var length = self._children.length;

		for(var i = 0; i < length; i++) {
			var child = self._children[i];
			if(child instanceof jslgEngine.model.common.JSlgElementStatus) {
				children.push(child);
			}
		}
		return children;
	};

	/**
	 * 範囲内に座標が存在するかどうか
	 *
	 * @name exists
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.common.JSlgElementBase#
	 * @returns {Boolean}
	 **/
	p.exists = function(location) {
		return false;
	};
	
	/**
	 * 文字列として出力
	 *
	 * @name toString
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.common.JSlgElementBase#
	 * @param {Object} options
	 * <ul>
	 * </ul>
	 */
	p.toString = function(options) {
		var self = this;
		
		var children = [];
		var baseOptions = options||{};
		var nest = baseOptions.nest||0;

		var text = jslgEngine.utility.getRepeatedText(' ', nest) + self.className+'\r\n';
		//jslgEngine.log(text);
		var length = self._children.length;
		for(var i = 0; i < length; i++) {
			baseOptions.nest = nest + 1;
			text += self._children[i].toString(baseOptions);
		}
		
		//TODO: 一時、うっとおしいのでコメント
		return false;
		//return text;
	};
	
	/**
	 * JSON形式として返す
	 *
	 * @name toJson
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.common.JSlgElementBase#
	 * @returns {JSON}
	 */
	p.toJson = function(options) {
		var self = this;
		return JSON.parse(self.toJsonString(options));
	};
	
	/**
	 * 検索用のJSON形式として返す
	 *
	 * @name toSimpleElements
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.common.JSlgElementBase#
	 * @returns {JSON}
	 */
	p.getElementFromSimpleElement = function(data, options) {
		var self = this;
		var element = {};
		var keys = data.obj.keys||[];
		var key = keys.shift();
		var matched = self.getKey() === key;
		
		if(!matched) return null;
		
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
		return null;
	};
	
	/**
	 * 検索用のJSON形式として返す
	 *
	 * @name toSimpleElements
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.common.JSlgElementBase#
	 * @returns {JSON}
	 */
	p.toSimpleElements = function(data, options) {
		var self = this;
		var element = {};
		var keys = data.keys||[];
		
		var key = data.key||self.getKey();
		keys.push(key);
		element['index'] = data.index != null ? data.index : null;
		element['key'] = key;
		element['keys'] = keys;
		element['location'] = self.getGlobalLocation ? self.getGlobalLocation() : null;
		element['className'] = self.className;
		
		//一時キーの削除
		data.key = null;
		
		var length = self._children.length;
		var children = [];
		for(var i = 0; i < length; i++) {
			var child = self._children[i];
			var nextKeys = [].concat(keys);
			data.index = i;
			data.keys = nextKeys;
			if(child.toSimpleElements) {
				children.push(child.toSimpleElements(data, options));
			}
		}
		element['children'] = children;
		return element;
	};
	
	/**
	 * XML文字列形式として返す
	 *
	 * @name toXML
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.common.JSlgElementBase#
	 * @returns {String}
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
		var key = ['<key>',self.getKey(),'</key>'].join('');
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
		var value = '';
		if(self.value) {
			value = (self.value instanceof Array) ?
						['<value>',getNestedProperties(0, self.value, 'arguments'),'</value>'].join(getIncrement(inc, true)) :
						'<value>'+self.value+'</value>';
		}
		var location = self.location ? (
			[	'<location>','<x>'+self.location.x+'</x>','<y>'+self.location.y+'</y>',
				'<z>'+self.location.z+'</z>','</location>' ].join(getIncrement(inc, true))
		) : '';
		var size = self.size ? (
			[	'<size>','<width>'+self.size.width+'</width>',
				'<height>'+self.size.height+'</height>','<depth>'+self.size.depth+'</depth>','</size>'].join(getIncrement(inc, true))
		) : '';
		
		var childrenWords = [];
		var length = self._children.length;
		for(var i = 0; i < length; i++) {
			var child = self._children[i];
			childrenWords.push(child.toXML({increment : inc}));
		}
		var targets = [type,className,key,location,size,params,value,childrenWords.join(getIncrement(inc, true))];
		var t, nw = [];
		while ((t = targets.shift()) !== undefined) {
			if (t !== "") nw.push(t);
		}
		getNestedProperties = null;
		var text = ['<element>',nw.join(getIncrement(inc, true))].join(getIncrement(inc, true))+
					getIncrement(inc-1, true)+'</element>';
		return text;
	};
	
	/**
	 * JSON文字列形式として返す
	 *
	 * @name toJsonString
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.common.JSlgElementBase#
	 * @returns {String}
	 */
	p.toJsonString = function(options) {
		return '{}';
	};
	
	/**
	 * 要素が循環参照していないかチェックする
	 *
	 * @name hasCircularReference
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.common.JSlgElementBase#
	 * @returns {String}
	 */
	p.hasCircularReference = function(obj) {
		var self = this;
		var result = false;
		
		//　この条件でいいか不安
		if(self.className === obj.className &&
		   self.getKey() === obj.getKey()) {
		   	return true;
		}
		
		if(obj._children) {
			for(var i = 0; i < obj._children.length; i++) {
				var child = obj._children[i];
				result = result||self.hasCircularReference(child);
			}
		}
		
		return result;
	};
	
	o.JSlgElementBase = JSlgElementBase;
}());
