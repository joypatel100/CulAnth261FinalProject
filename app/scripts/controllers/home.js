'use strict';

/**
 * @ngdoc function
 * @name projectApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the projectApp
 */
angular.module('projectApp')
  .controller('HomeCtrl', function ($scope) {
    $scope.doCool = function(){
      console.log('cool');
    };
  });
