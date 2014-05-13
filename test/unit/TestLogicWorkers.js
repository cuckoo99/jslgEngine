module('Element');
// 非同期の範囲取得テスト
testSettingAsAsync("TestLogicWorkers", {
		mainData : {width:10,height:10}
	},
	function(iconController, mainController, connector, options) {

	var result;
	var effectsMap = [];
	var elements;
	var region = mainController.getWorldRegion();
	var locationSeparator = '_';
	
	//対象要素はマップ土台
	region.findElements(connector, {
		className : 'Ground'
	}, options);
	connector.connects(function(connector_s, result_s) {
		elements = result_s;
		
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
	});
	
	function fire(list, options_s) {
		var worker = new Worker(jslgEngine.config.logicWorkerURL);
		var opts = options_s||{};
		var info = list.pop();
		var isRoute = opts.isRoute;
		
		// worker.onmessage = function(e) {
			// var data = e.data;
// 			
			// var locationKeys = [];
			// for(var i = 0; i < data.length; i++) {
				// for(var j = 0; j < data[i].length; j++) {
					// locationKey = data[i][j].join(locationSeparator);
					// locationKeys.push(locationKey);
				// }
			// }
// 			
			// info.equals({
				// locations : locationKeys
			// });
		// };
		// worker.postMessage(JSON.stringify(info.data));
		
		postMessage = function(result)　{
			var data = result;
			
			var locationKeys = [];
			for(var i = 0; i < data.length; i++) {
				if(isRoute) {
					locationKey = data[i].join(locationSeparator);
					locationKeys.push(locationKey);
					continue;
				}
				
				for(var j = 0; j < data[i].length; j++) {
					locationKey = data[i][j].join(locationSeparator);
					locationKeys.push(locationKey);
				}
			}
			
			info.equals({
				locations : locationKeys
			});
		};

		onmessage({
			data : JSON.stringify(info.data)
		});
	}
	
	var requests = [];
	testAsAsync('移動力２の範囲非同期取得', connector, function(name, connector_s) {
		requests.push({
			data : {
				type : 'Area',
		    	location : {x : 0, y : 0, z : 0},
		    	quantity : 2,
		    	positions : [{x : 0, y : 0, z : 0}],
		    	theta : 0,
		    	phi : 0,
		    	maskLength : 0,
		    	effectsMap : effectsMap
			},
			equals : function(obj) {
				var locationText = obj.locations.join(',');
				var expected = ['0_0_0','1_0_0','0_1_0','2_0_0','1_1_0','0_2_0'].join(',');

				equal(locationText, expected, name);
				connector_s.resolve();
			},
		});
		
		fire(requests);
	});

	testAsAsync('移動力１の範囲非同期取得', connector, function(name, connector_s) {
		requests.push({
			data : {
				type : 'Area',
		    	location : {x : 0, y : 0, z : 0},
		    	quantity : 1,
		    	positions : [{x : 0, y : 0, z : 0}],
		    	theta : 0,
		    	phi : 0,
		    	maskLength : 0,
		    	effectsMap : effectsMap
			},
			equals : function(obj) {
				var locationText = obj.locations.join(',');
				var expected = ['0_0_0','1_0_0','0_1_0'].join(',');

				equal(locationText, expected, name);
				connector_s.resolve();
			},
		});
		
		fire(requests);
	});
	
	testAsAsync('移動力３の経路非同期取得', connector, function(name, connector_s) {
		requests.push({
			data : {
				type : 'Route',
		    	from : {x : 0, y : 0, z : 0},
		    	to : {x : 2, y : 1, z : 0},
		    	effectsMap : effectsMap
			},
			equals : function(obj) {
				var locationText = obj.locations.join(',');
				var expected = ['0_0_0','1_0_0','1_1_0','2_1_0'].reverse().join(',');

				equal(locationText, expected, name);
				connector_s.resolve();
			},
		});
		
		fire(requests, {
			isRoute : true
		});
	});
	
	//TODO: 地形の影響を受けた場合
	//TODO: 高低差がある場合

});