module('Mind');
testSettingAsAsync("TestSimulator2", {
    mainData : {width:10,height:10},
    timeOut : 10000,
    onDummyTicker : true //TODO
},
function(iconController, mainController, connector, options) {
	// Simulator principal logic.
	
	var simulator = new jslgEngine.model.mind.Simulator({
		parameters : {
		}
	}, {});

	var me = new jslgEngine.model.stage.Cast({
		key : 'me'
	});
	var enemy1 = new jslgEngine.model.stage.Cast({
		key : 'enemy1'
	});
	var enemy2 = new jslgEngine.model.stage.Cast({
		key : 'enemy2'
	});
	var enemy3 = new jslgEngine.model.stage.Cast({
		key : 'enemy3'
	});
	var dummyCommand = new jslgEngine.mock.Command({
		key : 'hoge'
	});
	
	var dummyCommand2 = new jslgEngine.mock.Command({
		key : 'hoge2'
	});
	dummyCommand2.addChild({
		obj : new jslgEngine.mock.ActionRequireArea({
		})
	}, options);
	dummyCommand2.addChild({
		obj : new jslgEngine.mock.ActionPending({
		})
	}, options);

	//step1. test command as single.
	var driversList = [];
	simulator._test(connector, {
		command : dummyCommand,
		me : me,
		family : [],
		enemy : [enemy1]
	}, driversList, options);
	connector.connects(function(connector_s, result_s) {
		equal(driversList.length, 1, '');
	});
	
	var driversList = [];
	simulator._getCommandDriversByUnitTest(connector, {
		commands : [dummyCommand2],
		me : me,
		family : [],
		enemy : [enemy1],
		driversList : driversList
	}, options);
	connector.connects(function(connector_s, result_s) {
		equal(driversList.length, 1, '');
	});

	//step2. sort by comparation of review point.
	var cmdDrv = function(val, cmd, pendings) {
		var driver = function() {
			this.pt = val;
			this.command = cmd;
			this.pendings = pendings;
		}
		driver.prototype.getReview = function() {
			return this.pt;
		}
		driver.prototype.getCommand = function(connector, options) {
			var c = this.command ? this.command : new jslgEngine.model.command.Command({
				key : 'cmd'+val,
			});
			connector.resolve(c);
		}
		driver.prototype.run = function(connector, data, options) {
			var self = this;

			self.command.run(connector, {
				resolveFunc : function(connector_s, pending, data, options_s) {
					var pending = self.pendings.shift();

					pending.reset({
						issues : pending.getIssues()
					});
				}
			}, options)
		}
		return new driver;
	};
	var driversList = [
		{ drivers : [cmdDrv(5), cmdDrv(1), cmdDrv(2)] },
		{ drivers : [cmdDrv(2), cmdDrv(8), cmdDrv(2)] },
	]

	var result = simulator._sortCommandDriverOrderByEffect({
		driversList : driversList
	}, options);

	var expected = [[5,2,1],[8,2,2]];

	for(var i = 0, len = result.length; i < len; i++) {
		var drivers = result[i].drivers;
		for(var j = 0, len2 = drivers.length; j < len2; j++) {
			var driver = drivers[j];
			var ex = expected[i][j];
			equal(ex, driver.getReview(), '');
		}
	}

	//step3. assembling commands, and test each them. finally make combination of commands.
	
	var drivers = [cmdDrv(5, dummyCommand2), cmdDrv(8), cmdDrv(10)];
	var selection = [];
	var result = [];
	simulator._testCommandDrivers(connector, drivers, {
		me : me,
		family : [],
		enemey : [enemy1, enemy2],
		numberOfResult : 1,
		testIndex : 0,
	}, result, options);

	var expected = [];

	for(var i = 0, len = result.length; i < len; i++) {
		var drivers = result[i].drivers;
		for(var j = 0, len2 = drivers.length; j < len2; j++) {
		}
	}

	var driversList = [];
	simulator._getMostEffectiveCommandDriversList(connector, driversList, {
		me : me,
		family : [],
		enemey : [enemy1, enemy2],
		numberOfResult : 1,
		testIndex : 0,
	}, driversList, options);
	
	for(var i = 0, len = result.length; i < len; i++) {
		var drivers = result[i].drivers;
		for(var j = 0, len2 = drivers.length; j < len2; j++) {
		}
	}

	//step4. if they has anything of issue, it force to resolve it.
	var pending = new jslgEngine.model.issue.PendingCommand({
		key : 'hoge'
	}, options);
	var requiredArea = new jslgEngine.mock.Issue({
	});
	pending.addIssue(requiredArea);

	var negativeLocations = [{x:0,y:0,z:0}, {x:1,y:0,z:0}];
	var positiveLocations = [{x:0,y:1,z:0}, {x:1,y:1,z:0}];
	var beforeIssueSetList = [];
	
	simulator._calculatePatterns(connector, {
		pendingCommand : pending,
		negativeLocations : negativeLocations,
		positiveLocations : positiveLocations,
		beforeIssueSetList : beforeIssueSetList,
	}, options);

	simulator._resolveInTest(connector, pending, {
		commandKey : null,
		family : [],
		enemy : [enemy1, enemy2],
	}, options);
	
	//step5. make command drivers.

	// Basically, destination
	

	var issue = new jslgEngine.model.issue.RequiredArea({});

	//case1. one killer item and one enemy
	//case2. many killer items and one enemy
	//case3. one killer item and many enemies
	//case4. many killer items and many enemies
	
	//case5. has reachable require area, and there is one enemy.
	//case6. has reachable require area, and there are many enemies.
	//case7. has unreachable require area, and there is one enemy.
	//case8. has unreachable require area, and there are many enemies.
	
	//case5. has two require area, reachable in second time, and there is one enemy.
	//case6. has two require area, reachable in second time,  and there are many enemies.
	//case7. has unreachable two require area, and there is one enemy.
	//case8. has unreachable two require area, and there are many enemies.

	//case9. has many require area, and many enemies;
});
