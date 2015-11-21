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
	 * @name ActionJSlgTurn
	 * @memberOf jslgEngine.model.action
	 * @constructor
	 */
	var ActionJSlgTurn = jslgEngine.extend(
		jslgEngine.model.action.ActionBase,
		function(options) {
			this.initialize(options);
		}
	);
	/**
	 *
	 */
	var p = ActionJSlgTurn.prototype;
	
	/**
	 * クラス名
	 *
	 * @name className
	 * @property
	 * @type String
	 * @memberOf jslgEngine.model.action.ActionJSlgTurn#
	 **/
	p.className = 'ActionJSlgTurn';

	/**
	 * 実行
	 *
	 * @name run
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.action.ActionJSlgTurn#
	 * @param {Object} options
	 */
	p.run$ = function(connector, data, options) {
		var self = this;

		if(!self.isReadyToRun(connector, options)) return;
		
		if(data.isTest) {
			connector.resolve();
			return;
		}
		
		//ユーザー名
		var target = self._getElement(connector, 0, data, options);
		
		self._wasDone = true;
		
		connector.resolve();
		
		//アイテムの仕様状態を変更
		options.mainController.findElements(connector, {
			className : 'Cast'
		});
		connector.connects(function(connector_s, result_s) {
			var casts = result_s[0];
			
			for(var i = 0; i < casts.length; i++) {
				var cast = casts[i];
				
				var belongs = cast.getStatus();
				
				if(!belongs) continue;
				
				var enableValue = (belongs.value === target);
				
				var commands = cast.findElements(connector, {
					className : 'Command'
				});
				for(var j = 0; j < commands.length; j++) {
					var command = commands[j];
					
					//有効状態を変更
					command.setStatus(jslgEngine.model.command.keys.IS_AVAILABLE, enableValue);
				}
			}
			
			//ユーザを切り替える
			options.mainController.activateUser(connector, target, options);
		});
	};

	/**
	 * リストア
	 *
	 * @name restore
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.action.ActionJSlgTurn#
	 * @param {Object} options
	 * <ul>
	 * <li>{jslgEngine.controller.IconController} iconController</li>
	 * <li>{jslgEngine.controller.mainController} mainController</li>
	 * </ul>
	 */
	p.restore = function(connector, data, options) {
		var self = this;

		if(!self.isReadyToRestore(connector, options)) return;
		
		//今のところ、元に戻す事は考慮しない。
	};


	/**
	 * 展開する
	 *
	 * @name expand
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.action.ActionJSlgTurn#
	 * @param {Object} options
	 * <ul>
	 * <li>{jslgEngine.controller.IconController} iconController</li>
	 * <li>{jslgEngine.controller.mainController} mainController</li>
	 * </ul>
	 */
	p.expand = function(options) {};

	o.ActionJSlgTurn = ActionJSlgTurn;
}());
