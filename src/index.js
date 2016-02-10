"use strict";

import Weather from "./weather"

exports.handler = function (event, context) {
  let weather = new Weather(event.slackWebhookUrl);
  let keyword = event.keyword || 'today';
  weather.notifyWeatherInformation((result)=>{
    if (result){
      context.succeed();
    }else{
      context.fail();
    }
  }, keyword);
};
