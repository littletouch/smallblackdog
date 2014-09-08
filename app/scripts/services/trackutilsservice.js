'use strict';

/**
 * @ngdoc service
 * @name smallblackdogApp.trackUtilsService
 * @description
 * # trackUtilsService
 * Service in the smallblackdogApp.
 */
angular.module('smallblackdogApp')
  .service('trackUtilsService', function trackUtilsService($rootScope, $localStorage) {

  var getTrackMark = function(track) {
    return sprintf("%s:%s", track.domain, track.id);
  };

  this.init = function() {
    // FIXME: 短期内不重复播放.这个东西初始化和清理的策略是?
    $localStorage.trackHistoryList = $localStorage.trackHistoryList || {};
  };

  this.filterPlayedTrack = function(tracks) {
    return _.filter(tracks, function(track) {
      return !$localStorage.trackHistoryList[getTrackMark(track)];
    });
  };

  this.saveTrackHistory = function(track) {
    var mark = getTrackMark(track);
    console.log(sprintf('save track %s history', mark));
    $localStorage.trackHistoryList[mark] = Date.parse(new Date())/1000;
  };
});
