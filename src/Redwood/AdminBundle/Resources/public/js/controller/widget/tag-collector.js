define(function(require, exports, module) {
    var Widget = require('widget');
	var TagCollector = Widget.extend({
        events: {
            'click .btn': 'switchTo'
        },
        switchTo: function(index) {
            console.log(index);
        },
    });

    module.exports = TagCollector;

});