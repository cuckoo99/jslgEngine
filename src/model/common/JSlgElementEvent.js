/*
 * @author cuckoo99
 */

(function() {
	// namespace:
	var o = this.jslgEngine = this.jslgEngine||{};
	o = (o.model = o.model||{});
	o = (o.common = o.common||{});

	/**
	 * <h4>SLG要素・イベント</h4>
	 * <p>
	 * ゲームに用いられる、イベント要素。
	 * </p>
	 * @class
	 * @name JSlgElementCommand
	 * @memberOf jslgEngine.model.common
	 * @constructor
	 */
	var JSlgElementCommand = jslgEngine.extend(
		jslgEngine.model.common.JSlgElementBase,
		function(data, options) {
			this.initialize(data, options);
			this._command = new jslgEngine.model.command.Command({
				code : data.code
			}, options);
		}
	);
	/**
	 *
	 */
	var p = JSlgElementCommand.prototype;

	/**
	 * クラス名
	 *
	 * @name className
	 * @property
	 * @type String
	 * @memberOf jslgEngine.model.common.JSlgElementCommand#
	 **/
	p.className = 'Command';
	
	/**
	 * どこにでも着脱可能かどうか
	 *
	 * @name _isFloat
	 * @property
	 * @type Boolean
	 * @memberOf jslgEngine.model.common.JSlgElementCommand#
	 **/
	p._isFloat = true;

	/**
	 * 対象キーコード
	 *
	 * @name keyCode
	 * @property
	 * @type String
	 * @memberOf jslgEngine.model.common.JSlgElementCommand#
	 **/
	p._keyCode = jslgEngine.model.stage.keys.EVENT;

	/**
	 * イベント
	 *
	 * @name _command
	 * @property
	 * @type jslgEngine.model.command.Command
	 * @memberOf jslgEngine.model.common.JSlgElementCommand#
	 **/
	p._command = null;
	
	/**
	 * 実行する
	 *
	 * @name run
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.common.JSlgElementCommand#
	 * @param {JSON} options
	 **/
	p.run = function(connector, options) {
		var self = this;
		self._command.run(connector, options);
	};
	
	/**
	 * リストアする
	 *
	 * @name restore
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.common.JSlgElementCommand#
	 * @param {JSON} options
	 **/
	p.restore = function(options) {
		var self = this;
		self._command.restore(options);
	};
	
	/**
	 * 子要素の追加（実装しない）
	 *
	 * @ignore
	 */
	p.addChild = function(options) {
		return false;
	};

	/**
	 * 子要素の取得（実装しない）
	 *
	 * @ignore
	 */
	p.getChild = function(options) {
		return false;
	};

	/**
	 * 子要素の削除（実装しない）
	 *
	 * @ignore
	 */
	p.removeChild = function(options) {
		return false;
	};

	o.JSlgElementCommand = JSlgElementCommand;
}());
