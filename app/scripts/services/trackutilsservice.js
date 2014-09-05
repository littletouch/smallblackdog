'use strict';

/**
 * @ngdoc service
 * @name smallblackdogApp.trackUtilsService
 * @description
 * # trackUtilsService
 * Service in the smallblackdogApp.
 */
angular.module('smallblackdogApp')
  .service('trackUtilsService', function redditMusicService($rootScope, $localStorage) {

  var getTrackMark = function(track) {
    return sprintf("%s:%s", track.domain, track.id);
  };

  this.init = function() {
    // FIXME: 短期内不重复播放.这个东西初始化和清理的策略是?
    $localStorage.trackHistoryList = $localStorage.trackHistoryList || [];
  };

  this.filterPlayedTrack = function(tracks) {
    return _.filter(tracks, function(track) {
      return !(_.find($localStorage.trackHistoryList, getTrackMark(track)));
    });
  };

  this.saveTrackHistory = function(track) {
    var mark = getTrackMark(track);
    console.log(sprintf('save track %s', mark));
    $localStorage.trackHistoryList.push(mark);
  };
});
