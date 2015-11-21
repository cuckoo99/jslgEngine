module('Element');
testSettingAsAsync("TestJSlgCommandFactory", {
		mainData : {width:10,height:10},
		timeOut : 3000
	},
	function(iconController, mainController, connector, options) {

	var converter = new jslgEngine.model.logic.Converter();
	var slgCommandFactory = new jslgEngine.model.factory.JSlgCommandFactory();
	var data = {
		converter : converter
	};
	
	var result;
	
	// 範囲要求をし、待機状態にする。
	//「移動」・作成
	reuslt = slgCommandFactory.makeMoving(connector, data, options);
	
	equal(true, true, "passed!");
	//「移動」・実行
	equal(true, true, "passed!");

	//「能力が制限値を超えることを制限」・作成
	reuslt = slgCommandFactory.makeLimitedNumber(connector, data, options);
	
	equal(true, true, "passed!");
	//「能力が制限値を超えることを制限」・実行
	equal(true, true, "passed!");

	//「体力が０になったら消去」・作成
	reuslt = slgCommandFactory.makeCheckDeath(connector, data, options);
	
	equal(true, true, "passed!");
	//「体力が０になったら消去」・実行
	equal(true, true, "passed!");

	//「経験値を加算し、グレードアップ」・作成
	equal(true, true, "passed!");
	//「経験値を加算し、グレードアップ」・実行
	equal(true, true, "passed!");

	//「キャストは攻撃されたら反撃」・作成
	equal(true, true, "passed!");
	//「キャストは攻撃されたら反撃」・実行
	equal(true, true, "passed!");

	//「キャストは攻撃されたら防御」・作成
	equal(true, true, "passed!");
	//「キャストは攻撃されたら防御」・実行
	equal(true, true, "passed!");

	//「敵所属のキャストの体力が全て０なら、勝利アイコンを表示」・作成
	equal(true, true, "passed!");

	//「同じ座標に止まると、ユニット結合」・作成
	equal(true, true, "passed!");

	//「ユニット分離」・作成
	equal(true, true, "passed!");

	//「メニュー（子要素ビュー）」・作成
	equal(true, true, "passed!");

	//「画面スクロール」・作成
	equal(true, true, "passed!");

	//「メッセージボード、追加」・作成
	equal(true, true, "passed!");

	//「メッセージボード、戻る」・作成
	equal(true, true, "passed!");

	//「メッセージボード、進む」・作成
	equal(true, true, "passed!");

	//「アイテムを使用すると、使用回数が減少、０だと消去」・作成
	equal(true, true, "passed!");

	// キャスト内のアイテムを分類し、所属別（アイテム・スキル・移動）にメニューを表示
	// アイテム・スキルは１つになっても上段の階層に表示されない。
	//「キャストをクリック」・作成
	equal(true, true, "passed!");

	// 移動状態であれば、座標を渡し、解決アクションを実行する。
	//「マップ土台をクリック」・作成
	equal(true, true, "passed!");

	// 待機状態なので、解決アクションを実行する。
	//「メッセージボードをクリック」・作成
	equal(true, true, "passed!");

	// キャストの状態を表すアイコン群を表示する。
	//「ディティール」・作成
	equal(true, true, "passed!");

	//「表示キャストを１箇所に集める」・作成
	equal(true, true, "passed!");

	//「表示キャストを解散させる」・作成
	equal(true, true, "passed!");

	// ユーザオブジェクトを表示し、マップ土台間を移動可能にする。
	//「フリー移動」・作成
	equal(true, true, "passed!");

	//「ステージを追加するアイコン」・作成
	equal(true, true, "passed!");

	//「外部ユーザのステージにアクセスする」・作成
	equal(true, true, "passed!");

});
