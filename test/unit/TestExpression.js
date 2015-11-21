module('Element');

testSettingAsAsync("TestExpression", {
	mainData : {width:10,height:10},
	timeOut : 4000
},
function(iconController, mainController, connector, options) {

	var result;
	var expression;
	var locationSeparator = '_';
	var elementSeparator = '.';
	var from, to;
	var code = '5+5';
	var parameters;

	expression = new jslgEngine.model.logic.Expression({
		code : code
	});

	var data = {};
	var options = {
		mainController : mainController,
		iconController : iconController
	};

	testAsSync('get reverse polish notation text', connector, function(name, connector_s) {
		result = expression.getPolandStatement(code);
		equal(result, '5 5+', name);
	});

	testAsSync('addition', connector, function(name, connector_s) {
		result = expression.getPolandArguments('5+5');
		expression._parameters = result;
		expression.getElement(connector_s, data, options);
		connector_s.connects(function(connector_ss, result_ss) {
			result = result_ss[0].value;
			equal(result, 10, name);
		});
	});
	testAsSync('calculation more than two nodes', connector, function(name, connector_s) {
		result = expression.getPolandArguments('3*5+5');
		
		expression._parameters = result;
		expression.getElement(connector_s, data, options);
		
		connector_s.connects(function(connector_ss, result_ss) {
			result = result_ss[0].value;
			equal(result, 20, name);
		});
	});
	testAsSync('括弧の演算', connector, function(name, connector_s) {
		result = expression.getPolandArguments('4*(5+5)');
		expression._parameters = result;
		expression.getElement(connector_s, data, options);
		connector_s.connects(function(connector_ss, result_ss) {
			result = result_ss[0].value;
			equal(result, 40, name);
		});
	});
	testAsSync('括弧の演算２', connector, function(name, connector_s) {
		result = expression.getPolandArguments('8+(5*(8+2)/2)');
		expression._parameters = result;
		expression.getElement(connector_s, data, options);
		connector_s.connects(function(connector_ss, result_ss) {
			result = result_ss[0].value;
			equal(result, 33, name);
		});
	});
	testAsSync('比較', connector, function(name, connector_s) {
		result = expression.getPolandArguments('true==true');
		expression._parameters = result;
		expression.getElement(connector_s, data, options);
		connector_s.connects(function(connector_ss, result_ss) {
			result = result_ss[0].value;
			equal(result, true, name);
		});
	});
	testAsSync('加算後の比較（不一致）', connector, function(name, connector_s) {
		result = expression.getPolandArguments('(5+1)==(3+2)');
		expression._parameters = result;
		expression.getElement(connector_s, data, options);
		connector_s.connects(function(connector_ss, result_ss) {
			result = result_ss[0].value;
			equal(result, false, name);
		});
	});
	testAsSync('加算後の比較（一致）', connector, function(name, connector_s) {
		result = expression.getPolandArguments('(5+1)==(3+3)');
		expression._parameters = result;
		expression.getElement(connector_s, data, options);
		connector_s.connects(function(connector_ss, result_ss) {
			result = result_ss[0].value;
			equal(result, true, name);
		});
	});
	testAsSync('大なり', connector, function(name, connector_s) {
		result = expression.getPolandArguments('(5+1)<(3+7)');
		expression._parameters = result;
		expression.getElement(connector_s, data, options);
		connector_s.connects(function(connector_ss, result_ss) {
			result = result_ss[0].value;
			equal(result, true, name);
		});
	});
	testAsSync('大なり（一致）', connector, function(name, connector_s) {
		result = expression.getPolandArguments('(5+1)<(3+7)');
		expression._parameters = result;
		expression.getElement(connector_s, data, options);
		connector_s.connects(function(connector_ss, result_ss) {
			result = result_ss[0].value;
			equal(result, true, name);
		});
	});
	testAsSync('大なり（不一致）', connector, function(name, connector_s) {
		result = expression.getPolandArguments('(5+1)<9');
		expression._parameters = result;
		expression.getElement(connector_s, data, options);
		connector_s.connects(function(connector_ss, result_ss) {
			result = result_ss[0].value;
			equal(result, true, name);
		});
	});
	testAsSync('小なり', connector, function(name, connector_s) {
		result = expression.getPolandArguments('(5+1)>2');
		expression._parameters = result;
		expression.getElement(connector_s, data, options);
		connector_s.connects(function(connector_ss, result_ss) {
			result = result_ss[0].value;
			equal(result, true, name);
		});
	});
	testAsAsync('要素の取得', connector, function(name, connector_s) {
		result = expression.getPolandArguments('w1');
		expression._parameters = result;
		expression.getElement(connector_s, data, options);
		connector_s.connects(function(connector_ss, result_ss) {
			result = result_ss;
			equal(result.getKey(), 'w1', name);
		});
	});
	testAsAsync('親要素の取得', connector, function(name, connector_s) {
		result = expression.getPolandArguments('w1.r1.parent()');
		expression._parameters = result;
		expression.getElement(connector_s, data, options);
		connector_s.connects(function(connector_ss, result_ss) {
			result = result_ss;
			equal(result.getKey(), 'w1', name);
		});
	});
	testAsAsync('子要素の検索', connector, function(name, connector_s) {
		result = expression.getPolandArguments('w1.r1.find(x+3)');
		expression._parameters = result;
		expression.getElement(connector_s, data, options);
		connector_s.connects(function(connector_ss, result_ss) {
			result = result_ss.value;
			equal(result, null, name);
		});
	});
	testAsSync('加算', connector, function(name, connector_s) {
		elementA = expression.makeElement({ value : 10});
		elementB = expression.makeElement({ value : 20});

		result = expression.calculate([elementA], [elementB], '+')[0].value;
		equal(result, 30, name);
	});
	testAsSync('減算', connector, function(name, connector_s) {
		result = expression.calculate([elementA], [elementB], '-')[0].value;
		equal(result, -10, name);
	});
	testAsSync('乗算', connector, function(name, connector_s) {
		result = expression.calculate([elementA], [elementB], '*')[0].value;
		equal(result, 200, name);
	});
	testAsSync('除算', connector, function(name, connector_s) {
		result = expression.calculate([elementA], [elementB], '/')[0].value;
		equal(result, 0.5, name);
	});
	testAsSync('比較一致', connector, function(name, connector_s) {
		result = expression.calculate([elementA], [elementB], '==')[0].value;
		equal(result, false, name);
	});
	testAsSync('比較一致', connector, function(name, connector_s) {
		result = expression.calculate(null, undefined, '==')[0].value;
		equal(result, false, name);
	});
	testAsSync('比較一致', connector, function(name, connector_s) {
		result = expression.calculate(expression.makeElement({ value : 10}),
			expression.makeElement({ value : 10}), '==')[0].value;
		equal(result, true, name);
	});
	testAsSync('比較一致', connector, function(name, connector_s) {
		result = expression.calculate(expression.makeElement({ value : 'hoge'}),
			expression.makeElement({ value : 10}), '==')[0].value;
		equal(result, false, name);
	});
	testAsSync('比較一致', connector, function(name, connector_s) {
		result = expression.calculate(expression.makeElement({ value : 'hoge'}),
			expression.makeElement({ value : 'hoge'}), '==')[0].value;
		equal(result, true, name);
	});
	testAsSync('比較一致', connector, function(name, connector_s) {
		result = expression.calculate(new jslgEngine.model.stage.Cast({ key : 'hoge' }),
			new jslgEngine.model.stage.Cast({ key : 'hoge' }), '==')[0].value;
		equal(result, false, name);
	});
	testAsSync('比較一致', connector, function(name, connector_s) {
		var cast = new jslgEngine.model.stage.Cast({ key : 'hoge' });
		result = expression.calculate(cast, cast, '==')[0].value;
		equal(result, true, name);
	});
	testAsSync('比較一致', connector, function(name, connector_s) {
		result = expression.calculate(null, null, '==')[0].value;
		equal(result, true, name);
	});
	testAsSync('比較未満', connector, function(name, connector_s) {
		result = expression.calculate([elementA], [elementA], '<')[0].value;
		equal(result, false, name);
	});
	testAsSync('比較以下', connector, function(name, connector_s) {
		result = expression.calculate([elementA], [elementA], '<=')[0].value;
		equal(result, true, name);
	});
	testAsSync('探査予定の要素を取得', connector, function(name, connector_s) {
		code = 'w1.r1.0_0_0.test-w1.r1.0_0_0.hoge';
		expression = new jslgEngine.model.logic.Expression({
			code : code
		});
		result = expression.getJSlgElements();
		equal(result[0], 'w1.r1.0_0_0.test', name);
	});
	testAsSync('探査予定の要素を取得２', connector, function(name, connector_s) {
		equal(result[1], 'w1.r1.0_0_0.hoge', name);
	});
	testAsSync('文字列', connector, function(name, connector_s) {
		result = expression.getPolandArguments('"test"');
		expression._parameters = result;
		expression.getElement(connector_s, data, options);
		connector_s.connects(function(connector_ss, result_ss) {
			result = result_ss.value;
			equal(result, 'test', name);
		});
	});
	testAsSync('文字列と数値', connector, function(name, connector_s) {
		result = expression.getPolandArguments('"test"+12+"test"');
		expression._parameters = result;
		expression.getElement(connector_s, data, options);
		connector_s.connects(function(connector_ss, result_ss) {
			result = result_ss[0].value;
			equal(result, 'test12test', name);
		});
	});
});
