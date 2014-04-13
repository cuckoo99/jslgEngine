/*
 * @author cuckoo99
 */

(function() {
	// namespace:
	var o = this.jslgEngine = this.jslgEngine||{};
	o = (o.model = o.model||{});
	o = (o.mind = o.mind||{});

	/**
	 * <h4>人工知能クラス</h4>
	 * <p>
	 * 推奨される行動を考え、実行する。<br />
	 * または、最適なイベントを返す。<br />
	 * <br />
	 * 基本的にSLG固有のシステムに依存する。
	 * </p>
	 * @class
	 * @name Mind
	 * @memberOf jslgEngine.model.mind
	 * @constructor
	 */
	var Mind = jslgEngine.extend(
		jslgEngine.model.common.JSlgElementBase,
		function(data, options) {
			this.initialize(data, options);
			
			this._makeArguments();
			this._arguments.status.decreasedKeys = data.decreasedKeys;
			this._arguments.status.increasedKeys = data.increasedKeys;
			this._arguments.status.member.key = data.memberKey;
			this._arguments.status.member.familyMemberNames = data.familyMemberNames;
			this._arguments.status.member.enemyMemberNames = data.enemyMemberNames;
			this._arguments.status.command.key = data.commandKey;
			this._arguments.status.command.value = data.commandValue;
		}
	);
	/**
	 *
	 */
	var p = Mind.prototype;

	/**
	 * クラス名
	 *
	 * @name className
	 * @property
	 * @type String
	 * @memberOf jslgEngine.model.mind.Mind#
	 **/
	p.className = 'Mind';

	/**
	 * 対象キーコード
	 *
	 * @name keyCode
	 * @property
	 * @type String
	 * @memberOf jslgEngine.model.mind.Mind#
	 **/
	p._keyCode = 'Mind';

	/**
	 * 実行
	 *
	 * @name _makeArguments
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.mind.Mind#
	 * @param {Object} options
	 * <ul>
	 * </ul>
	 **/
	p._makeArguments = function() {
		var self = this;
		
		/**
		 * コード
		 *
		 * @private
		 * @name _arguments
		 * @property
		 * @type Object
		 * @memberOf jslgEngine.model.mind.Mind#
		 **/
		self._arguments = {
			/**
			 * ステータス
			 *
			 * @private
			 * @name status
			 * @property
			 * @type Object
			 * @memberOf jslgEngine.model.mind.Mind._arguments#
			 **/
			status : {
				/**
				 * 自身の数値を減少させる事で優位に立てる要素（ステータス）
				 *
				 * @private
				 * @name decreasedKeys
				 * @property
				 * @type String[]
				 * @memberOf jslgEngine.model.mind.Mind._arguments#
				 **/
				decreasedKeys : [],
				/**
				 * 自身の数値を増加させる事で優位に立てる要素（ステータス）
				 *
				 * @private
				 * @name increasedKeys
				 * @property
				 * @type String[]
				 * @memberOf jslgEngine.model.mind.Mind._arguments#
				 **/
				increasedKeys : [],
				/**
				 * 自身の所属を表す要素（ステータス）
				 *
				 * @private
				 * @name memberKey
				 * @property
				 * @type String
				 * @memberOf jslgEngine.model.mind.Mind._arguments#
				 **/
				member : {
					/**
					 * 自身の所属を表す要素（ステータス）
					 *
					 * @private
					 * @name key
					 * @property
					 * @type String
					 * @memberOf jslgEngine.model.mind.Mind._arguments#
					 **/
					key : null,
					/**
					 * 味方の所属名
					 *
					 * @private
					 * @name familyMemberNames
					 * @property
					 * @type String[]
					 * @memberOf jslgEngine.model.mind.Mind._arguments#
					 **/
					familyMemberNames : [],
					/**
					 * 味方の所属名
					 *
					 * @private
					 * @name enemyMemberNames
					 * @property
					 * @type String[]
					 * @memberOf jslgEngine.model.mind.Mind._arguments#
					 **/
					enemyMemberNames : []
				},
				/**
				 * 実行できるイベント要素（ステータス）
				 *
				 * @private
				 * @name command
				 * @property
				 * @type String
				 * @memberOf jslgEngine.model.mind.Mind._arguments#
				 **/
				command : {
					/**
					　* 実行できるイベント要素（ステータス）
					 *
					 * @private
					 * @name key
					 * @property
					 * @type String
					 * @memberOf jslgEngine.model.mind.Mind._arguments#
					 **/
					key : null,
					/**
					　* 実行できるイベント要素（ステータス）
					 *
					 * @private
					 * @name value
					 * @property
					 * @type String
					 * @memberOf jslgEngine.model.mind.Mind._arguments#
					 **/
					value : null
				}
			}
		};
	};

	/**
	 * 最適なイベントドライバを取り出す。
	 *
	 * @name chooseCommandDrivers
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.mind.Mind#
	 * @param {Object} options
	 * <ul>
	 * </ul>
	 **/
	p.chooseCommandDrivers = function(connector, data, options) {
		var self = this;
		var length;
		var region = options.mainController.getWorldRegion();
		var mindArguments = self._arguments;
		var result = [];
		
		var casts = [];
		region.findElements(connector, {
			className : 'Cast'
		}, options);
		connector.connects(function(connector_s, result_s) {
			casts = result_s;
			
			var keyPathCodes = jslgEngine.getElementPathCodes(jslgEngine.model.stage.keys.CAST);
			
			var path = self.getPath(keyPathCodes);

			region.findElements(connector_s, {
				key : path
			}, options);
			connector_s.connects(function(connector_ss, result_ss) {
				var me = result_ss[0];
				
				var family = self._pickUpElements(
					mindArguments.status.member.key,
					mindArguments.status.member.familyMemberNames,
					casts,
					options
					);
				var enemy = self._pickUpElements(
					mindArguments.status.member.key,
					mindArguments.status.member.enemyMemberNames,
					casts,
					options
					);
		        
		        //シミュレートし、最適なイベントドライバを得る。
		        var simulator = new jslgEngine.model.mind.Simulator({
		        	arguments : mindArguments
		        }, options);
		        
		        simulator.run(connector_ss, {
		            me : me,
		            family : family,
		            enemy : enemy,
		            result : result
		        }, options);
			});
		});
        connector.pipe(function(connector_s, result_s) {
        	if(data.callback) {
	        	data.callback(result);
	        }
	        connector_s.resolve();
        });
	};

	/**
	 * 指定されたステータスを持つ要素を取り出す
	 * TODO: Simulatorと同じ機能なので統合が必要。
	 *
	 * @name _pickUpElements
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.mind.Mind#
	 * @param {Object} options
	 * <ul>
	 * </ul>
	 **/
	p._pickUpElements = function(key, values, objs, options) {
		var length, objsLength;
		var elements = [];
		length = values.length;
		for(var i = 0; i < length; i++) {
			var value = values[i];
			objsLength = objs.length;
			for(var j = 0; j < objsLength; j++) {
				var obj = objs[j];
				var status = obj.getStatus(key);
				if(status && status.value === value) {
					elements.push(obj);
				}
			}
		}
		return elements;
	};
	
	/**
	 * 実オブジェクトの生成
	 * TODO:JSlgElementFrameを継承していないのに生成できる事、
	 *		自身を生成する事の問題
	 *
	 * @name getRunnableCommand
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.mind.Mind#
	 **/
	p.generate = function(data, options) {
		var self = this;
		
		return new jslgEngine.model.mind.Mind({
			key : data.key,
			decreasedKeys : self._arguments.status.decreasedKeys,
			increasedKeys : self._arguments.status.increasedKeys,
			memberKey : self._arguments.status.member.key,
			familyMemberNames : self._arguments.status.member.familyMemberNames,
			enemyMemberNames : self._arguments.status.member.enemyMemberNames,
			commandKey : self._arguments.status.command.key,
			commandValue : self._arguments.status.command.value
		}, options);
		//return self;
	};

	o.Mind = Mind;
}());