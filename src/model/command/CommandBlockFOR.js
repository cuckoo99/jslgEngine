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
	 * @name CommandBlockFOR
	 * @memberOf jslgEngine.model.command
	 * @constructor
	 */
	var CommandBlockFOR = jslgEngine.extend(
		jslgEngine.model.command.CommandBlockBase,
		function(options) {
			this.initialize(options);
			this._code = options ? options.code : null;
		}
	);
	/**
	 *
	 */
	var p = CommandBlockFOR.prototype;

	/**
	 * クラス名
	 *
	 * @name className
	 * @property
	 * @type String
	 * @memberOf jslgEngine.model.command.CommandBlockFOR#
	 **/
	p.className = 'CommandBlockFOR';

	/**
	 * 要素
	 *
	 * @private
	 * @name _arguments
	 * @property
	 * @type String
	 * @memberOf jslgEngine.model.command.CommandBlockFOR#
	 **/
	p._arguments = null;

	/**
	 * 初期化
	 *
	 * @name initialize
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.command.CommandBlockFOR#
	 **/
	p.initialize = function(options) {
		var self = this;
		self._children = options.children||[];
		self._arguments = options.arguments;
	};

	/**
	 * 参照するオブジェクトを抽出する
	 *
	 * @name find
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.command.CommandBlockFOR#
	 * @param {Object} options
	 */
	p.find = function(connector, data, options, callback) {
		var self = this;
		
		self._find(connector, data, options, callback);
		connector.connects(function(connector_s) {
			self.expand(connector_s, data, options);
		}).pipe(function(connector_s) {
			connector_s.resolve();
			
			for(var i = 0; i < self._children.length; i++) {
				self._children[i].find(connector_s, data, options);
			}
		});
	};
	
	/**
	 * 実行
	 *
	 * @name run
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.command.CommandBlockFOR#
	 * @param {Object} options
	 * <ul>
	 * <li>{jslgEngine.controller.IconController} iconController</li>
	 * <li>{jslgEngine.controller.mainController} mainController</li>
	 * </ul>
	 */
	p.run = function(connector, data, options) {
		var self = this;
		var child;
	
		var length = self._children.length;
		for(var i = 0; i < length; i++) {
			child = self._children[i];
			child.run(connector, data, options);
		}
		
		return;
	};

	/**
	 * リストア
	 *
	 * @name restore
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.command.CommandBlockFOR#
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
			
			child.restore(connector, data, options);
		}
	};
	
	/**
	 * コード展開（TODO）
	 *
	 * @name expand
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.command.CommandBlockFOR#
	 * @param {Object} options
	 * <ul>
	 * <li>{jslgEngine.controller.IconController} iconController</li>
	 * <li>{jslgEngine.controller.mainController} mainController</li>
	 * </ul>
	 */
	p.expand = function(connector, data, options) {
		var self = this;
	
		if(self._wasExpanded) return false;
	
		var obj = [];
		
		self._readAllElements(connector, data, options);
		connector.connects(function(connector_s, result_s) {
			var temporaryKey = result_s[0];
			var elements = result_s[1];
			
			elements = !(elements instanceof Array) ? [elements] : elements;
			
			temporaryKey = temporaryKey.value;
			
			var region = options.mainController.getWorldRegion();
			
			var length = elements.length;
			for(var i = 0; i < length; i++) {
				var element = elements[i];
				element = element.value ? element.value : element; 
				
				//変数の宣言
				var data = {
					arguments : ['\"'+temporaryKey+'\"', element.getPath()]
				};
				var variableAction = new jslgEngine.model.action.ActionVariable(data);
				
				var clone = jslgEngine.getClone(self._children);
				
				obj.push(variableAction);
				for(var j = 0; j < clone.length; j++) {
					obj.push(clone[j]);
				}
			}
			self._children = obj;
			self._wasFound = false;
			self._wasExpanded = true;
		});
	};

	o.CommandBlockFOR = CommandBlockFOR;
}());
