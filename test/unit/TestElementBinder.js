module('Element');
testSettingAsAsync("TestElementBinder", {
		mainData : {width:10,height:10}
	},
function(iconController, mainController, connector, options) {
    

	var connector = new jslgEngine.model.network.ConnectorOnline();
	
	var result;
    var elementBinder = mainController._elementBinder;
	
	var bindFunc = function(key_element, element, data) {
		var key = elementBinder.getUniqueId(key_element);
		elementBinder.set(key, key_element, {
			mainController : mainController
		});
		
		elementBinder.attachParent(key, element);
	}
    
    var emptyElement = new jslgEngine.model.common.JSlgElement({
		keyPathCodes : ['t', 'e'],
		keyCode : 'e',
        key : 'e'
	}, options);
    emptyElement.className = 'Hoge';
	
    var parentElement = new jslgEngine.model.common.JSlgElement({
		keyPathCodes : ['t'],
		keyCode : 't',
        key : 't'
	}, options);
    parentElement.className = 'HogeP';
    
    parentElement.addChild({
        obj : emptyElement
    }, options);
    bindFunc(emptyElement, parentElement, null);
    
    var childElement = new jslgEngine.model.common.JSlgElement({
		keyPathCodes : ['t', 'e', 'c'],
		keyCode : 'c',
        key : 'c'
	}, options);
    childElement.className = 'HogeC';
    
    emptyElement.addChild({
        obj : childElement
    }, options);
    bindFunc(childElement, emptyElement, null);
    
    var key = elementBinder.getUniqueId(emptyElement);
    // Add Element Relationship.
    elementBinder.set(elementBinder.getUniqueId(parentElement), parentElement, options);
    elementBinder.set(key, emptyElement, options);
    var element = elementBinder.search(connector, {
        key : emptyElement.getAbsolutePath(connector, {getLocation:true}, options)
    }, options);
    equal(element[0] === emptyElement, true, 'Add Element Relationship.');
    
    // Get parent element.
    elementBinder.attachParent(key, parentElement);
    var element = elementBinder.getParent(key);
    equal(element === parentElement, true, 'Add Element Relationship.');
    
    // Search Element By className.
    var element = elementBinder.search(connector, {
        target : emptyElement,
        className : 'HogeC'
    }, options);
    equal(element[0] === childElement, true, 'Search Element By className.');

    var element = elementBinder.search(connector, {
        className : 'Hoge'
    }, options);
    equal(element[0] == emptyElement, true, 'Search Element By className.');

    // Make the cache narrow by className.
    elementBinder.setCache(connector, {
        className : 'Ground'
    });

    // Make the cache narrow by location.
    elementBinder.setCache(connector, {
        location : {x : 0, y : 0, z : 0}
    });
    
    //Search
    var worldRegion = options.mainController.getWorldRegion()
    worldRegion.addChild({
        obj : parentElement
    }, options)
    bindFunc(parentElement, worldRegion, null);
    
    //Get by single key
    elementBinder.search(connector, {
        key : 'e'
    }, options);
    connector.connects(function(connector_s, result_s) {
        equal(result_s.length === 1 && result_s[0] === emptyElement, true, 'ok');
    });
    //From nesting element.
    elementBinder.search(connector, {
        target : emptyElement,
        key : 'c'
    }, options);
    connector.connects(function(connector_s, result_s) {
        equal(result_s[0].className === 'HogeC', true, 'ok');
    });
    
    //Get by single key as location
    elementBinder.search(connector, {
        key : [100,100,0].join(jslgEngine.config.locationSeparator)
    }, options);
    connector.connects(function(connector_s, result_s) {
        equal(result_s.length, 0, 'ok');
    });
    //From nesting element.
    elementBinder.search(connector, {
        target : emptyElement,
        key : [0,0,0].join(jslgEngine.config.locationSeparator)
    }, options);
    connector.connects(function(connector_s, result_s) {
        equal(result_s.length, 0, 'ok');
    });
    
    //Get by path
    elementBinder.search(connector, {
        key : 'e.c'
    }, options);
    connector.connects(function(connector_s, result_s) {
        equal(result_s.length === 1 && result_s[0] === childElement, true, 'ok');
    });
    //From nesting element.
    elementBinder.search(connector, {
        target : emptyElement,
        key : 'c'
    }, options);
    connector.connects(function(connector_s, result_s) {
        equal(result_s.length === 1 && result_s[0] === childElement, true, 'ok');
    });
    
    //Check if could not get element by deep nested element key
    elementBinder.search(connector, {
        key : 'c2'
    }, options);
    connector.connects(function(connector_s, result_s) {
        equal(result_s.length === 0, true, 'ok');
    });
    //From nesting element.
    elementBinder.search(connector, {
        target : emptyElement,
        key : 'c2'
    }, options);
    connector.connects(function(connector_s, result_s) {
        equal(result_s.length === 0, true, 'ok');
    });
    
    //Get by class name.
    elementBinder.search(connector, {
        className : 'HogeC'
    }, options);
    connector.connects(function(connector_s, result_s) {
        equal(result_s.length === 1 && result_s[0] === childElement, true, 'ok');
    });
    //From nesting element.
    elementBinder.search(connector, {
        target : emptyElement,
        className : 'HogeC'
    }, options);
    connector.connects(function(connector_s, result_s) {
        equal(result_s.length === 1 && result_s[0] === childElement, true, 'ok');
    });
    
    //Get by class name and key.
    elementBinder.search(connector, {
        key : 'e.c',
        className : 'HogeC'
    }, options);
    connector.connects(function(connector_s, result_s) {
        equal(result_s.length === 1 && result_s[0] === childElement, true, 'ok');
    });
    //From nesting element.
    elementBinder.search(connector, {
        target : emptyElement,
        key : 'c',
        className : 'HogeC'
    }, options);
    connector.connects(function(connector_s, result_s) {
        equal(result_s.length === 1 && result_s[0] === childElement, true, 'ok');
    });
    
    //Get parent
    elementBinder.search(connector, {
        key : 'w1.t.e.parent()'
    }, options);
    connector.connects(function(connector_s, result_s) {
        equal(result_s.length === 1 && result_s[0] === parentElement, true, 'Get parent');
    });
    //From nesting element.
    elementBinder.search(connector, {
        target : emptyElement,
        key : 'parent()'
    }, options);
    connector.connects(function(connector_s, result_s) {
        equal(result_s.length === 0, true, 'ok');
    });
    
    //Get parent and then get element by key.
    elementBinder.search(connector, {
        key : 'e.parent().e'
    }, options);
    connector.connects(function(connector_s, result_s) {
        equal(result_s.length === 1 && result_s[0] === emptyElement, true, 'ok');
    });
    //From nesting element.
    elementBinder.search(connector, {
        target : emptyElement,
        key : 'parent().e',
    }, options);
    connector.connects(function(connector_s, result_s) {
        equal(result_s.length === 0, true, 'ok');
    });
    
    //Get parent and then find by class name.
    elementBinder.search(connector, {
        key : 'e.parent().find(HogeC)'
    }, options);
    connector.connects(function(connector_s, result_s) {
        equal(result_s.length === 1 && result_s[0] === childElement, true, 'Get parent and then find by class name.');
    });
    //From nesting element.
    elementBinder.search(connector, {
        target : emptyElement,
        key : 'parent().find(HogeC)'
    }, options);
    connector.connects(function(connector_s, result_s) {
        equal(result_s.length === 0, true, 'ok');
    });
    
    //Find by class name and then get parent.
    elementBinder.search(connector, {
        key : 'find(HogeC).parent()'
    }, options);
    connector.connects(function(connector_s, result_s) {
        equal(result_s.length === 1 && result_s[0] === emptyElement, true, 'Find by class name and then get parent.');
    });
    //From nesting element.
    elementBinder.search(connector, {
        target : emptyElement,
        key : 'find(HogeC).parent()'
    }, options);
    connector.connects(function(connector_s, result_s) {
        equal(result_s.length === 1 && result_s[0] === emptyElement, true, 'ok');
    });
    
    //Get parent and then find by class name, and get by key.
    elementBinder.search(connector, {
        key : 'e.parent().find(HogeC).c2'
    }, options);
    connector.connects(function(connector_s, result_s) {
        equal(result_s.length === 0, true, 'ok');
    });
    //From nesting element.
    elementBinder.search(connector, {
        target : emptyElement,
        key : 'parent().find(HogeC).c2'
    }, options);
    connector.connects(function(connector_s, result_s) {
        equal(result_s.length === 0, true, 'ok');
    });
    
    //Find by class name and then get parent, and get by key.
    elementBinder.search(connector, {
        key : 'find(HogeC).parent().c2'
    }, options);
    connector.connects(function(connector_s, result_s) {
        equal(result_s.length === 0, true, 'ok');
    });
    //From nesting element.
    elementBinder.search(connector, {
        target : emptyElement,
        key : 'find(HogeC).parent().c2'
    }, options);
    connector.connects(function(connector_s, result_s) {
        equal(result_s.length === 0, true, 'ok');
    });
    
    // Remove ElementRelationship.
    elementBinder.remove(key, options);
    var element = elementBinder.search(connector, {
        target : emptyElement
    });
    equal(element.length === 0, true, 'Remove ElementRelationship.');
    elementBinder.set(key, emptyElement, options);
    
});
