
(function() {
	// namespace:
	var o = this.jslgEngine = this.jslgEngine||{};
	o = (o.mock = o.mock||{});

	var AnimationContainer = function(data) {
		this._children = [];
	}

	var p = AnimationContainer.prototype;

	p._children = null;

	p.unlock = function(options) {
	};

	p.run = function(options) {
	};

	p.notifyEndOfAnimation = function(flag) {
	};

	p.wasFinished = function() {
	};

	o.AnimationContainer = AnimationContainer; 
})();

