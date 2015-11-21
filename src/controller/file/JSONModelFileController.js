/*
 * @author cuckoo99
 */

(function() {
	// namespace:
	var o = this.jslgEngine = this.jslgEngine||{};
	o = (o.controller = o.controller||{});

	/**
	 * <h4>JSONModelFileController</h4>
	 * <p>
	 * This is file manager to handle Three.js JSON data of 3D model,<br />
     * has dependency on Three.js<br />
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
	 * Access key.
	 * 
	 * @name _key
	 * @property
	 * @type String
	 * @memberOf jslgEngine.controller.JSONModelFileController#
	 **/
	p._key = 'Model';

	/**
	 * Model loader.
	 *
	 * @name _loader
	 * @property
	 * @type Object
	 * @memberOf jslgEngine.controller.JSONModelFileController#
	 **/
	p._loader = null;

	/**
	 * Load 3D model data.
	 *
	 * @name load
	 * @method
	 * @function
	 * @memberOf jslgEngine.controller.JSONModelFileController#
	 * @param {jslgEngine.model.network.ConnectorBase} connector
	 * @param {Object} data
	 * @param {Object} options
	 **/
	p.load = function(connector, data, options) {
		var self = this;
		var stock = self._stock;
		var loader = self._loader;
		var one;
		
		var contentKeys = data.contentKeys||[];
		var loadModels = [];
		
		for(var i = 0; i < contentKeys.length; i++) {
			var key = contentKeys[i];
			var wasGot = false;
			for(var j = 0; j < self._stock.length; j++) {
				if(self._stock[j].key == key) {
					//読み込み待機中の画像リストと一致するなら追加する。
					loadModels.push({
						key : key,
						url : self._stock[j].url
					});
					wasGot = true;
				}
			}
			if(!wasGot) jslgEngine.log(key+' image key was not found.');
		}
		//もしも、読み込むキーが未指定なら、待機している画像を全て読み込み
		loadModels = (contentKeys.length === 0 ? self._stock : loadModels);
		
		//処理後実行されるメソッド、画像の読み込みが完了する度に呼ぶ。
		var callback = data.callback ? data.callback : function(){};
	
		var models = [];
		var length = loadModels.length;
		while(length--) {
			var model = loadModels[length];
			var key = model.key;

			models.push({
				key : model.key,
				src : model.url,
				callback : callback
			});

			if(self._contents[key] != null) {
				var one = models.pop();
				callback(self._contents[key]);
			} else {
				connector.pipe(function(connector_s) {
					var one = models.pop();

					if(!self._contents[one.key]) {
						jslgEngine.log('load : key,'+one.key+', source,'+one.url);
							var key = one.key;
							var src = one.src;
							
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
		}
	};

	o.JSONModelFileController = JSONModelFileController;
}());
