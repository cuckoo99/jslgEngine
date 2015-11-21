module('Element');
// 非同期の範囲取得テスト
testSettingAsAsync("TestLogicWorkers", {
		mainData : {width:10,height:10},
		//timeOut : 5000,
	},
	function(iconController, mainController, connector, options) {

	var webWorkersPath = '../src/LogicWorker.js';
	var result;
	var effectsMap = [];
	var elements;
	var region = mainController.getWorldRegion();
	var locationSeparator = '_';
	
	var equalLocations = function(test_name, obj, data, expected) {
		var locationKeys = [];
		for(var i = 0; i < data.length; i++) {
			equal(data[i].length, expected[i].length, test_name);
			if(obj.type === 'Route') {
				locationKey = data[i].join(locationSeparator);
				equal(locationKey === expected[i].join(locationSeparator), true, test_name);
				continue;
			}
			
			for(var j = 0; j < data[i].length; j++) {
				//console.log(expected[i][j]);
				locationKey = data[i][j].join(locationSeparator);
				//equal(locationKey === expected[i][j].join(locationSeparator), true, test_name);
			}
		}
	};

	var run = function(test_name, obj, expected, callback) {
		var worker = new Worker(webWorkersPath);
		
		worker.postMessage(JSON.stringify(obj));
		
		worker.onmessage = function(result) {
			equalLocations(test_name, obj, result.data, expected);
			callback();
		}
	}
	
	//対象要素はマップ土台
	var elms = region.findElements(null, {
		className : 'Ground'
	}, options);
	
	var elements = elms;
	
	//サンプルから、各座標の影響度を抽出。
	for(var i = 0; i < elements.length; i++) {
		var element = elements[i];
		var location = element.getGlobalLocation();
		var effect = element.getStatus('effect').value;
		effectsMap.push({
			location : location,
			effect : effect
		});
	}
	
	var requests = [];
	testAsAsync('移動力２の範囲非同期取得', connector, function(name, connector_s) {
		run(name, {
			type : 'Area',
		    	location : {x : 0, y : 0, z : 0},
		    	quantity : 2,
		    	positions : [{x : 0, y : 0, z : 0}],
		    	theta : 0,
		    	phi : 0,
		    	maskLength : 0,
		    	effectsMap : effectsMap
		}, [[[0,0,0],[1,0,0],[1,1,0],[0,1,0],[2,0,0],[0,2,0]]],
		function() {
			connector_s.resolve();
		});
	});
	testAsAsync('移動力１の範囲非同期取得', connector, function(name, connector_s) {
		run(name, {
			type : 'Area',
		    	location : {x : 0, y : 0, z : 0},
		    	quantity : 1,
		    	positions : [{x : 0, y : 0, z : 0}],
		    	theta : 0,
		    	phi : 0,
		    	maskLength : 0,
		    	effectsMap : effectsMap
		}, [[[0,0,0],[1,0,0],[0,1,0]]],
		function() {
			connector_s.resolve();
		});
	});
	
	testAsAsync('移動力３の経路非同期取得', connector, function(name, connector_s) {
		run(name, {
			type : 'Route',
		    	from : {x : 0, y : 0, z : 0},
		    	to : {x : 2, y : 1, z : 0},
		    	effectsMap : effectsMap
		}, [[2,1,0],[1,1,0],[1,0,0],[0,0,0]],
		function() {
			connector_s.resolve();
		});
	});
	
	//TODO: 地形の影響を受けた場合
	//TODO: 高低差がある場合

});
