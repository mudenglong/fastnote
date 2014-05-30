define(function(require, exports, module) {
    var Widget = require('widget');

    var line = Widget.extend({

        events: {
            'click .html-show' : 'buildHtml',
        },

        setup: function(){
            // this.buildHtml();
        },

        buildHtml: function() {

            // @todo use template
            var html = '<div class="html-crop-line" data-role="line-temp"></div>';
            this.trigger('getTempLineHtml', html);
            console.log("111");
            this.trigger('abc', '7777777');
        },

    });

    module.exports = line;

});