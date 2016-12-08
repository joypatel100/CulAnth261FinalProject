'use strict';

angular.module('projectApp')
  .controller('StoryCtrl', function($scope, $http) {
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
      console.log("hello");
      console.log($scope.user);
      $scope.user.hideId = false;
    };
    $scope.getLatLon = function() {
      console.log("getting lat lon");
      $http({
        method: "GET",
        url: "https://maps.googleapis.com/maps/api/geocode/json?address=" + $scope.address
      }).then(function successCallback(response) {
        console.log(response);
        $scope.user.latitude = response.data.results[0].geometry.location.lat;
        $scope.user.longitude = response.data.results[0].geometry.location.lng;
        console.log($scope);
      }, function errorCallback(response) {
        console.log("error in address");
      });
    };
  });
