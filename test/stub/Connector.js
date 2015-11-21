/*
 * @author cuckoo99
 */

(function() {
	// namespace:
	var o = this.jslgEngine = this.jslgEngine||{};
	o = (o.stub = o.stub||{});

	var Connector = function(data) {
		var dat = data||{};
	};
	
	/**
	 *
	 */
	var p = Connector.prototype;

	p.stock = null;

	p.pipe = function(func) {
		func(this, this.stock);

		return this;
	};

	p.connects = function(func) {
		func(this, this.stock);

		return this;
	};

	p.loop = function(data, func) {
		var len = data.elements.length;

		for(var i = 0; i < len; i++) {
			func(this, data.elements[i]);
		}

		return this;
	};

	p.resolve = function(obj) {
		this.stock = obj;
		return this;
	};
	
	p.reject = function(obj) {
		return this;
	};

	p.clearProperty = function() {
	};

	o.Connector = Connector;
})();
