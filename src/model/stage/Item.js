/*
 * @author cuckoo99
 */

(function() {
	// namespace:
	var o = this.jslgEngine = this.jslgEngine||{};
	o = (o.model = o.model||{});
	o = (o.stage = o.stage||{});

	/**
	 * <h4>アイテムクラス</h4>
	 * <p>
	 * キャストの保有する要素。
	 * 実行という機能を保有する。
	 * </p>
	 * @class
	 * @name Item
	 * @memberOf jslgEngine.model.stage
	 * @constructor
	 */
	var Item = jslgEngine.extend(
		jslgEngine.model.common.JSlgElement,
		function(data, options) {
			this.initialize(data, options);
		}
	);
	/**
	 *
	 */
	var p = Item.prototype;

	/**
	 * クラス名
	 *
	 * @name className
	 * @property
	 * @type String
	 * @memberOf jslgEngine.model.stage.Item#
	 **/
	p.className = 'Item';

	/**
	 * パスのキーコード
	 *
	 * @name keyPathCode
	 * @property
	 * @type String[]
	 * @memberOf jslgEngine.model.stage.Item#
	 **/
	p._keyPathCodes = [	jslgEngine.model.stage.keys.WORLD_REGION,
						jslgEngine.model.stage.keys.LOCAL_REGION,
	                   	jslgEngine.model.stage.keys.STAGE,
	                   	jslgEngine.model.stage.keys.GROUND,
	                   	jslgEngine.model.stage.keys.CAST,
	                   	jslgEngine.model.stage.keys.ITEM];

	/**
	 * 対象キーコード
	 *
	 * @name keyCode
	 * @property
	 * @type String
	 * @memberOf jslgEngine.model.stage.Item#
	 **/
	p._keyCode = jslgEngine.model.stage.keys.ITEM;

	/**
	 * 実行
	 *
	 * @name _run
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.stage.Item#
	 */
	p._run = function(connector, data, options) {
		var self = this;
		
		var length = self._children.length;
		for(var i = 0; i < length; i++) {
			var child = self._children[i];

			if(child.className === 'Command') {
				child.run(connector, data, options);
			}
		}
	};
	
	/**
	 * 実行のために複製を作成
	 *
	 * @name getRunnableCommand
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.stage.Item#
	 * @param {Object} options
	 */
	p.getRunnableCommand = function(data, options) {
		var self = this;
		
		var command = self._children[0];
		var clone = jslgEngine.getClone(command, { limit : 10000 });
		
		clone._key = command.getKeyData();
		//イベントを実行する時はインスタンスを作成し、親の情報を残すためキーはリセットしない。
		clone.setup({}, options);
		return clone;
	};
	
	o.Item = Item;
}());
