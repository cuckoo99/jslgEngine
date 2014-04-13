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
	 * @name JSONModelFileController
	 * @memberOf jslgEngine.controller
	 * @constructor
	 */
	var JSONModelFileController = jslgEngine.extend(
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
	var p = JSONModelFileController.prototype;

	/**
	 * 識別キー
	 * 
	 * @name _key
	 * @property
	 * @type String
	 * @memberOf jslgEngine.controller.JSONModelFileController#
	 **/
	p._key = 'Model';

	/**
	 * ローダ
	 *
	 * @name _loader
	 * @property
	 * @type Image[]
	 * @memberOf jslgEngine.controller.JSONModelFileController#
	 **/
	p._loader = null;

	/**
	 * 画像をロードする
	 *
	 * @name load
	 * @method
	 * @function
	 * @memberOf jslgEngine.controller.JSONModelFileController#
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
		var length = stock.length;
		while(length--) {
			connector.pipe(function(connector_s) {
				var one = stock.pop();
				
				if(!self._contents[one.key]) {
					jslgEngine.log('load : key,'+one.key+', source,'+one.url);
					var key = one.key;
					var src = one.url;
					
					jslgEngine.log('loading.. : key,'+key+', source,'+src);
					loader.load( src, function ( geometry, materials ) {
						// 初期設定
						geometry.computeBoundingBox();
						
						var loadedResult = {
							geometry : geometry,
							materials : materials
						};
						
						self._contents[key] = loadedResult;
						
						jslgEngine.log('loaded : key,'+key+', source,'+src);
						if(data.callback) {
							data.callback(loadedResult);
						}
						connector_s.resolve();
					} );
				} else {
					connector_s.resolve();
				}
			});
		}
	};

	/**
	 * 画像をロードする
	 *
	 * @name loaded
	 * @method
	 * @function
	 * @memberOf jslgEngine.controller.JSONModelFileController#
	 * @param {JSON} options
	 * <ul>
	 * <li>{jslgEngine.connector.SynchronizeBase} connector 直列処理クラス</li>
	 * <li>{String[]} loadImages 読み込む画像</li>
	 * </ul>
	 * @param {Function} callback 読み込み後実行されるコールバック関数
	 **/
	p.loaded = function(command) {
		
	};
	
	o.JSONModelFileController = JSONModelFileController;
}());