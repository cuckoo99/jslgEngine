module('Element');

test("TestLogic", function() {
	var result;
	
	var width = 10, height = 10;
	var mainController = new jslgEngine.stub.MainController({width:width,height:height});
	var region = mainController.getWorldRegion();
	var options = {
		mainController : mainController
	};
	
	//エリア取得
	equal(true, true, "passed!");

	//A*による経路取得
	equal(true, true, "passed!");

	//指定された形式から範囲を取得：言及
	equal(true, true, "passed!");

	var logic = new jslgEngine.model.logic.Logic();
	
	var toStringArea = jslgEngine.model.issue.RequiredArea.prototype.toStringArea;
	var convert = jslgEngine.model.issue.RequiredArea.prototype._convert;
	
	var loggingArea = function(res) {
		var locations = [];
		for(var i = 0; i < res.length; i++) {
			for(var j = 0; j < res[i].length; j++) {
				var location = res[i][j];
				locations = locations.concat(convert(location));
			}
		}
		jslgEngine.log(toStringArea.apply({
			getLocationsAll : function() { return locations; }
		}, [width,height]));
		return locations;
	};
	
	// logic.calculate
	// logic.setVariable
	
	var data = {
		element : region
	};
	
	//拡散範囲のテスト
	var result = logic.getAreaBySpread({ x : 2, y : 2, z : 0}, 4, data);
	loggingArea([result]);
	result = result.length;
	equal(result, 33, "passed!");
	
	//拡散範囲の実行速度検証
	var start=new Date().getTime();
	var result = logic.getAreaBySpread({ x : 2, y : 2, z : 0}, 8, data);
	loggingArea([result]);
	jslgEngine.log('pending time:' +((new Date().getTime())-start));
	
	//Astarアルゴリズム
	var start=new Date().getTime();
	result = logic.getRouteByAstar({ x : 0, y : 0, z : 0}, { x : 5, y : 3, z : 0}, data);
	loggingArea([result]);
	result = result.length;
	equal(result, 9, "passed!");
	jslgEngine.log('pending time:' +((new Date().getTime())-start));
	
	//パターン範囲の表示
	result = logic.getAreaByPattern({ x : 2, y : 2, z : 0}, [{x:0,y:1,z:0},{x:0,y:2,z:0}],90,0, data);
	//全ての領域を返す
	result = loggingArea(result).length;
	equal(result, 8, "passed!");
	
	// logic.getArea
	// logic.getMinimumCostLocation
	// logic.getTargetOfMap
	// logic.setOpen
	// logic.setIsNotOveredArea
	// logic.setOpenSides
	// logic.getHueristic
	// logic.getRoot
	// logic.getIndexOfArray
	// logic.getIndexOfArray
	// logic.getArrayOfLocation
	// logic.eval
	// logic.getPolandStatement
	// logic.getPolandReplacedOperator
	result = logic.getArrayOfText('[0,[0,3],[2]],2', 0);
	
	equal(result[1], 2, "passed!");
});
