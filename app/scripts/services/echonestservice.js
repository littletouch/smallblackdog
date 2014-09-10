'use strict';

/**
 * @ngdoc service
 * @name smallblackdogApp.echonestService
 * @description
 * # echonestService
 * Service in the smallblackdogApp.
 */
angular.module('smallblackdogApp')
  .service('echonestService', function echonestService($http, $q) {
    var API_URL = 'http://developer.echonest.com/api/v4/';
    var API_KEY = "GURIG51ENLW8SIQ95";

    var query = function(url, data) {
      console.log("query echonest");
      var deferred = $q.defer();

      data.api_key = API_KEY;
      data.format = 'jsonp';
      data.callback = 'JSON_CALLBACK';

      $http({
           method: 'JSONP',
           url: API_URL + url,
           params: data
      }).success(function(result) {
        deferred.resolve(result.response);
      });

      return deferred.promise;
    };

    this.getAudioDataByTrackId = function(trackId) {
      var deferred = $q.defer();
      var audioData = {};

      var data = {
        'id': trackId,
        'bucket': 'audio_summary'
      }

      query('track/profile', data).then(function(result) {
        data.callback = 'JSON_CALLBACK';
        data.format = 'jsonp';
        var track = result.track;
        var summary = track.audio_summary;
        var detailUrl = summary.analysis_url;

        audioData.track = track;

        $http({
          url: detailUrl,
        }).success(function(result) {
          audioData.summary = result;
          deferred.resolve(audioData);
        });
      })


      return deferred.promise;
    };

  });
