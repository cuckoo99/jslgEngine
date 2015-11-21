/*
 * @author cuckoo99
 */

(function() {
	// namespace:
	var o = this.jslgEngine = this.jslgEngine||{};
	o = (o.model = o.model||{});
	o = (o.common = o.common||{});

	/**
	 * <h4>JSlgEngineキー</h4>
	 * <p>
	 * 一意な情報を示す文字列キー
	 * ただし、一意性を保証するのはオブジェクトである。
	 * </p>
	 * @class
	 * @name JSlgKey
	 * @memberOf jslgEngine.model.common
	 * @constructor
	 */
	var JSlgKey = function(data, options) {
		this.initialize(data, options);
	};
	/**
	 *
	 */
	var p = JSlgKey.prototype;

	/**
	 * 初期化
	 *
	 * @name initialize
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.common.JSlgKey#
	 * @param {Object} options
	 * <ul>
	 * <li>{String[]} keys キー配列</li>
	 * </ul>
	 **/
	p.initialize = function(data, options) {
		var self = this;

		self._keyElements = {};

		if(!data) return;

		self._keyPathCodes = data.keys||[];
		if(data.keys) {
			var length = data.keys.length||0;
			for(var i = 0; i < length; i++) {
				self._keyElements[data.keys[i]] = '';
			}
		}
		if(data.keyCode) {
			self._keyCode = data.keyCode;
		}
		if(options) {
			var uniqueId = data.id ? data.id : options.mainController.getUniqueId();
			self._uniqueId = uniqueId;
		} else {
			//console.trace();
			//jslgEngine.log('failed to attach unique id');
		}
	};

	/**
	 * 一意ID
	 *
	 * @private
	 * @name _uniqueId
	 * @property
	 * @type JSON
	 * <ul>
	 * <li></li>
	 * </ul>
	 * @memberOf jslgEngine.model.common.JSlgKey#
	 **/
	p._uniqueId = null;

	/**
	 * 保有キー要素
	 *
	 * @private
	 * @name _keyElements
	 * @property
	 * @type JSON
	 * <ul>
	 * <li></li>
	 * </ul>
	 * @memberOf jslgEngine.model.common.JSlgKey#
	 **/
	p._keyElements = null;

	/**
	 * パスのキーコード
	 * 20131129 要素からキー側に情報を移す
	 *
	 * @name keyPathCodes
	 * @property
	 * @type String[]
	 * @memberOf jslgEngine.model.common.JSlgKey#
	 **/
	p._keyPathCodes = null;

	/**
	 * 対象キーコード
	 * 20131129 要素からキー側に情報を移す
	 *
	 * @name keyCode
	 * @property
	 * @type String
	 * @memberOf jslgEngine.model.common.JSlgKey#
	 **/
	p._keyCode = null;
	
	/**
	 * 区切り文字
	 *
	 * @name _separator
	 * @property
	 * @type String
	 * @memberOf jslgEngine.model.common.JSlgKey#
	 **/
	p.separator = '_';

	/**
	 * キーの書き換え
	 *
	 * @name getKeyCode
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.common.JSlgKey#
	 */
	p.getKeyCode = function() {
		var self = this;
		return self._keyCode;
	};
	
	/**
	 * キーの書き換え
	 *
	 * @name getKeyPathCodes
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.common.JSlgKey#
	 */
	p.getKeyPathCodes = function() {
		var self = this;
		return self._keyPathCodes;
	};
	
	/**
	 * キーの書き換え
	 *
	 * @name setKeyCode
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.common.JSlgKey#
	 */
	p.setKeyCode = function(key_code) {
		var self = this;
		return self._keyCode = key_code;
	};
	
	/**
	 * キーの書き換え
	 * 
	 * @name setKeyPathCodes
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.common.JSlgKey#
	 */
	p.setKeyPathCodes = function(key_codes) {
		var self = this;
		return self._keyPathCodes = key_codes;
	};

	/**
	 * キーの書き換え
	 *
	 * @name rewrite
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.common.JSlgKey#
	 * @param {Object | String[] | String} keys キーの値
	 */
	p.rewrite = function(keys) {
		var self = this;

		if(!keys) return false;

		for(key in keys) {
			self._keyElements[key] = keys[key];
		}
	};

	/**
	 * キーの設定
	 *
	 * @name setKey
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.common.JSlgKey#
	 * @param {String} key_code 対象キーコード
	 * @param {String} key キー
	 */
	p.setKey = function(key_code, key) {
		var self = this;

		// if(typeof key !== 'string') {
		// 	jslgEngine.log('キーの設定、失敗：文字列ではありません。');
		// 	return;
		// }

		//TODO: もし、数値も処理するが問題があれば修正する必要がある。
		self._keyElements[key_code] = ''+key;
	};

	/**
	 * ユニークIDの書き換え
	 * コマンドはクローンを作成して、ユニークIDを書き換える必要があるため
	 * 挙動を変える必要がある。
	 *
	 * @name resetUniqueId
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.common.JSlgKey#
	 * @param {String} key_code 対象キーコード
	 */
	p.resetUniqueId = function(options) {
		var self = this;

		//jslgEngine.log('!!!it does not rewrite object binder.');
		self._uniqueId = options.mainController.getUniqueId();
	};

	/**
	 * 一意IDの取得
	 *
	 * @name getUniqueId
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.common.JSlgKey#
	 * @param {String} key_code 対象キーコード
	 */
	p.getUniqueId = function(key_code) {
		var self = this;

		return self._uniqueId;
	};

	/**
	 * 一意IDの設定
	 *
	 * @name setUniqueId
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.common.JSlgKey#
	 * @param {String} key_code 対象キーコード
	 */
	p.setUniqueId = function(id) {
		var self = this;

		self._uniqueId = id;
	};

	/**
	 * キーの取得
	 *
	 * @name getKey
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.common.JSlgKey#
	 * @param {String} key_code 対象キーコード
	 */
	p.getKey = function(key_code) {
		var self = this;

		return self._keyElements[key_code];
	};

	/**
	 * キーのパス取得
	 *
	 * @name getPath
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.common.JSlgKey#
	 * @param {String[]} key_codes 対象キーコード
	 * @returns {String} パス
	 */
	p.getPath = function(key_codes) {
		var self = this;
		var path = '';
		var elementSeparator = jslgEngine.config.elementSeparator;
		var keyPathCodes = key_codes||self._keyPathCodes;
		
		for(var i = 0; i < keyPathCodes.length; i++) {
			path += self._keyElements[keyPathCodes[i]];
			path += (i != keyPathCodes.length - 1)?elementSeparator:'';
		}
		return path;
	};

	/**
	 * キーの全要素取得
	 *
	 * @name getKeyElements
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.common.JSlgKey#
	 * @returns {JSON} キー要素
	 */
	p.getKeyElements = function() {
		var self = this;

		return self._keyElements;
	};
	o.JSlgKey = JSlgKey;
}());
