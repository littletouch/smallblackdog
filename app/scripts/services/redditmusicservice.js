'use strict';

/**
 * @ngdoc service
 * @name smallblackdogApp.redditMusicService
 * @description
 * # redditMusicService
 * Service in the smallblackdogApp.
 */
angular.module('smallblackdogApp')
  .service('redditMusicService', function redditMusicService($rootScope, $http, $q) {

    var VALID_MUSIC_DOMAINS = [
      'youtube.com'
    ];

    var MUSIC_SUBREDDITS = [
      'music',
      'listentothis',
      'futurebeats',
      'edm',
      'dubstep',
      'electrohouse',
      'realdubstep',
      'hiphopheads',
      'chillmusic',
      'gamemusic',
      'treemusic',
      'indie',
      'electronicmusic',
      'glitch',
      'metal',
      'trance',
      'jazz',
      'postrock',
      'progmetal',
      'punk',
      'psychedelicrock',
      'shoegaze',
      'rock',
      'country',
      'classicrock',
      'alternativerock',
      'posthardcore',
      'metalcore'
    ];

    var pusher = new Pusher('50ed18dd967b455393ed');

    var subredditNewPostListUrl = function(subreddit) {
      // more on reddit api http://www.reddit.com/dev/api
      return sprintf('http://www.reddit.com/r/%s/new.json?limit=100', subreddit);
    };

    var getTracklistFromSubredditNewPostList = function(subreddit) {
      var defer = $q.defer();
      console.log('fill playlist from subreddit ', subreddit);
      var url = subredditNewPostListUrl(subreddit);

      $http({method: 'GET', url: url}).
          success(function(data, status, headers, config) {
            var posts = data.data.children;
            var newTracks = _.chain(posts)
              .map('data')
              .filter(function(post) {
                return _.contains(VALID_MUSIC_DOMAINS, post.domain);
              })
              .value();
            defer.resolve(newTracks);
          }).
          error(function(data, status, headers, config) {
            console.log('oops, reddit api calling failed');
          });

      return defer.promise;
    };


    this.watchChannelsPost = function() {
      console.log('init');

      var channels = _.map(MUSIC_SUBREDDITS, function(name){
        return pusher.subscribe(name);
      });

      var newPostCallback = function(post) {
        console.log('new post from reddit', post);
        if (_.contains(VALID_MUSIC_DOMAINS, post.domain)) {
          $rootScope.$broadcast('event:new-track', post);
        }
      };

      channels.forEach(function(channel) {
        channel.bind('new-listing', newPostCallback);
      });
    };

    this.fillTracksFromOldPost = function() {
      // random select 3 subreddit
      var subreddits = _.sample(MUSIC_SUBREDDITS, 3);

      var requests = _.map(subreddits, function(subreddit) {
        return getTracklistFromSubredditNewPostList(subreddit);
      });

      $q.all(requests).then(function(data){
        console.log(data);
        var newTracks = _.flatten(data, true);
        console.log(newTracks);
        $rootScope.$broadcast('event:new-track-list', newTracks);
      });

    };

    this.init = function() {
      this.fillTracksFromOldPost();
      this.watchChannelsPost();
    };

  });