'use strict';

var WeatherApp = angular.module('WeatherApp', []);

WeatherApp.factory('weatherServiceFactory', function ($http, $templateCache) {
  var $weather = {};

  $weather.showWeather = function (response) {
    if ('data' in response) {
      if (response.data.query.count > 0) {
        var data = response.data.query.results.channel;
        $weather.location = data.location;
        $weather.forecast = data.item.forecast.slice(0, 5);
        $weather.unit = data.units.temperature;
        
        $weather.hasState = 'has-success';
      } else {
        $weather.hasState = 'has-warning';
        $weather.message = 'No results found!';
      }
    } else {
      $weather.hasState = 'has-warning';
      $weather.message = 'Invalid request!';
    }
    $weather.showLoader = false;
  };

  $weather.showError = function (response) {
    $weather.hasState = 'has-warning';
    $weather.message = 'Occurred a error with Yahoo search. Try again later.';
    $weather.showLoader = false;
  };
  $weather.getYahooUrl = function () {
    return "https://query.yahooapis.com/v1/public/yql?q=select * from weather.forecast where woeid in (select woeid from geo.places(1) where text='%s') and u='c'&format=json".replace("%s", this.city);
  };
  $weather.search = function () {
    if ($weather.city == '' || $weather.city == undefined) {
      $weather.hasState = 'has-warning';
      $weather.message = 'Please provide a location';
      return;
    }
    $weather.showLoader = true;
    $http.get(this.getYahooUrl(), { cache: $templateCache }).then(this.showWeather, this.showError);
  };
  $weather.city = 'Porto, PT';
  $weather.location = {};
  $weather.forecast = [];
  $weather.unit = '';
  $weather.hasState = '';
  $weather.message = '';
  $weather.showLoader = false;

  return $weather;
});

WeatherApp.filter('temp', function ($filter) {
  return function (input, unit) {
    if (!unit) {
      unit = 'C';
    }
    var numberFilter = $filter('number');
    return numberFilter(input, 1) + '\u00B0' + unit;
  };
});

WeatherApp.controller('WeatherCtrl', function ($scope, weatherServiceFactory, $http, $templateCache) {
  $scope.weather = weatherServiceFactory;
});

WeatherApp.directive('weatherIcon', function () {
  return {
    restrict: 'E', replace: true,
    scope: {
      cloudiness: '@'
    },
    controller: function ($scope) {
      $scope.imgurl = function () {
        var baseUrl = 'https://ssl.gstatic.com/onebox/weather/128/';
        if ($scope.cloudiness < 20) {
          return baseUrl + 'sunny.png';
        } else if ($scope.cloudiness < 90) {
          return baseUrl + 'partly_cloudy.png';
        } else {
          return baseUrl + 'cloudy.png';
        }
      };
    },
    template: '<div style="float:left"><img ng-src="{{ imgurl() }}"></div>'
  };
});
