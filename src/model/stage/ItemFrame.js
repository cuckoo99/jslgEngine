/*
 * @author cuckoo99
 */

(function() {
	// namespace:
	var o = this.jslgEngine = this.jslgEngine||{};
	o = (o.model = o.model||{});
	o = (o.stage = o.stage||{});

	/**
	 * <h4>アイテム・フレームクラス</h4>
	 * <p>
	 * アイテムの基底要素。
	 * </p>
	 * @class
	 * @name ItemFrame
	 * @memberOf jslgEngine.model.stage
	 * @constructor
	 */
	var ItemFrame = jslgEngine.extend(
		jslgEngine.model.common.JSlgElementFrame,
		function(data, options) {
			this.initialize(data, options);
		}
	);
	/**
	 *
	 */
	var p = ItemFrame.prototype;

	/**
	 * クラス名
	 *
	 * @name className
	 * @property
	 * @type String
	 * @memberOf jslgEngine.model.stage.ItemFrame#
	 **/
	p.className = 'ItemFrame';

	/**
	 * パスのキーコード
	 *
	 * @name keyPathCode
	 * @property
	 * @type String[]
	 * @memberOf jslgEngine.model.stage.ItemFrame#
	 **/
	p._keyPathCodes = [	jslgEngine.model.stage.keys.WORLD_REGION,
						jslgEngine.model.stage.keys.LOCAL_REGION,
	                   	jslgEngine.model.stage.keys.ITEM_FRAME];

	/**
	 * 対象キーコード
	 *
	 * @name keyCode
	 * @property
	 * @type String
	 * @memberOf jslgEngine.model.stage.ItemFrame#
	 **/
	p._keyCode = jslgEngine.model.stage.keys.ITEM_FRAME;

	/**
	 * 実体要素取得
	 *
	 * @name getModel
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.stage.ItemFrame#
	 **/
	p.getModel = function(data, options) {
		return new jslgEngine.model.stage.Item(data, options);
	};

	o.ItemFrame = ItemFrame;
}());
