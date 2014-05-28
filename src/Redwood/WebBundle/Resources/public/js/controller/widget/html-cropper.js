define(function(require, exports, module) {
    var Widget = require('widget');
    require("../../../css/html-crop.css");


    var htmlCropper = Widget.extend({
    
        setup: function(){
            this._initItem();
        },
        _initItem: function(){
            console.log("123");
        },
     

    });

    module.exports = htmlCropper;

});