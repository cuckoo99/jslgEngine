/*
 * @author cuckoo99
 */

(function() {
	// namespace:
	var o = this.jslgEngine = this.jslgEngine||{};
	o = (o.model = o.model||{});
	o = (o.common = o.common||{});

	/**
	 * <h4>SLGステータス</h4>
	 * <p>
	 * ゲームに用いられる、物理的要素のオプション値。
	 * </p>
	 * @class
	 * @name JSlgElementStatus
	 * @memberOf jslgEngine.model.common
	 * @constructor
	 */
	var JSlgElementStatus = jslgEngine.extend(
		jslgEngine.model.common.JSlgElementBase,
		function(data, options) {
			this.initialize(data, options);
			//this.setKeyPathCodes(options.parent);
			this.value = data.value;
		}
	);
	/**
	 *
	 */
	var p = JSlgElementStatus.prototype;

	/**
	 * クラス名
	 *
	 * @name className
	 * @property
	 * @type String
	 * @memberOf jslgEngine.model.common.JSlgElementStatus#
	 **/
	p.className = 'Status';

	/**
	 * 対象キーコード
	 *
	 * @name keyCode
	 * @property
	 * @type String
	 * @memberOf jslgEngine.model.common.JSlgElementStatus#
	 **/
	p._keyCode = jslgEngine.model.stage.keys.STATUS;

	/**
	 * どこにでも着脱可能かどうか
	 *
	 * @name _isFloat
	 * @property
	 * @type Boolean
	 * @memberOf jslgEngine.model.common.JSlgElementStatus#
	 **/
	p._isFloat = true;

	/**
	 * ステータスの値
	 *
	 * @name value
	 * @property
	 * @type String
	 * @memberOf jslgEngine.model.common.JSlgElementStatus#
	 **/
	p.value = null;
	
	/**
	 * 値を数値として取得
	 *
	 * @name getNumber
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.common.JSlgElementStatus#
	 * @returns {Number} 数値
	 */
	p.getNumber = function(options) {
		var self = this;
		
		if(self.value == null || typeof(self.value) === 'string') return null;
        
		return isNaN(self.value) ? ~~self.value : self.value;
	};

	/**
	 * JSON形式として返す
	 *
	 * @name toJsonString
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.common.JSlgElementStatus#
	 * @returns {String}
	 */
	p.toJsonString = function(options) {
		var self = this;
		var length, text = '';
		var obj = [];
		
		text+='{';
		text+='\"type\":\"Status\",';
		text+='\"className\":\"'+self.className+'\",';
		text+='\"key\":\"'+self.getKey()+'\",';
		text+='\"value\":\"'+self.value+'\"';
		text+='}';
		return text;
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

	o.JSlgElementStatus = JSlgElementStatus;
}());
