module('Element');

test("TestLocation", function() {
	var result = null;
	var separator = '_';
	var location = new jslgEngine.model.area.Location({
	});
	var separator = location.separator;

	//座標文字列化
	result = location.toString();
	equal(result, null, "passed!");

	location = new jslgEngine.model.area.Location({
		x : 0,
		y : 0,
		z : 0
	});

	result = location.toString();
	equal(result, ['0','0','0'].join(separator), "passed!");


});