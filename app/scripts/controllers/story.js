'use strict';

angular.module('projectApp')
  .controller('StoryCtrl', ['$scope', '$http', 'DBService', function($scope, $http, DBService) {
    $scope.user = {
      title: '',
      author: '',
      story: '',
      longitude: '',
      latitude: '',
      address: '',
      category: '',
      storyId: '',
      hideId: true
    };
    $scope.submit = function() {
      console.log("submit");
      DBService.createStory($scope.user).then(function(promise) {
        $scope.user.hideId = false;
        $scope.user.storyId = promise.storyId;
      });
    };
    $scope.getLatLon = function() {
      console.log("getting lat lon");
      $http({
        method: "GET",
        url: "https://maps.googleapis.com/maps/api/geocode/json?address=" + $scope.user.address
      }).then(function successCallback(response) {
        $scope.user.latitude = response.data.results[0].geometry.location.lat;
        $scope.user.longitude = response.data.results[0].geometry.location.lng;
      }, function errorCallback(response) {
        console.log(response);
      });
    };
  }]);
