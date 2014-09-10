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

  var getTrackUid = function(track) {
    return sprintf("%s:%s", track.domain, track.sourceId);
  };

  this.init = function() {
    // FIXME: 短期内不重复播放.这个东西初始化和清理的策略是?
    $localStorage.trackHistoryList = $localStorage.trackHistoryList || {};
  };

  this.filterPlayedTrack = function(tracks) {
    return _.filter(tracks, function(track) {
      return !$localStorage.trackHistoryList[getTrackUid(track)];
    });
  };

  this.saveTrackHistory = function(track) {
    var uid = getTrackUid(track);
    console.log(sprintf('save track %s history', uid));
    $localStorage.trackHistoryList[uid] = Date.parse(new Date())/1000;
  };
});
