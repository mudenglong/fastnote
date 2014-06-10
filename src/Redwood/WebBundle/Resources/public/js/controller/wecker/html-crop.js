define(function(require, exports, module) {
    var HtmlCropper = require("../widget/html-cropper");
    var DragResizer = require("../widget/drag-resizer");

    
    exports.run = function() {
    	var $picture = $('[data-role="html-img"]'),
            $cropBox = $('#demo');

    	var naturalWidth = $picture.data('naturalWidth'),
            naturalHeight = $picture.data('naturalHeight'),
            lines = Array();


        var demo = new HtmlCropper({ 
                element: '#demo', 
                img: '[data-role="html-img"]',
                trueSize: [naturalWidth, naturalHeight],
                setCutOffLine: true,
            }).render();


// --------------------------------------------------------
        var dragDiv = new DragResizer({ 
                element: '#demo', 
                canvasID: 'canvas',
              
            }).render();



// ------------------------------------------------------
        //@todo 在初始化的时候一步实现
        var lines = demo.getLinePos();
        // 当 横线移动时
        demo.on('getLine', function(data){
            lines = data ? data : lines;
        });


        $cropBox.on('click', 'button', function() {
            console.log($(this).data('url'));
            console.log(lines);
            $.post($(this).data('url'), {'lines':lines}, function(results){
                console.log('13');
            });

        });


        // $form.find('[name=x]').val(c.x);
        // $form.find('[name=y]').val(c.y);
        // $form.find('[name=width]').val(c.w);
        // $form.find('[name=height]').val(c.h);


    };

});

