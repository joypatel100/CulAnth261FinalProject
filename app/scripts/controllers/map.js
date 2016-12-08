'use strict';

angular.module('projectApp')
  .controller('MapCtrl', ['$scope', 'DBService', function($scope, DBService) {

    self.markers = [];
    self.map = new google.maps.Map(document.getElementById('google_map'), {
      center: {
        lat: 39.8282,
        lng: -98.5795
      },
      zoom: 4
    });

    DBService.getAllStories().then(function(promise) {
      for (var i = 0; i < promise.data.length; i++) {
        var data = promise.data[i];
        self.markers.push(new google.maps.Marker({
          position: {
            lat: data.latitude,
            lng: data.longitude
          },
          map: self.map
        }));
      }
    });
    /*
    $scope.markers.push(new google.maps.Marker({
      position: {
        lat: 39,
        lng: -98
      },
      map: $scope.map
    }));
    */
  }]);
