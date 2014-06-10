define(function(require, exports, module) {
    var Widget = require('widget'),
        MouseCoords = require("../widget/html-cropper-mousecoords");
    require("../../../css/html-crop.css");

    /*rectangle obj */
    function Box() {
        this.x = 0;
        this.y = 0;
        this.w = 50; 
        this.h = 30;
        this.fillColor = '#000000';
    }

    Box.prototype.contains = function(mx, my) {
        // All we have to do is make sure the Mouse X,Y fall in the area between
        // the shape's X and (X + Height) and its Y and (Y + Height)
        return  (this.x <= mx) && (this.x + this.w >= mx) &&
                (this.y <= my) && (this.y + this.h >= my);
    };

    

    var DragResizer = Widget.extend({
        events: {

            'mousedown .img-wrap' : 'mousedownFun',
            'mousemove .img-wrap' : 'myMouseMove',
            'mouseup .html-crop-con' : 'myMouseUp',
        },
        attrs: {
            /*
            * required only id
            * if id='canvas' , you could set canvasID: canvas
            */
            canvasID: null,
            canvas:null,

            
            boxes: [],

            _canvasHeight: null,
            _canvasWidth: null,
            ctx: null,
            ctxClone: null,


            dragOffsetX: null,
            dragOffsetY: null,
            beDragging: false,
            selection: null,



        },
        myDraw: null,
        valid: false,

        setup: function()
        {
            this.initCanvas(this.get('canvasID'));

            // add an orange rectangle
            this.addRectangle(200, 200, 40, 40, '#FFC02B');

            // add a smaller blue rectangle
            this.addRectangle(25, 90, 25, 25, '#2BB8FF');


            this.draw();
            // this.debugStopDraw();
        },

        //Initialize a new Box, add it, and invalidate the canvas
        addRectangle:function (x, y, w, h, fillColor) 
        {
            var rectangle = new Box;
            rectangle.x = x;
            rectangle.y = y;
            rectangle.w = w
            rectangle.h = h;
            rectangle.fill = fillColor;

            var boxes = this.get('boxes');
            boxes.push(rectangle);
            this.set('boxes', boxes);
            // invalidate();
        },



        initCanvas: function(canvasID)
        {
            var canvasHtml5 = document.getElementById(canvasID);
            this.set('canvas', canvasHtml5);
            this.set('_canvasHeight', canvasHtml5.height);
            this.set('_canvasWidth', canvasHtml5.width);
            this.set('ctx', canvasHtml5.getContext('2d'));

            this.initCloneCanvas();

        },
        initCloneCanvas: function()
        {
            var canvasClone = document.createElement('canvas');
            canvasClone.height = this.get('_canvasHeight');
            canvasClone.width = this.get('_canvasWidth');
            this.set('ctxClone', canvasClone.getContext('2d'));
        },
        clear: function(ctx) {
            console.log("clear");
            var w = this.get('_canvasWidth'),
                h = this.get('_canvasHeight');

            ctx.clearRect(0, 0, w, h);
        },
        drawshape: function(ctx, box, fillColor)
        {
            ctx.fillStyle = fillColor;
            ctx.fillRect(box.x, box.y, box.w, box.h);
        },

        draw: function()
        {

            var obj = this;
            var boxes = obj.get('boxes');
            myDraw = setInterval(function(){
                if (obj.valid == false) {
                    obj.clear(obj.get('ctx'));
                    obj.clear(obj.get('ctxClone'));

                    var l = boxes.length;
                    for (var i = l-1; i >= 0; i--) {
                        //@todo ????why yao clone  ,and why can't see clone
                        obj.drawshape(obj.get('ctxClone'), boxes[i], 'black');
                        obj.drawshape(obj.get('ctx'), boxes[i], boxes[i].fill);
                    }
                    obj.valid = true;
                }
                // console.log('valid' + obj.valid);
            }, 1000);
        },


        debugStopDraw: function()
        {
            clearInterval(myDraw);
        },
        getMouse: function(e)
        {
            var mouse = MouseCoords.getMouseOffset('[data-crop-html="img-wrap"]', e);
            return mouse;
        },

        mousedownFun: function(e)
        {
            var selectedBox;
            var mouse = this.getMouse(e),
                mouseX = mouse.x,
                mouseY = mouse.y;

            var ctxClone = this.get('ctxClone');
            var boxes = this.get('boxes');

            this.clear(ctxClone);

            // run through all the boxes
            var l = boxes.length;
            for (var i = l-1; i >= 0; i--) {
                if (boxes[i].contains(mouseX, mouseY)) {
                    console.log(boxes[i]);


                    selectedBox = boxes[i];
                    var dragOffsetX = mouseX - selectedBox.x;
                    this.set('dragOffsetX', dragOffsetX); 
                    var dragOffsetY = mouseY - selectedBox.y;
                    this.set('dragOffsetY', dragOffsetY);

                    this.set('beDragging', true); 
                    this.set('selection', selectedBox); 

                    this.valid = false;

                    return;
                  }

            }
            

            if (this.get('selection')) {
                this.set('selection', null); 
                this.valid = false; // Need to clear the old selection border
            }
     

        },
        myMouseMove: function(e){
            if (this.get('beDragging')) {
            
                
      mouse = this.getMouse(e);
      // We don't want to drag the object by its top-left corner, we want to drag it
      // from where we clicked. Thats why we saved the offset and use it here
      this.get('selection').x = mouse.x - this.get('dragOffsetX');
      this.get('selection').y = mouse.y - this.get('dragOffsetY');   
      this.valid = false;// Something's dragging so we must redraw




                return;
            }; 
        },

        myMouseUp: function(e)
        {
            this.set('beDragging', false);
        },
  




     

   
    

    });

    module.exports = DragResizer;

});