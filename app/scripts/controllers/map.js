'use strict';

angular.module('projectApp')
  .controller('MapCtrl', ['$scope', 'DBService', function($scope, DBService) {

    $scope.self = self;

    self.hideInfo = true;
    self.markers = [];
    self.title = '';
    self.author = '';
    self.dateAdded = '';
    self.category = '';
    self.story = '';
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
        var marker = new google.maps.Marker({
          position: {
            lat: data.latitude,
            lng: data.longitude
          },
          map: self.map
        });
        data.marker = marker;
        self.markers.push(data);
        if (data.category == 'Ancestry') {
          marker.setIcon('http://maps.google.com/mapfiles/ms/icons/green-dot.png');
        } else if (data.category == 'Athletic Ability') {
          marker.setIcon('http://maps.google.com/mapfiles/ms/icons/red-dot.png');
        } else if (data.category == 'Genomics') {
          marker.setIcon('http://maps.google.com/mapfiles/ms/icons/yellow-dot.png');
        } else if (data.category == 'Intelligence') {
          marker.setIcon('http://maps.google.com/mapfiles/ms/icons/blue-dot.png');
        } else if (data.category == 'Race') {
          marker.setIcon('http://maps.google.com/mapfiles/ms/icons/orange-dot.png');
        }
      }

      for (var i = 0; i < self.markers.length; i++) {
        (function(i) {
          google.maps.event.addListener(self.markers[i].marker, 'click', function() {
            console.log(self.markers[i].story_id);
            DBService.getStory(self.markers[i].story_id).then(function(promise) {
              self.title = promise.data.title;
              self.author = promise.data.author;
              self.dateAdded = promise.data.date_added;
              self.category = promise.data.category;
              self.story = promise.data.story;
              self.hideInfo = false;
            });
          });
        })(i);
      }

    });
  }]);
