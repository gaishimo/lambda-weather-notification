import assert from 'power-assert'
import Weather from "../src/weather"

const SLACK_WEBHOOK_URL = 'https://hooks.slack.com/services/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';

describe("Weather.fetchWeatherInformation", ()=>{
  it("can fetch information", (done)=>{
    let weather = new Weather(SLACK_WEBHOOK_URL);
    weather.fetchWeatherInformation((information)=>{
      assert(information.length > 0);
      done();
    });
  });
});

describe("Weather.notifyWeatherInformation", ()=>{
  [ undefined, 'today', 'tomorrow', 'week' ].forEach((keyword)=>{
    it(`should suceed (${keyword})`, (done)=>{
      let weather = new Weather(SLACK_WEBHOOK_URL);
      weather.notifyWeatherInformation((result)=>{
        assert(result === true);
        done();
      }, keyword);
    });
  });
});
