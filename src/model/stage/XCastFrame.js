/*
 * @author cuckoo99
 */

(function() {
	// namespace:
	var o = this.jslgEngine = this.jslgEngine||{};
	o = (o.model = o.model||{});
	o = (o.stage = o.stage||{});

	/**
	 * <h4>キャスト・フレームクラス</h4>
	 * <p>
	 * キャストの基底要素。
	 * </p>
	 * @class
	 * @name XCastFrame
	 * @memberOf jslgEngine.model.stage
	 * @constructor
	 */
	var XCastFrame = jslgEngine.extend(
		jslgEngine.model.common.JSlgElementFrame,
		function(data, options) {
			this.initialize(data, options);
		}
	);
	/**
	 *
	 */
	var p = XCastFrame.prototype;

	/**
	 * クラス名
	 *
	 * @name className
	 * @property
	 * @type String
	 * @memberOf jslgEngine.model.stage.XCastFrame#
	 **/
	p.className = 'CastFrame';

	/**
	 * パスのキーコード
	 *
	 * @name keyPathCode
	 * @property
	 * @type String[]
	 * @memberOf jslgEngine.model.stage.XCastFrame#
	 **/
	p._keyPathCodes = [	jslgEngine.model.stage.keys.WORLD_REGION,
						jslgEngine.model.stage.keys.LOCAL_REGION,
						jslgEngine.model.stage.keys.CAST_FRAME];

	/**
	 * 対象キーコード
	 *
	 * @name keyCode
	 * @property
	 * @type String
	 * @memberOf jslgEngine.model.stage.XCastFrame#
	 **/
	p._keyCode = jslgEngine.model.stage.keys.CAST_FRAME;

	/**
	 * 実体要素取得
	 *
	 * @name getModel
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.stage.XCastFrame#
	 **/
	p.getModel = function(data, options) {
		return new jslgEngine.model.stage.XCast(data, options);
	};

	o.XCastFrame = XCastFrame;
}());