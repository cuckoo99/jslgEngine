module('Element');

testSettingAsSync("TestConverter", {
		mainData : {width:10,height:10}
	},
	function(iconController, mainController, connector, options) {
	var result;

	var converter = new jslgEngine.model.logic.Converter();

	var parser = new DOMParser();
	var xmlDoc = parser.parseFromString(jslgEngine.sampleXml.replace(/>[ |\t|\r|\n]*</g, "><"),
			"text/xml");
	var json = jslgEngine.sampleJson;

	converter.map({
		data : xmlDoc,
		mainController : mainController
	});
	
	testAsSync('XMLから要素を取得', connector, function(name, connector_s) {
		mainController.findElements(connector_s, {
			key : 'w1.r1.s1'
		}, options);
		connector_s.connects(function(connector_ss, result_s) {
			result = result_s[0];
			equal(result instanceof jslgEngine.model.stage.Stage, true, "passed!");
		});
	});
	testAsSync('XMLから要素を取得2', connector, function(name, connector_s) {
		mainController.findElements(connector_s, {
			key : 'w1.r1.s1.g1.c1.i1.e1'
		}, options);
		connector_s.connects(function(connector_ss, result_s) {
			result = result_s[0];
			equal(result instanceof jslgEngine.model.command.Command, true, "passed!");
		});
	});
	testAsSync('JSONから要素を取得', connector, function(name, connector_s) {
		mainController.getWorldRegion()._children = [];
	
		converter.map({
			data : json,
			mainController : mainController
		});
	
		mainController.findElements(connector_s, {
			key : 'w1.r1.s1'
		}, options);
		connector_s.connects(function(connector_ss, result_s) {
			result = result_s[0];
			equal(result instanceof jslgEngine.model.stage.Stage, true, "passed!");
		});
	});
});
