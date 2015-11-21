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
	 * @name CastFrame
	 * @memberOf jslgEngine.model.stage
	 * @constructor
	 */
	var CastFrame = jslgEngine.extend(
		jslgEngine.model.common.JSlgElementFrame,
		function(data, options) {
			this.initialize(data, options);
		}
	);
	/**
	 *
	 */
	var p = CastFrame.prototype;

	/**
	 * クラス名
	 *
	 * @name className
	 * @property
	 * @type String
	 * @memberOf jslgEngine.model.stage.CastFrame#
	 **/
	p.className = 'CastFrame';

	/**
	 * パスのキーコード
	 *
	 * @name keyPathCode
	 * @property
	 * @type String[]
	 * @memberOf jslgEngine.model.stage.CastFrame#
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
	 * @memberOf jslgEngine.model.stage.CastFrame#
	 **/
	p._keyCode = jslgEngine.model.stage.keys.CAST_FRAME;

	/**
	 * 実体要素取得
	 *
	 * @name getModel
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.stage.CastFrame#
	 **/
	p.getModel = function(data, options) {
		return new jslgEngine.model.stage.Cast(data, options);
	};

	o.CastFrame = CastFrame;
}());
