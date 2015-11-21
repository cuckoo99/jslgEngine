module('Command');


//アクションの単体テスト
testSettingAsSync("TestAction", {
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

	//console.log(Object.keys(jslgEngine.model.command.CommandBlockBase.prototype));
	//jslgEngine.model.command.CommandBlockBase.prototype._readAllElements = jslgEngine.stub.CommandBlockBase.prototype._readAllElements;
	rewriteNamespace('1', jslgEngine.model.command.CommandBlockBase, jslgEngine.stub.CommandBlockBase);

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
		var actionData = { parameters : ['w1.r1.0_0_0.0_0_0', '"cx1"', 'w1.r1.rc1'] };
		var action = new jslgEngine.model.action.ActionAdd(actionData);
		var at = new jslgEngine.model.stage.Ground({
			key : 'hoge'
		}, options);
		var key = new jslgEngine.model.common.JSlgElementStatus({
			key : '',
		    	value : 'cx1',
		}, options);
		var cf = new jslgEngine.model.stage.CastFrame({
			key : 'cf1'
		}, options);
		action.objs = [at, key, cf]; // dummy object
		
		testAction(connector_s, action, data, options, function(connector_ss, data_s) {
			var cast = at.getChild({ key : 'cx1' });
			equal(cast.className, 'Cast', [name,textRun].join(textSeparator));
		}, function(connector_ss, data_s) {
			var cast = at.getChild({ key : 'cx1' });
			equal(cast, null, [name,textRestore].join(textSeparator));
		});
	});
	testAsSync('アクション：設定', connector, function(name, connector_s) {
		var actionData = {parameters : ['w1.r1.0_0_0.0_0_0', '"testKey"', '"testValue"']};
		var action = new jslgEngine.model.action.ActionSet(actionData);
		var at = new jslgEngine.model.stage.Ground({
			key : 'hoge'
		});
		var key = new jslgEngine.model.common.JSlgElementStatus({
			key : '',
		    	value : 'testKey',
		});
		var val = new jslgEngine.model.common.JSlgElementStatus({
			key : '',
		    	value : 'testValue',
		});
		action.objs = [at, key, val]; // dummy object
		
		testAction(connector_s, action, data, options, function(connector_ss, data_s) {
			var stt = at.getStatus('testKey');
			equal(stt.value, 'testValue', [name,textRun].join(textSeparator));
		}, function(connector_ss, data_s) {
			var stt = at.getStatus('testKey');
			equal(stt.value, null, [name,textRestore].join(textSeparator));
		});
	});
	testAsSync('アクション：削除', connector, function(name, connector_s) {
		var actionData = {parameters : ['w1.r1.0_0_0.0_0_0', '"cx1"', 'w1.r1.rc1']};
		var action = new jslgEngine.model.action.ActionRemove(actionData);
		var at = new jslgEngine.model.stage.Ground({
			key : 'hoge'
		}, options);
		var ch = new jslgEngine.model.stage.CastFrame({
			key : 'cf1'
		}, options);
		at.addChild({
			obj : ch
		}, options);
		action.objs = [ch]; // dummy object
		
		testAction(connector_s, action, data, options, function(connector_ss, data_s) {
			var child = at.getChild({
				key : 'cf1'
			});
			equal(child, null, [name,textRun].join(textSeparator));
		}, function(connector_ss, data_s) {
			var child = at.getChild({
				key : 'cf1'
			});
			equal(child === ch, true, [name,textRestore].join(textSeparator));
		});
	});
	testAsSync('アクション：アニメーション', connector, function(name, connector_s) {
		actionData = {parameters : ['w1.r1.0_0_0.0_0_0.c1', '"anm1"']};
		action = new jslgEngine.model.action.ActionAnime(actionData);
		var at = new jslgEngine.model.stage.Ground({
			key : 'c1'
		}, options);
		var stt = new jslgEngine.model.common.JSlgElementStatus({
			key : 'stt',
		    	value : 'anm1'
		}, options);
		action.objs = [at, stt];
		
		connects(connector_s, function(connector_ss) {
			mainController.getController('Image').add({ key : 'human1', url : './images/human_01.gif' });
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
		var actionData = {parameters : [[address1,'c1'].join(elementSeparator), address2]};
		var action = new jslgEngine.model.action.ActionJSlgMove(actionData);
		var elementPath = [address1, 'c1'].join('.');
		var from = new jslgEngine.model.stage.Ground({
			key : 'g1',
			location : {x:0,y:0,z:0},
		}, options);
		var cast = new jslgEngine.model.stage.Cast({
			key : 'c1'
		}, options);
		from.addChild({
			obj : cast
		}, options);
		var to = new jslgEngine.model.stage.Ground({
			key : 'g2',
			location : {x:1,y:0,z:0},
		});
		action.objs = [cast, to];
		
		testAction(connector_s, action, data, options, function(connector_ss, data_s) {
			var child = from.getChild({
				key : 'c1'
			});
			equal(child, null, [name,textRun].join(textSeparator));
			var child = to.getChild({
				key : 'c1'
			});
			equal(child === cast, true, [name,textRun].join(textSeparator));
		}, function(connector_ss, data_s) {
			var child = from.getChild({
				key : 'c1'
			});
			equal(child === cast, true, [name,textRestore].join(textSeparator));
			var child = to.getChild({
				key : 'c1'
			});
			equal(child, null, [name,textRestore].join(textSeparator));
		});
	});
	testAsSync('アクション：範囲要求', connector, function(name, connector_s) {
		var elementSeparator = '.';
		var areaInfo = [null,[0,0,0],[
						 [1,1,2,[[0,3,0]],0,[90,0]],
						 [1,1,0,[[0,1,0],[0,2,0],[0,3,0]],0,[90,0]]
						]];
		var actionData = {parameters : areaInfo};
		var action = new jslgEngine.model.action.ActionRequireArea(actionData);
		action.objs = areaInfo;
		
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
		var parameters = [];
		var actionData = {parameters : parameters};
		var action = new jslgEngine.model.action.ActionUpdate(actionData);
		
		//TODO: 画面更新テスト
		testAction(connector_s, action, data, options, function(data_s) {
			equal(true, true, [name,textRun].join(textSeparator));
		}, function(data_s) {
			equal(true, true, [name,textRestore].join(textSeparator));
		});
	});
	testAsSync('アクション：変数', connector, function(name, connector_s) {
		var parameters = ['"$order"', 10];
		var actionData = {parameters : parameters};
		var action = new jslgEngine.model.action.ActionVariable(actionData);
		var vname = new jslgEngine.model.common.JSlgElementStatus({
			key : 'stt',
		    	value : '$order'
		}, options);
		var vnum = new jslgEngine.model.common.JSlgElementStatus({
			key : 'stt',
		    	value : 10
		});
		action.objs = [vname, vnum];
		
		testAction(connector_s, action, data, options, function(data_s) {
			result = data.localElements['$order'];
			equal(result.value, 10, [name,textRun].join(textSeparator));
		}, function(data_s) {
			result = data.localElements['$order'];
			equal(result, undefined, [name,textRestore].join(textSeparator));
		});
	});
	testAsSync('アクション：入力待機', connector, function(name, connector_s) {
		var parameters = [];
		var actionData = {parameters : parameters};
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
		data.isTest = true;
		var pv = new jslgEngine.model.common.JSlgElementVariable({
			key : '$PENDING',
		    	isArray : true,
		}, options);
		data.localElements[jslgEngine.model.logic.keys.PENDING] = pv; 
		var pc = new jslgEngine.model.issue.PendingCommand({
			key : jslgEngine.model.logic.keys.PEND_OBJ,
		});
		pv.addChild({
			obj : pc
		}, options);
		//TODO: it needs fix to be clear if variable has the child.
		pc.addIssue(new jslgEngine.model.issue.RequiredArea({
			offset : {x:0,y:0,z:0},
			areaSettings : [{ 
					isMulti : 0,
					quantity : 2,
					length : 0,
					positions : {x:0,y:0,z:0},
					maskLength : 0,
					degrees : {
						theta : 0,
						phi : 0
					}
			}],
			elementClassNames : [],
		}));
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
		var parameters = ['w1.func1'];
		var actionData = {parameters : parameters};
		var action = new jslgEngine.model.action.ActionCall(actionData);
		
		var cmd = new jslgEngine.mock.Command({
			key : 'func'
		}, options);
		// var region = options.mainController.getWorldRegion();
		// region.addChild({
		// 	obj : cmd
		// }, options);
		var tgt = new jslgEngine.model.common.JSlgElementStatus({
			key : '',
		    	value : 'w1.func',
		}, options);
		action.objs = [cmd]; // dummy object
		testAction(connector_s, action, data, options, function(connector_ss, data_s) {
			// インスタンスを作成するので、これは別のオブジェクト。
			var result = cmd.wasDone();
			equal(result, true, [name,textRun].join(textSeparator));
		}, function(connector_ss, data_s) {
			var result = cmd.wasDone();
			equal(result, false, [name,textRestore].join(textSeparator));
		});
	});
	testAsSync('アクション：アイコン', connector, function(name, connector_s) {
		var parameters = ['w1.r1', 'testIcon', 'map1',
			[
				[0,0,0],
				1,
				'null',
				[
					[100,100,0,0],
					[['"default"',0,0]]
				]
			]];
		parameters = (function(obj) {
			var result = [];
			if(obj instanceof Array) {
				for(var i = 0, len = obj.length; i < len; i++) {
					result.push(arguments.callee(obj[i]));
				}
			} else {
				result = new jslgEngine.model.common.JSlgElementStatus({
					key : '',
					value : obj,
				}, options);
			}
			return result;
		})(parameters);
		var actionData = {parameters : parameters};
		var action = new jslgEngine.model.action.ActionIcon(actionData);

		var resourceElement = new jslgEngine.model.common.ResourceElement({ key : 'hoge' });
		resourceElement.setStatus('fileType', 'Image');
		resourceElement.setStatus('key', 'map1');
		resourceElement.setStatus('url', './images/anime1.gif');

		mainController.addResourceElements({
			resources : resourceElement
		});
		action.objs = parameters;
		
		testAction(connector_s, action, data, options, function(data_s) {
			var element = iconController.hasKey('testIcon');
			equal(element, true, [name,textRun].join(textSeparator));
		}, function(data_s) {
			var element = iconController.hasKey('testIcon');
			equal(element, false, [name,textRestore].join(textSeparator));
		});
	});
	testAsSync('アクション：Mind', connector, function(name, connector_s) {
		var parameters = ['"enemy"', '"player"'];
		var actionData = {parameters : parameters};
		var action = new jslgEngine.model.action.ActionMind(actionData);
		var me = new jslgEngine.model.common.JSlgElementStatus({
			key : '',
		    	value : '"enemy"',
		}, options);
		var enemy = new jslgEngine.model.common.JSlgElementStatus({
			key : '',
		    	value : '"player"',
		}, options);
		action.objs = [me, enemy];
		
		testAction(connector_s, action, data, options, function(data_s) {
			equal(true, true, [name,textRun].join(textSeparator));
		}, function(data_s) {
			equal(true, true, [name,textRestore].join(textSeparator));
		});
	});
	connector.connects(function(connector_s) {
		restoreNamespace('1', jslgEngine.model.command.CommandBlockBase);
	});
});
