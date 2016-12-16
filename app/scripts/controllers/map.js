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
    self.loadingMarkers = false;
    self.map = new google.maps.Map(document.getElementById('google_map'), {
      center: {
        lat: 39.8282,
        lng: -98.5795
      },
      zoom: 4
    });

    var icons = {
      ancestry: {
        name: 'Ancestry',
        icon: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png'
      },
      athleticAbility: {
        name: 'Athletic Ability',
        icon: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
      },
      genomics: {
        name: 'Genomics',
        icon: 'http://maps.google.com/mapfiles/ms/icons/yellow-dot.png'
      },
      intelligence: {
        name: 'Intelligence',
        icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
      },
      race: {
        name: 'Race',
        icon: 'http://maps.google.com/mapfiles/ms/icons/orange-dot.png'
      }
    };

    google.maps.event.addListener(map, 'tilesloaded', function() {
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
          for (var key in icons) {
            if (data.category == icons[key].name) {
              marker.setIcon(icons[key].icon);
              break;
            }
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
        self.loadingMarkers = true;
      });
    });

    var legend = document.getElementById('legend');
    for (var key in icons) {
      var type = icons[key];
      var name = type.name;
      var icon = type.icon;
      var div = document.createElement('div');
      div.innerHTML = '<img src="' + icon + '"> ' + name;
      legend.appendChild(div);
    }

    self.map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(legend);

  }]);
