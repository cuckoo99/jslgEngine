module('Element');
testSettingAsAsync("TestElementBinder", {
		mainData : {width:10,height:10}
	},
function(iconController, mainController, connector, options) {
	var result;
    var elementBinder = mainController._elementBinder;
    var emptyElement = new jslgEngine.model.common.JSlgElement({
		keyPathCodes : ['t', 'e'],
		keyCode : 'e'
	}, options);
    emptyElement.className = 'Hoge';
	var parentElement = new jslgEngine.model.common.JSlgElement({
		keyPathCodes : ['t'],
		keyCode : 't'
	}, options);
    parentElement.className = 'HogeP';
    parentElement.addChild({
        obj : emptyElement
    }, options);
    var childElement = new jslgEngine.model.common.JSlgElement({
		keyPathCodes : ['t', 'e', 'c'],
		keyCode : 'c'
	}, options);
    childElement.className = 'HogeC';
    emptyElement.addChild({
        obj : childElement
    }, options);
    
    // Get Parent Element.
    
    var key = elementBinder.getUniqueId(emptyElement);
    // Add Element Relationship.
    elementBinder.set(key, emptyElement);
    var element = elementBinder.search(connector, {
        target : emptyElement
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

    // Search Element By key.
//    var element = elementBinder.search(connector, {
//        key : ''
//    }, options);
//    equal(element[0] == null, true, 'Search Element By key.');

    // Search Element By location.
//    var element = elementBinder.search(connector, {
//        location : []
//    }, options);
//    equal(element == null, true, 'Search Element By key.');

    // Make the cache narrow by className.
    elementBinder.makeCache(connector, {
        className : 'Ground'
    });

    // Make the cache narrow by location.
    elementBinder.makeCache(connector, {
        location : {x : 0, y : 0, z : 0}
    });
    
    // Remove ElementRelationship.
    elementBinder.remove(key);
    var element = elementBinder.search(connector, {
        target : emptyElement
    });
    equal(element == null, true, 'Remove ElementRelationship.');

});