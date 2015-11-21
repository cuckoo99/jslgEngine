module('Element');

test("TestJSlgKey", function() {
	//追加・削除・更新・取得
	//文字列化
	var result = null;

	var slgKey = new jslgEngine.model.common.JSlgKey({
		keys : ['t', 'e', 's', 't']
	});
	var separator = jslgEngine.config.elementSeparator;

	slgKey.setKey('t', 1);
	result = slgKey.getKey('t');
	equal(result, "", "passed!");

	result = slgKey.getPath(['t', 'e', 's', 't']);
	equal(result, ['','','',''].join(separator), "passed!");

	slgKey.setKey('t', {});
	result = slgKey.getKey('t');
	equal(result, "", "passed!");

	result = slgKey.getPath(['t', 'e', 's', 't']);
	equal(result, ['','','',''].join(separator), "passed!");

	slgKey.setKey('t', 't1');
	result = slgKey.getKey('t');
	equal(result, 't1', "passed!");


	result = slgKey.getPath(['e', 's']);
	equal(result, ['',''].join(separator), "passed!");


	result = slgKey.getPath(['t', 'e', 's', 't']);
	equal(result, ['t1','','','t1'].join(separator), "passed!");

	slgKey.rewrite({
		t : 'd',
		e : 'u',
		s : "s",
		t : "t"
	});
	result = slgKey.getPath(['t', 'e', 's', 't']);
	//オブジェクトのループの実行順序が保証されていない。
	equal(result, ['t','u','s','t'].join(separator), "passed!");

});
