/*
 * @author cuckoo99
 */

(function() {
	// namespace:
	var o = this.jslgEngine = this.jslgEngine||{};
	o = (o.model = o.model||{});
	o = (o.common = o.common||{});

	/**
	 * <h4>キャストクラス</h4>
	 * <p>
	 * マップ土台上に配置できる要素。
	 * </p>
	 * @class
	 * @name ResourceElement
	 * @memberOf jslgEngine.model.stage
	 * @constructor
	 */
	var ResourceElement = jslgEngine.extend(
		jslgEngine.model.common.JSlgElement,
		function(data) {
			this.initialize(data);
			this.resourceFileType = data.resourceFileType;
			this.resourceKey = data.resourceKey;
			this.resourceUrl = data.resourceUrl;
		}
	);
	/**
	 *
	 */
	var p = ResourceElement.prototype;

	/**
	 * ファイル種別
	 *
	 * @name resourceFileType
	 * @property
	 * @type String
	 * @memberOf jslgEngine.model.stage.ResourceElement#
	 **/
	p.resourceFileType = null;

	/**
	 * コンテンツ・アクセスキー
	 *
	 * @name resourceKey
	 * @property
	 * @type String
	 * @memberOf jslgEngine.model.stage.ResourceElement#
	 **/
	p.resourceKey = null;

	/**
	 * URL
	 *
	 * @name resourceUrl
	 * @property
	 * @type String
	 * @memberOf jslgEngine.model.stage.ResourceElement#
	 **/
	p.resourceUrl = null;

	/**
	 * クラス名
	 *
	 * @name className
	 * @property
	 * @type String
	 * @memberOf jslgEngine.model.stage.ResourceElement#
	 **/
	p.className = 'ResourceElement';

	/**
	 * パスのキーコード
	 *
	 * @name keyPathCode
	 * @property
	 * @type String[]
	 * @memberOf jslgEngine.model.stage.ResourceElement#
	 **/
	p._keyPathCodes = [	jslgEngine.model.stage.keys.WORLD_REGION,
						jslgEngine.model.stage.keys.RESOURCE];

	/**
	 * 対象キーコード
	 *
	 * @name keyCode
	 * @property
	 * @type String
	 * @memberOf jslgEngine.model.stage.ResourceElement#
	 **/
	p._keyCode = jslgEngine.model.stage.keys.RESOURCE;

	o.ResourceElement = ResourceElement;
}());