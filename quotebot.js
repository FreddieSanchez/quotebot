'use strict';

var fs = require('fs');
var irc = require('irc');

var client = 
  new irc.Client(
    process.env.IRC_HOST,
    process.env.IRC_USER,
    {
      userName: process.env.IRC_USER,
      password: process.env.IRC_PASS,
      channels: [process.env.IRC_CHANNEL],
      secure: true,
      sasl: true,
      port: 7000
    }
  );

client.addListener('error', function(message) {
    console.log('error: ', message);
});

var replies =
  fs.readFileSync(
    process.env.QUOTE_FILE,
    { encoding: 'utf-8' }
  ).split('\n').filter(function (x) { return x.trim().length > 0; });

var should_speak = function(startHour, endHour, startDay, endDay) {
  var now = new Date();
  var hour = now.getHours();
  var day = now.getDay();
  return day >= startDay && day <= endDay &&
         hour>= startHour && hour <= endHour;
};

var quote = function () {
  var index = Math.floor(Math.random() * replies.length);

  var startHour = 8;
  var endHour = 18;
  var startDay = 1; 
  var endDay = 5;
  var shouldSay = should_speak(startHour,endHour, startDay, endDay);

  if (shouldSay) {
    client.say(process.env.IRC_CHANNEL, replies[index]);
  }
};

setInterval(quote, parseInt(process.env.QUOTE_INTERVAL));

