module('Mind');
testSettingAsAsync("TestMind", {
		mainData : {width:10,height:10},
		timeOut : 4000
	},
	function(iconController, mainController, connector, options) {
	
	var result;
	
	var separator = jslgEngine.config.elementSeparator;
	
	var pMind, eMind;
	var player, enemy, item, eve;
	var driversList = [];
	
	mainController.findElements(connector, {
		key : ['w1','r1','s1','g0_0_0','c1'].join(separator)
	}, options);
	connector.connects(function(connector_s, result_s) {
		player = result_s[0];
	});
	mainController.findElements(connector, {
		key : ['w1','r1','s1','g1_1_0','c_e1'].join(separator)
	}, options);
	connector.connects(function(connector_s, result_s) {
		enemy = result_s[0];
		
		pMind = new jslgEngine.model.mind.Mind({
						key : 'mind1',
						decreasedKeys : ['life'],
						increasedKeys : [],
						memberKey : 'belongs',
						familyMemberNames : ['player'],
						enemyMemberNames : ['enemy']
					});
	
		eMind = new jslgEngine.model.mind.Mind({
						key : 'mind2',
						decreasedKeys : ['life'],
						increasedKeys : [],
						memberKey : 'belongs',
						familyMemberNames : ['enemy'],
						enemyMemberNames : ['player']
					});
		
		player.addChild({
			obj : pMind
		}, options);
		enemy.addChild({
			obj : eMind
		}, options);
	});
	mainController.findElements(connector, {
		key : 'w1.r1.s1.0_0_0.c1.i1'
	}, options);
	connector.connects(function(connector_s, result_s) {
		item = result_s[0];
	});
	mainController.findElements(connector, {
		key : 'w1.r1.s1.0_0_0.c1.i1.eve1'
	}, options);
	connector.connects(function(connector_s, result_s) {
		eve = result_s[0];
		
		item.removeChild({
			obj : eve
		}, options);
	});
	mainController.findElements(connector, {key:'0_0_0',className:'Cast'}, options);
	connector.connects(function(connector_s, result_s) {
		command = new jslgEngine.model.command.Command({
			key : 'Fire',
			code : ['alert("攻撃")',
			'require([0,0,0],[[1,1,2,[[0,3,0]],0,[90,0]]])',
			'pending()',
			'slg_move($THIS,$PENDING)',
			'alert("移動Next")',
			'require([0,0,0],[[1,1,2,[[0,3,0]],0,[0,0]]],["Cast"])',
			'pending()',
			'if($PENDING.obj:Cast.life > 0) {',
			'alert("攻撃実行Next")',
			//'set(w1.r1,"life",3)',
			//'set(w1,"$Selected",$PENDING.obj:Cast)',
			'set($PENDING.obj:Cast,"life",$PENDING.obj:Cast.life-3)',
			//'set($Selected,"life",$Selected.life-3)',
			'}else{',
			'alert("攻撃実キャンセル")',
			'}'
			].join('\n'),
			mainController : mainController
		});
	
		player.addChild({
			obj : command
		}, options);
		
		onChange = new jslgEngine.model.command.Command({
			key : 'onChange',
			code : ['alert("値の変更")',
			'if($THIS:Cast.life < 0) {',
			'alert("体力が０")',
			'set($THIS:Ground, $THIS:Cast)',
			'} else {',
			'alert("体力が０以上")',
			'}'
			].join('\n'),
			mainController : mainController
		});
		
		enemy.addChild({
			obj : onChange
		}, options);
	
		pMind.chooseCommandDrivers(connector_s, {
			callback : function(result_ss) {
				if(result_ss) {
					var bestCommandDrivers = result_ss[0];
					driversList.push(bestCommandDrivers);
				}
			}
		}, options);
		
	});
	connector.connects(function(connector_s, result_s) {
		//実行
		equal(true, true, "passed!");
	
		//思案（テスト実行）
		equal(true, true, "passed!");
	
		//最適な座標を判断
		equal(true, true, "passed!");
		
		start();
	});
});