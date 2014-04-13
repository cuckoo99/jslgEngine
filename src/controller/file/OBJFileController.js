/*
 * @author cuckoo99
 */

(function() {
	// namespace:
	var o = this.jslgEngine = this.jslgEngine||{};
	o = (o.controller = o.controller||{});

	/**
	 * <h4>画像・管理クラス</h4>
	 * <p>
	 * 描画画像を管理する。<br />
	 * </p>
	 * @class
	 * @name OBJFileController
	 * @memberOf jslgEngine.controller
	 * @constructor
	 */
	var OBJFileController = jslgEngine.extend(
		jslgEngine.controller.FileControllerBase,
		function(data) {
			//Threeに依存
			this._loader = data.loader;
			this.initialize(data);
		}
	);
	
	/**
	 *
	 */
	var p = OBJFileController.prototype;

	/**
	 * 識別キー
	 * 
	 * @name _key
	 * @property
	 * @type String
	 * @memberOf jslgEngine.controller.OBJFileController#
	 **/
	p._key = 'Model';

	/**
	 * ローダ
	 *
	 * @name _loader
	 * @property
	 * @type Image[]
	 * @memberOf jslgEngine.controller.OBJFileController#
	 **/
	p._loader = null;

	/**
	 * 画像をロードする
	 *
	 * @name load
	 * @method
	 * @function
	 * @memberOf jslgEngine.controller.OBJFileController#
	 * @param {JSON} options
	 * <ul>
	 * <li>{jslgEngine.connector.SynchronizeBase} connector 直列処理クラス</li>
	 * <li>{String[]} loadImages 読み込む画像</li>
	 * </ul>
	 * @param {Function} callback 読み込み後実行されるコールバック関数
	 **/
	p.load = function(connector, data, options) {
		var self = this;
		var stock = self._stock;
		var loader = self._loader;
		var one;

		while((one = stock.pop())) {
			if(self._contents[one.key]) {
				//後始末が必要？
				//delete self._models[one.key];
			} else {
				jslgEngine.log('load : key,'+one.key+', source,'+one.url);
				connector.pipe(function(connector_s) {
					var key = one.key;
					var src = one.url;
					
					jslgEngine.log('loading.. : key,'+key+', source,'+src);
					loader.load( src, function ( obj ) {
						self._contents[key] = obj;
						
						jslgEngine.log('loaded : key,'+key+', source,'+src);
						data.callback(obj);
						connector_s.resolve();
					} );
				});
			}
		}
	};

	/**
	 * 画像をロードする
	 *
	 * @name loaded
	 * @method
	 * @function
	 * @memberOf jslgEngine.controller.OBJFileController#
	 * @param {JSON} options
	 * <ul>
	 * <li>{jslgEngine.connector.SynchronizeBase} connector 直列処理クラス</li>
	 * <li>{String[]} loadImages 読み込む画像</li>
	 * </ul>
	 * @param {Function} callback 読み込み後実行されるコールバック関数
	 **/
	p.loaded = function(command) {
		
	};
	
	o.OBJFileController = OBJFileController;
}());