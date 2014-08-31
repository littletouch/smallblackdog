'use strict';

/**
 * @ngdoc function
 * @name smallblackdogApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the smallblackdogApp
 */
angular.module('smallblackdogApp')
  .controller('MainCtrl', function ($scope, $timeout, redditMusicService) {
    $scope.initializing = true;
    $scope.progressPercentage = 0;

    var playlist = [];

    var player = videojs('blackdog-player', {
      'controls': true,
      'autoplay': true,
      'techOrder': ['youtube']
    }).ready(function(){
      var player = this;

      player.on('ended', function() {
        console.log('ended');
        toNextTrack();
      });

      player.on('timeupdate', function(event) {
        var percent = player.currentTime() / player.duration();
        $scope.progressPercentage = percent;
      });

    });

    redditMusicService.init();

    var toNextTrack = function() {
      var track = playlist.shift();
      console.log('next', track);
      player.src({
        src: track.url,
        type: 'video/youtube'
      });

      $scope.track = track;
      $timeout(function() {
        $scope.$apply();
      });

      redditMusicService.getCoverByTrackTitle(track.title).then(function(cover){
        $scope.cover = cover;
        console.log('cover in ctrl', cover);
      }, function(reason) {
        console.log(track.youtubeId);
        $scope.cover = sprintf(
          'http://i3.ytimg.com/vi/%s/0.jpg',
          track.youtubeId
        );
      });

    };

    var playlistUpdateCallback = function() {
      playlist = _.shuffle(playlist);
    };

    $scope.$on('event:new-track', function(event, track) {
      console.log('new track in ctrl', track);
      playlist.push(track);
      playlistUpdateCallback();
    });

    $scope.$on('event:init-track-list', function(event, tracks) {
      console.log('init track list in ctrl', tracks);
      playlist = playlist.concat(tracks);
      playlistUpdateCallback();
      toNextTrack();
      $scope.initializing = false;
    });

  });
