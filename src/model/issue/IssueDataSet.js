/*
 * @author cuckoo99
 */

(function() {
	// namespace:
	var o = this.jslgEngine = this.jslgEngine||{};
	o = (o.model = o.model||{});
	o = (o.issue = o.issue||{});

	/**
	 * <h4>IssueDataSet要素</h4>
	 * <p>
	 * 処理を妨げる要因
	 * </p>
	 * @class
	 * @name IssueDataSet
	 * @memberOf jslgEngine.model.issue
	 * @constructor
	 */
	var IssueDataSet = function(options) {
		this.initialize(options);
	};
	/**
	 *
	 */
	var p = IssueDataSet.prototype;

	/**
	 * 識別キー
	 *
	 * @name key
	 * @property
	 * @type Object
	 * @memberOf jslgEngine.model.issue.IssueDataSet#
	 **/
	p.key = null;

	/**
	 * 適用された座標の配列
	 *
	 * @name locations
	 * @property
	 * @type Object
	 * @memberOf jslgEngine.model.issue.IssueDataSet#
	 **/
	p.locations = null;

	/**
	 * キャッシュデータ
	 *
	 * @name cache
	 * @property
	 * @type Object
	 * @memberOf jslgEngine.model.issue.IssueDataSet#
	 **/
	p.cache = null;

	/**
	 * 適用座標
	 *
	 * @name appliedLocation
	 * @property
	 * @type Object
	 * @memberOf jslgEngine.model.issue.IssueDataSet#
	 **/
	p.appliedLocation = null;

	/**
	 * 適用要素
	 *
	 * @name appliedElement
	 * @property
	 * @type Object
	 * @memberOf jslgEngine.model.issue.IssueDataSet#
	 **/
	p.appliedElement = null;

	/**
	 * 適用要素のキーデータ
	 *
	 * @name appliedKeyData
	 * @property
	 * @type Object
	 * @memberOf jslgEngine.model.issue.IssueDataSet#
	 **/
	p.appliedKeyData = null;

	/**
	 * 初期化
	 *
	 * @name initialize
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.issue.IssueDataSet#
	 **/
	p.initialize = function(options) {
		var self = this;
		
		self.key = options.key;
		self.locations = options.locations;
		self.cache = options.cache;
		self.appliedLocation = options.appliedLocation;
		self.appliedElement = options.appliedElement;
		self.appliedKeyData = options.appliedKeyData;
	};
	
	/**
	 * 名前を取得する
	 *
	 * @name getName
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.action.ActionPending#
	 * @param {Object} count
	 * @param {Object} data
	 * @param {Object} options
	 **/
	p.getName = function() {
		var self = this;
		
		//インデックスの種類に依存している。
		return 'area'+[self.key.layerIndex,self.key.splitIndex].join('-');
	};
	
	o.IssueDataSet = IssueDataSet;
}());
