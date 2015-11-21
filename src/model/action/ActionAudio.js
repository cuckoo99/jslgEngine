/*
 * @author cuckoo99
 */

(function() {
	// namespace:
	var o = this.jslgEngine = this.jslgEngine||{};
	o = (o.model = o.model||{});
	o = (o.action = o.action||{});

	/**
	 * <h4>コード処理・関数実行クラス</h4>
	 * <p>
	 * SLG要素の関数を実行する。
	 * </p>
	 * @class
	 * @name ActionAudio
	 * @memberOf jslgEngine.model.action
	 * @constructor
	 */
	var ActionAudio = jslgEngine.extend(
		jslgEngine.model.action.ActionBase,
		function(options) {
			this.initialize(options);
		}
	);
	/**
	 *
	 */
	var p = ActionAudio.prototype;
	
	/**
	 * クラス名
	 *
	 * @name className
	 * @property
	 * @type String
	 * @memberOf jslgEngine.model.action.ActionAudio#
	 **/
	p.className = 'ActionAudio';

	/**
	 * 実行
	 *
	 * @name run$
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.action.ActionAudio#
	 * @param {Object} options
	 * <ul>
	 * <li>{jslgEngine.controller.IconController} iconController</li>
	 * <li>{jslgEngine.controller.mainController} mainController</li>
	 * </ul>
	 */
	p.run$ = function(connector, data, options) {
		var self = this;
		
		if(!self.isReadyToRun(connector, options)) return;
		
		connector.resolve();
		
		if(data.isTest) {
			return;	
		}
		
		self._readAllElements(connector, data, options);
		connector.connects(function(connector_s, result_s) {
			var audioKey = result_s[0];
			var loop = result_s[1]||{};
			var wait = result_s[2]||{};
			
			if(audioKey === null) {
				jslgEngine.log(self.className + ' has no enough parameters.');
				return;
			}
	
			self._wasDone = true;
			
			options.mainController.getController('Audio').play(connector, {
				key : audioKey.value,
				loop : loop.value,
				wait : wait.value
			}, options);
		});
		
	};

	/**
	 * リストア
	 *
	 * @name restore$
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.action.ActionAudio#
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

	o.ActionAudio = ActionAudio;
}());
