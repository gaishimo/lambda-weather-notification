import request from "request"
import _ from "underscore"
import moment from "moment"
import { parseString } from "xml2js"
import 'babel-polyfill';

const SOURCE_URL = 'http://www.drk7.jp/weather/xml/13.xml';

const MESSAGE_TEMPLATE = `
<%=weather[0]%>
<%=weather_detail[0]%>
<%_.each(rainfallchance[0].period, function(period){ %><%=period.$.hour%>: <%=period._ %>%
<% }); %>
最低気温: <%=_.find(temperature[0].range, function(r){ return r.$.centigrade === 'min'; })._%>℃  最高気温: <%=_.find(temperature[0].range, function(r){ return r.$.centigrade === 'max'; })._%>℃
<%=wave[0]%>
`
const TEMPLATE = _.template(MESSAGE_TEMPLATE);

export default class Weather {
  constructor(slackWebhookUrl) {
    this.slackWebhookUrl = slackWebhookUrl;
  }

  notifyWeatherInformation(callback, keyword = "today") {
    let _me = this;
    this.fetchWeatherInformation((information)=>{
      let notificationList = [];
      let keywordStringsMap = {
        "today": "今日の天気です",
        "tomorrow": "明日の天気です",
        "week": "一週間の天気です"
      };
      if (keyword === 'today'){
        notificationList.push(information[0]);
      }else if (keyword === 'tomorrow'){
        notificationList.push(information[1]);
      }else{
        notificationList = _.map(information, (info)=>{
          // 週間の場合はこれらのフィールドが来ない
          info.weather_detail = ''
          info.wave = ''
          return info;
        });
      }
      let slackData = {
        username: "お天気情報",
        icon_emoji: ":earth_asia:",
        text: keywordStringsMap[keyword],
        attachments: _.map(notificationList, (item)=>{
          return {
            title: item.formattedDate,
            text: TEMPLATE(item),
            color: this.colorOf(moment(item.$.date, 'YYYY/MM/DD')),
            image_url: item.img[0]
          };
        })
      };
      request.post(
        {uri: this.slackWebhookUrl, form: JSON.stringify(slackData)},
        (err, response, body) =>{
          if(err){
            console.error(err);
            return callback(false);
          }
          // context.succeed({"message": "OK."});
          callback(true);
        }
      );

    });
  }

  fetchWeatherInformation(callback) {
    var req = request.get(SOURCE_URL, function(err, response, body){
      if (err){
        console.error(err.stack);
        return;
      }
      parseString(body, function(err, xml){
        if (err){
          console.error(err.stack);
          return;
        }
        var area = _.filter(xml.weatherforecast.pref[0].area, function(area){
          return area.$.id == "東京地方";
        });
        var information = _.map(area[0].info, function(info){
          info.formattedDate = moment(info.$.date, 'YYYY/MM/DD').format('YYYY-MM-DD ddd');
          return info;
        });
        callback(information);
      });
    });
  }

  colorOf(date){
    if ( date.day() === 0 ){
      return "#C81E1E"
    }else if ( date.day() === 6 ){
      return "#1E1EC8"
    }else{
      return "#323232"
    }
  }

}
