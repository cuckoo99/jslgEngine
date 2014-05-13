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
	 * @name MindFrame
	 * @memberOf jslgEngine.model.mind
	 * @constructor
	 */
	var MindFrame = jslgEngine.extend(
		jslgEngine.model.common.JSlgElementFrame,
		function(data, options) {
			this.initialize(data, options);
			
			//this.makeArguments(data);
		}
	);
	/**
	 *
	 */
	var p = MindFrame.prototype;

	/**
	 * クラス名
	 *
	 * @name className
	 * @property
	 * @type String
	 * @memberOf jslgEngine.model.mind.MindFrame#
	 **/
	p.className = 'MindFrame';

	/**
	 * 対象キーコード
	 *
	 * @name keyCode
	 * @property
	 * @type String
	 * @memberOf jslgEngine.model.mind.MindFrame#
	 **/
	p._keyCode = 'MindFrame';

	/**
	 * Information to decide its activity.
	 *
	 * @name makeArguments
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.mind.MindFrame#
	 * @param {Object} options
	 * <ul>
	 * </ul>
	 **/
	p.makeArguments = function(data) {
		var self = this;
		
        self.setStatus('decreasedKeys', data.decreasedKeys);
        self.setStatus('increasedKeys', data.increasedKeys);
        self.setStatus('memberKey', data.memberKey);
        self.setStatus('familyMemberNames', data.familyMemberNames);
        self.setStatus('enemyMemberNames', data.enemyMemberNames);
        self.setStatus('commandKey', data.commandKey);
        self.setStatus('commandValue', data.commandValue);
        
//		/**
//		 * コード
//		 *
//		 * @private
//		 * @name _arguments
//		 * @property
//		 * @type Object
//		 * @memberOf jslgEngine.model.mind.MindFrame#
//		 **/
//		self._arguments = {
//			/**
//			 * ステータス
//			 *
//			 * @private
//			 * @name status
//			 * @property
//			 * @type Object
//			 * @memberOf jslgEngine.model.mind.MindFrame._arguments#
//			 **/
//			status : {
//				/**
//				 * 自身の数値を減少させる事で優位に立てる要素（ステータス）
//				 *
//				 * @private
//				 * @name decreasedKeys
//				 * @property
//				 * @type String[]
//				 * @memberOf jslgEngine.model.mind.MindFrame._arguments#
//				 **/
//				decreasedKeys : [],
//				/**
//				 * 自身の数値を増加させる事で優位に立てる要素（ステータス）
//				 *
//				 * @private
//				 * @name increasedKeys
//				 * @property
//				 * @type String[]
//				 * @memberOf jslgEngine.model.mind.MindFrame._arguments#
//				 **/
//				increasedKeys : [],
//				/**
//				 * 自身の所属を表す要素（ステータス）
//				 *
//				 * @private
//				 * @name memberKey
//				 * @property
//				 * @type String
//				 * @memberOf jslgEngine.model.mind.MindFrame._arguments#
//				 **/
//				member : {
//					/**
//					 * 自身の所属を表す要素（ステータス）
//					 *
//					 * @private
//					 * @name key
//					 * @property
//					 * @type String
//					 * @memberOf jslgEngine.model.mind.MindFrame._arguments#
//					 **/
//					key : null,
//					/**
//					 * 味方の所属名
//					 *
//					 * @private
//					 * @name familyMemberNames
//					 * @property
//					 * @type String[]
//					 * @memberOf jslgEngine.model.mind.MindFrame._arguments#
//					 **/
//					familyMemberNames : [],
//					/**
//					 * 味方の所属名
//					 *
//					 * @private
//					 * @name enemyMemberNames
//					 * @property
//					 * @type String[]
//					 * @memberOf jslgEngine.model.mind.MindFrame._arguments#
//					 **/
//					enemyMemberNames : []
//				},
//				/**
//				 * 実行できるイベント要素（ステータス）
//				 *
//				 * @private
//				 * @name command
//				 * @property
//				 * @type String
//				 * @memberOf jslgEngine.model.mind.MindFrame._arguments#
//				 **/
//				command : {
//					/**
//					　* 実行できるイベント要素（ステータス）
//					 *
//					 * @private
//					 * @name key
//					 * @property
//					 * @type String
//					 * @memberOf jslgEngine.model.mind.MindFrame._arguments#
//					 **/
//					key : null,
//					/**
//					　* 実行できるイベント要素（ステータス）
//					 *
//					 * @private
//					 * @name value
//					 * @property
//					 * @type String
//					 * @memberOf jslgEngine.model.mind.MindFrame._arguments#
//					 **/
//					value : null
//				}
//			}
//		};
	};
    
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
	p.getArguments = function(data) {
		var self = this;
		
        var decreasedKeys = self.getStatus('decreasedKeys');
        var increasedKeys = self.getStatus('increasedKeys');
        var memberKey = self.getStatus('memberKey');
        var familyMemberNames = self.getStatus('familyMemberNames');
        var enemyMemberNames = self.getStatus('enemyMemberNames');
        var commandKey = self.getStatus('commandKey');
        var commandValue = self.getStatus('commandValue');
        
        return {
            decreasedKeys : decreasedKeys.value,
            increasedKeys : increasedKeys.value,
            memberKey : memberKey.value,
            familyMemberNames : familyMemberNames.value,
            enemyMemberNames : enemyMemberNames.value,
            commandKey : commandKey.value,
            commandValue : commandValue.value
        };
    };

	/**
	 * 実体要素取得
	 *
	 * @name getModel
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.mind.MindFrame#
	 **/
	p.getModel = function(data, options) {
        var self = this;
		var mindArguments = self.getArguments();
        
        data.decreasedKeys = mindArguments.decreasedKeys;
        data.increasedKeys = mindArguments.increasedKeys;
        data.memberKey = mindArguments.memberKey;
        data.familyMemberNames = mindArguments.familyMemberNames;
        data.enemyMemberNames = mindArguments.enemyMemberNames;
        data.commandKey = mindArguments.commandKey;
        data.commandValue = mindArguments.commandValue;
        
		return new jslgEngine.model.mind.Mind(data, options);
	};
    
	/**
	 * XML文字列形式として返す
	 *
	 * @name toXML
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.mind.MindFrame#
	 * @returns {String}
	 */
	p.toXML = function(options) {
		var self = this;
		var opts = options||{};
		opts.increment = opts.increment != null ? opts.increment : 0;
        
        // exceptional key.
        if(self.getKey()[0] === '_' || self.isUnexportment) {
            return null;
        }
        
		var mindArguments = self.getArguments();
        
		var space = '\t';
		var inc = opts.increment+1;
		var getIncrement = function(cnt, has_ret) {
			var retCode = has_ret ? '\r' : '';
			return retCode + jslgEngine.utility.getRepeatedText(space, cnt);
		}
		var limit = 10;
		var className = ['<className>',self.className,'</className>'].join('');
		var key = ['<key>',self.getKey(),'</key>'].join('');
		
		var getNestedProperties = function(cnt, tgt, name) {
			if(cnt > limit) return '';
			var tx = '';
			if(tgt instanceof Array) {
				var stk = [];
				for(var i = 0; i < tgt.length; i++) {
                    var prp = arguments.callee(cnt+1, tgt[i], name);
                    if(tgt[i] instanceof Array) {
					   prp = [getIncrement(inc+cnt+1, true),prp,getIncrement(inc+cnt, true)].join('');
                    }
					stk.push(['<'+name+'>',prp,'</'+name+'>'].join(''));
				}
				tx = stk.join(getIncrement(inc+cnt, true));
                return tx;
			} else {
				tx = tgt;
				return tx;
			}
		};
		
		var memberKey = '', increacedKeys = '', decreacedKeys = '', familyMemberNames = '', enemyMemberNames = '';
		if(self._arguments) {
            memberKey = '<memberKey>'+self._arguments.status.member.key+'</memberKey>';
            
			increacedKeys = (mindArguments.increasedKeys instanceof Array) ?
						['<increasedKeys>',getIncrement(inc+1, true),getNestedProperties(1, mindArguments.increasedKeys, 'argument'),getIncrement(inc, true),'</increasedKeys>'].join('') : '<increasedKeys></increasedKeys>';
            
            decreacedKeys = (mindArguments.decreasedKeys instanceof Array) ?
						['<decreasedKeys>',getIncrement(inc+1, true),getNestedProperties(1, mindArguments.decreasedKeys, 'argument'),getIncrement(inc, true),'</decreasedKeys>'].join('') : '<decreasedKeys></decreasedKeys>';
            
            familyMemberNames = (mindArguments.familyMemberNames instanceof Array) ?
						['<familyMemberNames>',getIncrement(inc+1, true),getNestedProperties(1, mindArguments.familyMemberNames, 'argument'),getIncrement(inc, true),'</familyMemberNames>'].join('') : '<familyMemberNames></familyMemberNames>';
            
            enemyMemberNames = (mindArguments.enemyMemberNames instanceof Array) ?
						['<enemyMemberNames>',getIncrement(inc+1, true),getNestedProperties(1, mindArguments.enemyMemberNames, 'argument'),getIncrement(inc, true),'</enemyMemberNames>'].join('') : '<enemyMemberNames></enemyMemberNames>';
		}
        var resource = '';
        var resourceElement = self.getChild({ key : '$FRAME'});
        if(resourceElement) {
            var frame = resourceElement.getChildren()[0];
            resource = frame ? ['<source>',frame.getKey(),'</source>'].join('') : '';
        }
		
		var childrenWords = [];
		var length = self._children.length;
		for(var i = 0; i < length; i++) {
			var child = self._children[i];
            var childText = child.toXML({increment : inc});
			if(childText) {
                childrenWords.push(childText);
            }
		}
		var targets = [className,resource,key,increacedKeys,decreacedKeys,familyMemberNames,enemyMemberNames,childrenWords.join(getIncrement(inc, true))];
		var t, nw = [];
		while ((t = targets.shift()) !== undefined) {
			if (t !== "") nw.push(t);
		}
		getNestedProperties = null;
		var text = ['<element>',nw.join(getIncrement(inc, true))].join(getIncrement(inc, true))+
					getIncrement(inc-1, true)+'</element>';
		return text;
	};
    
	o.MindFrame = MindFrame;
}());