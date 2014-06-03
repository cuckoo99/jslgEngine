/*
 *
 */

// namespace:
var o = this.jslgEngine||{};

o.stub = {};

o.config = o.config||{};
//o.config.logLevel = 0;

var timeOutId;

var testSettingAsSync = function(name, data, callback) {
	QUnit.test(name, function() {
		var mainController = new jslgEngine.stub.MainController({
			onDummyTicker : true
		});
		var iconController = new jslgEngine.stub.IconController();
		iconController._mainController = mainController;
		var options = {
			iconController : iconController,
			mainController : mainController
		};
		
		callback(iconController, mainController, mainController.connector, options);
	});
};

var testSettingAsAsync = function(name, data, callback) {
	return (function() {
        QUnit.asyncTest(name, function() {
		var timeOut = data.timeOut;
		
		var mainController = new jslgEngine.stub.MainController(data.mainData);
		var iconController = new jslgEngine.stub.IconController();
		iconController._mainController = mainController;
		var options = {
			iconController : iconController,
			mainController : mainController
		};
		
		callback(iconController, mainController, mainController.connector, options);
		
		timeOutId = setTimeout(function() {
			start();
		}, timeOut ? timeOut : 3000);
	})
    })();
};

var connects = function(connector_s, f) {
	connector_s.pipe(function(connector_ss, result_ss) {
		//connector_ss.resolve();
		f(connector_ss, result_ss);
	});
	return connector_s;
};

var testAsSync = function(name, connector, f) {
	connector.pipe(function(connector_s, result_s) {
		connector_s.resolve();
		jslgEngine.log('Test:'+name);
		f(name, connector_s, result_s);
	});
};

var testAsAsync = function(name, connector, f) {
	connector.pipe(function(connector_s, result_s) {
		jslgEngine.log('Test:'+name);
		f(name, connector_s, result_s);
	});
};

var informEndOfTest = function() {
	clearTimeout(timeOutId);
	start();
};
