'use strict';

var WeatherApp = angular.module('WeatherApp', []);

WeatherApp.factory('weatherServiceFactory', function($http, $templateCache) {
  var $weather = {};

  $weather.showWeather = function(response) {
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

  $weather.showError = function(response) {
    $weather.hasState = 'has-warning';
    $weather.message = 'Occurred a error with Yahoo search. Try again later.';
    $weather.showLoader = false;
  };
  $weather.getYahooUrl = function() {
    return "https://query.yahooapis.com/v1/public/yql?q=select * from weather.forecast where woeid in (select woeid from geo.places(1) where text='%s') and u='c'&format=json".replace("%s", this.city);
  };
  $weather.search = function() {
    if ($weather.city == '' || $weather.city == undefined) {
      $weather.hasState = 'has-warning';
      $weather.message = 'Please provide a location';
      return;
    }
    $weather.showLoader = true;
    $http.get(this.getYahooUrl(), {
      cache: $templateCache
    }).then(this.showWeather, this.showError);
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

WeatherApp.filter('temp', function($filter) {
  return function(input, unit) {
    if (!unit) {
      unit = 'C';
    }
    var numberFilter = $filter('number');
    return numberFilter(input, 1) + '\u00B0' + unit;
  };
});

WeatherApp.controller('WeatherCtrl', function($scope, weatherServiceFactory, $http, $templateCache) {
  $scope.weather = weatherServiceFactory;
});

WeatherApp.directive('weatherIcon', function() {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      code: '@'
    },
    controller: function($scope) {
      $scope.setWeatherIcon = function(condid) {
        var icon = '';
        switch (condid) {
          case '0':
          case '2':
            icon = 'wi-tornado';
            break;
          case '1':
          case '14':
          case '40':
            icon = 'wi-storm-showers';
            break;
          case '3':
          case '4':
          case '37':
          case '38':
          case '39':
          case '47':
            icon = 'wi-thunderstorm';
            break;
          case '5':
          case '13':
          case '15':
          case '16':
          case '41':
          case '42':
          case '43':
          case '46':
            icon = 'wi-snow';
            break;
          case '6':
          case '7':
          case '8':
          case '9':
            icon = 'wi-sprinkle';
            break;
          case '10':
          case '17':
          case '18':
          case '35':
            icon = 'wi-hail';
            break;
          case '11':
          case '12':
            icon = 'wi-showers';
            break;
          case '23':
          case '19':
            icon = 'wi-cloudy-gusts';
            break;
          case '20':
          case '21':
          case '22':
            icon = 'wi-fog';
            break;
          case '24':
            icon = 'wi-cloudy-windy';
            break;
          case '25':
            icon = 'wi-thermometer';
            break;
          case '26':
            icon = 'wi-cloudy';
            break;
          case '27':
            icon = 'wi-night-cloudy';
            break;
          case '28':
            icon = 'wi-day-cloudy';
            break;
          case '29':
            icon = 'wi-night-cloudy';
            break;
          case '30':
            icon = 'wi-day-cloudy';
            break;
          case '31':
            icon = 'wi-night-clear';
            break;
          case '32':
            icon = 'wi-day-sunny';
            break;
          case '33':
            icon = 'wi-night-clear';
            break;
          case '34':
            icon = 'wi-day-sunny-overcast';
            break;
          case '36':
            icon = 'wi-day-sunny';
            break;
          case '44':
            icon = 'wi-cloudy';
            break;
          case '45':
            icon = 'wi-lightning';
            break;
          default:
            icon = 'wi-cloud';
            break;
        }
        return icon;
      };
      $scope.icon = function() {
        return $scope.setWeatherIcon($scope.code);
      };
    },
    template: '<div><i class="wi {{ icon() }}"></i><div>'
  };
});
