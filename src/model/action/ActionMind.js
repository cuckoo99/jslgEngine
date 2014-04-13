/*
 *
 */

(function() {
	// namespace:
	var o = this.jslgEngine = this.jslgEngine||{};
	o = (o.model = o.model||{});
	o = (o.action = o.action||{});

	/**
	 * <h4>コード処理・基本クラス</h4>
	 * <p>
	 * ステージを操作する命令を実行するクラス。
	 * </p>
	 * @class
	 * @name ActionMind
	 * @memberOf jslgEngine.model.action
	 * @constructor
	 */
	var ActionMind = jslgEngine.extend(
		jslgEngine.model.action.ActionBase,
		function(options) {
			this.initialize(options);
		}
	);
	/**
	 *
	 */
	var p = ActionMind.prototype;

	/**
	 * クラス名
	 *
	 * @name className
	 * @property
	 * @type String
	 * @memberOf jslgEngine.model.action.ActionMind#
	 **/
	p.className = 'ActionMind';

	/**
	 * 実行
	 *
	 * @name run
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.action.ActionMind#
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
		
		var membersValue, usingCount;
		var driversList = [];
		//var casts = [];
		var targets = [];
		
		self._readAllElements(connector, data, options);
		connector.pipe(function(connector_s, result_s) {
			membersValue = result_s[0].value;
			usingCount = result_s[1].value;
			connector_s.resolve();
		});
		connector.pipe(function(connector_s, result_s) {
			connector_s.resolve();
			jslgEngine.log('hoge');
			options.mainController.findElements(connector_s, {
				className : 'Cast'
			}, options);
			connector_s.pipe(function(connector_ss,result_ss) {
				var casts = result_ss;
				
			jslgEngine.log('hhoge');
				//全ての所属キャストを実行するか
				//単体のキャストを実行する
				for(var i = 0; i < casts.length; i++) {
					var cast = casts[i];
					
					var belongs = cast.getStatus('belongs');
					if(belongs && belongs.value === membersValue) {
						targets.push(cast);
					}
				}
				connector_ss.resolve();
			});
		});
		//TODO: connectsにすると動かない（非同期が重複解決する）
		connector.pipe(function(connector_s, result_s) {
				jslgEngine.log('hhghoge');
			connector_s.resolve();
			connector_s.loop({
				elements : targets
			}, function(connector_ss, result_ss) {
				var target = result_ss;
				
				jslgEngine.log('hhhoge');
				target.findElements(connector_ss, {
					className : 'Mind'
				}, options);
				connector_ss.connects(function(connector_sss, result_sss) {
					var mind = result_sss[0];
					
					if(!mind) {
						jslgEngine.log('has no Mind');
						return;
					}
					//Mindを起動し、テストを行う。
					mind.chooseCommandDrivers(connector_sss, {
						callback : function(result_ssss) {
							if(result_ssss) {
								var bestCommandDrivers = result_ssss[0];
								driversList.push(bestCommandDrivers);
							}
						}
					}, options);
				});
			}, function(connector_ss, result_ss) {});
		});
		connector.connects(function(connector_s) {
			var commandDriversList = driversList;

			//評価値の最も多い順にソートし、指定された回数だけ処理する。
			commandDriversList.sort(function(a, b) {
				//影響度の大きいイベント順にソート
				return a[0].getReview() - b[0].getReview();
			});

			for(var i = 0; i < usingCount; i++) {
				var commandDrivers = commandDriversList.pop();
				
				if(commandDrivers) {
					var commandDriversLength = commandDrivers.length;
					for(var j = 0; j < commandDriversLength; j++) {
						connector_s.pipe(function(connector_ss) {
							var driver = commandDrivers.pop();
							
							driver.run(connector_ss.resolve(), data, options);
						});
					}
				}
			}
			connector_s.pipe(function(connector_ss) {
				jslgEngine.log('ActionMind Finished');
				
				
				self._wasDone = true;
				
				connector_ss.resolve();
			});
		});	
	};

	/**
	 * リストア
	 *
	 * @name restore
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.action.ActionMind#
	 * @param {Object} options
	 * <ul>
	 * <li>{jslgEngine.controller.IconController} iconController</li>
	 * <li>{jslgEngine.controller.mainController} mainController</li>
	 * </ul>
	 */
	p.restore$ = function(connector, data, options) {
		var self = this;
		
		if(!self.isReadyToRestore(connector, options)) return;
		
		
	};


	/**
	 * 展開する
	 *
	 * @name expand
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.action.ActionMind#
	 * @param {Object} options
	 * <ul>
	 * <li>{jslgEngine.controller.IconController} iconController</li>
	 * <li>{jslgEngine.controller.mainController} mainController</li>
	 * </ul>
	 */
	p.expand = function(options) {};

	o.ActionMind = ActionMind;
}());
