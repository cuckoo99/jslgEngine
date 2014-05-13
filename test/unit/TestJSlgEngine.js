module('Element');

test("TestJSlgEngine(Global)", function() {
	//継承
	var cnt = 0;

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

	//クローンのテスト
	var originalClass = function() {
		this.value = 5;
		this.getValue = function() { return this.value; };
	};
	var original = new originalClass();

	var clone = jslgEngine.getClone(original);
	equal(clone.value, 5, "passed!");
	equal(clone.getValue(), 5, "passed!");
});
