/*
 * @author cuckoo99
 */

(function() {
	// namespace:
	var o = this.jslgEngine = this.jslgEngine||{};
	o = (o.model = o.model||{});
	o = (o.command = o.command||{});

	/**
	 * <h4>イベントブロック・IFクラス</h4>
	 * <p>
	 * 条件により分岐が発生する。
	 * </p>
	 * @class
	 * @name CommandBlockIF
	 * @memberOf jslgEngine.model.command
	 * @constructor
	 */
	var CommandBlockIF = jslgEngine.extend(
		jslgEngine.model.command.CommandBlockBase,
		function(options) {
			this.initialize(options);
		}
	);
	/**
	 *
	 */
	var p = CommandBlockIF.prototype;

	/**
	 * クラス名
	 *
	 * @name className
	 * @property
	 * @type String
	 * @memberOf jslgEngine.model.command.CommandBlockIF#
	 **/
	p.className = 'CommandBlockIF';

	/**
	 * 条件が通ったかどうかの情報を格納する。
	 *
	 * @private
	 * @name _passingResult
	 * @property
	 * @type Object
	 * @memberOf jslgEngine.model.command.CommandBlockIF#
	 **/
	p._passingResult = null;

	/**
	 * この場所で、条件一致が発生したかどうか。
	 *
	 * @private
	 * @name _passedHere
	 * @property
	 * @type Object
	 * @memberOf jslgEngine.model.command.CommandBlockIF#
	 **/
	p._passedHere = false;

	/**
	 * 要素
	 *
	 * @private
	 * @name _arguments
	 * @property
	 * @type String
	 * @memberOf jslgEngine.model.command.CommandBlockIF#
	 **/
	p._arguments = null;

	/**
	 * 初期化
	 *
	 * @name initialize
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.command.CommandBlockIF#
	 **/
	p.initialize = function(options) {
		var self = this;
		self._children = [];
		
		self._arguments = options.arguments;
		self._passingResult = options.passingResult||{ result : false, info : 'No Reference' };
		if(!options.passingResult) {
			jslgEngine.log('No given PassingResult for IF');
		}
	};
	
	/**
	 * 結果オブジェクトの設定
	 *
	 * @name setPassingResult
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.command.CommandBlockIF#
	 **/
	p.setPassingResult = function(obj) {
		var self = this;
		self._passingResult = obj;
	};
	
	/**
	 * 実行
	 *
	 * @name run$
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.command.CommandBlockIF#
	 * @param {Object} options
	 * <ul>
	 * <li>{jslgEngine.controller.IconController} iconController</li>
	 * <li>{jslgEngine.controller.mainController} mainController</li>
	 * </ul>
	 */
	p.run$ = function(connector, data, options) {
		var self = this;
		connector.resolve();
		self.check(connector, data, options);
		connector.connects(function(connector_s, result_s) {
			if(result_s) {
				var length = self._children.length;
				for(var i = 0; i < length; i++) {
					var child = self._children[i];
	
					child.run(connector_s, data, options);
				}
				self.setPassingInfo(true);
				self._passedHere = true;
			}
		});
	};

	/**
	 * リストア
	 *
	 * @name restore$
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.command.CommandBlockIF#
	 * @param {Object} options
	 * <ul>
	 * <li>{jslgEngine.controller.IconController} iconController</li>
	 * <li>{jslgEngine.controller.mainController} mainController</li>
	 * </ul>
	 */
	p.restore$ = function(connector, data, options) {
		var self = this;
		connector.resolve();
		if(self._passedHere) {
			var length = self._children.length;
			for(var i = length - 1; i >= 0; i--) {
				var child = self._children[i];
	
				child.restore(connector, data, options);
			}
			self.setPassingInfo(false);
			self._passedHere = false;
		}
	};


	/**
	 * リストア
	 *
	 * @name setPassingInfo
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.command.CommandBlockIF#
	 * @param {Object} options
	 */
	p.setPassingInfo = function(flag) {
		var self = this;
		self._passingResult.result = flag;
	};


	/**
	 * リストア
	 *
	 * @name wasPassed
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.command.CommandBlockIF#
	 * @param {Object} options
	 */
	p.wasPassed = function() {
		var self = this;
		return self._passingResult.result;
	};

	/**
	 * コード展開（TODO）
	 *
	 * @name expand
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.command.CommandBlockIF#
	 * @param {Object} options
	 * <ul>
	 * <li>{jslgEngine.controller.IconController} iconController</li>
	 * <li>{jslgEngine.controller.mainController} mainController</li>
	 * </ul>
	 */
	p.expand = function(options) {};

	/**
	 * 条件判定
	 *
	 * @name check
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.command.CommandBlockIF#
	 * @param {Object} options
	 * <ul>
	 * <li>{jslgEngine.controller.IconController} iconController</li>
	 * <li>{jslgEngine.controller.mainController} mainController</li>
	 * </ul>
	 */
	p.check = function(connector, data, options) {
		var self = this;
		if(!self._isAlreadyFound()) return;

		var logic = options.mainController.logic;
		
		self._readAllElements(connector, data, options);
		connector.pipe(function(connector_s, result_s) {
			var conditionResult = result_s[0];
		
			if(conditionResult instanceof Array && conditionResult.length > 0) {
				conditionResult = conditionResult[0].value;
			}
		
			jslgEngine.log(self.className+' '+self._arguments[0]+' is '+conditionResult);
			connector_s.resolve(conditionResult);
		});
	};

	/**
	 * 実行済みか確認
	 *
	 * @name wasDone
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.command.CommandBlockIF#
	 * @boolean is_back 逆実行するかどうか
	 */
	p.wasDone = function(options) {
		var self = this;
		return self.wasPassed();
	};
	
	o.CommandBlockIF = CommandBlockIF;
}());
