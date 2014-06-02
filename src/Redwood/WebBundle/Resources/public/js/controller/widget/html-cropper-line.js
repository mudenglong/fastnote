define(function(require, exports, module) {
    var Widget = require('widget'),
        Templatable = require('templatable');

    var Line = Widget.extend({
        Implements: Templatable,

        attrs: {

            /*  
            * auto init by function _initContainer()
            */
            container: null, 

        },
        events: {
            'click .html-crop-xline-wrap' : 'dragLine',
            // 'click [data-crop-html^=xline]' : 'dragLine',
        },


        setup: function(){
            this._initContainer(this.get('parentNode'));
            console.log(this.element);
        },
        _initContainer: function(container)
        {
            this.set('container', container);
        },

        dragLine: function(ev) {
            // this.trigger('getTempLineHtml', html);
            console.log("111");

           
            var mousePos = this.getMouseOffset(this.get('container'), ev);
            console.log(mousePos);


        },

        /*return mouse coordinates on windows*/
        _mouseCoords:function(event)
        {
            var e = event || window.event;
            var scrollX = document.documentElement.scrollLeft || document.body.scrollLeft;
            var scrollY = document.documentElement.scrollTop || document.body.scrollTop;
            var x = e.pageX || e.clientX + scrollX;
            var y = e.pageY || e.clientY + scrollY;
            return { 'x': x, 'y': y };
            // return { 'x': e.pageX, 'y': e.pageY };
        },

        _getContainerOffset: function(container)
        {

            var offset = $(container).offset();
            return {
                'x': Math.round(offset.left),
                'y': Math.round(offset.top),
            };
        },

        /*return mouse coordinates on container*/
        getMouseOffset: function(container, ev)
        {
            var mousePos = this._mouseCoords(ev);
            var containerPos = this._getContainerOffset(container);

            return {
                'x':Math.max((mousePos.x - containerPos.x),0),
                'y':mousePos.y - containerPos.y,

            };

        },


    });

    module.exports = Line;

});