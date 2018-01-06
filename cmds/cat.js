const Discord = require('discord.js');
const randomCat = require('random.cat.js');
const randomCatApi = randomCat.api();

exports.run = async (bot, message, args) => {
randomCatApi.getCat().then(cat => {
  var embed = new Discord.RichEmbed()
  .setTitle(":cat: Random Cat :cat:")
  .setColor("BLUE")
  .setTimestamp()
  .setImage(cat.file)
  .setDescription(`[URL](${cat.file})`)
  message.channel.send({ embed: embed })
})}

exports.help = {
    name: "cat",
    description: "Sends a picture of a cat!",
    usage: "h!cat"
}

exports.aliases = ["catimage"]
