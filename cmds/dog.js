const randomPuppy = require('random-puppy');
const Discord = require('discord.js');

 exports.run = (bot, message, args) => {
randomPuppy()
    .then(url => {
        var embed = new Discord.RichEmbed()
        .setImage(url)
        .setTitle(":dog: Random Dog :dog:")
        .setDescription(`[Link](${url})`)
        .setColor("BLUE")
        .setTimestamp()
        message.channel.send({ embed: embed })
    })
}

exports.help = {
  name: "dog",
  description: "Get a random Dog Image!",
  usage: "h!dog"
}

exports.aliases = ["dogimage"]
