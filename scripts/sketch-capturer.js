$.sketch.tools.capturer = {
  onEvent: function (e) {
    var x = e.pageX - this.canvas.offset().left;
    var y = e.pageY - this.canvas.offset().top;

    switch (e.type) {
    case 'mousedown':
    case 'touchstart':
      CharDrawing.STROKE = {
        type: 'stroke',
        x: [x],
        y: [y]
      };
      this.startPainting();
      break;
    case 'mouseup':
    case 'mouseout':
    case 'mouseleave':
    case 'touchleave':
    case 'touchend':
    case 'touchcancel':
      if (this.painting) {
        CharDrawing.STROKES.push(CharDrawing.STROKE);
        this.stopPainting();
      }
    }

    if (this.painting) {
      this.action.events.push({
        x: x,
        y: y,
        event: e.type
      });

      CharDrawing.STROKE.x.push(x);
      CharDrawing.STROKE.y.push(y);

      return this.redraw();
    }
  },
  draw: $.sketch.tools.marker.draw
};
