/*
 * @author cuckoo99
 */

(function() {
	// namespace:
	var o = this.jslgEngine = this.jslgEngine||{};
	o = (o.stub = o.stub||{});

	/**
	 * <h4>イベントブロック・基本クラス</h4>
	 * <p>
	 * イベントをブロック単位に細分化したクラス。
	 * 実行とリストアを実装する。
	 * </p>
	 * @class
	 * @name CommandBlockBase
	 * @memberOf jslgEngine.model.command
	 * @constructor
	 */
	var CommandBlockBase = function(options) {
		jslgEngine.log('called dummy command block');
		this.parameters = options.parameters;
		this.initialize(options);
	};
	
	/**
	 *
	 */
	var p = CommandBlockBase.prototype;
	
	p.objs = null;

	p._readAllElements = function(connector, data, options) {
		var self = this;

		connector.resolve(self.objs);
	};
	
	o.CommandBlockBase = CommandBlockBase;
}());
