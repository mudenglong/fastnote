define(function(require, exports, module) {
    var HtmlCropper = require("../widget/html-cropper");

    
    exports.run = function() {
        var demo = new HtmlCropper({ element: '#demo' }).render();
    };

});

