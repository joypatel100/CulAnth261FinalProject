'use strict';

angular.module('projectApp')
  .factory('DBService', ['$http', '$q', 'Config',
    function DBService($http, $q, Config) {
      var service = {};

      service.getStory = function(storyId) {
        var deferred = $q.defer();
        $http({
          method: 'GET',
          url: Config.baseUrl + 'stories?story_id=' + storyId
        }).then(function successCallback(response) {
          console.log(response);
          deferred.resolve({
            data: response.data.data[0]
          });
        }, function errorCallback(response) {
          console.log(response);
          deferred.reject();
        });

        return deferred.promise;
      };

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
            console.log(response);
            deferred.reject();
          });
        return deferred.promise;
      };

      service.createStory = function(story) {
        var deferred = $q.defer();
        console.log(story);
        $http({
          method: 'POST',
          url: Config.baseUrl + 'stories',
          headers: {
            'Content-Type': 'application/json'
          },
          data: {
            title: story.title.replace(/[\u0080-\uffff]/g, ""),
            author: story.author.replace(/[\u0080-\uffff]/g, ""),
            category: story.category,
            latitude: story.latitude,
            longitude: story.longitude,
            story: story.story.replace(/[\u0080-\uffff]/g, "")
          }
        }).then(function successCallback(response) {
          deferred.resolve({
            storyId: response.data.story_id
          });
        }, function errorCallback(response) {
          console.log(response);
          deferred.reject();
        });

        return deferred.promise;
      };

      return service;
    }
  ]);
