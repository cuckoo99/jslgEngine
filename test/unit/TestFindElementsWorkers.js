module('Element');
// this web workers to get element asynchronously.
testSettingAsAsync("TestFindElementsWorkers", {
		mainData : {width:10,height:10},
	},
	function(iconController, mainController, connector, options) {

	var webWorkersPath = '../src/FindingElementsWorker.js';
	var result;
	var data;
	var region = mainController.getWorldRegion();
	var locationSeparator = '_';
	var findTargets;
	
	var getJSONParameter = function(data)　{
		var elements = region.toSimpleElements({});
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

	var run = function(obj, callback) {
		var worker = new Worker(webWorkersPath);
		worker.postMessage(obj.data);

		worker.onmessage = function(message) {
			callback(message.data);
		}
		worker.onerror = function(event) {
			jslgEngine.log(event.message);
			callback(message.data);
		}
	}
	
	testAsAsync('ID１', connector, function(name, connector_s) {
		var elm = new jslgEngine.model.common.JSlgElement({
			key : 'hogeid'
		}, options);
		
		elm.getKeyData()._uniqueId = 1000;
		region.addChild({
			obj : elm
		}, options);

		run({
			data : getJSONParameter({
				id : 1000,
			})
		}, function(result)　{
			equal(result.length, 1, name);
			//console.log(result);
			for(var i = 0; i < result.length; i++) {
				var element = getElement(region, result[i]);
				equal(element.getKey(), 'hogeid', name);
			}
			connector_s.resolve();
		});
	});
	testAsAsync('パス１', connector, function(name, connector_s) {
		run({
			data : getJSONParameter({
				key : 'w1.r1.s1.g0_0_0'
			})
		}, function(result)　{
			for(var i = 0; i < result.length; i++) {
				var element = getElement(region, result[i]);
				equal(element.getPath(), 'w1.r1.s1.g0_0_0', name);
				connector_s.resolve();
			}
		});
	});
	testAsAsync('パス２', connector, function(name, connector_s) {

		run({
			data : getJSONParameter({
				key : 'w1.r1.s1.g0_0_0'
			})
		}, function(result)　{
			for(var i = 0; i < result.length; i++) {
				var element = getElement(region, result[i]);
				equal(element.getPath(), 'w1.r1.s1.g0_0_0', name);
				connector_s.resolve();
			}
		});
	});
	testAsAsync('座標', connector, function(name, connector_s) {

		run({
			data : getJSONParameter({
				key : 'w1.r1.0_0_0'
			})
		}, function(result)　{
			for(var i = 0; i < result.length; i++) {
				var element = getElement(region, result[i]);
				equal(element.getPath(), 'w1.r1.s1', name);
				connector_s.resolve();
			}
		});
	});
	testAsAsync('親', connector, function(name, connector_s) {

		run({
			data : getJSONParameter({
				key : 'w1.r1.parent()'
			})
		}, function(result)　{
			for(var i = 0; i < result.length; i++) {
				var element = getElement(region, result[i]);
				equal(element.getPath(), 'w1', name);
				connector_s.resolve();
			}
		});
	});
	testAsAsync('親の親', connector, function(name, connector_s) {

		run({
			data : getJSONParameter({
				key : 'w1.r1.s1.parent().parent()'
			})
		}, function(result)　{
			for(var i = 0; i < result.length; i++) {
				var element = getElement(region, result[i]);
				equal(element.getPath(), 'w1', name);
				connector_s.resolve();
			}
		});
	});
	testAsAsync('クラス名', connector, function(name, connector_s) {

		run({
			data : getJSONParameter({
				className : 'Ground'
			})
		}, function(result)　{
			var clear = true;
			for(var i = 0; i < result.length; i++) {
				var element = getElement(region, result[i]);
				clear = element.className === 'Ground' ? clear : false;
			}
			equal(clear, true, name);
			connector_s.resolve();
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
		
		run({
			data : getJSONParameter({
				elements : target,
				className : 'Cast'
			})
		}, function(result)　{
			var clear = true;
			for(var i = 0; i < result.length; i++) {
				var element = getElement(target, result[i]);
				clear = element.className === 'Cast' ? clear : false;
			}
			equal(clear, true, name);
			connector_s.resolve();
		});
	});
	testAsAsync('クラス名3', connector, function(name, connector_s) {
		var target = region;
		

		var obj = region._getObjectToFind({
			key : 'w1.r1.s1.g0_0_0'
		}, options);
		obj.push(region._getObjectToFind({
			className : 'Cast'
		}, options)[0]);
		
		run({
			data : getJSONParameter({
				obj : obj
			})
		}, function(result)　{
			var clear = true;
			for(var i = 0; i < result.length; i++) {
				var element = getElement(target, result[i]);
				clear = element.className === 'Cast' ? clear : false;
			}
			equal(clear, true, name);
			connector_s.resolve();
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
		
		run({
			data : getJSONParameter({
				elements : target,
				key : '$T'
			})
		}, function(result)　{
			for(var i = 0; i < result.length; i++) {
				var element = getElement(target, result[i]);
				equal(element.getKey(), '$T', name);
				connector_s.resolve();
			}
		});
	});
	testAsAsync('変数２', connector, function(name, connector_s) {
		var target = variable;
		
		run({
			data : getJSONParameter({
				elements : target,
				key : '$T.r1'
			})
		}, function(result)　{
			for(var i = 0; i < result.length; i++) {
				var element = getElement(target, result[i]);
				equal(element.getPath(), 'w1.r1', name);
				connector_s.resolve();
			}
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
		
		run({
			data : getJSONParameter({
				elements : target,
				key : 'w1.$Tx'
			})
		}, function(result)　{
			for(var i = 0; i < result.length; i++) {
				var element = getElement(target, result[i]);
				equal(element.getPath(), 'w1.$Tx', name);
				connector_s.resolve();
			}
		});
	});
	testAsAsync('変数４', connector, function(name, connector_s) {
		var target = region;
		
		run({
			data : getJSONParameter({
				elements : target,
				key : 'w1.$Tx.gx'
			})
		}, function(result)　{
			for(var i = 0; i < result.length; i++) {
				var element = getElement(target, result[i]);
				equal(element.className, 'StageFrame', name);
				connector_s.resolve();
			}
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
		
		run({
			data : getJSONParameter({
				elements : target,
				key : 'w1.$Tx2'
			})
		}, function(result)　{
			for(var i = 0; i < result.length; i++) {
				var element = getElement(target, result[i]);
				equal(element.className, 'StageFrame', name);
				connector_s.resolve();
			}
		});
	});
	testAsAsync('変数６', connector, function(name, connector_s) {
		var target = region;
		
		run({
			data : getJSONParameter({
				elements : target,
				key : 'w1.$Tx2.hoge'
			})
		}, function(result)　{
			for(var i = 0; i < result.length; i++) {
				var element = getElement(target, result[i]);
				equal(element.value, 'hoge', name);
				connector_s.resolve();
			}
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
		
		
		run({
			data : getJSONParameter({
				elements : target,
				key : '$T2.obj'
			})
		}, function(result)　{
			for(var i = 0; i < result.length; i++) {
				var element = getElement(target, result[i]);
				equal(element.className, 'LocalRegion', name);
			}
			connector_s.resolve();
		});
	});
	testAsAsync('PendingCommand2', connector, function(name, connector_s) {
		var target = variable2;
		
		run({
			data : getJSONParameter({
				elements : target,
				key : '$T2.obj.s1'
			})
		}, function(result)　{
			for(var i = 0; i < result.length; i++) {
				var element = getElement(target, result[i]);
				equal(element.getPath(), 'w1.r1.s1', name);
			}
			connector_s.resolve();
		});
	});
});
