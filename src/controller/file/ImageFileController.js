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
	 * @name ImageFileController
	 * @memberOf jslgEngine.controller
	 * @constructor
	 */
	var ImageFileController = jslgEngine.extend(
		jslgEngine.controller.FileControllerBase,
		function(options) {
			this.initialize(options);
		}
	);
	
	/**
	 *
	 */
	var p = ImageFileController.prototype;

	/**
	 * 識別キー
	 * 
	 * @name _key
	 * @property
	 * @type String
	 * @memberOf jslgEngine.controller.ImageFileController#
	 **/
	p._key = 'Image';

	/**
	 * 画像をロードする
	 *
	 * @name load
	 * @method
	 * @function
	 * @memberOf jslgEngine.controller.ImageFileController#
	 * @param {JSON} options
	 * <ul>
	 * <li>{jslgEngine.connector.SynchronizeBase} connector 直列処理クラス</li>
	 * <li>{String[]} loadImages 読み込む画像</li>
	 * </ul>
	 * @param {Function} callback 読み込み後実行されるコールバック関数
	 **/
	p.load = function(connector, data, options) {
		var self = this;

		var contentKeys = data.contentKeys||[];
		var loadImages = [];
		
		for(var i = 0; i < contentKeys.length; i++) {
			var key = contentKeys[i];
			for(var j = 0; j < self._stock.length; j++) {
				if(self._stock[j].key == key) {
					//読み込み待機中の画像リストと一致するなら追加する。
					loadImages.push({
						key : key,
						url : self._stock[j].url
					});
				}
			}
		}
		//もしも、読み込むキーが未指定なら、待機している画像を全て読み込み
		loadImages = (contentKeys.length === 0 ? self._stock : loadImages);
		
		//処理後実行されるメソッド、画像の読み込みが完了する度に呼ぶ。
		var callback = data.callback ? data.callback : function(){};

		var images = [];
		for (var i = 0; i < loadImages.length; i++) {
			var loadImage = loadImages[i];
			
			//読み込みは非同期で行われるが、画像の枚数だけ処理する。
			images.push({
				key : loadImage.key,
				src : loadImage.url,
				callback : callback
			});
			
			var image = self._contents[key];

			//既に読み込みが完了しているか確認
			if (image != null) {
				images.pop();
				callback(image);
			} else {
				connector.pipe(function(connector_s) {
					var options_s = connector_s.options;
					var data = images.pop();
					
					var key = data.key;
					var src = data.src;
					var callback = data.callback;
	
						jslgEngine.log('load:' + src);
						var img = new Image();
	
						var loaded = function() {
							jslgEngine.log('loaded:' + src);
							self._contents[key] = img;
							callback(img);
							connector_s.resolve();
						};
						img.onload = loaded;
						img.src = src;
						if (img.complete) {
							jslgEngine.log('loaded　complete:' + src);
							self._contents[key] = img;
							//connector_s.resolve();
						}
				});
			}
		}
	};

	o.ImageFileController = ImageFileController;
}());