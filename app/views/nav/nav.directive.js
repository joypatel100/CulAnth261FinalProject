'use strict';

angular.module('projectApp')
  .directive('nav', function () {
    return {
      templateUrl: 'views/nav/nav.html',
      restrict: 'EA',
      scope: {},
      link: function () {},
      controller: function ($scope) {
        console.log("navbar");
        console.log($scope);
      }
    };
  });
