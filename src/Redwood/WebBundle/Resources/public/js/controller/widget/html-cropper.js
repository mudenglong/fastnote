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

            /**
             * 真实图片大小 
             * example trueSize:[width, height]
             */
            trueSize: null,
            setCutOffLine: false,
            perImageHeight: 250,


            /*do not change under value*/
            originImgWidth: 0,
            originImgHeight: 0,
            xscale: 1,
            yscale: 1,

            //@todo
            xlineTemplate: null,

        },
        events: {
            'click .img-wrap' : 'test',
            // 'click [data-crop-html^=xline]' : 'dragLine',
        },
        test:function()
        {
            console.log('touch me!!! img-wrap')
        },
        setup: function()
        {
            if (this.get('img') == null) {
                throw new Error('Please set img like --> img:#demo-img');
            }
 
            this._initLoadImg();


            /*if options contain trueSize*/
            var trueSize = this.get('trueSize');
            if (trueSize) {
                this.set('xscale', trueSize[0] / this.get('originImgWidth'));
                this.set('yscale', trueSize[1] / this.get('originImgHeight'));
            }
            console.log(this.get('xscale'));
            console.log(this.get('yscale'));

            /*if options contain setCutoffLine*/
            if (this.get('setCutOffLine') != false) {
                this.setCutOffLine(this.get('originImgHeight'), this.get('perImageHeight'));
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
                throw new Error('Load img Error');
            };
            

        },
        _convertNaturalSize: function(origin, scale)
        {
            if (scale == 'xscale') {
                return origin*this.get('xscale');
            } else if(scale == 'yscale'){
                return origin*this.get('yscale');
            }else{
                throw new Error('_convertNaturalSize function Error');
                return false;
            };
            
        },
        _convertOriginSize: function(natural, scale)
        {
            if (scale == 'xscale') {
                return natural/this.get('xscale');
            } else if(scale == 'yscale'){
                return natural/this.get('yscale');
            }else{
                throw new Error('_convertOriginSize function Error');
                return false;
            };
            
        },
        _calculateLineNum: function(imgHeight, perImageHeight)
        {
            return Math.floor(imgHeight / perImageHeight);
        },

        setCutOffLine: function(originImgHeight, perImageHeight)
        {
            var originPerImageHeight = Math.round(this._convertOriginSize(perImageHeight, 'yscale'));
            var lineNum = this._calculateLineNum(originImgHeight, originPerImageHeight);
            
            var lines = Array();
            var top = 0;

            for (var i = 0; i < lineNum; i++) 
            {
                top += originPerImageHeight;
                lines[i] = new Line({
                    template: '<div><div class="html-crop-xline-wrap" style="position: absolute; width:100%;top:{{top}}"><div class="html-crop-xline" data-crop-html="xline{{number}}" ></div></div></div>',
                    model: {
                        'number': i,
                        'top': top +'px',
                    },
                    parentNode: '[data-crop-html="img-wrap"]',
                    container: '[data-crop-html="img-wrap"]'
                }).render();
            };  




            // test.on('getTempLineHtml', function(data) {
            //     console.log('data---:',data);
            // });

        }

    });

    module.exports = htmlCropper;

});