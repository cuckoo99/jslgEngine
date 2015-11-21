/*
 * @author cuckoo99
 */

(function() {
	// namespace:
	var o = this.jslgEngine = this.jslgEngine||{};
	o = (o.controller = o.controller||{});

	/**
	 * <h4>OBJFileController</h4>
	 * <p>
	 * This is file manager to handle obj file,<br />
     * has dependency on Three.js<br />
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
	 * Access key.
	 * 
	 * @name _key
	 * @property
	 * @type String
	 * @memberOf jslgEngine.controller.OBJFileController#
	 **/
	p._key = 'Model';

	/**
	 * Model loader.
	 *
	 * @name _loader
	 * @property
	 * @type Object
	 * @memberOf jslgEngine.controller.OBJFileController#
	 **/
	p._loader = null;

	/**
	 * Load obj file.
	 *
	 * @name load
	 * @method
	 * @function
	 * @memberOf jslgEngine.controller.OBJFileController#
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
	
	o.OBJFileController = OBJFileController;
}());
