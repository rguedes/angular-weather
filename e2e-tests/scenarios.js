'use strict';

/* https://github.com/angular/protractor/blob/master/docs/toc.md */

describe('WeatherApp', function() {

  it('should show input with Porto, PT as default value', function() {
    browser.get('index.html');
    expect(element(by.model('weather.city')).getAttribute("value")).toEqual('Porto, PT');
  });

  describe('search with results', function() {
    it('should search and get 5 results', function() {
      element(by.css('.submit')).click();
      var forecast = element.all(by.repeater('forecast in weather.forecast'));
      expect(forecast.count()).toEqual(5);
    });
  });

  describe('search without results', function() {
    it('should search and get "No results found!"', function() {
      element(by.model('weather.city')).clear();
      element(by.model('weather.city')).sendKeys('vainjfknaf');
      element(by.css('.submit')).click();
      expect(element(by.css('.error .alert')).getText()).toEqual('No results found!');
    });
  });

});
