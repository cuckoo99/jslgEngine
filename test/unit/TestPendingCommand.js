module('Element');

testSettingAsAsync("TestPendingCommand", {
		mainData : {width:10,height:10},
		timeOut : 4000
	},
	function(iconController, mainController, connector, options) {
	
    var pKey = '$PENDING';
    var pendingCommand = new jslgEngine.model.issue.PendingCommand({
        key : pKey
    });
    
    pendingCommand.apply(connector
    );
    
    pendingCommand.wasResolved(
    );
    
    pendingCommand.findElements(connector, {
    });
    
});