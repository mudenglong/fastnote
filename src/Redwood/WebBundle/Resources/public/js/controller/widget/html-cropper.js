define(function(require, exports, module) {
    var Widget = require('widget'),
        Line = require("../widget/html-cropper-line");
    require("../../../css/html-crop.css");


    var htmlCropper = Widget.extend({
        attrs: {
            /*required  
            * example  img: #demo-img
            */
            img: null, 

            setCutOffLine: false,
            perImageHeight: 250,


            /*do not change under value*/
            originImgWidth: 0,
            originImgHeight: 0,

        },
        setup: function()
        {
            if (this.get('img') == null) {
                alert("图片不能为空!");
                return false;
            }
 
            this._initLoadImg();

            if (this.get('setCutOffLine') != false) {
                this.setCutOffLine();
            }

        },

        /*private function*/
        _initLoadImg: function()
        {
            $img = $(this.get('img'));
            if ($img.is('img')) {
                this.set('originImgWidth', $img.width());
                this.set('originImgHeight', $img.height());
       
            } else{
                alert("请指定<img>所在的标签上!");
            };
            

        },

        setCutOffLine: function()
        {
            var perImageHeight = this.get('perImageHeight');
            var originImgHeight = this.get('originImgHeight');
            var lines = Array();

            var lineNum = Math.ceil(originImgHeight/perImageHeight);
            // for (var i = 0; i < lineNum; i++) 
            // {
            //     lines[i] = new Line();
            // };

            var test = new Line({element: '#demo'}).render();
            test.on('abc', function(data) {
                console.log('data:',data);
            });

            

            
            // $.each(lines, function( key, line) {
            //     line.on('getTempLineHtml', function(html){
            //         console.log('html:',html);
            //     });
            // });



        }

    });

    module.exports = htmlCropper;

});