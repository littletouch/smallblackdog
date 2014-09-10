'use strict';

/**
 * @ngdoc function
 * @name smallblackdogApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the smallblackdogApp
 */
angular.module('smallblackdogApp')
  .controller('MainCtrl',
       function ($scope, $timeout, trackUtilsService, redditMusicService, echonestService, hotkeys) {
    $scope.initializing = true;
    $scope.progressPercentage = 0;
    $scope.playing = false;
    $scope.beats = [];

    NProgress.configure({
      showSpinner: false,
      minimum: 0
    });

    // hotkey to play/pause the song
    hotkeys.add({
      combo: 'space',
      description: 'Play/Pause',
      callback: function(event) {
        playOrPause();
        event.preventDefault();
      }
    });

    // hotkey to skip the song
    hotkeys.add({
      combo: 'right',
      callback: function(event) {
        toNextTrack();
        event.preventDefault();
      }
    });

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
        var currentTime = player.currentTime();
        var percent = currentTime / player.duration();
        $scope.progressPercentage = percent;
        NProgress.set(percent);
        // beatEventCallback(currentTime);
      });

    });

    trackUtilsService.init();
    redditMusicService.init();

    // var beatEventCallback = function(currentTime) {
    //   console.log();
    // }

    var playOrPause = function() {
      var isPlaying = !player.paused();
      if(isPlaying) {
        console.log("pause");
        player.pause();
        $scope.playing = false;
      } else {
        console.log("play");
        player.play();
        $scope.playing = true;
      }
    }

    var toNextTrack = function() {
      var track = playlist.shift();
      player.src({
        src: track.sourceUrl,
        type: 'video/youtube'
      });
      trackUtilsService.saveTrackHistory(track);

      $scope.track = track;
      $timeout(function() {
        $scope.$apply();
      });

      redditMusicService.getCoverByTrackTitle(track.title).then(function(data){
        $scope.cover = data.cover;

        // echonestService
        //   .getAudioDataByTrackId(data.uri)
        //   .then(function(audioData){
        //     var summary = audioData.summary;
        //     $scope.beats = summary.beats;
        //   });

      }, function(reason) {
        console.log(track.sourceId);
        $scope.cover = sprintf(
          'http://i3.ytimg.com/vi/%s/0.jpg',
          track.sourceId
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
      playlist = trackUtilsService.filterPlayedTrack(playlist);
      playlistUpdateCallback();
      toNextTrack();
      $scope.initializing = false;
      $scope.playing = true;
    });

  });
