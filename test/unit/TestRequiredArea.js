module('Mind');
testSettingAsAsync("TestRequiredArea", {
		mainData : {width:10,height:10},
		timeOut : 2000
	},
	function(iconController, mainController, connector, options) {
	var issueSet = [];
	//var webWorkersDir = '../src/';
	
	var result;

	// test has to check only if model behavior is correctly worked.
	// in this test case, it doesn't need to actual area value,
	// it works on Logic Workers.
	
	var requiredArea = new jslgEngine.model.issue.RequiredArea({
		offset : { x : 0, y : 1, z : 2 },
		areaSettings : [{
			isMulti : false,
			quantity : 2,
			length : 2,
			maskLength : 0,
			degrees : {
				Theta : 0,
				Phi : 0
			},
			postitions : [{ x : 0, y : 0, z : 0}]
		}, {
			isMulti : false,
			quantity : 1,
			length : 1,
			maskLength : 0,
			degrees : {
				Theta : 0,
				Phi : 0
			},
			postitions : [{ x : 1, y : 1, z : 0}]
		}]
	});
	requiredArea.elementClassNames = ['Ground'];
	
	connects(connector, function(connector_s) {
		requiredArea.apply(connector_s.resolve(), { x : 2, y : 3, z : 0 }, {}, {
			mainController : mainController
		});
	});
	testAsSync('適用', connector, function(name, connector_s) {
		//equal(requiredArea.getLocations().length, 13, name);
		jslgEngine.log(requiredArea.toStringArea(10,10));
	});
	testAsSync('次の座標へ', connector, function(name, connector_s) {
		requiredArea.next();
		equal(requiredArea._currentIndex, 1, name);
	});
	testAsSync('前の座標へ', connector, function(name, connector_s) {
		requiredArea.back();
		equal(requiredArea._issueDataSets.length, 1, name);
		
	});
	testAsSync('ループさせて適用座標を引数にし、コールバック実行', connector, function(name, connector_s) {
		equal(true, true, name);
	});
	connects(connector, function(connector_s) {
		requiredArea.apply(connector_s.resolve(), { x : 3, y : 2, z : 0 }, {}, {
			mainController : mainController
		});
	});
	testAsSync('適用', connector, function(name, connector_s) {
		jslgEngine.log(requiredArea.toStringArea(10,10));
		
		requiredArea.next();
		//equal(requiredArea.getLocationsAll().length, 13, name);
	});
	testAsSync('適用', connector, function(name, connector_s) {
		requiredArea.apply(connector_s, { x : 4, y : 3, z : 0 }, {}, {
			mainController : mainController
		});
	});
	testAsSync('適用', connector, function(name, connector_s) {
		//equal(requiredArea.getLocationsAll().length, 18, name);
		
		jslgEngine.log(requiredArea.toStringArea(10,10));
		
		//データの取得
		var data = requiredArea.getLastDataSet();
		
		requiredArea.next();
	});
	testAsSync('適用', connector, function(name, connector_s) {
		requiredArea.apply(connector_s, { x : 4, y : 4, z : 0 }, {}, 
			{
			mainController : mainController
			});
	});
	testAsSync('適用', connector, function() {
		//解決したか確認
		var result = requiredArea.wasResolved();
		//equal(result, true, name);
	});
	testAsSync('適用', connector, function(name, connector_s) {
		requiredArea = new jslgEngine.model.issue.RequiredArea({
			offset : { x : 0, y : 1, z : 2 },
			areaSettings : [{
				isMulti : false,
				quantity : 1,
				length : 1,
				maskLength : 0,
				degrees : {
					Theta : 0,
					Phi : 0
				},
				postitions : [{ x : 0, y : 0, z : 0}]
			}, {
				isMulti : false,
				quantity : 1,
				length : 1,
				maskLength : 0,
				degrees : {
					Theta : 90,
					Phi : 0
				},
				postitions : [{ x : 1, y : 1, z : 0},{ x : 2, y : 1, z : 0}]
			}]
		});
		
		requiredArea.apply(connector_s, { x : 3, y : 3, z : 0 }, {}, 
			{
			mainController : mainController
			});
	});
	testAsSync('適用', connector, function(name, connector_s) {
		jslgEngine.log(requiredArea.toStringArea(10,10));
		requiredArea.next();
		
		requiredArea.elementClassNames = [];
		// requiredArea.getPatterns(connector_s, 0, {\
		// 				positiveLocations : [{x:3,y:4,z:0}],\
		// 				negativeLocations : [],\
		// 				getAll : false,\
		// 				limit : 0,\
		// 				numberOfResult : 1,\
		// 				result : issueSet\
		// 			}, {\
		// 				mainController : mainController\
		// 			});\
	});
	testAsSync('適用', connector, function(name, connector_s) {
		var bestIssueSet = issueSet.pop();
		
		jslgEngine.log(requiredArea.toStringArea(10,10));
	});
});
