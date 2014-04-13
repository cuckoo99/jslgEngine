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
	 * @name BackGroundWorker
	 * @memberOf jslgEngine.controller
	 * @constructor
	 */
	var BackGroundWorker = function(data) {
		this.initialize(data);
	};
	/**
	 *
	 */
	var p = BackGroundWorker.prototype;

	/**
	 * マッピングされた情報<br />
	 * <br />
	 * @name _worker
	 * @property
	 * @type String[]
	 * @memberOf jslgEngine.controller.BackGroundWorker#
	 **/
	p._worker = null;

	/**
	 * 絶対パス<br />
	 * <br />
	 * @name _absolutePath
	 * @property
	 * @type String[]
	 * @memberOf jslgEngine.controller.BackGroundWorker#
	 **/
	p._absolutePath = null;

	/**
	 * マッピングされた情報<br />
	 * <br />
	 * @name _contents
	 * @property
	 * @type String[]
	 * @memberOf jslgEngine.controller.BackGroundWorker#
	 **/
	p._contents = null;

	/**
	 * 初期化
	 *
	 * @name initialize
	 * @method
	 * @function
	 * @memberOf jslgEngine.controller.BackGroundWorker#
	 **/
	p.initialize = function(data) {
		var self = this;
		var absolutePath = data.absolutePath||'';
		absolutePath = [absolutePath,data.url].join('');
		self._absolutePath = absolutePath;
		self._worker = new Worker(absolutePath);
	};

	/**
	 * ロードする画像の追加
	 *
	 * @name add
	 * @method
	 * @function
	 * @memberOf jslgEngine.controller.BackGroundWorker#
	 **/
	p.add = function(data, callback) {
		var self = this;
		var property = data.property||[];
		
		self._worker.onmessage = function(e) {
			var data = e.data;
			
			callback(data);
		};
		self._worker.postMessage(data);
	};

	o.BackGroundWorker = BackGroundWorker;
}());