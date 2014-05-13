module('Element');
// 非同期の範囲取得テスト
testSettingAsAsync("TestFindElementsWorkers", {
		mainData : {width:10,height:10}
		
	},
	function(iconController, mainController, connector, options) {

	var result;
	var data, elements;
	var region = mainController.getWorldRegion();
	var locationSeparator = '_';
	var findTargets;
	
	var elements = region.toSimpleElements({});
	var getJSONParameter = function(data)　{
		var target = data.elements ? data.elements.toSimpleElements({}) : null;
		findTargets = data.obj||region._getObjectToFind(data, options);
		var obj = {
			elements : target||elements,
			findTargets : findTargets
		};
		return JSON.stringify(obj);
	};
	
	var getElement = function(element, obj)　{
		return element.getElementFromSimpleElement({
			obj : obj
		});
	};
	
	testAsAsync('パス１', connector, function(name, connector_s) {
		postMessage = function(result)　{
			for(var i = 0; i < result.length; i++) {
				var element = getElement(region, result[i]);
				equal(element.getPath(), 'w1.r1.s1.g0_0_0', name);
				connector_s.resolve();
			}
		};

		onmessage({
			data : getJSONParameter({
				key : 'w1.r1.s1.g0_0_0'
			})
		});
	});
	testAsAsync('パス２', connector, function(name, connector_s) {
		postMessage = function(result)　{
			for(var i = 0; i < result.length; i++) {
				var element = getElement(region, result[i]);
				equal(element.getPath(), 'w1.r1.s1.g0_0_0', name);
				connector_s.resolve();
			}
		};

		onmessage({
			data : getJSONParameter({
				key : 'w1.r1.s1.g0_0_0'
			})
		});
	});
	testAsAsync('座標', connector, function(name, connector_s) {
		postMessage = function(result)　{
			for(var i = 0; i < result.length; i++) {
				var element = getElement(region, result[i]);
				equal(element.getPath(), 'w1.r1.s1', name);
				connector_s.resolve();
			}
		};

		onmessage({
			data : getJSONParameter({
				key : 'w1.r1.0_0_0'
			})
		});
	});
	testAsAsync('親', connector, function(name, connector_s) {
		postMessage = function(result)　{
			for(var i = 0; i < result.length; i++) {
				var element = getElement(region, result[i]);
				equal(element.getPath(), 'w1', name);
				connector_s.resolve();
			}
		};

		onmessage({
			data : getJSONParameter({
				key : 'w1.r1.parent()'
			})
		});
	});
	testAsAsync('親の親', connector, function(name, connector_s) {
		postMessage = function(result)　{
			for(var i = 0; i < result.length; i++) {
				var element = getElement(region, result[i]);
				equal(element.getPath(), 'w1', name);
				connector_s.resolve();
			}
		};

		onmessage({
			data : getJSONParameter({
				key : 'w1.r1.s1.parent().parent()'
			})
		});
	});
	testAsAsync('クラス名', connector, function(name, connector_s) {
		postMessage = function(result)　{
			var clear = true;
			for(var i = 0; i < result.length; i++) {
				var element = getElement(region, result[i]);
				clear = element.className === 'Ground' ? clear : false;
			}
			equal(clear, true, name);
			connector_s.resolve();
		};

		onmessage({
			data : getJSONParameter({
				className : 'Ground'
			})
		});
	});
	var localRegion = region.getChild({
		key : 'r1'
	});
	var stage = localRegion.getChild({
		key : 's1'
	});
	var ground = stage.getChild({
		key : 'g0_0_0'
	});
	testAsAsync('クラス名2', connector, function(name, connector_s) {
		var target = ground;
		
		postMessage = function(result)　{
			var clear = true;
			for(var i = 0; i < result.length; i++) {
				var element = getElement(target, result[i]);
				clear = element.className === 'Cast' ? clear : false;
			}
			equal(clear, true, name);
			connector_s.resolve();
		};

		onmessage({
			data : getJSONParameter({
				elements : target,
				className : 'Cast'
			})
		});
	});
	testAsAsync('クラス名3', connector, function(name, connector_s) {
		var target = region;
		
		postMessage = function(result)　{
			var clear = true;
			for(var i = 0; i < result.length; i++) {
				var element = getElement(target, result[i]);
				clear = element.className === 'Cast' ? clear : false;
			}
			equal(clear, true, name);
			connector_s.resolve();
		};

		var obj = region._getObjectToFind({
			key : 'w1.r1.s1.g0_0_0'
		}, options);
		obj.push(region._getObjectToFind({
			className : 'Cast'
		}, options)[0]);
		onmessage({
			data : getJSONParameter({
				obj : obj
			})
		});
	});
	var variable = new jslgEngine.model.common.JSlgElementVariable({
		key : '$T',
		isArray : true
	});
	variable.addChild({
		obj : localRegion
	})
	testAsAsync('変数', connector, function(name, connector_s) {
		var target = variable;
		
		postMessage = function(result)　{
			for(var i = 0; i < result.length; i++) {
				var element = getElement(target, result[i]);
				equal(element.getKey(), '$T', name);
				connector_s.resolve();
			}
		};
		
		onmessage({
			data : getJSONParameter({
				elements : target,
				key : '$T'
			})
		});
	});
	testAsAsync('変数２', connector, function(name, connector_s) {
		var target = variable;
		
		postMessage = function(result)　{
			for(var i = 0; i < result.length; i++) {
				var element = getElement(target, result[i]);
				equal(element.getPath(), 'w1.r1', name);
				connector_s.resolve();
			}
		};
		
		onmessage({
			data : getJSONParameter({
				elements : target,
				key : '$T.r1'
			})
		});
	});
	var variableX = new jslgEngine.model.common.JSlgElementVariable({
		key : '$Tx',
		isArray : true
	});
	var sFrame = new jslgEngine.model.stage.StageFrame({
		key : 'gx'
	});
	sFrame.setStatus('hoge', 'hoge');
	variableX.addChild({
		obj : sFrame
	})
	region.addChild({
		obj : sFrame
	})
	region.addChild({
		obj : variableX
	})
	testAsAsync('変数３', connector, function(name, connector_s) {
		var target = region;
		
		postMessage = function(result)　{
			for(var i = 0; i < result.length; i++) {
				var element = getElement(target, result[i]);
				equal(element.getPath(), 'w1.$Tx', name);
				connector_s.resolve();
			}
		};
		
		onmessage({
			data : getJSONParameter({
				elements : target,
				key : 'w1.$Tx'
			})
		});
	});
	testAsAsync('変数４', connector, function(name, connector_s) {
		var target = region;
		
		postMessage = function(result)　{
			for(var i = 0; i < result.length; i++) {
				var element = getElement(target, result[i]);
				equal(element.className, 'StageFrame', name);
				connector_s.resolve();
			}
		};
		
		onmessage({
			data : getJSONParameter({
				elements : target,
				key : 'w1.$Tx.gx'
			})
		});
	});
	var variableX2 = new jslgEngine.model.common.JSlgElementVariable({
		key : '$Tx2',
		isArray : false
	});
	variableX2.addChild({
		obj : sFrame
	})
	region.addChild({
		obj : variableX2
	})
	testAsAsync('変数５', connector, function(name, connector_s) {
		var target = region;
		
		postMessage = function(result)　{
			for(var i = 0; i < result.length; i++) {
				var element = getElement(target, result[i]);
				equal(element.className, 'StageFrame', name);
				connector_s.resolve();
			}
		};
		
		onmessage({
			data : getJSONParameter({
				elements : target,
				key : 'w1.$Tx2'
			})
		});
	});
	testAsAsync('変数６', connector, function(name, connector_s) {
		var target = region;
		
		postMessage = function(result)　{
			for(var i = 0; i < result.length; i++) {
				var element = getElement(target, result[i]);
				equal(element.value, 'hoge', name);
				connector_s.resolve();
			}
		};
		
		onmessage({
			data : getJSONParameter({
				elements : target,
				key : 'w1.$Tx2.hoge'
			})
		});
	});
	var variable2 = new jslgEngine.model.common.JSlgElementVariable({
		key : '$T2',
		isArray : true
	});
	var pending = new jslgEngine.model.issue.PendingCommand({
		key : 'obj'
	})
	// 直列化する要素を指定
	pending.getCurrentIssue = function() {
		return {
			getAppliedElement : function() {
				return localRegion;
			}
		}
	};
	variable2.addChild({
		obj : pending
	})
	testAsAsync('PendingCommand', connector, function(name, connector_s) {
		var target = variable2;
		
		postMessage = function(result)　{
			for(var i = 0; i < result.length; i++) {
				var element = getElement(target, result[i]);
				equal(element.className, 'LocalRegion', name);
			}
			connector_s.resolve();
		};
		
		onmessage({
			data : getJSONParameter({
				elements : target,
				key : '$T2.obj'
			})
		});
	});
	testAsAsync('PendingCommand2', connector, function(name, connector_s) {
		var target = variable2;
		
		postMessage = function(result)　{
			for(var i = 0; i < result.length; i++) {
				var element = getElement(target, result[i]);
				equal(element.getPath(), 'w1.r1.s1', name);
			}
			connector_s.resolve();
		};
		
		onmessage({
			data : getJSONParameter({
				elements : target,
				key : '$T2.obj.s1'
			})
		});
	});
});
