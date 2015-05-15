'use strict';

var CharDrawing = CharDrawing || {};

CharDrawing.CURR_CHALLENGE = 31;
CharDrawing.STROKE         = {};
CharDrawing.STROKES        = [];

CharDrawing.init = function () {

  function initVars () {
    CharDrawing.STROKES = [];
    CharDrawing.STROKE  = {};

    var challenge = generateCharacter();
    CharDrawing.CURR_CHALLENGE = challenge;
  }

  function generateCharacter () {
    // 48 - 57 (numbers)
    // 65 - 90 ([A-Z])
    var asciiCode = Math.floor(Math.random() * (90 - 48) + 48);
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
    $('.result p').css({lineHeight: mainH + 'px'});

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

  $('#mycanvas').sketch({
    defaultTool: 'capturer',
    defaultColor: '#ff0000',
    defaultSize: 10
  });

  $('.check').on('click', function (e) {
    e.preventDefault();

    $('.loading').show();

    new CharDrawing.MyScript()
      .recognize(CharDrawing.STROKES)
      .fail(function (jqXHR, text) {
        $('.messages').html('<p>Something is wrong: ' + text + '</p>');
      })
      .done(function successRequest (jsonResult) {
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
      })
      .always(function () {
        $('.loading').hide();
      });
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
