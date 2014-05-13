module('Command');

testSettingAsAsync("TestCommand", {
		mainData : {width:10,height:10}
	},
	function(iconController, mainController, connector, options) {
	var code, command, command2, command3;
		
	var result;
	var command, command2, command3;
    var action = new jslgEngine.stub.Action();
	var region = mainController.getWorldRegion();
	var converter = iconController.converter;
	var slgCommandFactory = new jslgEngine.model.factory.JSlgCommandFactory();
	
	jslgEngine.log('Test Command -----------');
	
    var command = new jslgEngine.model.command.Command({
        key : 'hoge'
    });
    command.addChild({
        obj : action
    });
	testAsAsync('Run', connector, function(name, connector_s) {
        command.run(connector_s.resolve(), {}, options);
        connector_s.connects(function(connector_ss) {
		  equal(action.wasDone(), true, name);
        });
    });
	testAsAsync('Restore', connector, function(name, connector_s) {
        command.restore(connector_s.resolve(), {}, options);
        connector_s.connects(function(connector_ss) {
		  equal(action.wasDone(), false, name);
        });
    });
	testAsAsync('Test', connector, function(name, connector_s) {
        command.restore(connector_s.resolve(), {}, options);
    });
	testAsSync('実行インスタンスの作成', connector, function(name, connector_s) {
        var commandFrame = new jslgEngine.model.command.Command({
            key : 'hoge'
        });
        var command = commandFrame.getRunnableCommand();
	
		equal(command.getKey(), 'hoge', name);
	});
    var elementFrame = new jslgEngine.model.common.JSlgElement({
        keyPathCodes : ['t', 'e', 's'],
        keyCode : 's',
        key : 'hgf'
    });
    var commandFrame = new jslgEngine.model.command.Command({
        key : 'hoge'
    });
    commandFrame.addChild({
        obj : new jslgEngine.stub.Action({
            run : function(connector, data, options) {
                var it = data.localElements[jslgEngine.model.logic.keys.SELF];
                this.selfElement = it;
            }
        })
    });
    elementFrame.addChild({ obj : commandFrame });
    var element1 = new jslgEngine.model.common.JSlgElement({
        keyPathCodes : ['t', 'e', 's'],
        keyCode : 's',
        key : 'hg1'
    });
    var element2 = new jslgEngine.model.common.JSlgElement({
        keyPathCodes : ['t', 'e', 's'],
        keyCode : 's',
        key : 'hg2'
    });
	testAsSync('フレームとしてCommandを作成', connector, function(name, connector_s) {
        var cmd1 = commandFrame.generate({
            key : 'h1'
        }, options);
        var cmd2 = commandFrame.generate({
            key : 'h2'
        }, options);
        element1.addChild({ obj : cmd1 });
        element2.addChild({ obj : cmd2 });
	
		equal(cmd1.getKey('s'), 'hg1', name+'1');
		equal(cmd2.getKey('s'), 'hg2', name+'2');
		equal(cmd1.getKeyData().getUniqueId() !== cmd2.getKeyData().getUniqueId(), true, name+':UniqueIdが異なる');
	});
	testAsAsync('Commandを作成２：実行したとき自身の要素は取得できているか', connector, function(name, connector_s) {
        var cmd1 = commandFrame.generate({
            key : 'h1'
        }, options);
        var cmd2 = commandFrame.generate({
            key : 'h2'
        }, options);
        element1.addChild({ obj : cmd1 });
        element2.addChild({ obj : cmd2 });
        
        connector_s.resolve();
        cmd1.run(connector_s, {}, options);
        connector_s.connects(function(connector_ss) {
            var it = cmd1._children[0].selfElement;
            equal(it.getKey('s'), 'hg1', name+'1');
        });
        cmd2.run(connector_s, {}, options);
        connector_s.connects(function(connector_ss) {
            var it = cmd2._children[0].selfElement;
            equal(it.getKey('s'), 'hg2', name+'2');
        });
        
    });
});