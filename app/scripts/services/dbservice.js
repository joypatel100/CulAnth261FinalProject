'use strict';

angular.module('projectApp')
  .factory('DBService', ['$http', '$q', 'Config',
    function DBService($http, $q, Config) {
      var service = {};

      service.getAllStories = function() {
        var deferred = $q.defer();
        $http({
          method: 'GET',
          url: Config.baseUrl + 'stories'
        }).then(function successCallback(response) {
            deferred.resolve({
              data: response.data.data
            });
          },
          function errorCallback(response) {
            deferred.reject();
          });
        return deferred.promise;
      };

      service.createStory = function(story) {
        var deferred = $q.defer();

        $http({
          method: 'POST',
          url: Config.baseUrl + 'stories',
          headers: {
            'Content-Type': 'application/json'
          },
          data: {
            title: story.title,
            author: story.author,
            category: story.category,
            latitude: story.latitude,
            longitude: story.longitude,
            story: story.story
          }
        }).then(function successCallback(response) {
          console.log(response);
        }, function errorCallback(response) {
          console.log(response);
        });
      };

      return service;
    }
  ]);
