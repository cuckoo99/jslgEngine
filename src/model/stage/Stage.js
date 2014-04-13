/*
 * @author cuckoo99
 */

(function() {
	// namespace:
	var o = this.jslgEngine = this.jslgEngine||{};
	o = (o.model = o.model||{});
	o = (o.stage = o.stage||{});

	/**
	 * <h4>ステージクラス</h4>
	 * <p>
	 * マップ土台を保有する要素。
	 * </p>
	 * @class
	 * @name Stage
	 * @memberOf jslgEngine.model.stage
	 * @constructor
	 */
	var Stage = jslgEngine.extend(
		jslgEngine.model.common.JSlgElement,
		function(data, options) {
			this.initialize(data, options);
		}
	);
	/**
	 *
	 */
	var p = Stage.prototype;

	/**
	 * クラス名
	 *
	 * @name className
	 * @property
	 * @type String
	 * @memberOf jslgEngine.model.stage.Stage#
	 **/
	p.className = 'Stage';

	/**
	 * パスのキーコード
	 *
	 * @private
	 * @name keyPathCode
	 * @property
	 * @type String[]
	 * @memberOf jslgEngine.model.stage.Stage#
	 **/
	p._keyPathCodes = [	jslgEngine.model.stage.keys.WORLD_REGION,
						jslgEngine.model.stage.keys.LOCAL_REGION,
	                   	jslgEngine.model.stage.keys.STAGE];

	/**
	 * 対象キーコード
	 *
	 * @private
	 * @name keyCode
	 * @property
	 * @type String
	 * @memberOf jslgEngine.model.stage.Stage#
	 **/
	p._keyCode = jslgEngine.model.stage.keys.STAGE;

	/**
	 * 座標を持つかどうか
	 *
	 * @name hasLocation
	 * @property
	 * @type Boolean
	 * @memberOf jslgEngine.model.stage.Stage#
	 **/
	p.hasLocation = true;

	/**
	 * 大きさを持つかどうか
	 *
	 * @name hasSize
	 * @property
	 * @type Boolean
	 * @memberOf jslgEngine.model.stage.Stage#
	 **/
	p.hasSize = true;

	o.Stage = Stage;
}());