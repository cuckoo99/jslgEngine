module('Element');
// 非同期の範囲取得テスト
testSettingAsSync("TestJSlgElement", {
		mainData : {width:10,height:10}
	},
	function(iconController, mainController, connector, options) {
	
	var result;
	var separator = jslgEngine.config.elementSeparator;
	
	var element = new jslgEngine.model.common.JSlgElement({
		keyPathCodes : ['t', 'e', 's'],
		keyCode : 's'
	});
	var elementParent = new jslgEngine.model.common.JSlgElement({
		keyPathCodes : ['t', 'e'],
		keyCode : 'e'
	});
	var elementOwner = new jslgEngine.model.common.JSlgElement({
		keyPathCodes : ['t'],
		keyCode : 't'
	});

	var elementParent2 = new jslgEngine.model.common.JSlgElement({
		keyPathCodes : ['t', 'e'],
		keyCode : 'e'
	});
	var elementItem = new jslgEngine.model.common.JSlgElement({
		keyPathCodes : ['t', 'e', 's', 'i'],
		keyCode : 'i'
	});

	//キーの追加・削除・更新・取得
	testAsSync('キーの取得', connector, function(name, connector_s) {
		var keyData = element.getKeyData();
		equal(keyData instanceof jslgEngine.model.common.JSlgKey, true, name);
	});
	testAsSync('キーの設定', connector, function(name, connector_s) {
		element.setKey('human');
		result = element.getKey();
		equal(result, 'human', name);
	});
	testAsSync('キーの取得', connector, function(name, connector_s) {
		result = element.getKey('e');
		equal(result, '', name);
	});
	testAsSync('キーの設定（親）', connector, function(name, connector_s) {
		elementOwner.setKey('owner');
		elementParent.setKey('parent');
		result = elementParent.getKey();
		equal(result, 'parent', name);
	});
	testAsSync('パスの取得', connector, function(name, connector_s) {
		result = elementParent.getPath();
		equal(result, ['', 'parent'].join(separator), name);
	});
	testAsSync('キーの再設定後のパスの取得', connector, function(name, connector_s) {
		elementParent.resetKey(elementOwner);
		result = elementParent.getPath();
		equal(result, ['owner','parent'].join(separator), name);
	});
	testAsSync('キーの再設定後のパスの取得（親の親）', connector, function(name, connector_s) {
		element.resetKey(elementParent);
		result = element.getPath();
		equal(result, ['owner','parent','human'].join(separator), name);
	});
	//子要素の追加・削除・更新・取得
	testAsSync('子要素の追加', connector, function(name, connector_s) {
		elementOwner.addChild({
			obj : elementParent2
		}, options);
		result = elementParent2.getPath();
		equal(result, ['owner', ''].join(separator), name);
	});
	testAsSync('深度の深い子要素の追加', connector, function(name, connector_s) {
		elementItem.setKey('item');
		element.addChild({
			obj : elementItem
		}, options);
		result = elementItem.getPath();
		equal(result, ['owner', 'parent', 'human', 'item'].join(separator), name); 
	testAsSync('子要素を取得', connector, function(name, connector_s) {
        var elm = element.getChild({
            key : 'item'
        });
		var result = elm.getPath();
		equal(result, ['owner', 'parent', 'human', 'item'].join(separator), name);
	});
	testAsSync('子要素をクラス名で取得', connector, function(name, connector_s) {
        elementItem.className = 'hogeItem';
        var elm = element.getChild({
            className : 'hogeItem'
        });
		var result = elm.getPath();
		equal(result, ['owner', 'parent', 'human', 'item'].join(separator), name);
	});
	});
	testAsSync('子要素に子要素の追加', connector, function(name, connector_s) {
		elementParent2.setKey('parent2');
		elementParent2.addChild({
			obj : element
		}, options);
		result = element.getPath();
		equal(result, ['owner', 'parent2', 'human'].join(separator), name);
	});
	testAsSync('子要素の削除後のパス取得（親）', connector, function(name, connector_s) {
		elementParent2.removeChild({
			obj : element
		}, options);
		result = element.getPath();
		equal(result, ['', '', 'human'].join(separator), name);
	});
	testAsSync('子要素の削除後のパス取得（子）', connector, function(name, connector_s) {
		elementParent2.removeChild({
			obj : element
		}, options);
		result = elementItem.getPath();
		equal(result, ['', '', 'human', 'item'].join(separator), name);
	});
	testAsSync('子要素の差し替え後のパス取得', connector, function(name, connector_s) {
		elementParent.addChild({
			obj : element
		}, options);
		result = element.getPath();
		equal(result, ['owner', 'parent', 'human'].join(separator), name);
	});
	testAsSync('孫要素への影響（パスが書き換わる）', connector, function(name, connector_s) {
		result = elementItem.getPath();
		equal(result, ['owner', 'parent', 'human', 'item'].join(separator), name);
	});
	//ステータス要素の追加・削除・更新・取得
	testAsSync('ステータスの設定・取得', connector, function(name, connector_s) {
		element.setStatus('test1',1);
		
		var result = element.getStatus('test1').value;
		equal(result, 1, name);
	});
	testAsSync('ステータスのパスを取得', connector, function(name, connector_s) {
		var result = element.getStatus('test1').getPath();
		equal(result, ['owner', 'parent', 'human', 'test1'].join(separator), name);
	});
	testAsSync('ステータスが文字列として扱われているか確認', connector, function(name, connector_s) {
		element.setStatus('test2','2');
		
		var result = element.getStatus('test2').value;
		equal(result, '2', name);
	});
	testAsSync('ステータスを削除後、パスを確認', connector, function(name, connector_s) {
		elementParent.removeChild({
			obj : element
		}, options);
	
		var result = element.getStatus('test1').getPath();
		equal(result, ['', '', 'human', 'test1'].join(separator), name);
	});
});