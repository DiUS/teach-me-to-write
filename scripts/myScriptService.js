'use strict';

var CharDrawing = CharDrawing || {};

var API_KEY            = 'f520270d-5e94-4691-9de8-49a8a3d61cdc';
var SIMPLE_RECOGNITION = 'https://cloud.myscript.com/api/v3.0/recognition/rest/hwr/doSimpleRecognition.json';

CharDrawing.MyScript = function () {

  return {
    recognize: function (strokes) {

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

      return $.post(SIMPLE_RECOGNITION, data);

    }
  }
}
