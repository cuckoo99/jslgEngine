/*
 * @author cuckoo99
 */

(function() {
	// namespace:
	var o = this.jslgEngine = this.jslgEngine||{};
	o = (o.model = o.model||{});
	o = (o.user = o.user||{});

	/**
	 * <h4>ユーザクラス</h4>
	 * <p>
	 * ユーザの情報を管理する。
	 * </p>
	 * @class
	 * @name User
	 * @memberOf jslgEngine.model.user
	 * @constructor
	 */
	var User = jslgEngine.extend(
		jslgEngine.model.common.JSlgElement,
		function(options) {
			this.initialize(options);
			
			var memberStatus = options.memberStatus;
			
			this.key = options.key;
			this.isAuto = options.isAuto;
			this.memberStatus = {
				key : memberStatus.key,
				value : memberStatus.value
			};
		}
	);
	/**
	 *
	 */
	var p = User.prototype;

	/**
	 * キー
	 * 
	 * @name key
	 * @property
	 * @type String
	 * @memberOf jslgEngine.model.user.User#
	 **/
	p.key = null;

	/**
	 * パスのキーコード
	 *
	 * @name keyPathCode
	 * @property
	 * @type String[]
	 * @memberOf jslgEngine.model.user.User#
	 **/
	p._keyPathCodes = [	jslgEngine.model.stage.keys.WORLD_REGION,
						jslgEngine.model.stage.keys.USER];

	/**
	 * 対象キーコード
	 *
	 * @name keyCode
	 * @property
	 * @type String
	 * @memberOf jslgEngine.model.user.User#
	 **/
	p._keyCode = jslgEngine.model.stage.keys.USER;

	/**
	 * 自分の操作できるメンバーのキーと値
	 * 
	 * @private
	 * @name _memberStatus
	 * @property
	 * @type Object
	 * @memberOf jslgEngine.model.user.User#
	 **/
	p._memberStatus = null;

	/**
	 * 各Mindから最適なイベントドライバを取り出す。
	 *
	 * @name beActive
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.user.User#
	 **/
	p.beActive = function(connector, options) {
		var self = this;
		
		//TODO: 各キャストを行動可能状態にする。
		
		if(self.isAuto) {
			self.chooseCommandDrivers(connector, options);
			
			connector.pipe(function(connector_s) {
				//
			});
		} else {
			
		}
	};
	
	/**
	 * 各Mindから最適なイベントドライバを取り出す。
	 *
	 * @name chooseCommandDrivers
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.user.User#
	 **/
	p.chooseCommandDrivers = function(connector, options) {
		var self = this;
		var memberKey = self._memberStatus.key;
		var memberValue = self._memberStatus.value;
		//実行回数
		var count = 1;
		var limit = 100;
		
		options.mainController.findElements(connector, {
			className : 'Cast'
		});
		connector.pipe(function(connector_s, result_s) {
			var casts = result_s;
			
			var members = [];
			for(var i = 0; i < casts.length; i++) {
				var cast = casts[i];
				
				var memberStatus = cast.getStatus(memberKey);
				if(memberStatus.value === memberValue) {
					members.push(cast);
				}
			}
			
			var recommendations = [];
			var member;
			
			//利得の多いドライバを取得する。
			while(member = members.pop()) {
				member.getCommandDrivers(connector, function(result) {
					var commandDrivers = result.commandDrivers;
					
					//攻撃なのか、防御なのか
					recommendations.push();
				});
			}
		});
		connector.pipe(function(connector_s) {
			//実行する
			var driver;
			while(driver = recommendations.pop() && (count--) > 0) {
				driver.run(connector_s);
			}
		});
	};

	o.User = User;
}());