/*
 * @author cuckoo99
 */

(function() {
	// namespace:
	var o = this.jslgEngine = this.jslgEngine||{};
	o = (o.model = o.model||{});
	o = (o.common = o.common||{});

	/**
	 * <h4>直列実行クラス</h4>
	 * <p>
	 * 実行関数を持ったオブジェクトを直列実行する事ができる。
	 * </p>
	 * @class
	 * @name SerialRunner
	 * @memberOf jslgEngine.model.common
	 * @constructor
	 */
	var SerialRunner = function(options) {
		this.initialize(options);
	};
	/**
	 *
	 */
	var p = SerialRunner.prototype;

	/**
	 * 初期化
	 *
	 * @name initialize
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.common.SerialRunner#
	 **/
	p.initialize = function(options) {
		var self = this;
		self._children = [];
	};

	/**
	 * 子要素
	 *
	 * @private
	 * @name _children
	 * @property
	 * @type Object[]
	 * @memberOf jslgEngine.model.common.SerialRunner#
	 **/
	p._children = null;

	/**
	 * 実行
	 *
	 * @name run
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.common.SerialRunner#
	 */
	p.run = function(options) {
		var self = this;
		var length = self._children.length;
		for(var i = 0; i < length; i++) {
			var child = self._children[i];
			
			child.run(options);
		}
	};

	/**
	 * リストア
	 *
	 * @name restore
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.common.SerialRunner#
	 */
	p.restore = function(options) {};

	/**
	 * 子要素の設定
	 *
	 * @name setChild
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.common.SerialRunner#
	 * @param {JSON} options
	 * <ul>
	 * <li>{jslgEngine.model.network.ConnectorBase} connector</li>
	 * <li>{jslgEngine.model.common.JSlgElementFinder} finder</li>
	 * </ul>
	 */
	p.addChild = function(options) {
		var self = this;

		self._children.push(options.obj);
	};
	
	/**
	 * 子要素の設定
	 *
	 * @name removeChild
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.common.SerialRunner#
	 * @param {JSON} options
	 * <ul>
	 * <li>{jslgEngine.model.network.ConnectorBase} connector</li>
	 * <li>{jslgEngine.model.common.JSlgElementFinder} finder</li>
	 * </ul>
	 */
	p.removeChild = function(options) {
		var self = this;

		var length = self._children.length;
		for(var i = 0; i < length; i++) {
			var child = self._children[i];
			if(child.key === options.key) {
				self._children.splice(i, 1);
			}
		}
	};
	
	o.SerialRunner = SerialRunner;
}());
