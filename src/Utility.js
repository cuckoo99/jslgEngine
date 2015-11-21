/*
 * @author cuckoo99
 */

(function() {
	// namespace:
	var o = this.jslgEngine = this.jslgEngine||{};

	o.utility = {
		/**
		 * 繰り返し文字列の作成
		 *
		 * @name getRepeatedText
		 * @function
		 * @static
		 * @memberOf jslgEngine.utility
		 */
		getRepeatedText : function(text, num) {
			return (new Array(num + 1).join(text));
		},
		/*
		 * 文字列を置き換える
		 * 
		 * @name replaceStr
		 * @function
		 * @static
		 * @memberOf jslgEngine.utility
		 * @param {String} data 置き換える文字列
		 * @param {Int} s_idx 開始インデックス
		 * @param {Int} l_idx 終了インデックス
		 * @param {String} rep 置き換え文字列
		 * @returns {String} 置き換え後の文字列
		 */
		replaceStr : function(data, s_idx, l_idx, rep) {
			return data.substr(0, s_idx) + rep + data.substr(l_idx);
		},
		/*
		 * 文字列を置き換える
		 *
		 * @name insertStr
		 * @function
		 * @static
		 * @memberOf jslgEngine.utility
		 * @param {String} data 挿入される文字列
		 * @param {String} ins 挿入文字列
		 * @returns {String} 挿入された文字列
		 */
		insertStr : function(data, idx, ins) {
			return data.substr(0, idx) + ins + data.substr(idx);
		}
	};
}());
