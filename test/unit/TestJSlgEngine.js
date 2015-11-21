module('Element');

testSettingAsAsync("TestJslgEngine(Global)", {
	mainData : {width:10,height:10},
	timeOut : 3000
},
function(iconController, mainController, connector, options) {
	var cnt = 0;

	testAsSync('extends', connector, function(name, connector_s) {
		var x = function() {};
		x.prototype = {
			test : 1
		};

		var ex = (function(options) {
			var exo = function() {
				var c = jslgEngine.extend(x, function() {
					this.__super__.constructor();
				});
				this.initialize(options);

				return c;
			};

			exo.prototype.initialize = function(options) {
				console.log('called!'+(cnt++));
				this.x = new x();
			};
			exo.prototype.setValue = function(v) {
				this.x.test = v;
			};

			return exo;
		}());

		var ex2 = (function() {
			var ex2o = jslgEngine.extend(ex, function() {
			});

			ex2o.prototype.initialize = function(options) {
				this.x = new x();
			};

			return ex2o;
		}());

		var o = (function() {
			var oo = jslgEngine.extend(ex2, function() {
				this.initialize();
			});

			return oo;
		}());

		var o1 = new o();
		o1.setValue(2);
		var o2 = new o();
		o2.setValue(3);
		var o3 = new o();

		equal(o1.x.test, 2, "passed!");
		equal(o2.x.test, 3, "passed!");
		equal(o2.x.test, 3, "passed!"); //TODO: 値が書き換わるが問題ないのか？
		equal(cnt, 0, "passed!");
	});
	testAsSync('clone', connector, function(name, connector_s) {
		var originalClass = function() {
			this.value = 5;
			this.getValue = function() { return this.value; };
		};
		var original = new originalClass();

		var clone = jslgEngine.getClone(original);
		equal(clone.value, 5, "passed!");
		equal(clone.getValue(), 5, "passed!");

		// test of changeNetworking.
		//var connector = new jslgEngine.model.network.ConnectorOnline();
		//jslgEngine.changeNetworking(connector, {}, {});
	});
	testAsSync('sort elements', connector, function(name, connector_s) {
		var elements = [{
			className : 'Cast',
		path : 'w1.r1',
		},{
			className : 'Resource',
		path : 'w1.hogehoge',
		},{
			className : 'CastFrame',
		path : 'w1.casthoge',
		},{
			className : 'WorldRegion',
		path : '',
		},{
			className : 'LocalRegion',
		path : 'w1',
		}];

		elements.sort(jslgEngine.sortElements);

		console.log(elements);
	});
	
	testAsSync('dispose', connector, function(name, connector_s) {
		var obj = {
			arr : [],
			num : 5,
			str : '5',
			sub : {}
		};
		jslgEngine.dispose(obj);
	});
	// testAsSync('loadJs', connector, function(name, connector_s) {
	// 	jslgEngine.loadJs();
	// });
});
