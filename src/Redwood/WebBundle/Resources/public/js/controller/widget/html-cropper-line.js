define(function(require, exports, module) {
    var Widget = require('widget');

    var line = Widget.extend({
        attrs: {

        },
        setup: function(){
            this._buildHtml();
        },

        _buildHtml: function() {
            console.log("787878");
        },

    });

    module.exports = line;

});