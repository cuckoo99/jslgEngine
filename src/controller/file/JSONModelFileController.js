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

	o.JSONModelFileController = JSONModelFileController;
}());