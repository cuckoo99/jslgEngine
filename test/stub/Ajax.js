
var o = this.jslgEngine = this.jslgEngine||{};
o = (o.model = o.model||{});
o = (o.network = o.network||{});

o.Ajax.prototype.run = function(options) {
	jslgEngine.log('Ajax');
	setTimeout(function() {
		jslgEngine.log('Ajax Called');
	options.callback({
		data : jslgEngine.sampleJson
	});
	},10);
};