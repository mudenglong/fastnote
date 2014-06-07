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
              
            }).render();

// holds all our rectangles
var boxes = []; 
var valid = false;
var ctx;

//Box object to hold data for all drawn rects
function Box() {
  this.x = 0;
  this.y = 0;
  this.w = 222; // default width and height?
  this.h = 333;
  this.fill = '#000000';
}
 
//Initialize a new Box, add it, and invalidate the canvas
function addRect(x, y, w, h, fill) {
  var rect = new Box;
  rect.x = x;
  rect.y = y;
  rect.w = w
  rect.h = h;
  rect.fill = fill;

  boxes.push(rect);
  // invalidate();
}
addRect();
console.log(boxes);



// initialize our canvas, add a ghost canvas, set draw loop
// then add everything we want to intially exist on the canvas
function init() {
    var canvasHtml5 = document.getElementById('canvas'),
    canvasHeight = canvasHtml5.height,
    canvasWidth = canvasHtml5.width;
    ctx = canvasHtml5.getContext('2d');

    // var canvasClone = document.createElement('canvas');
    // var canvasClone.height = canvasHeight;

    // var canvasClone.width = canvasWidth,
    // ctxClone = canvasClone.getContext('2d');

    //fixes a problem where double clicking causes text to get selected on the canvas
    //canvasHtml5.onselectstart = function () { return false; }

    // make draw() fire every INTERVAL milliseconds.
    myVar = setInterval(draw, 1000);

    // add our events. Up and down are for dragging,
    // double click is for making new boxes
    // canvas.onmousedown = myDown;
    // canvas.onmouseup = myUp;
    // canvas.ondblclick = myDblClick;
 
}

function myStopFunction() {
    clearInterval(myVar);
}

init();
// myStopFunction();

function clear(ctx) {
  ctx.clearRect(0, 0, 895, 1000);
}

function drawshape(ctx, box, fillColor) {

    ctx.fillStyle = fillColor;
    ctx.fillRect(2, 2, 200, 300);
}


// While draw is called as often as the INTERVAL variable demands,
// It only ever does something if the canvas gets invalidated by our code
function draw() {
  if (valid == false) {
    clear(ctx);
 

    // draw all boxes
    var l = boxes.length;
    for (var i = 0; i < l; i++) {
        drawshape(ctx, boxes[i], boxes[i].fill);
    }
 
    // draw selection
    // right now this is just a stroke along the edge of the selected box
    // if (mySel != null) {
    //   ctx.strokeStyle = mySelColor;
    //   ctx.lineWidth = mySelWidth;
    //   ctx.strokeRect(mySel.x,mySel.y,mySel.w,mySel.h);
    // }
 
    // Add stuff you want drawn on top all the time here
 
 
    valid = true;
  }
}






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

