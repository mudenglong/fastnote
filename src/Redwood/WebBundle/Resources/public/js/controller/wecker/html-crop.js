define(function(require, exports, module) {
    var HtmlCropper = require("../widget/html-cropper");

    
    exports.run = function() {
    	var $picture = $('[data-role="html-img"]'),
            $form = $('#html-crop-form');

    	var naturalWidth = $picture.data('naturalWidth'),
            naturalHeight = $picture.data('naturalHeight'),
            lines = Array(),
            aaa;


        var demo = new HtmlCropper({ 
                element: '#demo', 
                img: '[data-role="html-img"]',
                trueSize: [naturalWidth, naturalHeight],
                setCutOffLine: true,
            }).render();


        //@todo 在初始化的时候一步实现
        var lines = demo.getLinePos();
        // 当 横线移动时
        demo.on('getLine', function(data){
            lines = data ? data : lines;
        });

        $form.on('submit', function() {
            
            console.log(lines[0]);

            return true;
        });


        // $form.find('[name=x]').val(c.x);
        // $form.find('[name=y]').val(c.y);
        // $form.find('[name=width]').val(c.w);
        // $form.find('[name=height]').val(c.h);


    };

});

