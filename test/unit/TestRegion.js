module('Element');
testSettingAsAsync("TestRegion", {
		mainData : {width:10,height:10}
	},
	function(iconController, mainController, connector, options) {
	var result;
	var worldRegion, localRegion;
	var stageFrame, groundFrame, castFrame, itemFrame;
	var stage, ground, cast, item;

	var eSeparator = jslgEngine.config.elementSeparator;
	var lSeparator = jslgEngine.config.locationSeparator;

	//TODO: サンプルを作成しない。
	
	//要素検索オブジェクトの取得
	var toFind = function(key, type) {
		return {
			type : type,
			data : {
				key : key
			}
		};
	};
	
	var findElements = function(connector_s, data_s, callback) {
		var target = data_s.target||mainController;
		target.findElements(connector_s, {
			key : data_s.elementPath,
			obj : data_s.obj
		}, options);
		connector_s.connects(function(connector_ss, result_ss) {
			var element = result_ss;
			callback(element);
		});
	};
	
	testAsSync('ワールド空間作成・ローカル空間作成', connector, function(name, connector_s) {
		worldRegion = mainController.getWorldRegion();
		worldRegion.setKey('w1');
		localRegion = new jslgEngine.model.area.LocalRegion();
		localRegion.setKey('r1');
		worldRegion.addChild({
			obj : localRegion
		}, options);
	});
	testAsSync('フレーム作成', connector, function(name, connector_s) {
		stageFrame = new jslgEngine.model.stage.StageFrame();
		stageFrame.setKey('stage_f');
		groundFrame = new jslgEngine.model.stage.GroundFrame();
		groundFrame.setKey('ground_f');
		castFrame = new jslgEngine.model.stage.CastFrame();
		castFrame.setKey('cast_f');
		itemFrame = new jslgEngine.model.stage.ItemFrame();
		itemFrame.setKey('item_f');

		stageFrame.setStatus('width', 10);
		stageFrame.setStatus('height', 20);
		stageFrame.setStatus('depth', 30);
	
		groundFrame.setStatus('type', 'pond');
		groundFrame.setStatus('effect', 2);
	
		castFrame.setStatus('type', 'human');
		castFrame.setStatus('effect', 3);
	
		itemFrame.setStatus('type', 'weapon');
		itemFrame.setStatus('effect', 4);

		//追加・削除・更新・取得
		localRegion.addChild({
			obj : stageFrame
		}, options);
		localRegion.addChild({
			obj : groundFrame
		}, options);
		localRegion.addChild({
			obj : castFrame
		}, options);
		localRegion.addChild({
			obj : itemFrame
		}, options);
	});
	testAsSync('ステージ作成', connector, function(name, connector_s) {
		stage = stageFrame.generate({
			key : 's1',
			location : new jslgEngine.model.area.Location({
				x : 1,
				y : 1,
				z : 0
			}),
			size : new jslgEngine.model.area.Size({
				width : 1,
				height : 1,
				depth : 1
			})
		}, options);
		localRegion.addChild({
			obj : stage
		}, options);
		equal(stage.getStatus('width').value, 10, name);
	});
	testAsSync('マップ土台作成', connector, function(name, connector_s) {
		stage.addChild({
			obj : groundFrame.generate({
				key : 'g1',
				location : new jslgEngine.model.area.Location({
					x : 2,
					y : 2,
					z : 1
				})
			}, options)
		}, options);
		ground = stage.getChild({
			key : 'g1'
		});
		equal(ground.getStatus('type').value, 'pond', name);
	});
	testAsSync('キャスト作成', connector, function(name, connector_s) {
		ground.addChild({
			obj : castFrame.generate({
				key : 'c1'
			}, options)
		}, options);
		cast = ground.getChild({
			key : 'c1'
		});
		equal(cast.getStatus('type').value, 'human', name);
	});
	testAsSync('アイテム作成', connector, function(name, connector_s) {
		cast.addChild({
			obj : itemFrame.generate({
				key : 'i1'
			}, options)
		}, options);
		item = cast.getChild({
			key : 'i1'
		});
		equal(item.getStatus('type').value, 'weapon', name);
	});
	testAsSync('座標によるオブジェクト検索', connector, function(name, connector_s) {
		stage = null;
		stage = localRegion.getChild({
			key : ['1', '1', '0'].join(lSeparator)
		});
		equal( stage instanceof jslgEngine.model.stage.Stage, true, name);
	});
	testAsSync('ステージ取得', connector, function(name, connector_s) {
		stage = null;
		stage = localRegion.getChild({
			key : 's1'
		});
		equal( stage instanceof jslgEngine.model.stage.Stage, true, name);
	});
	testAsSync('オブジェクトを取り外した時、オフセットが補正される。', connector, function(name, connector_s) {
		stage.removeChild({
			obj : ground
		}, options);
	
		result = (cast.offset.x === 2 && cast.offset.y === 2 && cast.offset.z === 1);
		equal(result, true, name);
	});
	testAsSync('オブジェクトを再設定した時、オフセットが補正される。', connector, function(name, connector_s) {
		stage.addChild({
			key : 'g2',
			obj : ground
		}, options);
	
		result = (cast.offset.x === 3 && cast.offset.y === 3 && cast.offset.z === 1);
		equal(result, true, name);
	});
	testAsSync('座標による取得。', connector, function(name, connector_s) {
		findElements(connector_s, {
			target : localRegion,
			elementPath : 'r1' + eSeparator + ['3', '3', '1'].join(lSeparator)
		}, function(result_s) {
			equal(result_s[0] instanceof jslgEngine.model.stage.Ground, false, name);
		});
	});
	testAsSync('座標による取得２。', connector, function(name, connector_s) {
		findElements(connector_s, {
			target : localRegion,
			elementPath : 'r1' + eSeparator + ['1', '1', '0'].join(lSeparator)
		}, function(result_s) {
			equal(result_s[0] instanceof jslgEngine.model.stage.Stage, true, name);
		});
	});
	testAsSync('階層の深い取得。', connector, function(name, connector_s) {
		findElements(connector_s, {
			target : localRegion,
			elementPath : ['r1', 's1', 'g1', 'c1', 'i1'].join(eSeparator)
		}, function(result_s) {
			equal(result_s[0] instanceof jslgEngine.model.stage.Item, true, name);
		});
	});
	testAsSync('取得。', connector, function(name, connector_s) {
		findElements(connector_s, {
			target : localRegion,
			elementPath : ['r1', ['1', '1', '0'].join(lSeparator), ['3', '3', '1'].join(lSeparator)].join(eSeparator)
		}, function(result_s) {
			equal(result_s[0] instanceof jslgEngine.model.stage.Ground, true, name);
		});
	});
	testAsSync('取得２。', connector, function(name, connector_s) {
		findElements(connector_s, {
			target : localRegion,
			elementPath : ['r1', ['1', '1', '0'].join(lSeparator), ['3', '3', '1'].join(lSeparator)].join(eSeparator)
		}, function(result_s) {
			equal(result_s[0] instanceof jslgEngine.model.stage.Ground, true, name);
		});
	});
	testAsSync('取得３。', connector, function(name, connector_s) {
		findElements(connector_s, {
			elementPath : ['w1', 'r1', 's1', 'g1'].join(eSeparator)
		}, function(result_s) {
			equal(result_s[0] instanceof jslgEngine.model.stage.Ground, true, name);
		});
	});
	testAsSync('親要素の取得', connector, function(name, connector_s) {
		//TODO: 限定要素絞込みをparent取得に変更すべき。
		findElements(connector_s, {
			obj : [toFind('w1'), toFind('r1'), toFind('s1'), toFind(null, 'parent'), toFind('s1')]
		}, function(result_s) {
			equal(result_s[0] instanceof jslgEngine.model.stage.Stage, true, name);
		});
	});
	testAsSync('親要素の取得２', connector, function(name, connector_s) {
		findElements(connector_s, {
			obj : [toFind('w1'), toFind('r1'), toFind('s1'), toFind(null, 'parent'), toFind(['1', '1', '0'].join(lSeparator)), toFind(['3', '3', '1'].join(lSeparator))]
		}, function(result_s) {
			equal(result_s[0] instanceof jslgEngine.model.stage.Ground, true, name);
		});
	});
	testAsSync('親要素の取得３', connector, function(name, connector_s) {
		findElements(connector_s, {
			//target : localRegion,
			elementPath : 'w1.r1.s1.parent().1_1_0.3_3_1'
			//obj : [toFind('r1'), toFind('s1'), toFind(null, 'parent'), toFind(['1', '1', '0'].join(lSeparator)), toFind(['3', '3', '1'].join(lSeparator))]
		}, function(result_s) {
			equal(result_s[0] instanceof jslgEngine.model.stage.Ground, true, name);
		});
	});
	var v,vv,wKey,vKey,vvKey;
	testAsSync('変数のテスト', connector, function(name, connector_s) {
		//変数のテスト
		v = new jslgEngine.model.common.JSlgElementVariable({
			key : '$in'
		});
		vv = new jslgEngine.model.common.JSlgElementVariable({
			key : '$obj',
			isArray : true
		});
		vv.addChild({
			obj : v
		}, options);
		worldRegion.addChild({
			obj : vv
		}, options);
		wKey = worldRegion.getKey();
		vKey = v.getKey();
		vvKey = vv.getKey();
	});
	testAsSync('変数のテスト２', connector, function(name, connector_s) {
		findElements(connector_s, {
			elementPath : [wKey,vvKey,vKey].join(jslgEngine.config.elementSeparator)
		}, function(result_s) {
			equal(result_s[0].getPath(), [wKey,vvKey,vKey].join(jslgEngine.config.elementSeparator), name);
	
			v.addChild({
				obj : localRegion
			}, options);
		});
	});
	testAsSync('変数のテスト３', connector, function(name, connector_s) {
		findElements(connector_s, {
			elementPath : [wKey,vvKey,vKey].join(jslgEngine.config.elementSeparator)
		}, function(result_s) {
			equal(result_s[0].getPath(), [wKey,vvKey,vKey].join(jslgEngine.config.elementSeparator), name);
		});
	});
	testAsSync('変数のテスト４', connector, function(name, connector_s) {
		findElements(connector_s, {
			elementPath : [wKey,vvKey].join(jslgEngine.config.elementSeparator)
		}, function(result_s) {
			equal(result_s[0].getPath(), [wKey,vvKey].join(jslgEngine.config.elementSeparator), name);
		});
	});
	testAsSync('変数のテスト。循環参照を防ぐ', connector, function(name, connector_s) {
		var result = vv.addChild({
			obj : worldRegion
		}, options);
		equal(result, false, name);
		var result = item.addChild({
			obj : cast
		}, options);
		equal(result, false, name);
	});

	jslgEngine.log('End TestRegion -------------------------------');
}); 

