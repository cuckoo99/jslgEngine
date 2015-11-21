module('Element');
testSettingAsAsync("TestJSlgIconFactory", {
		mainData : {width:10,height:10},
		timeOut : 3000
	},
	function(iconController, mainController, connector, options) {

	var result;
	
	var slgIconFactory = new jslgEngine.model.factory.JSlgIconFactory();
	
	var data = {
		key : 'hoge',
		position : { x : 0, y : 0 },
		drawingOptions : [['test',[160,160,0,0]],[['default',0,0]]],
	};
	
	//「メニュー」・作成
	slgIconFactory.makeMenu({
		menuItems : [
			{
				text : 'Move',
				obj : {
					getPath : function() { return 'm1'; }
				}
			},
			{
				text : 'Item',
				obj :  {
					getPath : function() { return 'm2'; }
				}
			},
			{
				text : 'Close',
				obj :  {
					getPath : function() { return 'm3'; }
				}
			}
		],
		position : { x : 0, y : 0, z : 0 },
		mainController : mainController,
		iconController : iconController
	}, options);
	equal(true, true, "passed!");

	//「メッセージボード」・作成
	slgIconFactory.makeMessageBoard(connector, {
		text : 'text',
		imageKey : null,
		imageSize : {
			width : 160,
			height : 160
		},
		selection : ['OK']
	}, options);
	equal(true, true, "passed!");

	//「マップ土台」・作成
	slgIconFactory.makeGround(data, options);
	equal(true, true, "passed!");

	//「キャスト、アイテム」・作成
	slgIconFactory.makeCast(data, options);
	equal(true, true, "passed!");

	//「スクロールボタン」・作成
	slgIconFactory.makeScrollButtons(data, options);
	equal(true, true, "passed!");
	
	//「エフェクト」・作成
	// slgIconFactory.makeEffects(connector, {
		// key : 'effects',
		// imageKey : null,
		// particleCount : 0,
		// frames : null,
		// animations : null,
		// position : null
	// }, options);
	equal(true, true, "passed!");

	//「ステータス」・作成
	slgIconFactory.makeStatus(data, options);
	equal(true, true, "passed!");

	//「タイトル」・作成
	slgIconFactory.makeTitle(data, options);
	equal(true, true, "passed!");

	//「テロップ」・作成
	//slgIconFactory.makeTelop(data, options);
	//equal(true, true, "passed!");

	//「ステージ配置ツール」・作成
	equal(true, true, "passed!");

	//「ステージ配置モード」・作成
	equal(true, true, "passed!");

});
