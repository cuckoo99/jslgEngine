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
	 * ロード処理を必要とし、ロードされたオブジェクトを管理するコントローラ。<br />
	 * </p>
	 * @class
	 * @name FileControllerBase
	 * @memberOf jslgEngine.controller
	 * @constructor
	 */
	var FileControllerBase = function() {
		this.initialize();
	};
	/**
	 *
	 */
	var p = FileControllerBase.prototype;

	/**
	 * 識別キー<br />
	 * <br />
	 * @name _key
	 * @property
	 * @type String
	 * @memberOf jslgEngine.controller.FileControllerBase#
	 **/
	p._key = null;

	/**
	 * ロード予約済みの情報<br />
	 * <br />
	 * Key：キー、Value：Url
	 * @name _stock
	 * @property
	 * @type String[]
	 * @memberOf jslgEngine.controller.FileControllerBase#
	 **/
	p._stock = null;

	/**
	 * 実オブジェクト
	 *
	 * @name _contents
	 * @property
	 * @type Object
	 * @memberOf jslgEngine.controller.FileControllerBase#
	 **/
	p._contents = null;

	/**
	 * 初期化
	 *
	 * @name initialize
	 * @method
	 * @function
	 * @memberOf jslgEngine.controller.FileControllerBase#
	 **/
	p.initialize = function(data) {
		var self = this;
		//self._key = data ? data.key : '';
		self._contents = [];
		self._stock = [];
	};

	/**
	 * キーの取得
	 *
	 * @name initialize
	 * @method
	 * @function
	 * @memberOf jslgEngine.controller.FileControllerBase#
	 **/
	p.getKey = function() {
		var self = this;
		return self._key;
	};

	/**
	 * ロードする画像の追加
	 *
	 * @name add
	 * @method
	 * @function
	 * @memberOf jslgEngine.controller.FileControllerBase#
	 **/
	p.add = function(data) {
		var self = this;
		self._stock.push({
			key : data.key,
			url : data.url
		});
	};

	/**
	 * オブジェクトの取得<br />
	 * コールバックが指定されると、ロードが実行される。
	 *
	 * @name get
	 * @method
	 * @function
	 * @memberOf jslgEngine.controller.OBJFileController#
	 **/
	p.get = function(connector, data, options, callback) {
		var self = this;
		
		if(self._contents[data.key]) {
			if(callback) {
				callback(self._contents[data.key]);
			} else {
				return self._contents[data.key];
			}
		}
		
		for(var i = 0; i < self._stock.length; i++) {
			var one = self._stock[i];
			
			if(one.key === data.key) {
				if(callback) {
					self.load(connector, {
						contentKeys : [data.key],
						callback : function(content) {
							callback(content);
						}
					}, options);
					break;
				} else {
					return null;
				}
			}
		}
	};

	/**
	 * 画像をロードする
	 *
	 * @name load
	 * @method
	 * @function
	 * @memberOf jslgEngine.controller.FileControllerBase#
	 * @param {JSON} options
	 * <ul>
	 * <li>{jslgEngine.connector.SynchronizeBase} connector 直列処理クラス</li>
	 * <li>{String[]} loadContents 読み込む画像</li>
	 * </ul>
	 * @param {Function} callback 読み込み後実行されるコールバック関数
	 **/
	p.load = function(connector, data, options) {
	};

	o.FileControllerBase = FileControllerBase;
}());