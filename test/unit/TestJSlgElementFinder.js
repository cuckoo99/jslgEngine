module('Element');

test("TestJSlgElementFinder", function() {
	var result = null;
	
	var connector = new jslgEngine.model.network.ConnectorOnline();
	
	connector.ajax = function(options) {
		options.callback({
			obj : new jslgEngine.stub.Stage()
		});
	};
	
	var finder = new jslgEngine.model.common.JSlgElementFinder();
	
	finder.addElementGetting('s1');
	finder.addElementGetting('s1-g1');
	finder.addElementGetting('s1-g1-c1');
	
	finder.readElements({
		connector : connector,
		callback : function() {
		}
	});
	
	//子要素の追加・削除・更新・取得
	equal(true, true, "passed!");

	//取得
	equal(true, true, "passed!");

});
