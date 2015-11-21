/*
 * @author cuckoo99
 */

(function() {
	// namespace:
	var o = this.jslgEngine = this.jslgEngine||{};
	o = (o.controller = o.controller||{});

	/**
	 * <p>
	 * this class is abstact.<br />
	 * it includes graphical objects managed.<br />
	 * </p>
	 * @class
	 * @name OnlineManager
	 * @memberOf jslgEngine.controller
	 * @constructor
	 */
	var OnlineManager = function(options) {
		this.initialize(options);
	};
	/**
	 *
	 */
	var p = OnlineManager.prototype;

	/**
	 * set up.
	 * 
	 * @name initialize
	 * @method
	 * @function
	 * @memberOf jslgEngine.controller.OnlineManager#
	 * @param {Object} options
	 **/
	p.initialize = function(options) {
		var self = this;
		self.mainUser = this.mainUser;
	};

	/**
	 * Address of the server.
	 *
	 * @name url
	 * @property
	 * @function
	 * @memberOf jslgEngine.controller.OnlineManager#
	 * @param {Object} options
	 **/
	p.url =  'http:localhost:8888/home/';

	/**
	 * Address of the server.
	 *
	 * @name url
	 * @property
	 * @function
	 * @memberOf jslgEngine.controller.OnlineManager#
	 * @param {Object} options
	 **/
	p.urls =  'https:localhost:8888/home/';
	
	/**
	 * main user.
	 *
	 * @name userAlias
	 * @property
	 * @function
	 * @memberOf jslgEngine.controller.OnlineManager#
	 * @param {Object} options
	 **/
	p.mainUser =  null;
	
	/**
	 * State of networking.
	 * If it works, frequently fetches elements and other info from the server.
	 * And changes main controller's kick method behavior as send requests to
	 * work action on the server.
	 *
	 * @name isOnline
	 * @property
	 * @function
	 * @memberOf jslgEngine.controller.OnlineManager#
	 * @param {Object} options
	 **/
	p.isOnline = false;

	/**
	 * get path of user area.
	 * 
	 * @name chnageNetworkingMode
	 * @method
	 * @function
	 * @memberOf jslgEngine.controller.OnlineManager#
	 * @param {Object} options
	 **/
	p.getUserAlias = function(alias, options) {
		var self = this;
		var al = alias||self.mainUser.getAlias();
		var worldRegion = options.mainController.getWorldRegion();
		var worldRegionKey = worldRegion.getKey();
		return [worldRegionKey,al].join(jslgEngine.config.elementSeparator);
	};

	/**
	 * 
	 * @name chnageNetworkingMode
	 * @method
	 * @function
	 * @memberOf jslgEngine.controller.OnlineManager#
	 * @param {Object} options
	 **/
	p.setMainUser = function(user) {
		var self = this;
		self.mainUser = user;
	};

	/**
	 * 
	 * @name chnageNetworkingMode
	 * @method
	 * @function
	 * @memberOf jslgEngine.controller.OnlineManager#
	 * @param {Object} options
	 **/
	p.findMainUser = function(connector, options) {
		var self = this;
		var localRegionKey = null;
		options.mainController.findElements(connector, {
			className : 'LocalRegion'
		}, options);
		connector.connects(function(connector_s, result_s) {
			var localRegions = result_s;
			if(localRegions.length === 1) {
				localRegionKey = localRegions[0].getKey();
			}
		});
		options.mainController.findElements(connector, {
			className : 'User'
		}, options);
		connector.connects(function(connector_s, result_s) {
			var users = result_s;
			for(var i = 0, len = users.length; i < len; i++) {
				var user = users[i];
				if(user.getKey() === localRegionKey) {
					self.setMainUser(user);
				}
			}
		});
	};

	/**
	 * change behavior of project.
	 * Then fetch elements from the server.
	 * and rewrite Element, Icon, Animation, and other related properties to synchronize.
	 * 
	 * @name chnageNetworkingMode
	 * @method
	 * @function
	 * @memberOf jslgEngine.controller.OnlineManager#
	 * @param {Object} options
	 **/
	p.changeNetworkingMode = function(connector, data, options) {
		var self = this;

		self.isOnline = data.isOnline;

		self.findMainUser(connector, options);
		connector.pipe(function(connector_s) {
			return options.iconController.requireInputText$(connector_s, {
				title : 'Require user name',
				message : 'write down your user name in this form.',
			}, options);
		}).connects(function(connector_s, result_s) {
			self.begin(connector_s, {
				alias : result_s
			}, options).connects(function(connector_ss, result_ss) {
				
				// refresh
				options.mainController.reset(options);
				//jslgEngine.log(result_ss);
				//var json = JSON.parse(result_ss);
				//if(json.success) {
					self.fetchElements(connector, data, options);
				//}
			});
		});
	};


	/**
	 * access to network.
	 * 
	 * @name begin
	 * @method
	 * @function
	 * @memberOf jslgEngine.controller.OnlineManager#
	 * @param {Object} options
	 **/
	p.begin = function(connector, data, options) {
		var self = this;

		var url = self.urls+'users/login';
		
		// location.href = url;
		
		// var path = self.getUserAlias(data.alias, options);
		// jslgEngine.log(path);
		// return connector.ajax({
		// 	type : 'post',
		// 	url : url,
		// 	data : {
		// 		'User' : {
		// 			'username' : path,
		// 			'password' : path
		// 		}
		// 	}
		// });
		
		return connector.resolve({
			success : true
		});
	};

	/**
	 * shut down network.
	 * 
	 * @name begin
	 * @method
	 * @function
	 * @memberOf jslgEngine.controller.OnlineManager#
	 * @param {Object} options
	 **/
	p.end = function(connector, data, options) {	
		var self = this;

		var url = self.urls+'users/logout';
		
		// var path = self.getUserAlias(null, options);
		
		// connector.ajax({
		// 	type : 'post',
		// 	url : url,
		// 	data : {
		// 	}
		// });
		
		connector.resolve({
			success : true
		});
	};

	/**
	 * send request to update elements on the client.
	 * 
	 * @name fetchElements
	 * @method
	 * @function
	 * @memberOf jslgEngine.controller.OnlineManager#
	 * @param {Object} options
	 **/
	p.fetchElements = function(connector, data, options) {
		var self = this;

		var url = self.url+'games/get';
		var range = {x:0,y:0,z:0,width:10,height:10,depth:10};

		//TODO: it should be included user name.
		var path = self.getUserAlias(null, options);
		var localRegionKey = 'r1';

		connector.ajax({
			type : 'get',
			url : url,
			data : {
				path : path,
				type : 'all',
				default : true, //for test.
			},
		}).connects(function(connector_s, elements) {
			jslgEngine.log(elements);
			var elements = JSON.parse(elements).elements;

			// arrange order by resource, frame.
			elements.sort(this.sortElements);
			self.attachElements(connector_s, elements, options);
			jslgEngine.onlineMode = true;
		});
	};

	/**
	 * send request to update elements on the client.
	 * 
	 * @name fetchElements
	 * @method
	 * @function
	 * @memberOf jslgEngine.controller.OnlineManager#
	 * @param {Object} options
	 **/
	p.run = function(connector, data, options) {
		var self = this;

		var url = self.url+'games/run';

		//TODO: it should be included user name.
		var path = self.getUserAlias(null, options);
		var commandPath = data.id;
		
		connector.ajax({
			type : 'get',
			url : url,
			data : {
				path : commandPath,
				default : true, //for test.
			},
		}).connects(function(connector_s, result_s) {
			var elements = JSON.parse(result_s).elements;

			// arrange order by resource, frame.
			elements.sort(this.sortElements);
			self.attachElements(connector, elements, options);
		});
	};

	/**
	 * sort elements by lowest dependence.
	 * 
	 * @name attachElements
	 * @method
	 * @function
	 * @memberOf jslgEngine.controller.OnlineManager#
	 * @param {Object} options
	 **/
	p.sortElements = function(a, b) {	
		var f = (function(elm) {
			var max = 256;
			var clsName = elm.className;
			//var pathLength = max - elm.path.length;
			if(clsName === 'Resource') {
				return 1;
			} else if(clsName.indexOf('Frame') !== -1) {
				return 2;
			}
			return 2+elm.path.length;
		})
		return f(a) - f(b);
	};

	/**
	 * merge existing elements between client and arguments.
	 * 
	 * @name attachElements
	 * @method
	 * @function
	 * @memberOf jslgEngine.controller.OnlineManager#
	 * @param {Object} options
	 **/
	p.attachElements = function(connector, elements, options) {
		var createdElements = [];
		var caches = [];
		var resources = [];

		connector.loop({
			elements : elements,
			limit : 100
		}, function(connector_s, result_s) {
			var element = result_s;
			jslgEngine.log(element.className);

			if(!caches[element.path]) {
				options.mainController.findElements(connector_s, {
					key : element.path,
				}, options);
			}
			connector_s.connects(function(connector_ss, result_s) {
				var elms = result_s ? result_s : [caches[element.path]];

				if(elms.length === 1) {
					var elm = elms[0];

					caches[element.path] = elm;
					//reformat.
					element.key = element.keyword;
					
					var m = options.iconController.converter.getModel({
						property : element,
						createdElements : createdElements
					}, options);

					if(!m) {
						jslgEngine.log('fail to make:'+elememt.className);
						return;
					}

					m.wasRewrited = true;

					if(element.className === 'Resource') {
						resources.push(m);
					}

					jslgEngine.log('add '+m.className+' in '+elms[0].getPath());

					var tgt = elm.getChild({
						key : element.key
					});
					if(!tgt) {
						elm.addChild({
							obj : m
						}, options);
						tgt = m;
					} else {
						tgt.setKey(element.key);
						tgt.parameter = element.parameter;
						tgt.className = element.className;
						if(element.className === 'Status') {
							tgt.value = element.value;
						}
					}

					//tgt.getKeyData().setUniqueId(element.id);
				}
			});
		});
		// load graphical objects.
		connector.connects(function(connector_s) {
			options.mainController.addResourceElements({
				resources : resources
			});
		});
		connector.connects(function(connector_s) {
			options.mainController.load(connector_s, {}, options);
		});
		connector.connects(function(connector_s) {
			jslgEngine.build(connector_s, {}, options);
		});
	};
	
	o.OnlineManager = OnlineManager;
}());
