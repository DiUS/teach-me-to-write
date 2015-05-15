'use strict';

var CharDrawing = CharDrawing || {};
var API_KEY     = 'a31966c7-7508-438e-9aa3-192cbd7addef';
var RECOGN_URL  = 'https://cloud.myscript.com/api/myscript/v2.0/hwr/doSimpleRecognition.json';

CharDrawing.CURR_CHALLENGE = 31;

CharDrawing.recognize = function (strokes) {

  var jsonPost = {
    hwrParameter: {
      language: 'en_US'
    },
    inputUnits: [{
      components: strokes
    }]
  };

  var data = {
    apiKey: API_KEY,
    hwrInput: JSON.stringify(jsonPost)
  };

  function successRequest (jsonResult) {
    $('.loading').hide();
    if (jsonResult.result.textSegmentResult.candidates.length > 0) {
      var result = jsonResult.result.textSegmentResult.candidates[0].label;
      var charCodeResult = result.toUpperCase().charCodeAt(0);
      if (charCodeResult === CharDrawing.CURR_CHALLENGE) {
        alert('Well done!');
      } else {
        alert('Back to school!');
      }
    }
  }

  function errorHandler (XMLHttpRequest, textStatus) {
    $('.loading').hide();
    $('.messages').html('<p>Something is wrong: ' + XMLHttpRequest.responseText + '</p>');
  }

  $('.loading').show();

  $.post(RECOGN_URL, data, successRequest, 'json').error(errorHandler);
};

CharDrawing.init = function () {

  var stroke, strokes;

  function initVars () {
    strokes     = [];
    stroke      = {};
  }

  function generateCharacter () {
    // 48 - 57 (numbers)
    // 65 - 90 ([A-Z])
    var asciiCode = Math.floor(Math.random() * (90 - 47) + 47);
    if (asciiCode > 57 && asciiCode < 65) {
      return generateCharacter();
    }
    return asciiCode;
  }

  function initMainUI () {
    var mainW = $('main').innerWidth() - 100;
    var mainH = $('main').innerHeight() - 100;

    $('canvas').attr('width', mainW / 2).attr('height', mainH);
    $('.result').css({width: mainW / 2, height: mainH});
  }

  $.sketch.tools.capturer = {
    onEvent: function(e) {
      var x = e.pageX - this.canvas.offset().left;
      var y = e.pageY - this.canvas.offset().top;

      switch (e.type) {
        case 'mousedown':
        case 'touchstart':
          stroke = {
            type: 'stroke',
            x : [x],
            y : [y]
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
            strokes.push(stroke);
            this.stopPainting();
          }
      }

      if (this.painting) {
        this.action.events.push({
          x: x,
          y: y,
          event: e.type
        });

        stroke.x.push(x);
        stroke.y.push(y);

        return this.redraw();
      }
    },
    draw: $.sketch.tools.marker.draw
  };

  $('#mycanvas').sketch({
    defaultTool: 'capturer',
    defaultColor: '#ff0000',
    defaultSize: 10
  });

  $('.check').on('click', function (e) {
    e.preventDefault();
    CharDrawing.recognize(strokes);
  });

  initVars();
  initMainUI();

  var challenge = generateCharacter();
  CharDrawing.CURR_CHALLENGE = challenge;
  $('.result p').html(String.fromCharCode(CharDrawing.CURR_CHALLENGE));
};
