/*
 * @author cuckoo99
 */

(function() {
	// namespace:
	var o = this.jslgEngine = this.jslgEngine||{};
	o = (o.controller = o.controller||{});

	/**
	 * <h4>音・管理クラス</h4>
	 * <p>
	 * 音関連のファイルを管理する。<br />
	 * </p>
	 * @class
	 * @name AudioFileController
	 * @memberOf jslgEngine.controller
	 * @constructor
	 */
	var AudioFileController = jslgEngine.extend(
		jslgEngine.controller.FileControllerBase,
		function(data) {
			this.initialize(data);
		}
	);
	
	/**
	 *
	 */
	var p = AudioFileController.prototype;

	/**
	 * 識別キー
	 * 
	 * @name _key
	 * @property
	 * @type String
	 * @memberOf jslgEngine.controller.AudioFileController#
	 **/
	p._key = 'Audio';

	/**
	 * 繰り返し再生情報
	 *
	 * @private
	 * @name _REPEAT_ATTRIBUTE
	 * @property
	 * @type String
	 * @memberOf jslgEngine.controller.AudioFileController#
	 **/
	p._REPEAT_ATTRIBUTE = 'repeat';

	/**
	 * 繰り返し再生情報無効値
	 *
	 * @private
	 * @name _REPEAT_ATTRIBUTE_NO_REPEAT
	 * @property
	 * @type String
	 * @memberOf jslgEngine.controller.AudioFileController#
	 **/
	p._REPEAT_ATTRIBUTE_NO_REPEAT = 'NO_REPEAT';

	/**
	 * 音をロードする
	 *
	 * @name load
	 * @method
	 * @function
	 * @memberOf jslgEngine.controller.AudioFileController#
	 * @param {jslgEngine.model.network.ConnectorBase} connector 直列化クラス
	 * @param {Object} data パラメータ
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
					
					var audio = new Audio("");
					audio.autoplay = false;
					audio.src = src;
					
					jslgEngine.log('loading.. : key,'+key+', source,'+src);
					audio.onloadeddata = function() {
						var loadedResult = audio;
						audio.setAttribute(self._REPEAT_ATTRIBUTE, false);
						//TODO: selfが循環参照？
						audio.addEventListener('ended', function() {
							if(	this.getAttribute(self._REPEAT_ATTRIBUTE) !==
								self._REPEAT_ATTRIBUTE_NO_REPEAT) {
									
								this.currentTime = 0;
							    this.play();
							}
						}, false);
						
						self._contents[key] = loadedResult;
						
						jslgEngine.log('loaded : key,'+key+', source,'+src);
						if(data.callback) {
							data.callback(loadedResult);
						}
						connector_s.resolve();
					};
				} else {
					connector_s.resolve();
				}
			});
		}
	};

	/**
	 * 音を再生する。
	 *
	 * @name play
	 * @method
	 * @function
	 * @memberOf jslgEngine.controller.AudioFileController#
	 * @param {jslgEngine.model.network.ConnectorBase} connector 直列化クラス
	 * @param {Object} data パラメータ
	 * @param {Object} options 
	 **/
	p.play = function(connector, data, options) {
		var self = this;
		
		if(self._contents[data.key]) {
			jslgEngine.log('play a sound:'+data.key);
			var content = self._contents[data.key];
			var repeats = data.loop === true ? data.loop : self._REPEAT_ATTRIBUTE_NO_REPEAT;
			content.setAttribute(self._REPEAT_ATTRIBUTE, repeats);
			content.play();
			//var v = document.getElementById("video");
			
		}
	};

	/**
	 * 音を停止する。
	 *
	 * @name stop
	 * @method
	 * @function
	 * @memberOf jslgEngine.controller.AudioFileController#
	 * @param {jslgEngine.model.network.ConnectorBase} connector 直列化クラス
	 * @param {Object} data パラメータ
	 * @param {Object} options 
	 **/
	p.stop = function(connector, data, options) {
	};
	
	o.AudioFileController = AudioFileController;
}());