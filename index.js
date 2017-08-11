require('dotenv').config();
const speedTest = require('speedtest-net');
const Twitter = require('twitter');

var client = new Twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});

// Download and upload speed that you pay for in mbits/s
const DOWN_SPEED = process.env.DOWN_SPEED;
const UP_SPEED = process.env.UP_SPEED;

const test = speedTest({ maxTime: 5000 });

test.on('data', data => {
  let status = `
  ISP ${data.client.isp}: My internet speed is ${data.speeds.download}mbps ↓ / ${data.speeds.upload}mbps ↑,
  which is ${Math.round((data.speeds.download / DOWN_SPEED) * 100)}% / ${Math.round((data.speeds.upload / UP_SPEED) * 100)}% of what I pay for.
  #isptweeter https://github.com/JouzaLoL/isp-tweeter
  `;
  client.post('statuses/update', { status })
    .then((tweet) => {
      console.log('Tweet submitted.');
    })
    .catch((err) => {
      console.err(err);
    });
});

test.on('error', err => {
  console.error(err);
});
