/*
 * @author cuckoo99
 */

// namespace:
var o = this.jslgEngine = this.jslgEngine||{};
o = (o.model = o.model||{});
o = (o.factory = o.factory||{});

(function() {
	/**
	 * <h4>SLG依存・イベント生成クラス</h4>
	 * <p>
	 * SLGのシステムに依存するイベントを生成するクラス。
	 * </p>
	 * @class
	 * @name JSlgCommandFactory
	 * @memberOf jslgEngine.model.factory
	 * @constructor
	 */
	var JSlgCommandFactory = function() {
		this.initialize();
	};
	/**
	 *
	 */
	var p = JSlgCommandFactory.prototype;

	/**
	 * 初期化
	 *
	 * @name initialize
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.factory.JSlgCommandFactory#
	 **/
	p.initialize = function() {
	};

	/**
	 * イベントの取得
	 *
	 * @name getCommand
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.factory.JSlgCommandFactory#
	 * @param {Object} options
	 * <ul>
	 * <li>{jslgEngine.controller.IconManager} iconManager</li>
	 * </ul>
	 **/
	p.getCommand = function(connector, converter, data, options) {
		var self = this;
		
		var template = self.getCommandTemplate(data);
		
		options.iconController.converter.getFromTextOfXml(connector, template, options);
	};

	/**
	 * アイテムの取得
	 *
	 * @name getItem
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.factory.JSlgCommandFactory#
	 * @param {Object} options
	 * <ul>
	 * <li>{jslgEngine.controller.IconManager} iconManager</li>
	 * </ul>
	 **/
	p.getItem = function(key, code, options) {
		var self = this;

		var itemFrame = new jslgEngine.model.stage.ItemFrame({}, options);
		var itemCommand = self.getCommand(key, code, options);
		
		itemFrame.addChild({ obj : itemCommand }, options);
		
		return itemFrame.generate({ key : 'i1'}, options);
	};

	/**
	 * アクション雛形の取得
	 *
	 * @name getCommandTemplate
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.factory.JSlgCommandFactory#
	 * @param {Object} options
	 * <ul>
	 * <li>{jslgEngine.controller.IconManager} iconManager</li>
	 * </ul>
	 **/
	p.getCommandTemplate = function(data, options) {
		var code = ['<element>',
			'<type>Element</type>',
			'<className>Command</className>',
			['<key>',data.key,'</key>'].join(''),
			data.children.join('\n'),
			'</element>'].join('\n');
		return code;
	};

	/**
	 * アクション雛形の取得
	 *
	 * @name getCommandBlockTemplate
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.factory.JSlgCommandFactory#
	 * @param {Object} options
	 * <ul>
	 * <li>{jslgEngine.controller.IconManager} iconManager</li>
	 * </ul>
	 **/
	p.getCommandBlockTemplate = function(data, options) {
		var self = this;
		
		return self.getActionTemplate(data, options);
	};

	/**
	 * アクション雛形の取得
	 *
	 * @name getActionTemplate
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.factory.JSlgCommandFactory#
	 * @param {Object} options
	 * <ul>
	 * <li>{jslgEngine.controller.IconManager} iconManager</li>
	 * </ul>
	 **/
	p.getActionTemplate = function(data, options) {
		var self = this;
		// var parameters = data.parameters ? ['<argument>',self._getArgumentTemplate(data.parameters),
			// '</argument>'].join('') : '';
		var parameters = data.parameters ? self._getArgumentTemplate(data.parameters) : '';
		var children = data.children ? data.children.join('\n') : '';
		
		var code = ['<element>',
			'<type>Element</type>',
			['<className>',data.className,'</className>'].join(''),
			parameters,
			children,
			'</element>'].join('\n');
		return code;
	};

	/**
	 * アクション雛形の取得
	 *
	 * @name _getArgumentTemplate
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.factory.JSlgCommandFactory#
	 * @param {Object} options
	 * <ul>
	 * <li>{jslgEngine.controller.IconManager} iconManager</li>
	 * </ul>
	 **/
	p._getArgumentTemplate = function(parameters, options) {
		var self = this;
		var text;
		if(parameters instanceof Array) {
			var words = [];
			for(var i = 0; i < parameters.length; i++) {
				words.push(self._getArgumentTemplate(parameters[i], options));
			}
			text = ['<argument>',words.join('</argument><argument>'),'</argument>'].join('');
		} else {
			text = typeof(parameters) === 'string' ?
				parameters.replace('<','&lt;').replace('>','&gt;') : parameters;
		}
		return text;
	};

	/**
	 * アクション雛形の取得
	 *
	 * @name _getElement
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.factory.JSlgCommandFactory#
	 * @param {Object} options
	 * <ul>
	 * <li>{jslgEngine.controller.IconManager} iconManager</li>
	 * </ul>
	 **/
	p._getElement = function(connector, converter, data, options) {
		converter.getFromTextOfXml(connector, data.text, options);
	};
	
	/**
	 * イベント作成・移動
	 *
	 * @name makeMoving
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.factory.JSlgCommandFactory#
	 * @param {Object} options
	 * <ul>
	 * <li>{jslgEngine.controller.IconManager} iconManager</li>
	 * </ul>
	 **/
	p.makeMoving = function(connector, data, options) {
		var self = this;
		
		var commandTemplate = self.getCommandTemplate({
			key : 'onClick',
			children : [
				self.getActionTemplate({
					className : 'ActionRequireArea',
					parameters : [[0,0,0],[[1,'_THIS._CAST.moving',2,[[0,3,0]],0, [90,0]]]]
				}),
				self.getActionTemplate({
					className : 'ActionPending'
				}),
				self.getActionTemplate({
					className : 'ActionRemove',
					parameters : ['_THIS._CAST']
				}),
				self.getActionTemplate({
					className : 'ActionAdd',
					parameters : ['_AREA','_THIS']
				})
			]
		});
		
		return self._getElement(connector, data.converter, {
			text : commandTemplate
		}, options);
	};

	/**
	 * イベント作成・制限値
	 *
	 * @name makeLimitedNumber
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.factory.JSlgCommandFactory#
	 * @param {Object} options
	 * <ul>
	 * </ul>
	 **/
	p.makeLimitedNumber = function(connector, data, options) {
		var self = this;
		
		var commandTemplate = self.getCommandTemplate({
			key : 'onChange',
			children : [
				self.getCommandBlockTemplate({
					className : 'CommandBlockIF',
					parameters : ['$THIS._VALUE >= $THIS._FRAME.VALUE'],
					children : [
						self.getActionTemplate({
							className : 'ActionSet',
							parameters : ['_THIS._VALUE','_THIS._FRAME.VALUE']
						})
					]
				})
			]
		});
		
		return self._getElement(connector, data.converter, {
			text : commandTemplate
		}, options);
	};

	/**
	 * イベント作成・体力が０になったら消去
	 *
	 * @name makeCheckDeath
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.factory.JSlgCommandFactory#
	 * @param {Object} options
	 * <ul>
	 * </ul>
	 **/
	p.makeCheckDeath = function(connector, data, options) {
		var self = this;
		
		var commandTemplate = self.getCommandTemplate({
			key : 'onChange',
			children : [
				self.getActionTemplate({
					className : 'ActionLog',
					parameters : ['"消去イベント"']
				}),
				self.getCommandBlockTemplate({
					className : 'CommandBlockIF',
					parameters : ['$THIS.parent().life<1'],
					children : [
						self.getActionTemplate({
							className : 'ActionRemove',
							parameters : ['$THIS.parent()']
						})
					]
				})
			]
		});
		
		return self._getElement(connector, data.converter, {
			text : commandTemplate
		}, options);
	};

	/**
	 * イベント作成・経験値を加算し、グレードアップ
	 *
	 * @name makeGradeUpCommand
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.factory.JSlgCommandFactory#
	 * @param {Object} options
	 * <ul>
	 * </ul>
	 **/
	p.makeGradeUpCommand = function(options) {
		var self = this;
		
		return self.getItem(
					'onChange',
					'',
					options);
	};

	/**
	 * イベント作成・キャストは攻撃されたら反撃
	 *
	 * @name makeRevenge
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.factory.JSlgCommandFactory#
	 * @param {Object} options
	 * <ul>
	 * </ul>
	 **/
	p.makeRevenge = function(options) {
		var self = this;
		
		return self.getItem(
					'onChange',
					'mind()',
					options);
	};

	/**
	 * イベント作成・キャストは攻撃されたら防御
	 *
	 * @name makeGuard
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.factory.JSlgCommandFactory#
	 * @param {Object} options
	 * <ul>
	 * </ul>
	 **/
	p.makeGuard = function(options) {
		var self = this;
		
		return self.getItem(
			'onChange',
			'mind()',
			options);
	};

	/**
	 * イベント作成・敵所属のキャストの体力が全て０なら、勝利アイコンを表示
	 *
	 * @name makeWinningCommand
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.factory.JSlgCommandFactory#
	 * @param {Object} options
	 * <ul>
	 * </ul>
	 **/
	p.makeWinningCommand = function(connector, converter, options) {
		var self = this;
		
		self.getCommand(connector, converter, {
			key : 'won',
			children : [
				self.getActionTemplate({
					className : 'ActionVariable',
					parameters : ['w1', '"$lose"', 'true']
				}),
				self.getActionTemplate({
					className : 'ActionVariable',
					parameters : ['w1', '"$won"', 'true']
				}),
				self.getCommandBlockTemplate({
					className : 'CommandBlockFOR',
					parameters : ['"$temp"', 'w1.find(Cast)'],
					children : [
						self.getCommandBlockTemplate({
							className : 'CommandBlockIF',
							parameters : ['w1.$temp.belongs=="enemy"'],
							children : [
								self.getActionTemplate({
									className : 'ActionSet',
									parameters : ['w1', '"$won"', 'false']
								})
							]
						}),
						self.getCommandBlockTemplate({
							className : 'CommandBlockIF',
							parameters : ['w1.$temp.belongs=="player"'],
							children : [
								self.getActionTemplate({
									className : 'ActionSet',
									parameters : ['w1', '"$lose"', 'false']
								})
							]
						})
					]
				}),
				self.getCommandBlockTemplate({
					className : 'CommandBlockIF',
					parameters : ['w1.$won==true'],
					children : [
						self.getActionTemplate({
							className : 'ActionLog',
							parameters : ['"You Won"']
						})
					]
				}),
				self.getCommandBlockTemplate({
					className : 'CommandBlockElseIF',
					parameters : ['w1.$lose==true'],
					children : [
						self.getActionTemplate({
							className : 'ActionLog',
							parameters : ['"You Lose"']
						})
					]
				})
			]
		}, options);
	};

	/**
	 * イベント作成・同じ座標に止まるとユニット結合
	 *
	 * @name makeJointCast
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.factory.JSlgCommandFactory#
	 * @param {Object} options
	 * <ul>
	 * </ul>
	 **/
	p.makeJointCast = function(options) {};

	/**
	 * イベント作成・ユニット分離
	 *
	 * @name makeDivideJointCast
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.factory.JSlgCommandFactory#
	 * @param {Object} options
	 * <ul>
	 * </ul>
	 **/
	p.makeDivideJointCast = function(options) {};

	/**
	 * イベント作成・メニューアイテムの作成
	 *
	 * @name makeMenuItem
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.factory.JSlgCommandFactory#
	 * @param {Object} options
	 * <ul>
	 * </ul>
	 **/
	p.makeMenuItem = function(connector, key, name, obj, parent, options) {
		var self = this;
		
		var menuItem = new jslgEngine.model.stage.Icon({
			key : key
		}, options);
		parent.addChild({
			obj : menuItem
		}, options);
		menuItem.setStatus('name', name);
		self.getCommand(connector, options.converter, {
			key : 'onClick',
			children : obj,
			mainController : options.mainController
		}, options);
		connector.connects(function(connector_s, result_s) {
			var command = result_s;
			menuItem.addChild({
				obj : command
			}, options);
		});
		return menuItem;
	};
	
	/**
	 * イベント作成・メニュー表示
	 *
	 * @name makeScreenMenu
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.factory.JSlgCommandFactory#
	 * @param {Object} options
	 * <ul>
	 * </ul>
	 **/
	p.makeScreenMenu = function(connector, converter, options) {
		var self = this;
		
		var screenKey = 'screen';
		var screenMenuKey = 'screenMenu';
		
		var menuItemScreen = new jslgEngine.model.stage.Icon({
						key : screenMenuKey
					}, options);
		//TODO: イベントの使用状態を変更する必要がある。
		self.makeMenuItem(connector, 'ms1', 'ターン終了',
					[self.getActionTemplate({
						className : 'ActionLog',
						parameters : ['"ターン終了"']
					}),self.getActionTemplate({
						className : 'ActionJSlgMenu',
						parameters : ['null']
					}),self.getActionTemplate({
						className : 'ActionMind',
						parameters : ['"enemy"', 1]
					}),self.getActionTemplate({
						className : 'ActionLog',
						parameters : ['w1.r1.s1.g0_0_0.c1.Kill']
					}),
					self.getCommandBlockTemplate({
						className : 'CommandBlockFOR',
						parameters : ['"$temp"', 'w1.find(Item)'],
						children : [
							self.getCommandBlockTemplate({
								className : 'CommandBlockIF',
								parameters : ['$temp.parent().belongs=="player"'],
								children : [
									self.getActionTemplate({
										className : 'ActionSet',
										parameters : ['$temp', '"count"', '$temp.$FRAME.count']
									})
								]
							})
						]
					})
					], menuItemScreen, options);
		self.makeMenuItem(connector, 'ms2', '閉じる',
					[self.getActionTemplate({
						className : 'ActionLog',
						parameters : ['"閉じる"']
					}),self.getActionTemplate({
						className : 'ActionJSlgMenu',
						parameters : ['null']
					})], menuItemScreen, options);
		self.getCommand(connector, options.converter, {
			key : 'onClick',
			children : [
				self.getActionTemplate({
					className : 'ActionJSlgMenu',
					parameters : ['$THIS.parent()']
				})
			]
		}, options);
		connector.pipe(function(connector_s, result_s) {
			var command = result_s;
			
			menuItemScreen.addChild({
				obj : result_s
			}, options);
			
			connector_s.resolve(menuItemScreen);
		});
		return menuItemScreen;
	};

	/**
	 * イベント作成・画面スクロール
	 *
	 * @name makeScrollCommand
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.factory.JSlgCommandFactory#
	 * @param {Object} options
	 * <ul>
	 * </ul>
	 **/
	p.makeScrollCommand = function(converter, options) {
		var self = this;
		
		return self.getCommand(converter, {
					key : 'scroll',
					children : [
						self.getActionTemplate({
							className : 'ActionScroll',
							parameters : [[0,0,0]]
						})
					]
				}, options);
	};

	/**
	 * イベント作成・メッセージボード追加
	 *
	 * @name makeAddMessage
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.factory.JSlgCommandFactory#
	 * @param {Object} options
	 * <ul>
	 * </ul>
	 **/
	p.makeAddMessage = function(options) {
		var self = this;
		
		return self.getCommand(converter, {
			key : 'scroll',
			children : [
				self.getActionTemplate({
					className : 'ActionScroll',
					parameters : [[0,0,0]]
				})
			]
		}, options);
	};

	/**
	 * イベント作成・メッセージボード進む
	 *
	 * @name makeNextMessage
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.factory.JSlgCommandFactory#
	 * @param {Object} options
	 * <ul>
	 * </ul>
	 **/
	p.makeNextMessage = function(options) {};

	/**
	 * イベント作成・メッセージボード戻る
	 *
	 * @name makeBeckMessage
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.factory.JSlgCommandFactory#
	 * @param {Object} options
	 * <ul>
	 * </ul>
	 **/
	p.makeBackMessage = function(options) {};

	/**
	 * イベント作成・アイテムの使用
	 *
	 * @name makeUseItem
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.factory.JSlgCommandFactory#
	 * @param {Object} options
	 * <ul>
	 * </ul>
	 **/
	p.makeUseItem = function(options) {};

	/**
	 * イベント作成・キャストをクリック
	 *
	 * @name makeKickCast
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.factory.JSlgCommandFactory#
	 * @param {Object} options
	 * <ul>
	 * </ul>
	 **/
	p.makeKickCast = function(options) {
		return [
			'variable($cast,_AREA._CAST)',
			'for($item,$cast._ITEM) {',
			'icon($item.name,$item)',
			'}',
			''].join('\r\n');
	};

	/**
	 * イベント作成・マップ土台をクリック
	 *
	 * @name makeKickGround
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.factory.JSlgCommandFactory#
	 * @param {Object} options
	 * <ul>
	 * </ul>
	 **/
	p.makeKickGround = function(options) {};

	/**
	 * イベント作成・メッセージボードをクリック
	 *
	 * @name makeKickMessageBoard
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.factory.JSlgCommandFactory#
	 * @param {Object} options
	 * <ul>
	 * </ul>
	 **/
	p.makeKickMessageBoard = function(options) {};

	/**
	 * イベント作成・ディティール表示
	 *
	 * @name makeShowingCastDetail
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.factory.JSlgCommandFactory#
	 * @param {Object} options
	 * <ul>
	 * </ul>
	 **/
	p.makeShowingCastDetail = function(options) {};

	/**
	 * イベント作成・キャストを集合させる
	 *
	 * @name makeGatheringCast
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.factory.JSlgCommandFactory#
	 * @param {Object} options
	 * <ul>
	 * </ul>
	 **/
	p.makeGatheringCast = function(options) {};

	/**
	 * イベント作成・キャストを解散させる
	 *
	 * @name makeDismissingCast
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.factory.JSlgCommandFactory#
	 * @param {Object} options
	 * <ul>
	 * </ul>
	 **/
	p.makeDismissingCast = function(options) {};

	/**
	 * イベント作成・移動モード
	 *
	 * @name makeMovingMode
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.factory.JSlgCommandFactory#
	 * @param {Object} options
	 * <ul>
	 * </ul>
	 **/
	p.makeMovingMode = function(options) {};

	/**
	 * イベント作成・ステージ追加アイコン
	 *
	 * @name makeAddingStageIcon
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.factory.JSlgCommandFactory#
	 * @param {Object} options
	 * <ul>
	 * </ul>
	 **/
	p.makeAddingStageIcon = function(options) {};

	/**
	 * イベント作成・外部ユーザのステージにアクセスする。
	 *
	 * @name makeConnectingOuterStage
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.factory.JSlgCommandFactory#
	 * @param {Object} options
	 * <ul>
	 * </ul>
	 **/
	p.makeConnectingOuterStage = function(options) {};

	o.JSlgCommandFactory = JSlgCommandFactory;
}());
