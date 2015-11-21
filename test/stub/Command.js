
(function() {	
	var o = this.jslgEngine = this.jslgEngine||{};
	o = (o.mock = o.mock||{});

	var Command = function(data) {
		var dat = data||{};
		this.run = dat.run||this.run;
		this.className = data.className||this.className;
		this._children = [];
	};
	
	/**
	 *
	 */
	var p = Command.prototype;

	p.className = 'Command';

	p._wasDone = false;

	p._children = null;

	p.dispose = function() {
	};

	p.getPath = function() {
		jslgEngine.log('Called StubCommand GetPath');
		return '';
	};

	p.addChild = function(data, options) {
		this._children.push(data.obj);
	}

	p.getRunnableCommand = function(connector, data, options) {
		jslgEngine.log('Called StubCommand Get Runnable Command');
		return this;
	};

	p.run = function(connector, data, options) {
		jslgEngine.log('Called StubCommand Run Method');
		this._wasDone = true;
		var children = this._children;
		if(!children) return;
		for(var i = 0, len = children.length; i < len; i++) {
			children[i].run(data, options);
		}
	};

	p.restore = function(connector, data, options) {
		jslgEngine.log('Called StubCommand Restore Method');
		this._wasDone = false;
		var children = this._children;
		if(!children) return;
		for(var i = 0, len = children.length; i < len; i++) {
			children[i].restore(data, options);
		}
	};

	p.run$ = function(connector, data, options) {
		jslgEngine.log('Called StubCommand Run$ Method');
		this._wasDone = true;
		connector.resolve();
	};

	p.restore$ = function(connector, data, options) {
		jslgEngine.log('Called StubCommand Restore$ Method');
		this._wasDone = false;
		connector.resolve();
	};

	p.test = function(connector, data, out, options) {
		jslgEngine.log('Called StubCommand Test Method');
		
		out.push(new jslgEngine.model.command.CommandDriver({
			commandKeyData : null,
			pendingCommands : null,
		}));
	};

	p.setup = function(data, options) {
	};

	p.wasDone = function() {
		return this._wasDone;
	};

	p.review = function(result, data, options) {};

	o.Command = Command;
}());
