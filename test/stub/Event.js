
(function() {	
	var o = this.jslgEngine = this.jslgEngine||{};
	o = (o.stub = o.stub||{});

	var Command = function() {
		this.initialize();
	};

	var p = Command.prototype;
	
	p.initialize = function() {
	};
	
	o.Command = jslgEngine.model.command.Command;

}());