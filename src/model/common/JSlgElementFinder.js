/*
 * @author cuckoo99
 */

(function() {
	// namespace:
	var o = this.jslgEngine = this.jslgEngine||{};
	o = (o.model = o.model||{});
	o = (o.common = o.common||{});

	/**
	 * <h4>SLG要素探査クラス</h4>
	 * <p>
	 * サーバに対し、文字列キーを送信し
	 * SLG要素を取得する。
	 * </p>
	 * @class
	 * @name JSlgElementFinder
	 * @memberOf jslgEngine.model.common
	 * @constructor
	 */
	var JSlgElementFinder = function() {
		this.initialize();
	};
	/**
	 *
	 */
	var p = JSlgElementFinder.prototype;

	/**
	 * 初期化
	 *
	 * @name initialize
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.common.JSlgElementFinder#
	 **/
	p.initialize = function() {
		var self = this;
		self._settingElements = [];
		self._gettingElements = [];
	};

	/**
	 * 設定用の要素
	 *
	 * @private
	 * @name _settingElements
	 * @property
	 * @type JSON
	 * @memberOf jslgEngine.model.common.JSlgElementFinder#
	 **/
	p._settingElements = null;

	/**
	 * 取得用の要素
	 *
	 * @private
	 * @name _gettingElements
	 * @property
	 * @type String[]
	 * @memberOf jslgEngine.model.common.JSlgElementFinder#
	 **/
	p._gettingElements = null;

	/**
	 * SLGオブジェクトをサーバーから見つけ出す。
	 *
	 * @name addElementGetting
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.common.JSlgElementFinder#
	 * @param {JSON} options
	 * <ul>
	 * <li>{String} keys 探し出すオブジェクト</li>
	 * </ul>
	 */
	p.addElementGetting = function(options) {
		var self = this;

		self._gettingElements.push(options);
	};

	/**
	 * SLGオブジェクトをサーバーから見つけ出す。
	 *
	 * @name addElementSetting
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.common.JSlgElementFinder#
	 * @param {JSON} options
	 * <ul>
	 * <li>{String} keys 探し出すオブジェクト</li>
	 * </ul>
	 */
	p.addElementSetting = function(options) {
		var self = this;

		self._settingElements.push(options);
	};

	/**
	 * SLGオブジェクトをサーバーから見つけ出す。
	 *
	 * @name readElements
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.common.JSlgElementFinder#
	 * @param {JSON} options
	 * <ul>
	 * <li>{String} keys 探し出すオブジェクト（<em>設定がない場合、全てを検索する</em>）</li>
	 * </ul>
	 */
	p.readElements = function(options) {
		var connector = options.connector;
		
		return connector.pipe(function(connector_s) {
			//setTimeout(function() {
			connector_s.ajax({
				data : options.elements,
				connector : connector_s,
				callback : function() {
					jslgEngine.log('Ajax Called Resolved');
					connector_s.resolve();
				}
			});
			//},500);
			return connector_s;
		});
	};

	/**
	 * SLGオブジェクトをサーバーから見つけ出す。
	 *
	 * @name writeElements
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.common.JSlgElementFinder#
	 * @param {JSON} options
	 * <ul>
	 * <li>{String} keys 探し出すオブジェクト（<em>設定がない場合、全てを検索する</em>）</li>
	 * </ul>
	 */
	p.writeElements = function(options) {};

	o.JSlgElementFinder = JSlgElementFinder;
}());
