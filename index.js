'use strict';

var CharDrawing = CharDrawing || {};
var API_KEY     = 'f520270d-5e94-4691-9de8-49a8a3d61cdc';
var RECOGN_URL  = 'https://cloud.myscript.com/api/v3.0/recognition/rest/hwr/doSimpleRecognition.json';

CharDrawing.CURR_CHALLENGE = 31;

CharDrawing.recognize = function (strokes) {

  var jsonPost = {
    hwrParameter: {
      language: 'en_US',
      hwrInputMode: 'CURSIVE',
      resultDetail: 'CHARACTER',
      hwrProperties: {
         textCandidateListSize: 1,
         wordCandidateListSize: 1,
         characterCandidateListSize: 1
      },
      contentTypes:[ 'text' ]
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

      console.log('Result is: ', result, ', with charcode: ', charCodeResult);

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

    var challenge = generateCharacter();
    CharDrawing.CURR_CHALLENGE = challenge;
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
    var headerH = $('h1').outerHeight() + parseInt($('h1').css('margin-top'), 10) + parseInt($('h1').css('margin-bottom'), 10);
    var toolboxH = $('.toolbox').outerHeight() + parseInt($('.toolbox').css('margin-top'), 10) + parseInt($('.toolbox').css('margin-bottom'), 10);

    var mainW = $('main').innerWidth() - 100;
    var mainH = $('main').innerHeight() - (headerH + toolboxH) - 50;

    $('canvas').attr('width', mainW / 2).attr('height', mainH);
    $('.result').css({width: mainW / 2, height: mainH});

    updateChallenge();
  }

  function updateChallenge () {
    $('.result p').html(String.fromCharCode(CharDrawing.CURR_CHALLENGE));
  }

  function clearDrawings () {
    var sk = $('#mycanvas').data('sketch'), context = sk.context;
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    sk.actions = [];
    sk.action = [];
    sk.stopPainting();
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

  $('.new-challenge').on('click', function (e) {
    e.preventDefault();
    initVars();
    clearDrawings();
    updateChallenge();
  });

  $('.clear').on('click', function (e) {
    e.preventDefault();
    clearDrawings();
  });

  initVars();
  initMainUI();
};
