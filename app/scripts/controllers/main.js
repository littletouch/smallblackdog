'use strict';

/**
 * @ngdoc function
 * @name smallblackdogApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the smallblackdogApp
 */
angular.module('smallblackdogApp')
  .controller('MainCtrl', function ($scope, $timeout, redditMusicService, hotkeys) {
    $scope.initializing = true;
    $scope.progressPercentage = 0;
    $scope.playing = false;

    var loader = document.getElementById('loader-inner')
      , border = document.getElementById('loader-outer')
      , α = 0
      , π = Math.PI
      , t = 15
      , tdraw;

    function PieDraw() {
      α++;
      α %= 360;
      var r = ( α * π / 180 )
      , x = Math.sin( r ) * 250
      , y = Math.cos( r ) * - 250
      , mid = ( α > 180 ) ? 1 : 0
      , anim = 'M 0 0 v -250 A 250 250 1 ' 
             + mid + ' 1 ' 
             +  x  + ' ' 
             +  y  + ' z';

      loader.setAttribute( 'd', anim );
      border.setAttribute( 'd', anim );

      tdraw = $timeout(PieDraw, t);
    }

    PieDraw();

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
        var percent = player.currentTime() / player.duration();
        $scope.progressPercentage = percent;
        NProgress.set(percent);
      });

    });

    redditMusicService.init();

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
      $scope.playing = true;
      $timeout.cancel(tdraw);
    });

  });
