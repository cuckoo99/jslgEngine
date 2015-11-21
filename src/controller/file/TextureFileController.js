/*
 * @author cuckoo99
 */

(function() {
	// namespace:
	var o = this.jslgEngine = this.jslgEngine||{};
	o = (o.controller = o.controller||{});

	/**
	 * <h4>TextureFileController</h4>
	 * <p>
	 * This is file manager to handle Texture file.<br />
     * has dependency on Three.js<br />
	 * </p>
	 * @class
	 * @name TextureFileController
	 * @memberOf jslgEngine.controller
	 * @constructor
	 */
	var TextureFileController = jslgEngine.extend(
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
	var p = TextureFileController.prototype;

	/**
	 * Access key.
	 * 
	 * @name _key
	 * @property
	 * @type String
	 * @memberOf jslgEngine.controller.TextureFileController#
	 **/
	p._key = 'Texture';

	/**
	 * Texture loader
	 *
	 * @name _loader
	 * @property
	 * @type Image[]
	 * @memberOf jslgEngine.controller.TextureFileController#
	 **/
	p._loader = null;

	/**
	 * Load texture
	 *
	 * @name load
	 * @method
	 * @function
	 * @memberOf jslgEngine.controller.TextureFileController#
	 * @param {jslgEngine.model.network.ConnectorBase} connector
	 * @param {Object} data
	 * @param {Object} options
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
	
	o.TextureFileController = TextureFileController;
}());
