/*
 * @author cuckoo99
 */

(function() {
	// namespace:
	var o = this.jslgEngine = this.jslgEngine||{};
	o = (o.model = o.model||{});
	o = (o.issue = o.issue||{});

	/**
	 * <h4>文章要求オブジェクト</h4>
	 * <p>
	 * 文字の選択による入力を必要とします。
	 * </p>
	 * @class
	 * @name RequiredMessage
	 * @memberOf jslgEngine.model.issue
	 * @constructor
	 */
	var RequiredMessage = jslgEngine.extend(
		jslgEngine.model.issue.Issue,
		function(data, options) {
			this.initialize(data, options);
		}
	);
	/**
	 *
	 */
	var p = RequiredMessage.prototype;

	/**
	 * 初期化
	 *
	 * @name initialize
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.issue.RequiredMessage#
	 **/
	p.initialize = function(data, options) {
		var self = this;
		
		// 現在のインデックス
		self._currentIndex = 0;
		// 設定情報
		self._settings = data ? data.settings : [];
		// 識別ID
		self._uniqueId = data ? data.uniqueId :
			[self.className,options.mainController.getUniqueId()].join('');
		// 適用情報
		self._issueDataSets = [];
	};

	/**
	 * 識別用ID
	 *
	 * @name _uniqueId
	 * @property
	 * @type jslgEngine.model.issue.Area[]
	 * @memberOf jslgEngine.model.issue.RequiredMessage#
	 **/
	p._uniqueId = null;

	/**
	 * 情報が格納されているステータス名
	 *
	 * @name answerStatusName
	 * @property
	 * @type jslgEngine.model.issue.Area[]
	 * @memberOf jslgEngine.model.issue.RequiredMessage#
	 **/
	p.answerStatusName = '_ANSWER';

	/**
	 * 適用可能な要素
	 *
	 * @name elementClassNames
	 * @property
	 * @type jslgEngine.model.issue.Area[]
	 * @memberOf jslgEngine.model.issue.RequiredMessage#
	 **/
	p.elementClassNames = null;

	/**
	 * クラス名
	 *
	 * @name className
	 * @property
	 * @type String
	 * @memberOf jslgEngine.model.issue.RequiredMessage#
	 **/
	p.className = 'RequiredMessage';

	/**
	 * 範囲の解決
	 *
	 * @name resolve
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.issue.RequiredMessage#
	 * @param {Object} obj
	 * @param {Object} options
	 **/
	p.resolve = function(connector, obj, data, options) {
		var self = this;
		
		if(self.apply(connector, obj, data, options)) {
			self.next();
			return true;
		}
		return false;
	};
	
	/**
	 * 範囲の適用
	 *
	 * @name apply
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.issue.RequiredMessage#
	 * @param {Object} obj
	 * @param {Object} options
	 **/
	p.apply = function(connector, obj, data, options) {
		var self = this;
		var settings = self._settings[self._currentIndex];
		var selection = settings.selection;
		
		//選択されたテキスト情報を得る
		answer = obj.getStatus(self.answerStatusName);
		
		if(!answer) {
			jslgEngine.log('No RequiredMessages Text');
			return false;
		}
		answer = answer.value;
		
		var hasIt = false;
		for(var i = 0; i < selection.length; i++) {
			if(selection[i].text === answer) {
				hasIt = true;
			}
		}
		if(!hasIt) {
			jslgEngine.log('RequiredMessage has no such a text');
			return false;
		}
		jslgEngine.log('applied RequiredMessage:'+answer);
		
		self.clear(self._currentIndex);
		
		var issueDataSet = new jslgEngine.model.issue.IssueDataSet({
			key : {
				layerIndex : self._currentIndex
			},
			text : answer,
			appliedElement : obj,
			appliedKeyData : obj.getKeyData ? obj.getKeyData() : obj
		});
		self._issueDataSets.push(issueDataSet);
		return true;
	};
	
	/**
	 * 次の要求へ
	 *
	 * @name next
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.issue.RequiredMessage#
	 **/
	p.next = function() {
		var self = this;
		
		// 設定の数と一致。
		if (self._settings.length - 1 > self._currentIndex) {
			self._currentIndex++;
			return self._currentIndex;
		}
		return false;
	};

	/**
	 * 互換性があれば、データセットを書き換える
	 *
	 * @name rewrite
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.issue.RequiredMessage#
	 * @param {Object} obj
	 * @param {Object} options
	 **/
	p.rewrite = function(required_message) {
		var self = this;
		var RequiredMessage = required_message;
		
		//TODO: 範囲要求に互換性があるかチェックが必要
		self._issueDataSets = RequiredMessage._issueDataSets;
	};
	
	/**
	 * 画面更新のためのプログラム
	 * TODO: ここでやるのも疑問か？
	 *
	 * @name update
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.issue.RequiredMessage#
	 * @param {Object} data
	 * @param {Object} options
	 */
	p.update = function(connector, data, options) {
		var self = this;
		
		connector.resolve();
        
        // 強制アップデートが指定された場合、何も描画処理を行わない。
        if(data.wasSolved === false) return;
        
		connector.pipe(function(connector_s) {
            self._removeMessages$(connector_s, options);
        });
		connector.connects(function(connector_s) {
            if(self.wasResolved()) {
                return;
            }
            
            var animationKey;
            var region = options.mainController.getWorldRegion();
            var settings = self._settings[self._currentIndex];
            
            var slgIconFactory = options.iconController.iconFactory;
            
            var text = settings.message;
            var imageData = settings.imageData;
            var selection = settings.selection;
            self._makeMessageElement(connector, selection, data, options);
            
            slgIconFactory.makeMessageBoard(connector_s, {
                position : [0,0],
                text : text,
                image : imageData ? {
                    key : imageData.key,
                    regX : imageData.regX,
                    regY : imageData.regY,
                    width : imageData.width,
                    height : imageData.height
                } : null,
                selection : selection
            }, options);
            
            options.mainController.ticker.unlockAnimation();
        });
	};
	
	
	/**
	 *
	 * @name _removeMessages
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.issue.RequiredMessage#
	 * @param {Object} count
	 * @param {Object} data
	 * @param {Object} options
	 **/
	p._removeMessages$ = function(connector, options) {
		var groupName = 'message';
		
		var removeKeys = options.iconController.getKeysByGroup(groupName);
		
		if(removeKeys.length > 0) {
			for(var i = 0; i < removeKeys.length; i++) {
				// 現在のメッセージを優先して表示
				options.mainController.ticker.addAnimation({
					key : removeKeys[i],
					fadeType : jslgEngine.model.animation.keys.fadeType.FADE_OUT,
					group : groupName
				}, options);
			}
			
			options.mainController.ticker.addAnimationGroup({
				key : groupName+'Group',
				groupKeys : removeKeys,
				callback : function() {
					for(var i = 0; i < removeKeys.length; i++) {
						options.iconController.remove({
							key : removeKeys[i]
						});
					}
					connector.resolve();
				}
			}, options);
			
			options.mainController.ticker.unlockAnimation();
		} else {
            connector.resolve();
        }
	};
	
	/**
	 * 全てのパターンを実行できるようにクローンを作成する<br />
	 * 座標から正負評価をし、設定する。<br />
	 *
	 * @name getPatterns
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.issue.RequiredMessage#
	 * @param {Object} count
	 * @param {Object} data
	 * @param {Object} options
	 **/
	p.getPatterns = function(connector, count, data, options) {
		var self = this;
		var areasLength, locationsLength, targetsLength;
		var requiredMessage = self;
		var limit = data.limit != null ? data.limit : 0;
		var numberOfResult = data.numberOfResult||1;
		var result = data.result||[];
		//全てのパターンを取得する、あるいは接近が期待できる要素を選ぶ
		var getAll = data.getAll||false;
		//経路探査により、正確な目標までの距離を測ることで期待できる候補を選ぶ（負荷増）
		var getRoute = data.getRoute||false;
		
		var passed;
		
        //即席で要素を作成する。
        var settings = self._settings[self._currentIndex];
        var selection = settings.selection;
        self._makeMessageElement(connector, selection, data, options);
        
		var messageElement = self._getMessageElement(connector, data, options);
		var selectionItems = messageElement.getChildren();
		for(var j = 0; j < selectionItems.length; j++) {
			if(selectionItems[j].className !== 'Icon') {
				selectionItems.splice(j, 1);
				j--;
			}
		}
		
		if(selectionItems.length > 0) {
			
			selectionItemsLength = selectionItems.length;
			for(var j = 0; j < selectionItemsLength; j++) {
				var point = count;
				
				requiredMessage.apply(connector, selectionItems[j], options);
				
				if(!requiredMessage.next()) {
					if(result.length<numberOfResult || getAll) {
						var cloneRequireMessage = jslgEngine.getClone(requiredMessage);
						var castCount = 0;
						
						if(result.length>=numberOfResult && !getAll) {
							//0番目の候補が一番評価が低いので切り捨てる
							result.splice(0,1);
						}
						result.push(cloneRequireMessage);
					}
				} else {
					result = self.getPatterns(point, data, options);
					requiredMessage.back();
				}
			}
		}
        return result;
	};
	
	/**
     * create JSlg element.
	 *
	 * @name makeElement
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.issue.RequiredMessage#
	 * @param {Object} count
	 * @param {Object} data
	 * @param {Object} options
	 **/
	p.makeElement = function(connector, data, options) {
        var self = this;
        
        if(self.wasResolved()) {
            return;
        }
        
        var settings = self._settings[self._currentIndex];
        var text = settings.message;
        var imageData = settings.imageData;
        var selection = settings.selection;
        
        self._makeMessageElement(connector, selection, data, options);
    };
    
	/**
     * Get message information as JSlg element.
	 *
	 * @name makeMessageElement
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.issue.RequiredMessage#
	 * @param {Object} count
	 * @param {Object} data
	 * @param {Object} options
	 **/
	p._makeMessageElement = function(connector, selection, data, options) {
		var self = this;
		
		//入力要素を構築
		var name = jslgEngine.ui.keys.MESSAGE_BOARD;
		var selectionName = jslgEngine.ui.keys.MESSAGE_BOARD_SELECTION;
		var region = options.mainController.getWorldRegion();
		var messageElement = self._getMessageElement(connector, data, options);
		if(!messageElement) {
			messageElement = new jslgEngine.model.stage.Icon({
				key : name
			}, options);
			region.addChild({
				obj : messageElement
			}, options);
		}
		for(var i = 0; i < selection.length; i++) {
			var selectionKey = [self._uniqueId,selectionName,i].join('');
			var selectionItem = messageElement.getChild({
				key : selectionKey
			});
			if(!selectionItem) {
				selectionItem = new jslgEngine.model.stage.Icon({
					key : selectionKey
				}, options);
				messageElement.addChild({
					obj : selectionItem
				}, options);
			}
			selectionItem.setStatus(self.answerStatusName, selection[i].text);
		}
		if(selection.length == 0) {
			messageElement.clearChildren({});
		}
		
		return messageElement;
	};
	
	/**
	 *
	 * @name _getMessageElement
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.issue.RequiredMessage#
	 * @param {Object} count
	 * @param {Object} data
	 * @param {Object} options
	 **/
	p._getMessageElement = function(connector, data, options) {
		var self = this;
		
		var name = jslgEngine.ui.keys.MESSAGE_BOARD;
		var region = options.mainController.getWorldRegion();
		var messageElement = region.getChild({
			key : name
		});
		
		return messageElement;
	};
	
	o.RequiredMessage = RequiredMessage;
}());
