/*
 * @author cuckoo99
 */

(function() {
	// namespace:
	var o = this.jslgEngine = this.jslgEngine||{};
	o = (o.model = o.model||{});
	o = (o.action = o.action||{});

	/**
	 * <h4>コード処理・追加クラス</h4>
	 * <p>
	 * SLG要素に子要素を追加する。
	 * </p>
	 * @class
	 * @name ActionIcon
	 * @memberOf jslgEngine.model.action
	 * @constructor
	 */
	var ActionIcon = jslgEngine.extend(
		jslgEngine.model.action.ActionBase,
		function(options) {
			this.initialize(options);
		}
	);
	/**
	 *
	 */
	var p = ActionIcon.prototype;
	
	/**
	 * クラス名
	 *
	 * @name className
	 * @property
	 * @type String
	 * @memberOf jslgEngine.model.action.ActionIcon#
	 **/
	p.className = 'ActionIcon';

	/**
	 * 実行
	 *
	 * @name run
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.action.ActionIcon#
	 * @param {Object} options
	 * <ul>
	 * <li>{jslgEngine.controller.IconController} iconController</li>
	 * <li>{jslgEngine.controller.mainController} mainController</li>
	 * </ul>
	 */
	p.run$ = function(connector, data, options) {
		var self = this;

		if(!self.isReadyToRun(connector, options)) return;
		
		connector.resolve();
		
		self._readAllElements(connector, data, options);
		connector.pipe(function(connector_s, result_s) {
			connector_s.resolve();
			
			var target = result_s[0];
			var key = result_s[1];
			var imageKey = result_s[2];
			var commandKey = result_s[3];
			var property = result_s[4];
			
			if(target === null || key === null ||
				imageKey === null || commandKey === null) {
				jslgEngine.log(self.className + ' has no enough arguments.');
				return;
			}
	
			self._wasDone = true;
			
			var position = property[0] ? {
				x : property[0][0].value,
				y : property[0][1].value,
				z : property[0][2].value
			} : { x : 0, y : 0, z : 0 };
			var alpha = property[1].value;
			
			var textProperties = property[2];
			var text = textProperties instanceof Array ? {
					textValue : textProperties[0].value,
					color : textProperties[1].value,
					font : textProperties[2].value
				} : null;
			
			var spriteProperties = property[3];
			var framesProperties = spriteProperties[0];
			var frames = framesProperties instanceof Array ? {
				width : framesProperties[0].value,
				height : framesProperties[1].value,
				regX : framesProperties[2].value,
				regY : framesProperties[3].value
			} : null;
			
			var animationsProperties = spriteProperties[1];
			var animations = null;
			if(animationsProperties instanceof Array) {
				animations = {};
	
				var length = animationsProperties.length;
				for(var i = 0; i < length; i++) {
					var animePropaties = animationsProperties[i];
					if(animePropaties[0]) {
						animations[animePropaties[0].value] = [
							animePropaties[1].value, animePropaties[2].value, animePropaties[0].value];
					}
				}
			}
			
			options.iconController.add(connector_s, {
				key : key.value,
				imageKey : imageKey.value,
				position : position,
				alpha : alpha,
				text : text,
				sprite : spriteProperties != null ? {
					frames : frames,
					animations : animations,
					clickFunc : function(e, options_s) {
						var mainController = options_s.mainController;
						var name = e.target.name;
						
						mainController.kick({
							key : name,
							className : 'Icon',
							x : location.x,
							y : location.y,
							z : location.z
						}, options_s);
					}
				} : null
			});
			
			if(target.onAdd) {
				target.onAdd.run(connector_s, data, options);
			}
		});
	};

	/**
	 * 要素が条件を満たしているかチェックする
	 *
	 * @name isCorrectArguments
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.action.ActionIcon#
	 * @param {Object} options
	 * <ul>
	 * <li>{jslgEngine.controller.IconController} iconController</li>
	 * <li>{jslgEngine.controller.mainController} mainController</li>
	 * </ul>
	 */
	p.isCorrectArguments = function(data, options) {
		var self = this;
		var arguments = data.arguments;
		var matcher = data.matcher;
		var success = data.success||true;

		if(arguments.length !== matcher.length) return false;

		var length = arguments.length;
		for(var i = 0; i < length; i++) {
			var argument = arguments[i];
			var match = matcher[i];
			
			if(typeof(argument) == typeof(match)) {
				var result = self.isCorrectArguments({
					arguments : argument,
					matcher : match,
					success : success
				}, options);
				success = result ? success : false;
			}
		}
		
		return success;
	};
	
	/**
	 * リストア
	 *
	 * @name restore
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.action.ActionIcon#
	 * @param {Object} options
	 * <ul>
	 * <li>{jslgEngine.controller.IconController} iconController</li>
	 * <li>{jslgEngine.controller.mainController} mainController</li>
	 * </ul>
	 */
	p.restore = function(connector, data, options) {
		var self = this;

		if(!self.isReadyToRestore(connector, options)) return;
		
		self._readAllElements(connector, data, options);
		connector.connects(function(connector_s, result_s) {
			var key = result_s[1].value;
			
			options.iconController.remove({
				key : key
			});
		});
	};


	/**
	 * 展開する
	 *
	 * @name expand
	 * @method
	 * @function
	 * @memberOf jslgEngine.model.action.ActionIcon#
	 * @param {Object} options
	 * <ul>
	 * <li>{jslgEngine.controller.IconController} iconController</li>
	 * <li>{jslgEngine.controller.mainController} mainController</li>
	 * </ul>
	 */
	p.expand = function(options) {};

	o.ActionIcon = ActionIcon;
}());
