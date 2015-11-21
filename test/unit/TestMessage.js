module('Mind');

test("TestRequiredArea", function() {
	var result;
	
	var mainController = new jslgEngine.stub.MainController({width:8, height:8});
	var iconController = new jslgEngine.stub.IconController();
	
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
	
	//適用
	requiredArea.apply({ x : 2, y : 3, z : 0 }, {}, {
		mainController : mainController
	});
	equal(requiredArea.getLocations().length, 13, "passed!");

	jslgEngine.log(requiredArea.toStringArea(10,10));
	
	//次の座標へ
	requiredArea.next();
	equal(requiredArea._currentIndex, 1, "passed!");

	//前の座標へ
	requiredArea.back();
	equal(requiredArea._areas.length, 1, "passed!");

	//ループさせて適用座標を引数にし、コールバック実行
	equal(true, true, "passed!");

	requiredArea.apply({ x : 3, y : 2, z : 0 }, {}, 
		{
		mainController : mainController
		});
	
	jslgEngine.log(requiredArea.toStringArea(10,10));
	
	requiredArea.next();
	
	equal(requiredArea.getLocationsAll().length, 13, "passed!");
	
	requiredArea.apply({ x : 4, y : 4, z : 0 }, {}, 
		{
		mainController : mainController
		});
	equal(requiredArea.getLocationsAll().length, 18, "passed!");
	
	jslgEngine.log(requiredArea.toStringArea(10,10));
	
	//データの取得
	var data = requiredArea.getLastDataSet();
	
	//解決したか確認
	var result = requiredArea.wasResolved();
	
	equal(result, true, "passed!");

});
