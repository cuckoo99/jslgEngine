/*
 * @author cuckoo99
 */

(function() {
	// namespace:
	var o = this.jslgEngine = this.jslgEngine||{};
	o = (o.model = o.model||{});
	o = (o.command = o.command||{});

	/**
	 * <h4>イベントブロック・コードクラス</h4>
	 * <p>
	 * アクション・コードをまとめたブロック。
	 * </p>
	 * @class
	 * @name CommandBlockCode
	 * @memberOf jslgEngine.model.command
	 * @constructor
	 */
	var CommandBlockCode = jslgEngine.extend(
		jslgEngine.model.command.CommandBlockBase,
		function(options) {
			this.initialize(options);
		}
	);
	/**
	 *
	 */
	var p = CommandBlockCode.prototype;

	/**
	 * クラス名
	 *
	 * @name className
	 * @property
	 * @type String
	 * @memberOf jslgEngine.model.command.CommandBlockCode#
	 **/
	p.className = 'CommandBlockCode';

	/**
	 * コード
	 *
	 * @private
	 * @name _code
	 * @property
	 * @type String
	 * @memberOf jslgEngine.model.command.CommandBlockCode#
	 **/
	p._code = null;

	/**
	 * 初期化
	 *
	 * @name initialize
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.command.CommandBlockCode#
	 **/
	p.initialize = function(options) {
		var self = this;
		self._children = options.children||[];
		
		//140108 初期化にアクションを作成する役目はない。
		//self._code = this.getFormattedCode(options.code);
		// self._code = options.code;
// 		
		// var makeAction = true;		
		// if(makeAction) {
			// var codes = self._code.split('\n');
			// var length = codes.length;
			// for(var i = 0; i < length; i++) {
				// var code = codes[i].replace(/^\s+|\s+$/g, "");
// 				
				// var action = self.makeAction({
					// code : code,
					// mainController : options.mainController
				// });
// 				
				// if(action) self._children.push(action);
			// }
		// }
	};
	
	/**
	 * コード展開（TODO）
	 *
	 * @name expand
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.command.CommandBlockCode#
	 * @param {Object} options
	 * <ul>
	 * <li>{jslgEngine.controller.IconController} iconController</li>
	 * <li>{jslgEngine.controller.mainController} mainController</li>
	 * </ul>
	 */
	p.expand = function(options) {};

	/**
	 * 実行
	 *
	 * @name run
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.command.CommandBlockCode#
	 * @param {Object} options
	 * <ul>
	 * <li>{jslgEngine.controller.IconController} iconController</li>
	 * <li>{jslgEngine.controller.mainController} mainController</li>
	 * </ul>
	 */
	p.run = function(connector, data, options) {
		var self = this;

		var length = self._children.length;
		for(var i = 0; i < length; i++) {
			var child = self._children[i];

			child.run(connector, data, options);
		}
		self._wasDone = true;	
	};

	/**
	 * リストア
	 *
	 * @name restore
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.command.CommandBlockCode#
	 * @param {Object} options
	 * <ul>
	 * <li>{jslgEngine.controller.IconController} iconController</li>
	 * <li>{jslgEngine.controller.mainController} mainController</li>
	 * </ul>
	 */
	p.restore = function(connector, data, options) {
		var self = this;

		var length = self._children.length;
		for(var i = length - 1; i >= 0; i--) {
			var child = self._children[i];

//			//テストの場合、中断されるアクションなら以降の処理を実行しない。（中断処理のリストアと重複するため）
//			if(data.isTest && child.isBreaker) {
//				jslgEngine.log('interrupts restore procedure');
//				return false;
//			}
			child.restore(connector, data, options);
		}
		self._wasDone = false;
		return true;
	};

	/**
	 * 実行済みか確認
	 *
	 * @name wasDone
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.command.CommandBlockCode#
	 * @boolean is_back 逆実行するかどうか
	 */
	p.wasDone = function(options) {
		var self = this;
		var wasDone = self._wasDone;

//		var length = self._children.length;
//		for(var i = 0; i < length; i++) {
//			var child = self._children[i];
//			
//			if(!child.wasDone()) wasDone = false;
//		}
		return wasDone;
	};
	
	/**
	 * アクションの作成
	 * 
	 * @name makeAction
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.command.CommandBlockCode#
	 * @param {Object} options
	 * <ul>
	 * <li>{jslgEngine.controller.IconController} iconController</li>
	 * <li>{jslgEngine.controller.mainController} mainController</li>
	 * </ul>
	 */
	p.makeAction = function(options) {
		var self = this;
		var code = options.code;
		var logic = options.mainController.logic;
	
		var index = -1;
		
		if(code.length == 0) return null;
		
		index = code.indexOf(" ", 0);
	
		var statement = code.substr(0, (index != -1) ? index : code.length);
		var element = code.substr((index != -1) ? index+1 : code.length);
	
		var arguments = logic.getArrayOfText(element, 0);

		var action = self._getAction(statement, arguments);
		
		return action;
	};
	
	o.CommandBlockCode = CommandBlockCode;
}());
