module('Mind');

asyncTest("TestPending", function() {
	var result;
	var code, action, arguments, mainController, iconCOntroller, data, actionData;
	var mainController = new jslgEngine.stub.MainController();
	var iconController = new jslgEngine.stub.IconController({
		mainController : mainController
	});
	
	var connector = mainController.connector;
	
	var slgIconFactory = new jslgEngine.model.factory.JSlgIconFactory();
	data = {
		mainController : mainController,
		iconController : iconCOntroller,
		connector : connector
	};
	
	var runAction = function(action, test_func, expect, before, options) {
		
	};
	
	var region = mainController.getWorldRegion();
	var count = 0;
	
	code = 'pending()';
	arguments = [];
	actionData = {arguments : arguments};
	action = new jslgEngine.model.action.ActionPending(actionData);
	
	connector.pipe(function(connector_s) {
		jslgEngine.log('count:'+(count++));
		action.find(connector_s.resolve(), {}, {
			mainController : mainController
		});
	}).pipe(function(connector_s) {
		jslgEngine.log('count:'+(count++));
		action.run.apply(action, [connector_s.resolve(), {
			resolveFunc : function(connector_ss, pending, options) {
				connector_ss.resolve({
					result : [new jslgEngine.model.issue.PendingCommand({
						commandKey : null
					})]
				});
			}
		}, {
			mainController : mainController
		}]);
	}).pipe(function(connector_s) {
		jslgEngine.log('count:'+(count++));
		var issueStack = action.issueStack;
		
		// 入力待機オブジェクトの存在確認
		equal(issueStack.length, 1, "passed!");
		connector_s.resolve();
	}).pipe(function(connector_s) {
		jslgEngine.log('count:'+(count++));
		action.restore.apply(action, [connector_s.resolve(), {}, {
			mainController : mainController,
			connector : connector_s.resolve()
		}]);
	}).pipe(function(connector_s) {
		jslgEngine.log('count:'+(count++));
		equal(0, 0, "passed!");
		
		connector_s.resolve();
	});
	
	command = new jslgEngine.stub.Command({
		code : 	'require([0,0,0],[[1,3,2,[[0,3,0]],0,[90,0]]])\n' +
				'pending()\n' +
				'add(w1.r1.0_0_0.0_0_0, "cx1", w1.r1.rc1)',
		mainController : mainController
	});
	
	var ground;
	mainController.findElements(connector, {
		key : ['w1','r1','s1','g0_0_0'].join(jslgEngine.config.elementSeparator)
	});
	connector.connects(function(connector_s, result_s) {
		ground = result_s[0];
		
		ground.addChild({
			obj : command
		}, options);
	});
	connector.pipe(function(connector_s) {
		jslgEngine.log('count:'+(count++));
		command.run(connector_s.resolve(), {}, {
			mainController : mainController,
			iconController : iconController
		});
		
		setTimeout(function() {
			var issue = mainController.getIssue();
			if(issue) {
				var ground;
				mainController.findElements(connector_s, {
					key : 'w1.r1.0_0_0.0_0_0'
				});
				connector_s.connects(function(connector_ss, result_ss) {
					ground = result_ss[0];
					
					jslgEngine.log('resolve pending command.');
					issue.resolve(ground, null, { mainController : mainController });
				});
			}
		}, 2000);
	}).pipe(function(connector_s) {
		jslgEngine.log('countF:'+(count++));
		connector_s.resolve();
	});
	
	
	setTimeout(function() {
		start();
	}, 3000);
});