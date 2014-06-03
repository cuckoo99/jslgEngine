module('Mind');
testSettingAsAsync("TestSimulator", {
    mainData : {width:10,height:10},
    timeOut : 10000,
    
    onDummyTicker : true //TODO
},
function(iconController, mainController, connector, options) {
	var result;
	
	var separator = jslgEngine.config.elementSeparator;
	
	var converter = new jslgEngine.model.logic.Converter();
	var slgCommandFactory = new jslgEngine.model.factory.JSlgCommandFactory();
	
	var player, enemy;
	var command, command2, command3, deathCommand;
	mainController.findElements(connector, {
		key : ['w1','r1','s1','g0_0_0','c1'].join(separator)
	}, options);
	connector.connects(function(connector_s, result_s) {
		player = result_s[0];
	});
	mainController.findElements(connector, {
		key : ['w1','r1','s1','g1_1_0','c_e1'].join(separator)
	}, options);
	connector.connects(function(connector_s, result_s) {
		enemy = result_s[0];
	});
	connector.connects(function(connector_s, result_s) {
		var template = slgCommandFactory.getCommandTemplate({
			key : 'Fire_AttackAndMove',
			children : [
				slgCommandFactory.getActionTemplate({
					className : 'ActionLog',
					arguments : ['"攻撃＆移動"']
				}),
				slgCommandFactory.getActionTemplate({
					className : 'ActionRequireArea',
					arguments : [[0,0,0],[[1,1,2,[[0,3,0]],0,[90,0]]]]
				}),
				slgCommandFactory.getActionTemplate({
					className : 'ActionPending'
				}),
				slgCommandFactory.getActionTemplate({
					className : 'ActionJSlgMove',
					arguments : ['$THIS.parent()','$PENDING.obj']
				}),
				slgCommandFactory.getActionTemplate({
					className : 'ActionLog',
					arguments : ['"移動Next"']
				}),
				slgCommandFactory.getActionTemplate({
					className : 'ActionRequireArea',
					arguments : [[0,0,0],[[1,1,2,[[0,3,0]],0,[0,0]]],['"Cast"']]
				}),
				slgCommandFactory.getActionTemplate({
					className : 'ActionPending'
				}),
				slgCommandFactory.getCommandBlockTemplate({
					className : 'CommandBlockIF',
					arguments : ['$PENDING.obj.life>0'],
					children : [
						slgCommandFactory.getActionTemplate({
							className : 'ActionLog',
							arguments : ['"攻撃実行Next"']
						}),
						slgCommandFactory.getActionTemplate({
							className : 'ActionSet',
							arguments : ['$PENDING.obj','"life"','$PENDING.obj.life-3']
						})
					]
				}),
				slgCommandFactory.getCommandBlockTemplate({
					className : 'CommandBlockElseIF',
					arguments : ['true==true'],
					children : [
						slgCommandFactory.getActionTemplate({
							className : 'ActionLog',
							arguments : ['"攻撃実キャンセル"']
						})
					]
				}),
				slgCommandFactory.getActionTemplate({
					className : 'ActionSet',
					arguments : ['$THIS','"_ENABLE"','false']
				})
			]
		});
		
		converter.getFromTextOfXml(connector_s, template, options);
	});
	connector.connects(function(connector_ss, result_ss) {
		command = result_ss;
	});
	connector.connects(function(connector_s, result_s) {
		template = slgCommandFactory.getCommandTemplate({
			key : 'Fire_Move',
			children : [
				slgCommandFactory.getActionTemplate({
					className : 'ActionLog',
					arguments : ['"移動"']
				}),
				slgCommandFactory.getActionTemplate({
					className : 'ActionRequireArea',
					arguments : [[0,0,0],[[1,1,2,[[0,3,0]],0,[90,0]]]]
				}),
				slgCommandFactory.getActionTemplate({
					className : 'ActionPending'
				}),
				slgCommandFactory.getActionTemplate({
					className : 'ActionJSlgMove',
					arguments : ['$THIS.parent()','$PENDING.obj']
				}),
				slgCommandFactory.getActionTemplate({
					className : 'ActionSet',
					arguments : ['$THIS','"_ENABLE"','false']
				})
			]
		});
	
		converter.getFromTextOfXml(connector_s, template, options);
	});
	connector.connects(function(connector_ss, result_ss) {
		command2 = result_ss;
	});
	connector.connects(function(connector_s, result_s) {
		template = slgCommandFactory.getCommandTemplate({
			key : 'Fire_Attack',
			children : [
				slgCommandFactory.getActionTemplate({
					className : 'ActionLog',
					arguments : ['"攻撃"']
				}),
				slgCommandFactory.getActionTemplate({
					className : 'ActionRequireArea',
					arguments : [[0,0,0],[[1,1,2,[[0,3,0]],0,[0,0]]],['"Cast"']]
				}),
				slgCommandFactory.getActionTemplate({
					className : 'ActionPending'
				}),
				slgCommandFactory.getCommandBlockTemplate({
					className : 'CommandBlockIF',
					arguments : ['$PENDING.obj.life>0'],
					children : [
						slgCommandFactory.getActionTemplate({
							className : 'ActionLog',
							arguments : ['"攻撃実行Next"']
						}),
						slgCommandFactory.getActionTemplate({
							className : 'ActionSet',
							arguments : ['$PENDING.obj','"life"','$PENDING.obj.life-10']
						})
					]
				}),
				slgCommandFactory.getCommandBlockTemplate({
					className : 'CommandBlockElseIF',
					arguments : ['true==true'],
					children : [
						slgCommandFactory.getActionTemplate({
							className : 'ActionLog',
							arguments : ['"攻撃実キャンセル"']
						})
					]
				}),
				slgCommandFactory.getActionTemplate({
					className : 'ActionSet',
					arguments : ['$THIS','"_ENABLE"','false']
				})
			]
		});
		
		converter.getFromTextOfXml(connector_s, template, options);
	});
	connector.connects(function(connector_ss, result_ss) {
		command3 = result_ss;
	});
	connector.connects(function(connector_s, result_s) {
		slgCommandFactory.makeCheckDeath(connector_s, { converter : converter }, options);
	});
	connector.connects(function(connector_ss, result_ss) {
		deathCommand = result_ss;
	});
	connector.connects(function(connector_s, result_s) {
		enemy.addChild({
			obj : deathCommand
		}, options);
		
		player.addChild({
			obj : command
		}, options);
		player.addChild({
			obj : command2
		}, options);
		player.addChild({
			obj : command3
		}, options);
		
	    var arguments = {
	        status : {
	            member : {},
	            command : {}
	        }
	    };
	    arguments.status.decreasedKeys = ['life'];
	    arguments.status.increasedKeys = [];
	    arguments.status.member.key = 'belongs';
	    arguments.status.member.familyMemberNames = ['player'];
	    arguments.status.member.enemyMemberNames = ['enemy'];
	    arguments.status.command.key = null;
	    arguments.status.command.value = null;
	    var simulator = new jslgEngine.model.mind.Simulator({
	        arguments : arguments
	    });
	    
		var drivers = [];
		var data = {
	        me : player,
	        family : [],
	        enemy : [enemy],
	        result : drivers
	    };
	    
	    simulator.run(connector_s, data, {
			mainController : mainController,
			iconController : iconController
		});
	    connector_s.pipe(function(connector_ss) {
	    	var commandDrivers = drivers[0];
	    	
	    	if(commandDrivers) {
				connector_ss.resolve();
				var commandDriver;
				while(commandDriver = commandDrivers.shift()) {
					commandDriver.run(connector_ss, {}, {
						mainController : mainController,
						iconController : iconController
					});
				}
			} else {
				//TODO: その場に留まるか、移動だけでも行うか、性格により異なる
				connector_ss.resolve();
			}
	    });
    	mainController.findElements(connector_s, {
    		key : 'c1',
    		className : 'Cast'
    	}, options);
	    connector_s.pipe(function(connector_ss, result_ss) {
	    	player = result_ss;
	    	var pLocation = player[0].getGlobalLocation();
	    	equal([pLocation.x,pLocation.y,pLocation.z].join('_'), '0_1_0', "passed!");
	    });
    	mainController.findElements(connector_s, {
    		key : 'c_e1',
    		className : 'Cast'
    	}, options);
	    connector_s.pipe(function(connector_ss, result_ss) {
	    	enemy = result_ss;
			start();
	    	connector_s.resolve();
	    });
	});
        
    // 本当の単体テスト
    // Simulator's unit test method
    var result = [];
    simulator._test(connector, {
        command : null,
        me : null,
        family : null,
        enemy : null,
        innerFunc : null,
        pendingCommands : [],
        testIndex : 0
    }, result, options);
    
    // Check calling array of Command test method
    simulator._getCommandDriversByUnitTest(connector, {
        commands : [],
        me : null,
        family : null,
        enemy : null,
        innerFunc : null,
        driversList : [],
        testIndex : 0
    }, options);
    
    // Check test joining each results of unit test method.
    simulator._testCommandDrivers();

    simulator._getMostEffectiveCommandDriversList();

    // Check if it would be done well if given joint count parameter.
    simulator._calculatePatterns();
    
    // Check makin  list.
    simulator._calculatePatterns();
    
    // Sort CommandDriver.
    simulator._calculatePatterns();
    
    // Check if it correctly works order by preority.
    simulator._sortCommandDriverOrderByEffect({
        driversList : []
    }, options);
    
    // Call review action.
    // Test of resolving Issue object.
    simulator._calculatePatterns();
    simulator._resolveInTest();
    
    // Test of resolve.
    simulator._checkInTest();
});