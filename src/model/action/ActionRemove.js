/*
 * @author cuckoo99
 */

(function() {
	// namespace:
	var o = this.jslgEngine = this.jslgEngine||{};
	o = (o.model = o.model||{});
	o = (o.action = o.action||{});

	/**
	 * <h4>コード処理・削除クラス</h4>
	 * <p>
	 * SLG要素の子要素を削除する。
	 * </p>
	 * @class
	 * @name ActionRemove
	 * @memberOf jslgEngine.model.action
	 * @constructor
	 */
	var ActionRemove = jslgEngine.extend(
		jslgEngine.model.action.ActionBase,
		function(options) {
			this.initialize(options);
		}
	);
	/**
	 *
	 */
	var p = ActionRemove.prototype;
	
	/**
	 * クラス名
	 *
	 * @name className
	 * @property
	 * @type String
	 * @memberOf jslgEngine.model.action.ActionRemove#
	 **/
	p.className = 'ActionRemove';

	/**
	 * 実行
	 *
	 * @name run
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.action.ActionRemove#
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
		
		//TODO: 副イベントでPendingが発生すると受け取れないので、restoreDataで保持
		self._readAllElements(connector, data, options);
		connector.connects(function(connector_s, result_s) {
			var target = result_s[0];
			
			if(target === null) {
				jslgEngine.log(self.className + ' has no enough parameters.');
				return;
			}
			
			var parent = target.getParent(options);
			self._restoreData = {};
			self._restoreData.parent = parent;
			self._restoreData.target = target;
			parent.removeChild({
				obj : target
			}, options);
			
			self._wasDone = true;
			
			self.checkPending(connector, {
				place : parent,
				key : key,
				target : target
			}, data, options);
			
			if(!data.isTest) {
				//TODO:アニメーションを加えるかどうかは暫定
				options.mainController.ticker.addAnimation({
					key : target.getKeyData().getUniqueId(),
					fadeType : jslgEngine.model.animation.keys.fadeType.FADE_OUT,
				}, options);
			}
			
			if(!self.runSubCommand(connector, 'onRemove', target, data, options)) {
			}
		});
	};

	/**
	 * リストア
	 *
	 * @name restore
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.action.ActionRemove#
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
		
		if(!self.restoreSubCommand(connector, data, options)) {
			connector.resolve();
		}
		
		connector.pipe(function(connector_s) {
			var parent = self._restoreData.parent;
			var target = self._restoreData.target;
			
			parent.addChild({
				obj : target
			}, options);
			connector_s.resolve();
		});
	};


	/**
	 * 展開する
	 *
	 * @name expand
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.action.ActionRemove#
	 * @param {Object} options
	 * <ul>
	 * <li>{jslgEngine.controller.IconController} iconController</li>
	 * <li>{jslgEngine.controller.mainController} mainController</li>
	 * </ul>
	 */
	p.expand = function(options) {};

	/**
	 * Pendingに対して参照があれば評価を行う
	 *
	 * @name review
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.action.ActionRemove#
	 * @param {Object} options
	 */
	p.review = function(result, data, options) {
		//Mindから得た情報を元に評価を行う
		var reputation = 0;
		
		reputation = result.enemy.length - result.family.length;
		return  {
			point : reputation
		};
	};
	
	o.ActionRemove = ActionRemove;
}());
