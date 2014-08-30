'use strict';

/**
 * @ngdoc function
 * @name smallblackdogApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the smallblackdogApp
 */
angular.module('smallblackdogApp')
  .controller('AboutCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
