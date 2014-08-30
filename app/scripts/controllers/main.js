'use strict';

/**
 * @ngdoc function
 * @name smallblackdogApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the smallblackdogApp
 */
angular.module('smallblackdogApp')
  .controller('MainCtrl', function ($scope, redditMusicService) {
    var playlist = [];

    var player = videojs('blackdog-player', {
      'controls': true,
      'autoplay': true,
      'techOrder': ['youtube']
      // 'src': 'http://www.youtube.com/watch?v=xjS6SftYQaQ'
    }).ready(function(){
      var player = this;

      player.on('ended', function() {
        console.log('ended');
        var track = playlist.shift();
        player.src({
          src: track.url,
          type: 'video/youtube'
        });
      });
    });

    redditMusicService.init();

    var jumpToNewTrack = function() {
      // return if already playing
      if (player.src()) return;

      var track = playlist.shift();
      console.log('jump', track);

      //hardcoded
      player.src({
        src: track.url,
        type: 'video/youtube'
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

    $scope.$on('event:new-track-list', function(event, tracks) {
      console.log('new track list in ctrl', tracks);
      playlist = playlist.concat(tracks);
      playlistUpdateCallback();
      jumpToNewTrack();
    });

  });
