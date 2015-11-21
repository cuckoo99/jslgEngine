/*
 *
 */

(function() {
	// namespace:
	var o = this.jslgEngine = this.jslgEngine||{};
	o = (o.ui = o.ui||{});

	/**
	 * <p>
	 * </p>
	 * @class
	 * @name UI
	 * @memberOf jslgEngine.ui
	 * @constructor
	 */
	var UI = function() {
		this.initialize();
	};
	/**
	 *
	 */
	var p = UI.prototype;

	/**
	 * set up
	 *
	 * @name initialize
	 * @method
	 * @function
	 * @memberOf jslgEngine.ui.UI#
	 **/
	p.initialize = function() {};

	/**
	 * clicked
	 *
	 * @name onClick
	 * @method
	 * @function
	 * @memberOf jslgEngine.ui.UI#
	 **/
    p.onClick = function() {
    };
    
	/**
	 * moved mouse
	 *
	 * @name onMouseMove
	 * @method
	 * @function
	 * @memberOf jslgEngine.ui.UI#
	 **/
    p.onMouseMove = function() {
    };
    
	o.UI = UI;
}());
