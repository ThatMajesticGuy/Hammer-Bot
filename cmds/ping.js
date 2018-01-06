const Discord = require('discord.js');

exports.run = (bot, message, args) => {
  message.channel.send("Pinging... sec")
  .then(msg => {
    var embed = new Discord.RichEmbed()
    .setTitle("Pong :ping_pong:")
    .setColor("BLUE")
    .setTimestamp()
    .setThumbnail(message.author.displayAvatarURL)
    .addField("Latency Ping", msg.createdTimestamp - message.createdTimestamp)
    .addField("API Ping", Math.round(bot.ping))
    msg.edit({ embed: embed });
  })
}

exports.help = {
  name: "ping",
  description: "Gets your Latency and API Ping!",
  usage: "h!ping"
}

exports.aliases = ["pong"]
