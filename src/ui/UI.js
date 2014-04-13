/*
 *
 */

(function() {
	// namespace:
	var o = this.jslgEngine = this.jslgEngine||{};
	o = (o.ui = o.ui||{});

	/**
	 * <h4>ユーザ・インタフェース</h4>
	 * <p>
	 * 入出力の橋渡しを行う。
	 * </p>
	 * @class
	 * @name UI
	 * @memberOf jslgEngine.ui
	 * @constructor
	 */
	var UI = function() {
		this.initialize();
	};
	/**
	 *
	 */
	var p = UI.prototype;

	/**
	 * 初期化
	 *
	 * @name initialize
	 * @method
	 * @function
	 * @memberOf jslgEngine.ui.UI#
	 **/
	p.initialize = function() {};

	/**
	 * 依存する描画オブジェクト
	 *
	 * @private
	 * @property _graphics
	 * @type Object
	 * @memberOf jslgEngine.ui.UI#
	 **/
	p._graphics = null;

	/**
	 * オブジェクトの追加
	 *
	 * @name addObject
	 * @method
	 * @function
	 * @memberOf jslgEngine.ui.UI#
	 * @param {String} key オブジェクトに割り当てられるキー
	 * @param {String} img_key オブジェクトに割り当てられる画像キー
	 * @param {JSON} options
	 * <ul>
	 * 	<li>graphics : {createjs.Graphics}</li>
	 * 	<li>alpha : アルファ値</li>
	 * 	<li>text : </li>
	 * 	<ul>
	 * 	<li>font : フォント情報</li>
	 * 	<li>textValue : 文字列</li>
	 * 	<li>color : 文字色</li>
	 * 	</ul>
	 * 	<li>sprite : {careatejs.Sprite}</li>
	 * 	<li>stageManager : {jslgEngine.controller.StageManager}</li>
	 * </ul>
	 * @param {Number} at_index 表示順
	 */
	p.addObject = function(options) {};

	/**
	 * オブジェクトの削除
	 *
	 * @name removeObject
	 * @method
	 * @function
	 * @memberOf jslgEngine.ui.UI#
	 * @param {String} key オブジェクトのキー
	 */
	p.removeObject = function(options) {};

	/**
	 * オブジェクトの更新
	 *
	 * @name updateObject
	 * @method
	 * @function
	 * @memberOf jslgEngine.ui.UI#
	 * @param {JSON} options
	 * <ul>
	 * 	<li>{String} key オブジェクトのキー</li>
	 * 	<li>{String} animeKey アニメーションのキー</li>
	 * 	<li>{Number} fadeValue フェード値</li>
	 * 	<li>{jslgEngine.model.Location} location グローバル座標</li>
	 * 	<li>{String} text テキスト</li>
	 * </ul>
	 */
	p.updateObject = function(options) {};

	/**
	 * ステージへの反映
	 *
	 * @name update
	 * @method
	 * @function
	 * @memberOf jslgEngine.ui.UI#
	 */
	p.update = function(options) {};

	o.UI = UI;
}());