define(function(require, exports, module) {
    var HtmlCropper = require("../widget/html-cropper");

    
    exports.run = function() {
    	var $picture = $('[data-role="html-img"]');

    	var naturalWidth = $picture.data('naturalWidth'),
            naturalHeight = $picture.data('naturalHeight');


        var demo = new HtmlCropper({ 
                element: '#demo', 
                img: '[data-role="html-img"]',
                trueSize: [naturalWidth, naturalHeight],
                setCutOffLine: true,
            }).render();



    };

});

