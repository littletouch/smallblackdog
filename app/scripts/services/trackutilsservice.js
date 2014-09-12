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

  var getTimeStamp = function() {
    return Date.parse(new Date())/1000;
  };

  this.init = function() {
    $localStorage.trackHistoryList = $localStorage.trackHistoryList || {};
    this.removeOldTrackHistory();
  };

  this.removeOldTrackHistory = function() {
    var SECOND = 1,
        MIN = 60 * SECOND,
        HOUR = 60 * MIN,
        DAY = 24 * HOUR,
        EXPIRE_DAYS = 15, // 默认15天过期
        cntTimeStamp = getTimeStamp(),
        outdatedTimeStamp = cntTimeStamp - DAY * EXPIRE_DAYS;

    console.log("clean track history list. outdated timestamp is " + outdatedTimeStamp);
    $localStorage.trackHistoryList = _.omit($localStorage.trackHistoryList, function(v, k, obj){
      return v < outdatedTimeStamp;
    });
  };

  this.filterPlayedTrack = function(tracks) {
    return _.filter(tracks, function(track) {
      return !$localStorage.trackHistoryList[getTrackUid(track)];
    });
  };

  this.saveTrackHistory = function(track) {
    var uid = getTrackUid(track);
    console.log(sprintf('save track %s history', uid));
    $localStorage.trackHistoryList[uid] = getTimeStamp();
  };
});
