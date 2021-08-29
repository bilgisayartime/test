const { parse } = require('rss-to-json');
const {bot: {token, channelID, message}} = require('./config.json')
const { Client, MessageEmbed } = require('discord.js')
global.client = new Client()

const croxy = require("croxydb")
const adapter = require("croxydb/adapters/jsondb")
const db = new croxy(adapter, {
    "dbName": "sonKonu", 
    "dbFolder": "database", 
    "noBlankData": true,
    "readable": true,
    "language": "tr" 
})

global.client.on("ready", () => {
  console.log('active')
global.client.user.setActivity('Coded with Kaan ❤️ Özgür')
setInterval(() => {

  (async () => {

    var rss = await parse('https://www.bilgisayartime.com/feeds/posts/default/-/Web%20Haberleri/?alt=rss');

    let sonKonu = JSON.parse(JSON.stringify(rss, null, 3)).items[0].link;

    if (db.fetch('sonKonu') == sonKonu) {
      return false;
    } else {
      if (db.fetch('sonKonu')) {
        db.push('eskiKonu', db.fetch('sonKonu'))
      }
      db.set('sonKonu', sonKonu)

      if (db.fetch('eskiKonu').includes(sonKonu)) {
        return;
      }

      if(!global.client.channels.cache.get(channelID)) {
        return console.log('Kanal bulunamadı!')
      } else {
        return global.client.channels.cache.get(channelID).send(message.replace('{link}', sonKonu))
      }
    }

})();

}, 10000)
})


global.client.login(token)