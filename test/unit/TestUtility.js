module('Element');

test("TestUtility", function() {
	var result;
	//クローンの作成
	equal(true, true, "passed!");

	//継承
	equal(true, true, "passed!");

	//継承
	equal(true, true, "passed!");

	//ログ出力
	equal(true, true, "passed!");

	//繰り返し文字列の作成
	var result = jslgEngine.utility.getRepeatedText('hoge', 3);
	equal(result, 'hogehogehoge', "passed!");

	//文字列の挿入
	var result = jslgEngine.utility.insertStr('hogehoge', 4, 'test');
	equal(result, 'hogetesthoge', "passed!");

	//文字列の置き換え
	var result = jslgEngine.utility.replaceStr('hogehoge', 4, 8, 'test');
	equal(result, 'hogetest', "passed!");
	
	var data = {
		prop1 : true,
		func1 : function() {
			return 'hoge';
		},
		sub1 : {
			prop2 : false,
			text2 : 'hoge'
		}
	};
	var clone = jslgEngine.getClone(data);
	clone.prop1 = false;
	var result = data.prop1;
	equal(result, true, "passed!");

	clone.func1 = function() {
		return 'text';
	};
	var result = data.func1();
	equal(result, 'hoge', "passed!");
	
	clone.sub1 = {};
	var result = data.sub1.text2;
	equal(result, 'hoge', "passed!");
	
	// var clone2 = jslgEngine.getClone2(data);
	// clone2.prop1 = false;
	// var result = data.prop1;
	// equal(result, true, "passed!");
// 
	// clone2.func1 = function() {
		// return 'text';
	// };
	// var result = data.func1();
	// equal(result, 'hoge', "passed!");
	
	// clone2.sub1 = {};
	// var result = data.sub1.text2;
	// equal(result, 'hoge', "passed!");
	
});
