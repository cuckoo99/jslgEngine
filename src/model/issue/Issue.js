/*
 * @author cuckoo99
 */

(function() {
	// namespace:
	var o = this.jslgEngine = this.jslgEngine||{};
	o = (o.model = o.model||{});
	o = (o.issue = o.issue||{});

	/**
	 * <h4>Issue要素</h4>
	 * <p>
	 * 処理を妨げる要因
	 * </p>
	 * @class
	 * @name Issue
	 * @memberOf jslgEngine.model.common
	 * @constructor
	 */
	var Issue = function(options) {
		this.initialize(options);
	};
	/**
	 *
	 */
	var p = Issue.prototype;

	/**
	 * 解決された問題
	 *
	 * @name _issueDataSets
	 * @property
	 * @type Number
	 * @memberOf jslgEngine.model.common.Issue#
	 **/
	p._issueDataSets = null;

	/**
	 * 範囲要求の設定情報
	 *
	 * @name _currentIndex
	 * @property
	 * @type Number
	 * @memberOf jslgEngine.model.common.Issue#
	 **/
	p._currentIndex = null;

	/**
	 * 文章要求の設定情報
	 *
	 * @name _settings
	 * @property
	 * @type JSON
	 * @memberOf jslgEngine.model.common.Issue#
	 **/
	p._settings = null;

	/**
	 * 初期化
	 *
	 * @name initialize
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.common.Issue#
	 **/
	p.initialize = function(options) {
	};

	/**
	 * 問題の解決
	 *
	 * @name resolve
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.common.Issue#
	 * @param {Object} obj
	 * @param {Object} options
	 **/
	p.resolve = function(obj, options) {
	};

	/**
	 * 適用された範囲の取得
	 *
	 * @name getAppliedElement
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.issue.RequiredArea#
	 * @param {Object} index
	 **/
	p.getAppliedElement = function(index) {
		var self = this;
		var appliedIndex = index != null ? index : self._currentIndex;
		var appliedElements = [];
		
		if(!self._issueDataSets) return null;
		for(var i = 0; i < self._issueDataSets.length; i++) {
			var issueDataSet = self._issueDataSets[i];
			
			if(issueDataSet.key.layerIndex === appliedIndex) {
				appliedElements.push(issueDataSet.appliedElement);
			}
		}
		
		//TODO: 複数の要素に対応すべき
		return appliedElements.length > 0 ? appliedElements[0] : null;
	};
	
	/**
	 * 次の要求へ
	 *
	 * @name next
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.common.Issue#
	 **/
	p.next = function() {
		var self = this;
		
		//2013.12.24 最終的な適用座標に対応
		if (self._settings.length > self._currentIndex) {
			self._currentIndex++;
			return self._currentIndex;
		}
		return false;
	};

	/**
	 * 前の要求へ
	 *
	 * @name back
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.common.Issue#
	 **/
	p.back = function() {
		var self = this;
		if(self._currentIndex == 0) return false;
		
		if (0 < self._currentIndex) {
			self.clear(self._currentIndex);
			self._currentIndex--;
			return true;
		}
		self.clear(self._currentIndex);
		return false;
	};

	/**
	 * エリアを初期化する
	 *
	 * @name clear
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.common.Issue#
	 * @param {Object} index
	 **/
	p.clear = function(index) {
		var self = this;
	
		for(var i = 0; i < self._issueDataSets.length; i++) {
			var issueDataSet = self._issueDataSets[i];
			
			if(issueDataSet.key.layerIndex == index) {
				self._issueDataSets.splice(i, 1);
				i--;
			}
		}
	};

	/**
	 * インデックスからデータを取得。デフォルトは現在のインデックス。
	 *
	 * @name getLastDataSet
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.common.Issue#
	 **/
	p.getLastDataSet = function() {
		var self = this;
		
		if(self._currentIndex == 0) return null;
		
		return self.getDataSet(self._currentIndex - 1);
	};
	
	/**
	 * インデックスからデータを取得。デフォルトは現在のインデックス。
	 *
	 * @name getDataSet
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.common.Issue#
	 **/
	p.getDataSet = function(index) {
		var self = this;
		var targetIndex = index != null ? index : self._currentIndex;
		var list = [];

		//TODO:Currentと表記してあるが、実際は一つ前の適応状態を読む必要があるため、メソッド名が不適切。
		var length = self._issueDataSets.length;
		for(var i = 0; i < length; i++) {
			var issueDataSet= self._issueDataSets[i];
			
			if(issueDataSet.key.layerIndex == targetIndex) {
				list.push(issueDataSet);
			}
		}
		
		return list;
	};

	/**
	 * 全ての要求が解決したかどうか確認する。
	 *
	 * @name wasResolved
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.common.Issue#
	 **/
	p.wasResolved = function() {
		var self = this;
	
		if(!self._issueDataSets) return false;

		return self._issueDataSets.length === self._settings.length;
	};

	/**
	 * 全てのパターンを実行できるようにクローンを作成する<br />
	 * 座標から正負評価をし、設定する。<br />
	 *
	 * @name getPatterns
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.common.Issue#
	 * @param {Object} count
	 * @param {Object} data
	 * @param {Object} options
	 **/
	p.getPatterns = function(count, data, options) {
	};
	
	/**
	 * 入力待機の回数を取得する
	 *
	 * @name getPendingCount
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.common.Issue#
	 **/
	p.getPendingCount = function() {
		var self = this;
		
		return self._settings.length;
	};

	o.Issue = Issue;
}());
