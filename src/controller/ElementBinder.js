/*
 * @author cuckoo99
 */

(function() {
	// namespace:
	var o = this.jslgEngine = this.jslgEngine||{};
	o = (o.controller = o.controller||{});

	/**
	 * <h4>実オブジェクト・管理クラス</h4>
	 * <p>
	 * 循環参照を回避するために、作成される要素管理コントローラ<br />
	 * </p>
	 * @class
	 * @name ElementBinder
	 * @memberOf jslgEngine.controller
	 * @constructor
	 */
	var ElementBinder = function() {
		this.initialize();
	};
	/**
	 *
	 */
	var p = ElementBinder.prototype;

	/**
	 * マッピングされた情報<br />
	 * <br />
	 * @name _contents
	 * @property
	 * @type String[]
	 * @memberOf jslgEngine.controller.ElementBinder#
	 **/
	p._contents = null;

	/**
	 * 初期化
	 *
	 * @name initialize
	 * @method
	 * @function
	 * @memberOf jslgEngine.controller.ElementBinder#
	 **/
	p.initialize = function() {
		var self = this;
		self._contents = [];
	};

	/**
	 * ロードする画像の追加
	 *
	 * @name set
	 * @method
	 * @function
	 * @memberOf jslgEngine.controller.ElementBinder#
	 **/
	p.set = function(key, element, options) {
		var self = this;
		
		var k = key;
		
		if(key instanceof jslgEngine.model.common.JSlgKey) {
			k = key.getKey();
		}
		
		if(element === null) {
			self.remove(k);
		} else {
			//TODO: キーが一意でなければならない。
			self._contents[k] = element;
		}
	};

	/**
	 * ロードする画像の追加
	 *
	 * @name add
	 * @method
	 * @function
	 * @memberOf jslgEngine.controller.ElementBinder#
	 **/
	p.remove = function(key, options) {
		var self = this;
		var k = key;
		
		if(key instanceof jslgEngine.model.common.JSlgKey) {
			k = key.getKey();
		}
		
		if(self._contents[k]) {
			jslgEngine.log('Remove Binding : '+k);
			delete self._contents[k];
			return true;
		}
		return false;
	};

	/**
	 * オブジェクトの取得<br />
	 * コールバックが指定されると、ロードが実行される。
	 *
	 * @name get
	 * @method
	 * @function
	 * @memberOf jslgEngine.controller.ElementBinder#
	 **/
	p.get = function(key, data, options) {
		var self = this;
		var k = key;
		
		if(key instanceof jslgEngine.model.common.JSlgKey) {
			//TODO: キーが一意でなければならない。
			k = key.getKey();
		}
		
		return self._contents[k];
	};

	o.ElementBinder = ElementBinder;
}());