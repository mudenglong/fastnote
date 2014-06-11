define(function(require, exports, module) {
    var Widget = require('widget'),
        MouseCoords = require("../widget/html-cropper-mousecoords");
    require("../../../css/html-crop.css");

    /*rectangle obj */
    function Box(DragResizer) {
        this.dragResizerObj = DragResizer;
        this.state = this.dragResizerObj.options;
        this.x = 0;
        this.y = 0;
        this.w = 50; 
        this.h = 30;
        this.fillColor = 'rgba(0,255,0,.7)';
    }

    Box.prototype.contains = function(mx, my) {
        // All we have to do is make sure the Mouse X,Y fall in the area between
        // the shape's X and (X + Height) and its Y and (Y + Height)
        return  (this.x <= mx) && (this.x + this.w >= mx) &&
                (this.y <= my) && (this.y + this.h >= my);
    };

    Box.prototype.drawBox = function(ctx) {
        ctx.fillStyle = this.fillColor;
        ctx.fillRect(this.x, this.y, this.w, this.h);
        // console.log(this.state.selection);
        // if (this.state.selection === this) {
            console.log("111111");
            console.log(this.state.selectionColor);
            ctx.strokeStyle = this.state.selectionColor;
            ctx.lineWidth = this.state.selectionWidth;
            ctx.strokeRect(this.x,this.y,this.w,this.h);

            // draw the boxes
            var half = this.state.selectionBoxSize / 2;

            // 0  1  2
            // 3     4
            // 5  6  7

            // top left, middle, right
            this.state.selectionHandles[0].x = this.x-half;
            this.state.selectionHandles[0].y = this.y-half;

            this.state.selectionHandles[1].x = this.x+this.w/2-half;
            this.state.selectionHandles[1].y = this.y-half;

            this.state.selectionHandles[2].x = this.x+this.w-half;
            this.state.selectionHandles[2].y = this.y-half;

            //middle left
            this.state.selectionHandles[3].x = this.x-half;
            this.state.selectionHandles[3].y = this.y+this.h/2-half;

            //middle right
            this.state.selectionHandles[4].x = this.x+this.w-half;
            this.state.selectionHandles[4].y = this.y+this.h/2-half;

            //bottom left, middle, right
            this.state.selectionHandles[6].x = this.x+this.w/2-half;
            this.state.selectionHandles[6].y = this.y+this.h-half;

            this.state.selectionHandles[5].x = this.x-half;
            this.state.selectionHandles[5].y = this.y+this.h-half;

            this.state.selectionHandles[7].x = this.x+this.w-half;
            this.state.selectionHandles[7].y = this.y+this.h-half;


            ctx.fillStyle = this.state.selectionBoxColor;
            for (var i = 0; i < 8; i += 1) {

                var cur = this.state.selectionHandles[i];
                ctx.fillRect(cur.x, cur.y, this.state.selectionBoxSize, this.state.selectionBoxSize);
            }
        // }
    };

  

    var DragResizer = Widget.extend({
        events: {

            'mousedown .img-wrap' : 'mousedownFun',
            'mousemove .img-wrap' : 'myMouseMove',
            'mouseup .html-crop-con' : 'myMouseUp',
            'dblclick .img-wrap' : 'myDbclick'
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

            beResizeDragging: false,
            //return which selectionHandles when dragging selectionHandles
            expectResize: -1,

        },
        options:{
            //八个角上的拖动手柄
            selectionHandles : [],
            selectionColor: '#CC0000',
            selectionBoxColor: 'darkred',
            selectionBoxSize: 6,
            selectionWidth: 2,

        },
        myDraw: null,
        valid: false,

        setup: function()
        {
            var i, 
                selectionHandles = this.options.selectionHandles;



            for (i = 0; i < 8; i += 1) {
                selectionHandles.push(new Box(this));
            }
            this.set('selectionHandles', selectionHandles);



            this.initCanvas(this.get('canvasID'));

            // add rectangle
            this.addRectangle(this, 200, 200, 40, 40, 'rgba(0,255,0,.7)');
            // this.addRectangle(25, 90, 25, 25, '#2BB8FF');


           

            //@todo 把时间refresh的操作显示出来
            this.draw();
            // this.debugStopDraw();
        },

        //Initialize a new Box, add it, and invalidate the canvas
        addRectangle:function (that, x, y, w, h, fillColor) 
        {
            console.log(that);
            var rectangle = new Box(that);
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

                        boxes[i].drawBox(obj.get('ctx')); 
                        // obj.drawshape(obj.get('ctxClone'), boxes[i], 'black');
                        // obj.drawshape(obj.get('ctx'), boxes[i], boxes[i].fill);
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
                    selectedBox = boxes[i];
                    var dragOffsetX = mouseX - selectedBox.x;
                    this.set('dragOffsetX', dragOffsetX); 
                    var dragOffsetY = mouseY - selectedBox.y;
                    this.set('dragOffsetY', dragOffsetY);

                    this.set('beDragging', true); 
                    this.set('selection', selectedBox); 
                    // console.log(this.get('selection'));

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
            
                var mouse = this.getMouse(e);
                // We don't want to drag the object by its top-left corner, we want to drag it
                // from where we clicked. Thats why we saved the offset and use it here
                this.get('selection').x = mouse.x - this.get('dragOffsetX');
                this.get('selection').y = mouse.y - this.get('dragOffsetY');   
                // Something is dragging so we must redraw
                this.valid = false;

                // return;
            }else if (this.get('beResizeDragging')) {
              // time ro resize!
              oldx = this.get('selection').x;
              oldy = this.get('selection').y;
              console.log('enter!');
              // 0  1  2
              // 3     4
              // 5  6  7
              // switch (myState.expectResize) {
              //   case 0:
              //     myState.selection.x = mx;
              //     myState.selection.y = my;
              //     myState.selection.w += oldx - mx;
              //     myState.selection.h += oldy - my;
              //     break;
              //   case 1:
              //     myState.selection.y = my;
              //     myState.selection.h += oldy - my;
              //     break;
              //   case 2:
              //     myState.selection.y = my;
              //     myState.selection.w = mx - oldx;
              //     myState.selection.h += oldy - my;
              //     break;
              //   case 3:
              //     myState.selection.x = mx;
              //     myState.selection.w += oldx - mx;
              //     break;
              //   case 4:
              //     myState.selection.w = mx - oldx;
              //     break;
              //   case 5:
              //     myState.selection.x = mx;
              //     myState.selection.w += oldx - mx;
              //     myState.selection.h = my - oldy;
              //     break;
              //   case 6:
              //     myState.selection.h = my - oldy;
              //     break;
              //   case 7:
              //     myState.selection.w = mx - oldx;
              //     myState.selection.h = my - oldy;
              //     break;
              // }
              // this.valid = false;
            }

            var mouse2 = this.getMouse(e);
            var mx = mouse2.x;
            var my = mouse2.y;

            var selectionHandles = this.options.selectionHandles;
            var selectionBoxSize = this.options.selectionBoxSize;
            var that = e.currentTarget;

            // if there's a selection see if we grabbed one of the selection handles
            if (this.get('selection') !== null && !this.get('beResizeDragging')) {
         
                for (var i = 0; i < 8; i += 1) {
                    // 0  1  2
                    // 3     4
                    // 5  6  7
                    cur = selectionHandles[i];



                    // we dont need to use the ghost context because
                    // 确定鼠标悬停的是哪个托拽框
                    if (mx >= cur.x && mx <= cur.x + selectionBoxSize &&
                    my >= cur.y && my <= cur.y + selectionBoxSize) {

                        // we found one!
                        this.set('expectResize', i);

                        this.valid = false;
              

                        switch (i) {
                          case 0:
                            that.style.cursor='nw-resize';
                            break;
                          case 1:
                            that.style.cursor='n-resize';
                            break;
                          case 2:
                            that.style.cursor='ne-resize';
                            break;
                          case 3:
                            that.style.cursor='w-resize';
                            break;
                          case 4:
                            that.style.cursor='e-resize';
                            break;
                          case 5:
                            that.style.cursor='sw-resize';
                            break;
                          case 6:
                            that.style.cursor='s-resize';
                            break;
                          case 7:
                            that.style.cursor='se-resize';
                            break;
                        }
                        return;
                    }

                }
                // not over a selection box, return to normal
                this.set('beResizeDragging', false);
                this.set('expectResize', -1);

                // this.style.cursor = 'auto';
            }








        },

        myMouseUp: function(e)
        {
            this.set('beDragging', false);
        },
        myDbclick: function(e)
        {
            var mouse = this.getMouse(e);
            this.addRectangle(this, (mouse.x - 20), (mouse.y - 20), 80, 40, 'rgba(0,255,0,.7)');
            this.valid = false;
        },

  




     

   
    

    });

    module.exports = DragResizer;

});