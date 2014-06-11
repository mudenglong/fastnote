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

        //@todo 在初始化的时候一步实现
        var lines = demo.getLinePos();
        // 当 横线移动时
        demo.on('getLine', function(data){
            lines = data ? data : lines;
        });

        var boxs = Array();
        // @todo 当框框移动到边缘 返回的坐标有问题 没有边界
        var dragDiv = new DragResizer({ 
                element: '#demo', 
                canvasID: 'canvas',
                trueSize: [naturalWidth, naturalHeight],
              
            }).render();

        dragDiv.on('getBoxs', function(data){
            boxs = data ? data : '';
        });



        $cropBox.on('click', 'button', function() {

            var data = {
                'lines': lines,
                'boxs' : boxs,
            };

            $.post($(this).data('url'), {'postData':data}, function(results){
                console.log('13');
            });

        });


        // $form.find('[name=x]').val(c.x);
        // $form.find('[name=y]').val(c.y);
        // $form.find('[name=width]').val(c.w);
        // $form.find('[name=height]').val(c.h);


    };

});

