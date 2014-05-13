/*
 * @author cuckoo99
 */

(function() {
	// namespace:
	var o = this.jslgEngine = this.jslgEngine||{};
	o = (o.model = o.model||{});
	o = (o.action = o.action||{});

	/**
	 * <h4>コード処理・ターン切り替えクラス（SLG固有要素）</h4>
	 * <p>
	 * ターンを切り替える。<br />
	 * </p>
	 * @class
	 * @name ActionJSlgText
	 * @memberOf jslgEngine.model.action
	 * @constructor
	 */
	var ActionJSlgText = jslgEngine.extend(
		jslgEngine.model.action.ActionBase,
		function(options) {
			this.initialize(options);
		}
	);
	/**
	 *
	 */
	var p = ActionJSlgText.prototype;
	
	/**
	 * クラス名
	 *
	 * @name className
	 * @property
	 * @type String
	 * @memberOf jslgEngine.model.action.ActionJSlgText#
	 **/
	p.className = 'ActionJSlgText';

	/**
	 * 実行
	 *
	 * @name run
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.action.ActionJSlgText#
	 * @param {Object} options
	 */
	p.run$ = function(connector, data, options) {
		var self = this;

		if(!self.isReadyToRun(connector, options)) return;
		
		connector.resolve();
		
		self._readAllElements(connector, data, options);
		connector.connects(function(connector_s, result_s) {
			var element = result_s[0];
			var text = result_s[1];
		
			self._wasDone = true;
			
			if(!data.isTest
				&& jslgEngine.checkSameElement(element, jslgEngine.model.common.JSlgElementBase)
				//&& element.hasLocation
				) {
				var slgIconFactory = options.iconController.iconFactory;
				
				var key = ['text',options.mainController.getUniqueId()].join('');
				var position = element.getPosition({
					stageViewOffset : options.iconController.stageViewOffset
				}, options);
				
				slgIconFactory.makeText(connector_s.resolve(), {
					key : key,
					text : text.value,
					position : position,
				}, options);
				
				options.mainController.ticker.addAnimation({
					key : key,
					fadeType : jslgEngine.model.animation.keys.fadeType.FADE_IN_AND_OUT,
				}, options);
				return;
			}
		});
	};

	/**
	 * リストア
	 *
	 * @name restore
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.action.ActionJSlgText#
	 * @param {Object} options
	 */
	p.restore$ = function(connector, data, options) {
		var self = this;

		if(!self.isReadyToRestore(connector, options)) return;
		
		self._wasDone = false;
		
		connector.resolve();
	};

	o.ActionJSlgText = ActionJSlgText;
}());
