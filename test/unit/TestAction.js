module('Command');

//アクションの単体テスト
testSettingAsAsync("TestAction", {
		mainData : {width:10,height:10},
		timeOut : 3000
	},
	function(iconController, mainController, connector, options) {

	var result;
	var action;
	var textRun = 'Run', textRestore = 'Restore', textSeparator = '_';
	var region = mainController.getWorldRegion();
	var slgIconFactory = new jslgEngine.model.factory.JSlgIconFactory();
	var slgCommandFactory = new jslgEngine.model.factory.JSlgCommandFactory();
	var converter = iconController.converter;
	var data = {
		localElements : {},
		resolveFunc : null
	};
	
	//ダミー座標要素
	var emptyGround = new jslgEngine.model.stage.Ground({
		key : 'hoge',
		location : {x:0,y:0,z:0}
	});
	
	//TODO: 副イベントのテスト
	
	var testAction = function(connector_s, action, data_s, options_s, callback, callback_s) {
		connector_s.pipe(function(connector_ss) {
			action.find(connector_ss.resolve(), data_s, options_s);
		}).pipe(function(connector_ss) {
			data.localElements[jslgEngine.model.logic.keys.SELF] = null;
			
			action.run.call(action, connector_ss.resolve(), data_s, options_s);
		}).pipe(function(connector_ss) {
			connector_ss.resolve();
			callback(connector_ss, data_s);
		}).pipe(function(connector_ss) {
			action.restore.call(action, connector_ss.resolve(), data_s, options_s);
		}).pipe(function(connector_ss) {
			connector_ss.resolve();
			callback_s(connector_ss, data_s);
		});
	};
	
	var findElements = function(connector_s, data_s, callback) {
		mainController.findElements(connector_s, {
			key : data_s.elementPath
		}, options);
		connector_s.connects(function(connector_ss, result_ss) {
			var element = result_ss;
			callback(element);
		});
	};
	
	testAsSync('アクション：追加', connector, function(name, connector_s) {
		var address = 'w1.r1.0_0_0.0_0_0';
		var actionData = {arguments : [address, '"cx1"', 'w1.r1.rc1']};
		var action = new jslgEngine.model.action.ActionAdd(actionData);
		var elementPath = [address, 'cx1'].join('.');
		
		testAction(connector_s, action, data, options, function(connector_ss, data_s) {
			findElements(connector_ss, {
				elementPath : elementPath
			}, function(result_s) {
				equal(result_s.length, 1, [name,textRun].join(textSeparator));
			});
		}, function(connector_ss, data_s) {
			findElements(connector_ss, {
				elementPath : elementPath
			}, function(result_s) {
				equal(result_s.length, 0, [name,textRestore].join(textSeparator));
			});
		});
	});
	testAsSync('アクション：設定', connector, function(name, connector_s) {
		var address = 'w1.r1.0_0_0.0_0_0';
		var actionData = {arguments : [address, '"testKey"', '"testValue"']};
		var action = new jslgEngine.model.action.ActionSet(actionData);
		
		testAction(connector_s, action, data, options, function(connector_ss, data_s) {
			findElements(connector_ss, {
				elementPath : address
			}, function(result_s) {
				equal(result_s[0].getStatus('testKey').value, 'testValue', [name,textRun].join(textSeparator));
			});
		}, function(connector_ss, data_s) {
			findElements(connector_ss, {
				elementPath : address
			}, function(result_s) {
				equal(result_s[0].getStatus('testKey').value, null, [name,textRestore].join(textSeparator));
			});
		});
	});
	testAsSync('アクション：削除', connector, function(name, connector_s) {
		var address = 'w1.r1.0_0_0.0_0_0';
		var actionData = {arguments : [address, '"cx1"', 'w1.r1.rc1']};
		var action = new jslgEngine.model.action.ActionRemove(actionData);
		
		testAction(connector_s, action, data, options, function(connector_ss, data_s) {
			findElements(connector_ss, {
				elementPath : address
			}, function(result_s) {
				equal(result_s.length, 0, [name,textRun].join(textSeparator));
			});
		}, function(connector_ss, data_s) {
			findElements(connector_ss, {
				elementPath : address
			}, function(result_s) {
				equal(result_s.length, 1, [name,textRestore].join(textSeparator));
			});
		});
	});
	testAsSync('アクション：アニメーション', connector, function(name, connector_s) {
		var address = 'w1.r1.0_0_0.0_0_0.c1';
		actionData = {arguments : [address, '"anm1"']};
		action = new jslgEngine.model.action.ActionAnime(actionData);
		
		connects(connector_s, function(connector_ss) {
			mainController.getController('Image').add({ key : 'human1', url : './images/human_01.gif' });
			
			connector_ss.resolve();
			mainController.findElements(connector_ss, {
				key : address
			}, options);
		});
		connects(connector_s, function(connector_ss, result_ss) {
			testAction(connector_ss.resolve(), action, data, options, function(data_s) {
				var container = mainController.ticker._getAnimationContainer('c1');
				
				equal(container._children[0].animeKey, 'anm1', [name,textRun].join(textSeparator));
			}, function(data_s) {
				var container = mainController.ticker._getAnimationContainer('c1');
				
				equal(container._children[0].animeKey, 'anm1', [name,textRestore].join(textSeparator));
			});
		});
	});
	testAsSync('アクション：移動', connector, function(name, connector_s) {
		var address1 = 'w1.r1.0_0_0.0_0_0';
		var address2 = 'w1.r1.0_0_0.1_1_0';
		var elementSeparator = '.';
		var actionData = {arguments : [[address1,'c1'].join(elementSeparator), address2]};
		var action = new jslgEngine.model.action.ActionJSlgMove(actionData);
		var elementPath = [address1, 'c1'].join('.');
		
		testAction(connector_s, action, data, options, function(connector_ss, data_s) {
			findElements(connector_ss, {
				elementPath : [address1,'c1'].join(elementSeparator)
			}, function(result_s) {
				equal(result_s.length, 0, [name,textRun].join(textSeparator));
			});
		}, function(connector_ss, data_s) {
			findElements(connector_ss, {
				elementPath : [address1,'c1'].join(elementSeparator)
			}, function(result_s) {
				equal(result_s.length, 1, [name,textRun].join(textSeparator));
			});
		});
	});
	testAsSync('アクション：範囲要求', connector, function(name, connector_s) {
		var address1 = 'w1.r1.0_0_0.0_0_0';
		var address2 = 'w1.r1.0_0_0.1_1_0';
		var elementSeparator = '.';
		var arguments = [null,[0,0,0],[
						 [1,1,2,[[0,3,0]],0,[90,0]],
						 [1,1,0,[[0,1,0],[0,2,0],[0,3,0]],0,[90,0]]
						]];
		var actionData = {arguments : arguments};
		var action = new jslgEngine.model.action.ActionRequireArea(actionData);
		
		testAction(connector_s, action, data, options, function(data_s) {
			var element = data.localElements[jslgEngine.model.logic.keys.PENDING];
			element = element ? element.getChild({ key : 'obj' }) : element; 
			
			var result = element?element.getCurrentIssue() instanceof jslgEngine.model.issue.RequiredArea : null;

			equal(result, true, [name,textRun].join(textSeparator));
		}, function(data_s) {
			var element = data.localElements[jslgEngine.model.logic.keys.PENDING];
			element = element ? element.getChild({ key : 'obj' }) : element; 
			
			var result = element?element.getCurrentIssue() instanceof jslgEngine.model.issue.RequiredArea : null;

			equal(result, true, [name,textRestore].join(textSeparator));
		});
	});
	testAsSync('アクション：画面更新', connector, function(name, connector_s) {
		var arguments = [];
		var actionData = {arguments : arguments};
		var action = new jslgEngine.model.action.ActionUpdate(actionData);
		
		//TODO: 画面更新テスト
		testAction(connector_s, action, data, options, function(data_s) {
			equal(true, true, [name,textRun].join(textSeparator));
		}, function(data_s) {
			equal(true, true, [name,textRestore].join(textSeparator));
		});
	});
	testAsSync('アクション：変数', connector, function(name, connector_s) {
		var arguments = ['"$order"', 10];
		var actionData = {arguments : arguments};
		var action = new jslgEngine.model.action.ActionVariable(actionData);
		
		testAction(connector_s, action, data, options, function(data_s) {
			result = data.localElements['$order'];
			equal(result.value, 10, [name,textRun].join(textSeparator));
		}, function(data_s) {
			result = data.localElements['$order'];
			equal(result, undefined, [name,textRestore].join(textSeparator));
		});
	});
	testAsSync('アクション：入力待機', connector, function(name, connector_s) {
		var arguments = [];
		var actionData = {arguments : arguments};
		var action = new jslgEngine.model.action.ActionPending(actionData);
		//RequiredAreaのdataを引き継ぐ
		data.resolveFunc = function(connector_ss, pending, data, options) {
			pending.resolve(connector_ss, emptyGround, {}, options);
			connector_ss.pipe(function(connector_sss) {
				pending.resolve(connector_sss.resolve(), emptyGround, {}, options);
			}).pipe(function(connector_sss) {
				pending.resolve(connector_sss.resolve(), emptyGround, {}, options);
			}).pipe(function(connector_sss) {
				connector_sss.resolve([]);
			});
		};
		testAction(connector_s, action, data, options, function(data_s) {
			result = data.localElements['$PENDING'].getChild({
				key : 'obj'
			}).wasResolved();
			equal(result, true, [name,textRun].join(textSeparator));
		}, function(data_s) {
			equal(true, true, [name,textRestore].join(textSeparator));
		});
	});
	testAsSync('アクション：呼び出し', connector, function(name, connector_s) {
		var arguments = ['w1.func1'];
		var actionData = {arguments : arguments};
		var action = new jslgEngine.model.action.ActionCall(actionData);
		
		var testCommand;
		converter.getFromTextOfXml(connector_s, slgCommandFactory.getCommandTemplate({
			key : 'func1',
			children : [
				slgCommandFactory.getActionTemplate({
					className : 'ActionAdd',
					arguments : ['w1.r1.0_0_0.0_0_0', '"byfunc1"', 'w1.r1.rc1']
				})
			]
		}), {
			mainController : mainController
		});
		connector_s.connects(function(connector_ss, result_ss) {
			var testCommand = result_ss;
			
			region.addChild({
				obj : testCommand
			}, options);
		});
		testAction(connector_s, action, data, options, function(connector_ss, data_s) {
			findElements(connector_ss, {
				elementPath : 'w1.r1.0_0_0.0_0_0.byfunc1'
			}, function(result_s) {
				equal(result_s.length, 1, [name,textRun].join(textSeparator));
			});
		}, function(connector_ss, data_s) {
			findElements(connector_ss, {
				elementPath : 'w1.r1.0_0_0.0_0_0.byfunc1'
			}, function(result_s) {
				equal(result_s.length, 0, [name,textRestore].join(textSeparator));
			});
		});
	});
	testAsSync('アクション：アイコン', connector, function(name, connector_s) {
		var arguments = ['w1.r1', '"testIcon"', '"map1"',
			[
				[0,0,0],
				1,
				'null',
				[
					[100,100,0,0],
					[['"default"',0,0]]
				]
			]];
		var actionData = {arguments : arguments};
		var action = new jslgEngine.model.action.ActionIcon(actionData);
		
        var resourceElement = new jslgEngine.model.common.ResourceElement({ key : 'hoge' });
        resourceElement.setStatus('fileType', 'Image');
        resourceElement.setStatus('key', 'map1');
        resourceElement.setStatus('url', './images/anime1.gif');
        
		mainController.addResourceElements({
			resources : resourceElement
		});
		
		testAction(connector_s, action, data, options, function(data_s) {
			var element = iconController.hasKey('testIcon');
			equal(element, true, [name,textRun].join(textSeparator));
		}, function(data_s) {
			var element = iconController.hasKey('testIcon');
			equal(element, false, [name,textRestore].join(textSeparator));
		});
	});
	testAsSync('アクション：Mind', connector, function(name, connector_s) {
		var arguments = ['"enemy"', '"player"'];
		var actionData = {arguments : arguments};
		var action = new jslgEngine.model.action.ActionMind(actionData);
		
		testAction(connector_s, action, data, options, function(data_s) {
			equal(true, true, [name,textRun].join(textSeparator));
		}, function(data_s) {
			equal(true, true, [name,textRestore].join(textSeparator));
		});
	});
});