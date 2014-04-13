/*
 * @author cuckoo99
 */

(function() {
	// namespace:
	var o = this.jslgEngine = this.jslgEngine||{};
	o = (o.model = o.model||{});
	o = (o.stage = o.stage||{});

	/**
	 * <h4>マップ土台・フレームクラス</h4>
	 * <p>
	 * マップ土台の基底要素。
	 * </p>
	 * @class
	 * @name GroundFrame
	 * @memberOf jslgEngine.model.stage
	 * @constructor
	 */
	var GroundFrame = jslgEngine.extend(
		jslgEngine.model.common.JSlgElementFrame,
		function(data, options) {
			this.initialize(data, options);
		}
	);
	/**
	 *
	 */
	var p = GroundFrame.prototype;

	/**
	 * クラス名
	 *
	 * @name className
	 * @property
	 * @type String
	 * @memberOf jslgEngine.model.stage.GroundFrame#
	 **/
	p.className = 'GroundFrame';

	/**
	 * パスのキーコード
	 *
	 * @name keyPathCode
	 * @property
	 * @type String[]
	 * @memberOf jslgEngine.model.stage.GroundFrame#
	 **/
	p._keyPathCodes = [	jslgEngine.model.stage.keys.WORLD_REGION,
						jslgEngine.model.stage.keys.LOCAL_REGION,
	                   	jslgEngine.model.stage.keys.GROUND_FRAME];

	/**
	 * 対象キーコード
	 *
	 * @name keyCode
	 * @property
	 * @type String
	 * @memberOf jslgEngine.model.stage.GroundFrame#
	 **/
	p._keyCode = jslgEngine.model.stage.keys.GROUND_FRAME;

	/**
	 * 実体要素取得
	 *
	 * @name getModel
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.stage.GroundFrame#
	 **/
	p.getModel = function(data, options) {
		return new jslgEngine.model.stage.Ground(data, options);
	};

	o.GroundFrame = GroundFrame;
}());