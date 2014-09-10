'use strict';

/**
 * @ngdoc overview
 * @name smallblackdogApp
 * @description
 * # smallblackdogApp
 *
 * Main module of the application.
 */
angular
  .module('smallblackdogApp', [
    'ngRoute',
    'ngStorage',
    'cfp.hotkeys'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
