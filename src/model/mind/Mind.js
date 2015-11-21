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
		jslgEngine.model.common.JSlgElement,
		function(data, options) {
			this.initialize(data, options); 
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
	 * Information to decide its activity.
	 *
	 * @name getArguments
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.mind.MindFrame#
	 * @param {Object} options
	 * <ul>
	 * </ul>
	 **/
	p.getArguments = jslgEngine.model.mind.MindFrame.prototype.getArguments;
    
	/**
	 * 最適なイベントドライバを取り出す。
	 *
	 * @name chooseCommandDrivers
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.mind.MindFrame#
	 * @param {Object} options
	 * <ul>
	 * </ul>
	 **/
	p.chooseCommandDrivers = function(connector, data, options) {
		var self = this;
		var length;
		var region = options.mainController.getWorldRegion();
		var mindArguments = self.getArguments();
		var result = [];
		
		connector.connects(function(connector_s, result_s) {
			var casts = data.casts;
			
            var me = self.getParent(options);
            
            var family = self._pickUpElements(
                mindArguments.memberKey,
                mindArguments.familyMemberNames,
                casts,
                options
                );
            var enemy = self._pickUpElements(
                mindArguments.memberKey,
                mindArguments.enemyMemberNames,
                casts,
                options
                );
            
            //シミュレートし、最適なイベントドライバを得る。
            var simulator = new jslgEngine.model.mind.Simulator({
                parameters : mindArguments
            }, options);
            
            simulator.run(connector_s, {
                me : me,
                family : family,
                enemy : enemy,
                result : result
            }, options);
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
	 * @memberOf jslgEngine.model.mind.MindFrame#
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
	
	o.Mind = Mind;
}());
