define(function(require, exports, module) {
    var Widget = require('widget'),
        Templatable = require('templatable');

    var line = Widget.extend({
        Implements: Templatable,
        events: {
            'click #testH3' : 'buildHtml',
        },


        setup: function(){
            console.log(this.element);
        },

        buildHtml: function() {
            
            var html = 'aaaaaaaaaaaa';
            this.trigger('getTempLineHtml', html);
            console.log("111");
            this.trigger('abc', '7777777');
        },

    });

    module.exports = line;

});