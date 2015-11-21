module('Element');

testSettingAsAsync("TestOnlineManger", {
	mainData : {
			   iconFactory : new jslgEngine.stub.JSlgIconFactory()
	},
	//timeOut : 4000
},
function(iconController, mainController, connector, options) {

	var region = mainController.getWorldRegion();
	var onlineManager = new jslgEngine.controller.OnlineManager();

	var user = new jslgEngine.model.user.User({
		key : 'r1'
	});

	onlineManager.setMainUser(user);

	var stub = {
		fetch1 : {
			elements : [
			{ id : 200, className : 'Cast', keyword : 'hogech2', path : 'w1' },	
			]       
		},
		run1 : {
			elements : [
			{ id : 250, className : 'Cast', keyword : 'hogech3', path : 'w1' },	
			]       
		},
		forSort : {
			elements : [
			{ id : 100, className : 'Cast', keyword : 'hogech2', path : 'w1' },	
			{ id : 200, className : 'Resource', keyword : 'hogech2', path : 'w1' },	
			{ id : 300, className : 'CastFrame', keyword : 'hogech2', path : 'w1' },	
			]       
		}
	};

	var stubResavation = null;

	connector.ajax = function(options) {
		var url = options.url;
		//var conn = new jslgEngine.model.network.ConnectorOnline();
		var conn = this;
		if(url.lastIndexOf('get') == url.length-3) {
			conn.pipe(function(conn_s) {
				conn_s.resolve(JSON.stringify(stub.fetch1));
			});
		} else if(url.lastIndexOf('run') == url.length-3) {
			conn.pipe(function(conn_s) {
				conn_s.resolve(JSON.stringify(stub.run1));
			});
		} else {
			conn.pipe(function(conn_s) {
				conn_s.resolve(null);
			});
		}
		return conn;
	};

	testAsSync('findMainUser', connector, function(name, connector_s) {
		// frequently fetch elements from server.
		onlineManager.findMainUser(connector_s, options);
		connector_s.connects(function(connector_ss, result_s) {
		});
	});
	testAsSync('attachElements', connector, function(name, connector_s) {
		// frequently fetch elements from server.
		onlineManager.attachElements(connector_s, [
		{ id : 100, className : 'Cast', keyword : 'hogech', path : 'w1' },	
		], options);
		connector_s.connects(function(connector_ss, result_s) {
			var addition = region.getChild({
				key : 'hogech'
			});
			equal(addition.getKeyData().getUniqueId(), 100, name);
			equal(addition.getKey(), 'hogech', name);
		});
	});
	testAsSync('fetchElements', connector, function(name, connector_s) {
		connector_s.ajax = connector.ajax;
		
		onlineManager.fetchElements(connector_s, {
		}, options);
		connector_s.connects(function(connector_ss, result_s) {
			var addition = region.getChild({
				key : 'hogech2'
			});
			equal(addition.getKeyData().getUniqueId(), 200, name);
			equal(addition.getKey(), 'hogech2', name);
		});
	});
	testAsAsync('fetchElements times out', connector, function(name, connector_s) {
		connector_s.resolve();
	});
	testAsSync('runElement', connector, function(name, connector_s) {
		connector_s.ajax = connector.ajax;
		
		onlineManager.run(connector_s, {
		}, options);
		connector_s.connects(function(connector_ss, result_s) {
			var elements = JSON.parse(result_s).elements;
			// return elements for update.
			for(var i = 0, len = elements.length; i < len; i++) {
				var elm = elements[i];
				equal(elm.keyword, 'hogech3', name);
			}
		});
	});
	testAsSync('runElement and requirement', connector, function(name, connector_s) {
		connector_s.ajax = connector.ajax;
		
		var path = 'w1.r1';

		onlineManager.run(connector_s, {
			path : path
		}, options);
		connector_s.connects(function(connector_ss, result_s) {
			var elements = JSON.parse(result_s).elements;

			// it has to be clear.
		});	
	});
	testAsSync('runElement and requirement, then try send request again', connector, function(name, connector_s) {
		connector_s.ajax = connector.ajax;
		var path = 'w1.r1.req'

		onlineManager.run(connector_s, {
			path : path
		}, options);
		connector_s.connects(function(connector_ss, result_ss) {
			var elements = JSON.parse(result_ss).elements;

			// check if exists requirement.
			equal(elements.length > 0, true, name);
		});
		onlineManager.run(connector_s, {
			path : path
		}, options);
		connector_s.connects(function(connector_ss, result_ss) {
			var elements = JSON.parse(result_ss).elements;

			// it has to be clear.
			equal(elements.length, 0, name)
		});
	});
	testAsAsync('runElement times out', connector, function(name, connector_s) {
		connector_s.resolve();
	});
	testAsSync('sortElements', connector, function(name, connector_s) {
		var elms = stub.forSort.elements;
		elms.sort(onlineManager.sortElements);

		var expected = ['Resource', 'CastFrame', 'Cast'];
		for(var i = 0, len = elms.length; i < len; i++) {
			var element = elms[i];
			equal(expected.shift(), element.className, name);
		}
	});
	testAsSync('changeNetworkingMode', connector, function(name, connector_s) {
		onlineManager.changeNetworkingMode(connector, {
			isOnline : true
		}, options);
		equal(onlineManager.isOnline, true, name);
	});
	testAsSync('check if it rewrited elements', connector, function(name, connector_s) {
		// frequently fetch elements from server.
		onlineManager.attachElements(connector, [
		{ id : 100, className : 'Cast', keyword : 'hogech', path : 'w1' },	
		], options);
		connector.connects(function(connector_s, result_s) {
			var addition = region.getChild({
				key : 'hogech'
			});
			equal(addition.getKeyData().getUniqueId(), 100, name);
			equal(addition.getKey(), 'hogech', name);
		});
	});
	testAsSync('begin', connector, function(name, connector_s) {
		onlineManager.begin(connector, {
			success : function() {
				var result = result_s;

				equal(result != null, true, name);
			},
			error : function() {
				ok(false, name+'failed');
			},
		}, options);
	});
	testAsSync('end', connector, function(name, connector_s) {
		onlineManager.end(connector, {
			success : function() {
				var result = result_s;

				equal(result != null, true, name);
			},
			error : function() {
				ok(false, name+'failed');
			},
		}, options);
	});
});
