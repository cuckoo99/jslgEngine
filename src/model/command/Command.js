/*
 * @author cuckoo99
 */

(function() {
	// namespace:
	var o = this.jslgEngine = this.jslgEngine||{};
	o = (o.model = o.model||{});
	o = (o.command = o.command||{});

	/**
	 * <h4>イベントクラス</h4>
	 * <p>
	 * ゲーム内における事象を管理するクラス。
	 * </p>
	 * @class
	 * @name Command
	 * @memberOf jslgEngine.model.command
	 * @constructor
	 */
	var Command = jslgEngine.extend(
		jslgEngine.model.common.JSlgElementBase,
		function(data, options) {
			this.initialize(data, options);
		}
	);
	/**
	 *
	 */
	var p = Command.prototype;

	/**
	 * クラス名
	 *
	 * @name className
	 * @property
	 * @type String
	 * @memberOf jslgEngine.model.command.Command#
	 **/
	p.className = 'Command';

	/**
	 * どこにでも着脱可能かどうか
	 *
	 * @name _isFloat
	 * @property
	 * @type Boolean
	 * @memberOf jslgEngine.model.command.Command#
	 **/
	p._isFloat = true;

	/**
	 * 対象キーコード
	 *
	 * @name keyCode
	 * @property
	 * @type String
	 * @memberOf jslgEngine.model.command.Command#
	 **/
	p._keyCode = jslgEngine.model.stage.keys.EVENT;

	/**
	 * 復元時のために自身キーを保有しておく
	 *
	 * @private
	 * @name _myElementKeyData
	 * @property
	 * @type String
	 * @memberOf jslgEngine.model.command.Command#
	 **/
	p._myElementKeyData = null;

	/**
	 * 子要素
	 *
	 * @private
	 * @name _commandBlock
	 * @property
	 * @type jslgEngine.model.command.CommandBlockBase
	 * @memberOf jslgEngine.model.command.Command#
	 **/
	p._commandBlock = null;

	/**
	 * イベントブロックを取得
	 *
	 * @name _getCommandBlock
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.command.Command#
	 * @param {Object} options
	 */
	p._getCommandBlock = function() {
		var self = this;
		var children = self.getChildren();
		if(children.length > 0) {
			return children[0];
		} else {
			jslgEngine.log('Not found CommandBlock');
			return false;
		}
	};

	p.dispose = function() {
		var self = this;

		if(!self._children) return;

		var length = self._children.length;
		for(var i = 0; i < length; i++) {
			var child = self._children[i];

			child.dispose();
			child = null;
			delete child;
		}
		self._children = null;

		jslgEngine.dispose(self);
	};

	/**
	 * 参照するオブジェクトを抽出する
	 *
	 * @name find
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.command.Command#
	 * @param {Object} options
	 * <ul>
	 * <li>{jslgEngine.controller.IconController} iconController</li>
	 * <li>{jslgEngine.controller.mainController} mainController</li>
	 * </ul>
	 */
	p.find = function(connector, data, options, callback) {
		var self = this;
		
		self._find(connector, data, options, callback);
	};

	/**
	 * 参照するオブジェクトを抽出する
	 *
	 * @name _find
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.command.Command#
	 * @param {Object} options
	 * <ul>
	 * <li>{jslgEngine.controller.IconController} iconController</li>
	 * <li>{jslgEngine.controller.mainController} mainController</li>
	 * </ul>
	 */
	p._find = function(connector, data, options) {
		var self = this;
		
		if(self._children.length == 0) return false;
		
		var finder = options.mainController.finder;
		
		if(!self.wasFound()) {
			connector.pipe(function(connector_s) {
				connector_s.resolve();
				
				var length = self._children.length;
				for(var i = 0; i < length; i++) {
					var child = self._children[i];
	
					if(child.find) {
						child.find(connector_s, data, options);
					}
				}
	
				return connector_s;
			});
			// connector.pipe(function(connector_s) {
			// 	connector_s.resolve();
			// 	
			// 	options.mainController.finder.readElements({
			// 		elements : options.result,
			// 		connector : connector_s
			// 	});
			// });
			connector.pipe(function(connector_s) {
				jslgEngine.log('found out');
				connector_s.resolve();
			});
		}
	};
	
	/**
	 * 実行
	 *
	 * @name run
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.command.Command#
	 * @param {Object} options
	 * <ul>
	 * <li>{jslgEngine.controller.IconController} iconController</li>
	 * <li>{jslgEngine.controller.mainController} mainController</li>
	 * </ul>
	 */
	p.run = function(connector, data, options, callback) {
		var self = this;
		
		if(self._children.length == 0) return false;
		
		if(!self.isAvailable(data)) return false;

		if(!self.wasFound()) {
			self.find(connector, data, options);
		}
		connector.pipe(function(connector_s) {
			self._makeLocalElement(data, options);
			
			self._run(connector_s.resolve(), data, options);
			
			connector_s.pipe(function(connector_ss) {
				//副イベントが発生した時、実行完了後元の要素に戻す。
				self._restoreLocalElement(data, options);
				connector_ss.resolve();
			});
		});
	};
	
	/**
	 * 実行
	 *
	 * @name _run
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.command.Command#
	 * @param {Object} options
	 * <ul>
	 * <li>{jslgEngine.controller.IconController} iconController</li>
	 * <li>{jslgEngine.controller.mainController} mainController</li>
	 * </ul>
	 */
	p._run = function(connector, data, options) {
		var self = this;
		
		var length = self._children.length;
		for(var i = 0; i < length; i++) {
			var child = self._children[i];

			child.run(connector, data, options);
			
		}
	};
	
	/**
	 * リストア
	 *
	 * @name restore
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.command.Command#
	 * @param {Object} options
	 * <ul>
	 * <li>{jslgEngine.controller.IconController} iconController</li>
	 * <li>{jslgEngine.controller.mainController} mainController</li>
	 * </ul>
	 */
	p.restore = function(connector, data, options, callback) {
		var self = this;
		
		if(self._children.length == 0) return false;
		
		//if(!self.isAvailable(data)) return false;

		if(!self.wasFound()) {
			self.find(connector, data, options);
		}
		connector.pipe(function(connector_s) {
			self._makeLocalElement(data, options);
			
			self._restore(connector_s.resolve(), data, options);
			
			connector_s.pipe(function(connector_ss) {
				//副イベントが発生した時、実行完了後元の要素に戻す。
				self._restoreLocalElement(data, options);
				connector_ss.resolve();
			});
		});
	};

	/**
	 * 実行
	 *
	 * @name _restore
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.command.Command#
	 * @param {Object} options
	 * <ul>
	 * <li>{jslgEngine.controller.IconController} iconController</li>
	 * <li>{jslgEngine.controller.mainController} mainController</li>
	 * </ul>
	 */
	p._restore = function(connector, data, options) {
		var self = this;
		
		var length = self._children.length;
		for(var i = length - 1; i >= 0; i--) {
			var child = self._children[i];

			child.restore(connector, data, options);
		}
	};
	
	/**
	 * テスト実行
	 *
	 * @name test
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.command.Command#
	 * @param {Object} options
	 * <ul>
	 * <li>{jslgEngine.controller.IconController} iconController</li>
	 * <li>{jslgEngine.controller.mainController} mainController</li>
	 * </ul>
	 */
	p.test = function(connector, data, out, options) {
		var self = this;

		if(self._children.length == 0) return false;

		if(!self.isAvailable(data)) return false;

		//現在のイベント・テストのインデックスを作成
		var testIndex = data.testIndex != null ? data.testIndex : 0;

		var setOptions = function() {
			//インデックスの設定
			data.testIndex = testIndex+1;
			//イベントのキーの参照の追加する。
			data.commandKeyData = self.getKeyData();
			//テストである情報を付与。
			data.isTest = true;
		};
		setOptions();

		self.run(connector, data, options);
		connector.pipe(function(connector_ss) {
			var pendingStack = data[jslgEngine.model.command.keys.PENDING_STACK+data.testIndex];
			var stackCopy;
			if(pendingStack) {
				//実行を再現するために、最終的な実行手順を格納していく。
				stackCopy = pendingStack.slice(0,pendingStack.length);
			}
			commandDriver = new jslgEngine.model.command.CommandDriver({
				commandKeyData : self.getKeyData(),
				pendingCommands : stackCopy
			});
			out.push(commandDriver);
			connector_ss.resolve();
		}).pipe(function(connector_ss) {
			if(data.innerFunc) {
				//実行完了後に続けて処理を繋ぐ
				data.innerFunc(connector_ss.resolve(), data, options);
			} else {
				connector_ss.resolve();
			}
		}).pipe(function(connector_ss) {
			//オプションの再設定
			setOptions();

			self.restore(connector_ss.resolve(), data, options);			
		});
	};
	
	/**
	 * 取得済みか確認
	 *
	 * @name wasFound
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.command.Command#
	 * @boolean is_back 逆実行するかどうか
	 */
	p.wasFound = function(options) {
		var self = this;
		var wasFound = self._wasFound;
		var length = self._children ? self._children.length : 0;
		for(var i = 0; i < length; i++) {
			var child = self._children[i];
			wasFound = (!child.wasFound || child.wasFound()) ? wasFound : false;
		}
		return wasFound;
	};
	
	/**
	 * 依存する要素が存在するかどうかチェックする
	 *
	 * @name getDependencyElements
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.command.Command#
	 * @param {Object} options
	 * <ul>
	 * <li>{jslgEngine.controller.IconController} iconController</li>
	 * <li>{jslgEngine.controller.mainController} mainController</li>
	 * </ul>
	 */
	p.getDependencyElements = function(connector, options) {
		var self = this;
		
		var commandBlock = self._getCommandBlock();
		if(!commandBlock) return false;
		
		var result = [];
		commandBlock.getDependencyElements(connector, {
			result : result
		}, options);
		
		return result;
	};
	
	/**
	 * 命令からの実行可能状態を変更
	 *
	 * @name changeAvailable
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.command.Command#
	 * @param {Object} options
	 */
	p.changeAvailable = function(value) {
		var self = this;
		
		self.setStatus(jslgEngine.model.command.keys.IS_AVAILABLE, value);
	};
	
	/**
	 * 命令からの実行が可能かどうか
	 *
	 * @name isAvailable
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.command.Command#
	 * @param {Object} options
	 */
	p.isAvailable = function(data) {
		var self = this;
		
		var isAvailable = self.getStatus(jslgEngine.model.command.keys.IS_AVAILABLE);
		isAvailable = isAvailable ? isAvailable.value : true;
		
		//要素が見つからなかった場合は利用可能
		isAvailable = isAvailable == null ? true : isAvailable;
		
		if(!isAvailable) {
			jslgEngine.log(self.getKey()+'is not available.');
		}
		
		if(data.runningCount > jslgEngine.config.loopLimit) {
			jslgEngine.log(self.getKey()+' loop count is over the limit.');
			isAvailable = false;
		}
		
		return isAvailable;
	};
	
	/**
	 * キーの書き換え（再帰処理）<br />
	 * <br />
	 * 追加など行った場合、子要素すべてのキーを再設定する。<br />
	 * 
	 * @private
	 * @name _resetKey
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.command.Command#
	 * @param {jslgEngine.model.common.JSlgElementBase} element キー書き換え元要素
	 */
	p._resetKey = function(element, options) {
		var self = this;
		
		if(self._isFloat) {
			//追加する要素が不変のパスコードだった場合、パスコードを書き直す。
			self.setKeyPathCodes(element);
		}
		
		var keyCode = self._key.getKeyCode();
		if(!element) {
			var keyElements = self.getKeyData().getKeyElements();
			var resetKeyElements = {};
			//書き換え要素が存在しない場合（要素が削除された時など）、
			//自身のキーコード以外を空文字で埋める。
			for(var key in keyElements) {
				if(key !== keyCode) {
					resetKeyElements[key] = '';
				}
			}
			self._key.rewrite(resetKeyElements);
		} else {
			//対象要素のキーコードのクローンを作成し、自身のキーコードに上書きする。
			var slgKey = element.getKeyData();
			self._key.rewrite(slgKey.getKeyElements());
		}
	};
	
	/**
	 * 子要素の設定
	 *
	 * @name addChild
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.command.Command#
	 * @param {Object} options
	 */
	p.addChild = function(data) {
		var self = this;
		
		self._children.push(data.obj);
	};
	
	/**
	 * 実行のために複製を作成
	 *
	 * @name getRunnableCommand
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.command.Command#
	 * @param {Object} options
	 */
	p.getRunnableCommand = function(data, options) {
		var self = this;
		
		var clone = jslgEngine.getClone(self, { limit : 10000 });
		
		clone._key = self.getKeyData();
		//イベントを実行する時はインスタンスを作成し、親の情報を残すためキーはリセットしない。
		clone.setup({}, options);
		return clone;
	};
		
	/**
	 * 新規インスタンス生成時の設定
	 *
	 * @name setup
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.command.Command#
	 * @param {Object} options
	 */
	p.setup = function(data, options) {
		var self = this;
		var length = self._children ? self._children.length : 0;
		var passingResult = null;

		//親要素の紐付けが必要な場合
		if(data.parent) {
			self.getKeyData().resetUniqueId(options);
			options.mainController.bindElement(self, data.parent);
		}
		
		for(var i = 0; i < length; i++) {
			var child = self._children[i];
			
			child.setup(data, options);
			
			if(passingResult && child instanceof jslgEngine.model.command.CommandBlockElseIF) {
				child.setPassingResult(passingResult);
			} else if(child instanceof jslgEngine.model.command.CommandBlockIF) {
				passingResult = {
					result : false
				};
				child.setPassingResult(passingResult);
			} else {
				passingResult = null;
			}
		}
	};
	
	/**
	 * 参照するオブジェクトを抽出する
	 *
	 * @name _makeLocalElement
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.command.Command#
	 */
	p._makeLocalElement = function(data, options) {
		var self = this;
		data.localElements = data.localElements||{};
		data.localElements[jslgEngine.model.logic.keys.SELF] = self;
		data.localElements[jslgEngine.model.logic.keys.SENDER] = data.sender;
		for(var key in data.parameters) {
			data.localElements[key] = data.parameters[key];
		}
		data.runningCount = data.runningCount != null ? (data.runningCount++) : 0;
	};

	/**
	 * 参照するオブジェクトを抽出する
	 *
	 * @name _restoreLocalElement
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.command.Command#
	 */
	p._restoreLocalElement = function(data, options) {
	};
	
	/**
	 * 複製する
	 *
	 * @name generate
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.command.Command#
	 */
	p.generate = function(data, options) {
        var self = this;
       
		var clone = jslgEngine.getClone(self, { limit : 10000 });
		
		clone.setup({}, options);
        clone.getKeyData().resetUniqueId(options);
		return clone;
	};

	p.updateIcon = function(connector, data, options) {
	}

	o.Command = Command;
}());
