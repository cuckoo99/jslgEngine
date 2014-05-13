module('Element');

asyncTest("TestConnector", function() {
	var count = 1;
	var logLevel = 4;
	
	function func2(options) {
		jslgEngine.log(options.num, logLevel);
		count++;
		setTimeout(function() {
			jslgEngine.log(options.num+'+wait', logLevel);
			count--;
			options.resolve(options);
		}, 100);
	}

	function func3(options) {
		jslgEngine.log(options.num, logLevel);
		count++;
		setTimeout(function() {
			jslgEngine.log(options.num+'+wait', logLevel);
			count--;
			options.resolve(options);
		}, 2000);
	}

	function func4(connector_s, result) {
		jslgEngine.log(result, logLevel);
		setTimeout(function() {
			jslgEngine.log('Async'+result, logLevel);
			connector_s.resolve(result);
		}, 500);
	}

	obj = {
		stage : 'test',
		unresolved : false
	};

	var a = new jslgEngine.model.network.ConnectorOnline();

	a.pipe(function(connector_ss, result_ss) {
		func4(connector_ss, 10);
	});
	a.pipe(function(connector_s) {
		connector_s.resolve().pipe(function(connector_ss, result_ss) {
			func4(connector_ss, 10);
		});
		connector_s.pipe(function(connector_ss, result_ss) {
			equal(result_ss, 10, '引数受け取り１');
			func4(connector_ss, result_ss-1);
		});
		connector_s.connects(function(connector_ss, result_ss) {
			connector_ss.connects(function(connector_sss, result_sss) {
				connector_sss.pipe(function(connector_ssss, result_ssss) {
					equal(result_ssss, 9, '引数受け取り２');
					func4(connector_ssss, result_ssss-1);
				}).connects(function(connector_ssss, result_ssss) {
					equal(result_ssss, 8, '引数受け取り３');
				}).pipe(function(connector_ssss, result_ssss) {
					equal(result_ssss, 8, '引数受け取り４');
					func4(connector_ssss, result_ssss-1);
				});
			});
			connector_ss.pipe(function(connector_sss, result_sss) {
				equal(result_sss, 7, '引数受け取り５');
				func4(connector_sss, result_sss-1);
			});
		});
	}).connects(function(connector_s, result_s) {
		equal(result_s, 6, '引数受け取り６');
		func4(connector_s, result_s-1);
	});

	a.pipe(function(options2) {
		jslgEngine.log(0, logLevel);
		options2.resolve();
		return options2;
	});
	a.pipe(function(options2) {
		jslgEngine.log(1, logLevel);

		var d = options2.resolve();

		for(var i = 0; i < 3; i++) {
			d.pipe(function(options) {
				options.num = 2;
				func2(options);
				return options;
			});
		}
		d.pipe(function(options) {
			jslgEngine.log(5, logLevel);
			options.resolve();
			return options;
		});
		return d;
	});

	a.pipe(function(options2) {
		equal(count, 1, '○カウント');
		jslgEngine.log(6, logLevel);

		var d = options2.resolve()
		.pipe(function(options_x) {
			options_x.resolve().pipe(function(options_xx) {
				options_xx.num = 7;
				func2(options_xx);
				return options_xx;
			}).pipe(function(options_xx) {
				options_xx.num = 8;

				options_xx.resolve().pipe(function(options_xxx) {
					options_xxx.num = 80;
					func3(options_xxx);
					return options_xxx;
				});
				return options_xx;
			}).pipe(function(options_xx) {
				var num1 = 85;
				// setTimeout(function() {
					// jslgEngine.log(num1+'+wait', logLevel);
					// count--;
					// // options_xx.pipe(function(options_xxx) {
						// // // setTimeout(function() {
							// // // jslgEngine.log(90+'+wait', logLevel);
							// // // options_xxx.resolve(options_xxx);
						// // // }, 500);
// // 						
						// // options_xxx.resolve();
					// // });
					// options_xx.$df.resolve();
				// }, 500);
				return options_xx.resolve();
			});
			return options_x;
		}).pipe(function(options) {
			options.num = 9;
			func2(options);
			return options;
		}).pipe(function(options) {
			options.num = 10;
			func2(options);
			return options;
		}).pipe(function(options) {
			options.resolve();
			return options;
		});
		return d;
	}).pipe(function(options) {
		options.num = 11;
		func2(options);
		return options;
	}).pipe(function(options) {
		equal(count, 1, '○カウント');
		start();
	});
	
	//結合
	//equal(true, true, "passed!");

	//ループ
	//equal(true, true, "passed!");

	//解決
	//equal(true, true, "passed!");

	//失敗
	//equal(true, true, "passed!");
// 	
	// setTimeout(function() {
		// jslgEngine.log('Test Connector Timed out ----------');
		// start();
	// }, 5000);
});