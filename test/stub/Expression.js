
(function() {	
	var Expression = function(data) {
		this.initialize(data);
	};

	var p = jslgEngine.model.logic.Expression.prototype;

	p.connector = null;

	p.add = function(key, func) {
		func({});
	};

	jslgEngine.model.logic.Expression = Expression;
}());
