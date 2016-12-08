'use strict';

angular.module('projectApp')
  .factory('Config', [
    function Config() {
      var config = {
        baseUrl: 'http://104.154.161.82:8080/'
      };
      return config;
    }
  ]);
