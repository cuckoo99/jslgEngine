
(function() {	
	var o = this.jslgEngine = this.jslgEngine||{};
	o = (o.stub = o.stub||{});

	var BackGroundWorker = function(data) {
		this.initialize(data);
	};

	var p = BackGroundWorker.prototype;

	p.connector = null;

	p.key = null;

	p.count = 0;

	p.initialize = function(data) {
		this.key = data.key;
	};

	p.add = function(data, func) {
		var key = this.key;

		switch(key) {
			case 'FindElements': {
				func([]);
				break;
			}
			case 'Logic': {
				func([
					//[0,0,0],
					[{x:0,y:0,z:0}],
				]);
				break;
			}
			default: {
				jslgEngine.log('Not supported web workers');
				break;
			}
		}
	};

	o.BackGroundWorker = BackGroundWorker;
}());
