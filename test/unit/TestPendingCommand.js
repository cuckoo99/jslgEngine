module('Element');

testSettingAsSync("TestPendingCommand", {
	//mainData : {width:10,height:10},
	timeOut : 4000
},
function(iconController, mainController, connector, options) {
	
	var pKey = '$PENDING';
	var pendingCommand = new jslgEngine.model.issue.PendingCommand({
		key : pKey
	}, options);

	var issue = new jslgEngine.mock.Issue({
	});

	var emptyElement = new jslgEngine.model.stage.Ground({
		key : 'empty'
	}, options);
	var emptyChild = new jslgEngine.model.stage.Cast({
		key : 'echild'
	}, options);
	emptyElement.addChild({
		obj : emptyChild
	}, options);

	// add issue, then it could get it.
	pendingCommand.addIssue(issue);

	var issues = pendingCommand.getIssues();
	equal(issues.length, 1, 'check if it has issue');

	var current = pendingCommand.getCurrentIssue();
	equal(current, issue, 'current issue is ');
	
	// check if could resolve any element.
	pendingCommand.resolve(connector, emptyElement, {}, options, function() {});
	equal(current.wasResolved(), true, 'current issue is ');
	// then it would be resolved.
	// apply empty element.
	// find element in pending command.
	var result = [];
	var element = pendingCommand.findElements(null, {
		key : pKey+'.echild',
	    	result : result,
	}, options);
	equal(result[0] === emptyChild, true, 'current issue is pending command');
	
	var issueOne = new jslgEngine.mock.Issue({
	});
	var issueTwo = new jslgEngine.mock.Issue({
	});

	// reset issues.
	pendingCommand.reset({
		issues : [issueOne, issueTwo]
	});

	var issues = pendingCommand.getIssues();
	equal(issues.length, 2, '');

	// read next issue.
	var result = pendingCommand.next();
	equal(result, false, '');
	
	var issue = pendingCommand.getCurrentIssue();
	equal(issue === issueOne, true, '');
	
	issue.resolve();

	var result = pendingCommand.next();

	var issue = pendingCommand.getCurrentIssue();
	equal(issue === issueTwo, true, '');

	// back to before issue.
	pendingCommand.back();

	var issue = pendingCommand.getCurrentIssue();
	equal(issue === issueOne, true, '');
	
	// remove issues resolved.
	pendingCommand.removeResolvedIssues();

	// clear issues at index.
	pendingCommand.clear(0);
	
	var issues = pendingCommand.getIssues();
	equal(issues.length, 1, '');

	var issue = pendingCommand.getCurrentIssue();
	equal(issue === issueTwo, true, '');
	
	// get current issue.
	// add reputation
	pendingCommand.addReputation({});
	// get reputation
	pendingCommand.getReputations();

	// dispose
	pendingCommand.dispose();

});
