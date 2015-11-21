
(function() {
	// namespace:
	var o = this.jslgEngine = this.jslgEngine||{};
	o = (o.mock = o.mock||{});
	
	var Ajax = function(data) {
	};

	Ajax.prototype.run = function(options) {
		jslgEngine.log('Ajax');
		setTimeout(function() {
			jslgEngine.log('Ajax Called');
			options.callback({
				data : jslgEngine.sampleJson
			});
		},10);
		return {
			done : function() {
			},
			fail : function() {
			}
		};
	};

	o.Ajax = Ajax;
})();
