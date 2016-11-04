'use strict';

angular.module('projectApp')
  .controller('MapCtrl', function ($scope) {
    $scope.map = new google.maps.Map(document.getElementById('google_map'), {
      center: {
        lat: 39.8282,
        lng: -98.5795
      },
      zoom: 4
    });
    $scope.markers = [];
    $scope.markers.push(new google.maps.Marker({
          position: {
            lat: 39.8282,
            lng: -98.5795
          },
          map: $scope.map
        })
      );
});
