/*
 * @author cuckoo99
 */

(function() {
	// namespace:
	var o = this.jslgEngine = this.jslgEngine||{};
	o = (o.model = o.model||{});
	o = (o.network = o.network||{});

	/**
	 * <h4>オンライン実行クラス</h4>
	 * <p>
	 * 実行環境がオンラインの場合の振る舞いを制御する。
	 * <em>現在jQuery.Deferredに依存している</em>
	 * </p>
	 * @class
	 * @name ConnectorOnline
	 * @memberOf jslgEngine.model.network
	 * @constructor
	 */
	var ConnectorOnline = function(options) {
		this.initialize(options);
	};
	/**
	 *
	 */
	var p = ConnectorOnline.prototype;

	/**
	 * 初期化
	 *
	 * @name initialize
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.network.ConnectorOnline#
	 **/
	p.initialize = function(options) {
		var self = this;

		self.options = options||{};
		self._index = 0;

		if(options) {
			self.$df = options.unresolved ? $.Deferred() : $.Deferred().resolve();
			self._index = options.index !== null ? options.index : 0;
		} else {
			self.$df = $.Deferred().resolve();
		}
		
		self._ajax = new jslgEngine.model.network.Ajax();
	};

	/**
	 * jQuery.Deferred
	 *
	 * @name $df
	 * @property
	 * @type jQuery.Deferred
	 * @memberOf jslgEngine.model.network.ConnectorOnline#
	 **/
	p.$df = null;

	/**
	 * 非同期通信クラス
	 *
	 * @private
	 * @name _ajax
	 * @property
	 * @type jslgEngine.model.network.Ajax
	 * @memberOf jslgEngine.model.network.ConnectorOnline#
	 **/
	p._ajax = null;

	/**
	 * 保有メンバー
	 *
	 * @name options
	 * @property
	 * @type JSON
	 * @memberOf jslgEngine.model.network.ConnectorOnline#
	 **/
	p.options = null;
	
	/**
	 * 識別インデックス（テスト用なので特に必要ない）
	 *
	 * @private
	 * @name _index
	 * @property
	 * @type String
	 * @memberOf jslgEngine.model.command.CommandBlockIF#
	 **/
	p._index = null;

	/**
	 * インスタンスを取得する。
	 *
	 * @name getConnector
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.network.ConnectorOnline#
	 * @param {JSON} options
	 * @returns {jslgEngine.model.network.ConnectorOnline}
	 */
	p.getConnector = function(options) {
		return new jslgEngine.model.network.ConnectorOnline(options);
	};

	/**
	 * 非同期処理を連結する。
	 *
	 * @name pipe
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.network.ConnectorOnline#
	 * @param {Function} func 直列化するメソッド
	 * @returns {jslgEngine.model.network.ConnectorOnline} メソッドチェーンのための自身のオブジェクト
	 */
	p.pipe = function(func) {
		var self = this;

		var e = self.$df.pipe(function(options) {
			var data = self.options||{};
			data.unresolved = true;
			data.index = self._index + 1;
			
			var obj = new jslgEngine.model.network.ConnectorOnline(data);
			
			//第２引数に、引き継ぐ変数を渡す
			var access = func(obj, options);
			
			return obj.$df.promise();
		});

		self.$df = e;
		return this;
	};

	/**
	 * 処理を連結する。
	 *
	 * @name connects
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.network.ConnectorOnline#
	 * @param {Function} func 直列化するメソッド
	 * @returns {jslgEngine.model.network.ConnectorOnline} メソッドチェーンのための自身のオブジェクト
	 */
	p.connects = function(func) {
		var self = this;

		var e = self.$df.pipe(function(options) {
			var data = self.options||{};
			data.unresolved = true;
			data.index = self._index + 1;
			
			var obj = new jslgEngine.model.network.ConnectorOnline(data);
			
			obj.$df.resolve(options);
			
			//第２引数に、引き継ぐ変数を渡す
			var access = func(obj, options);

			return obj.$df.promise();
		});

		self.$df = e;
		return this;
		
		// return self.pipe(function(connector, result) {
			// connector.resolve(result);
			// func(connector, result);
		// });
	};

	/**
	 * 処理を連結する。
	 *
	 * @name loop
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.network.ConnectorOnline#
	 * @param {Function} func 直列化するメソッド
	 * @returns {jslgEngine.model.network.ConnectorOnline} メソッドチェーンのための自身のオブジェクト
	 */
	p.loop = function(data, inside_func, outside_func) {
		var self = this;
		var count = 0;
		var elements = [].concat(data.elements);
		var elementsLength = elements.length;
		var limit = data.limit == null ? 100 : data.limit;
		var results = [];

		while((elementsLength--) > 0 && (count++) < limit) {
			self.pipe(function(connector, result) {
				if(count > 0) {
					results.shift(result);
				}
				connector.resolve();
				inside_func(connector, elements.shift());
			});
		};
		if(count >= limit) {
			jslgEngine.log('connector loop limit was over');
		}
		var ret = self.pipe(function(connector, result) {
			results.push(result);
			connector.resolve();
			if(outside_func) {
				outside_func(connector, results);
			}
		});

		return ret;
	};

	/**
	 * 成功を通知する。
	 *
	 * @name resolve
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.network.ConnectorOnline#
	 * @param options
	 * @returns {jslgEngine.model.network.ConnectorOnline} メソッドチェーンのための自身のオブジェクト
	 */
	p.resolve = function(options) {
		//jslgEngine.log('resolved connector:'+this._index);
		this.$df.resolve(options);
		return this;
	};

	/**
	 * 失敗を通知する。
	 *
	 * @name reject
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.network.ConnectorOnline#
	 * @param options
	 * @returns {jslgEngine.model.network.ConnectorOnline} メソッドチェーンのための自身のオブジェクト
	 */
	p.reject = function(options) {
		this.$df.reject(options);
		return this;
	};

	/**
	 * 非同期通信をする。
	 *
	 * @name ajax
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.network.ConnectorOnline#
	 * @param options
	 * @returns {jslgEngine.model.network.ConnectorOnline} メソッドチェーンのための自身のオブジェクト
	 */
	p.ajax = function(options) {
		this._ajax.run(options);
	};

	/**
	 * プロパティを初期化する。
	 *
	 * @name clearProperty
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.network.ConnectorOnline#
	 * @param options
	 * @returns {jslgEngine.model.network.ConnectorOnline} メソッドチェーンのための自身のオブジェクト
	 */
	p.clearProperty = function() {
		var self = this;
		for(var key in self.options) {
			self.options[key] = null;
		}
	};

	/**
	 * プロパティを設定する。
	 *
	 * @name setProperty
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.network.ConnectorOnline#
	 * @param options
	 * @returns {jslgEngine.model.network.ConnectorOnline} メソッドチェーンのための自身のオブジェクト
	 */
	p.setProperty = function(key, value) {
		var self = this;
		self.options[key] = value;
	};

	/**
	 * プロパティを取得する。
	 *
	 * @name getProperty
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.network.ConnectorOnline#
	 * @param options
	 * @returns {jslgEngine.model.network.ConnectorOnline} メソッドチェーンのための自身のオブジェクト
	 */
	p.getProperty = function(key) {
		var self = this;
		return self.options[key];
	};

	o.ConnectorOnline = ConnectorOnline;
}());