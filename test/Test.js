/*
 *
 */

// namespace:
var o = this.jslgEngine||{};

o.stub = {};

o.config = o.config||{};
//o.config.logLevel = 0;

var cr = this.createjs||{};
cr.Text = function() {
	return {
		getMeasuredWidth : function() {},
		getMeasuredLineHeight : function() {}
	};
};
cr.Graphics = function() {
	return {
		setStrokeStyle : function() {},
		beginRadialGradientFill : function() {},
		drawRoundRect : function() {},
	};
};

var timeOutId;

var webWorkersDirectory = '';

var testSettingAsSync = function(name, data, callback) {
	QUnit.test(name, function() {
		var mainController = new jslgEngine.stub.MainController({
			onDummyTicker : true,
		    	isAsync : false,
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
	
		var mainData = data.mainData||{};
		mainData.isAsync = true;
		var mainController = new jslgEngine.stub.MainController(mainData);
		var iconController = new jslgEngine.stub.IconController(mainData);
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

var temporaryNamespace = [];

var rewriteNamespace = function(key, ns, target) {
	var nw_ns = {};
	var arr = Object.keys(ns.prototype);
	for(var i = 0, len = arr.length; i < len; i++) {
		var prop = arr[i];
		nw_ns[prop] = ns.prototype[prop];
	}
	//ns.prototype = {};
	var arr = Object.keys(target.prototype);
	for(var i = 0, len = arr.length; i < len; i++) {
		var prop = arr[i];
		ns.prototype[prop] = target.prototype[prop];
	}
	temporaryNamespace[key] = nw_ns;
}

var restoreNamespace = function(key, ns) {
	var temp_ns = temporaryNamespace[key];
	//ns.prototype = tmp_ns;
	//ns.prototype = {};
	var arr = Object.keys(temp_ns);
	for(var i = 0, len = arr.length; i < len; i++) {
		var prop = arr[i];
		ns.prototype[prop] = temp_ns[prop];
	}
}

var informEndOfTest = function() {
	clearTimeout(timeOutId);
	start();
};
