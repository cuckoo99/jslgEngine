/*
 * @author cuckoo99
 */

(function() {
	// namespace:
	var o = this.jslgEngine = this.jslgEngine||{};
	o = (o.model = o.model||{});
	o = (o.action = o.action||{});

	/**
	 * <h4>コード処理・アニメーションクラス</h4>
	 * <p>
	 * 再生予定のアニメーションを追加する。<br />
	 * ・再生オブジェクトのキー<br />
	 * ・アニメーションのキー<br />
	 * </p>
	 * @class
	 * @name ActionAnime
	 * @memberOf jslgEngine.model.action
	 * @constructor
	 */
	var ActionAnime = jslgEngine.extend(
		jslgEngine.model.action.ActionBase,
		function(options) {
			this.initialize(options);
		}
	);
	/**
	 *
	 */
	var p = ActionAnime.prototype;

	/**
	 * クラス名
	 *
	 * @name className
	 * @property
	 * @type String
	 * @memberOf jslgEngine.model.action.ActionAnime#
	 **/
	p.className = 'ActionAnime';

	/**
	 * 実行
	 *
	 * @name run
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.action.ActionAnime#
	 * @param {JSON} options
	 * <ul>
	 * </ul>
	 **/
	p.run$ = function(connector, data, options) {
		var self = this;
		
		if(!self.isReadyToRun(connector, options)) return;
		
		connector.resolve();
		
		self._readAllElements(connector, data, options);
		connector.connects(function(connector_s, result_s) {
			var keyObj = result_s[0];
			var animationKey = result_s[1];
			
			if(keyObj === null || animationKey === null) {
				jslgEngine.log(self.className + ' has no enough parameters.');
				return;
			}
	
			self._wasDone = true;
			
			if(!data.isTest) {
				options.mainController.ticker.addAnimation({
					key : keyObj.getKeyData().getUniqueId(),
					animeKey : animationKey.value,
					stopAnimation : false
				}, options);
			}
		});
	};

	/**
	 * リストア
	 *
	 * @name restore
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.action.ActionAnime#
	 * @param {Object} options
	 * <ul>
	 * <li>{jslgEngine.controller.IconController} iconController</li>
	 * <li>{jslgEngine.controller.mainController} mainController</li>
	 * </ul>
	 */
	p.restore$ = function(connector, data, options) {
		var self = this;

		if(!self.isReadyToRestore(connector, options)) return;
		
		self._wasDone = false;
		
		connector.resolve();
	};


	o.ActionAnime = ActionAnime;
}());
