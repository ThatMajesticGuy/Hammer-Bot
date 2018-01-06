const Discord = require('discord.js');
var random = require('random-integer')
const dateformat = require('dateformat');

exports.run = (bot, message, args) => {
  const member = message.mentions.members.first();
  var reason = args[1]
  if (message.author.id === bot.user.id) return message.channel.send("Why the heck would you kick me?");
  if (!message.member.permissions.has("KICK_MEMBERS")) return message.channel.send("**ERROR**\nYou do not have permissions to ***KICK_MEMBERS***, if you have permissions, please contact ThatMajesticGuy immediatly!")
  if (!reason) reason = "No Reason";
  if (!member) return message.channel.send("**ERROR**\nYou did not give a reason, please specify your reason!\nUsage is `h!kick [Mention] <Reason>`")
  if (!member.kickable) return message.channel.send("**ERROR**\nThis user is not kickable!\nPossible Reasons: This person has a higher role than me, They are the owner, Some other error")
  member.kick(reason)
  message.channel.send(`**__${member.user.username}__** has been kicked by **__${message.author.username}__**! for ${reason}!`)
  const channel = bot.channels.get("398285921616789504")
  var embed = new Discord.RichEmbed()
  .setTitle("Member Kicked")
  .setColor("RED")
  .setThumbnail(member.user.displayAvatarURL)
  .setAuthor(`Banned by ${message.author.username}`, message.author.displayAvatarURL)
  .addField(":spy: User Kicked :spy:", `__**${member.user.tag}**__`)
  .addField(":spy: Kicked User's ID :spy:", `__**${member.user.id}**__`)
  .addField(":cop: Kicked By :cop:", `__**${message.author.tag}**__`)
  .addField(":calendar_spiral: Kicked On :calendar_spiral:", `${dateformat(Date.now(), "**__mmmm dS, yyyy, On a dddd, h:MM:ss TT, Z__**")}`)
  .addField(":mag: The reason Is :mag:", `__**${reason}**__`)
  .addField("Case ID", `#${random(1000, 10000)}`)
  channel.send({ embed: embed })
}

exports.help = {
  name: "kick",
  description: "Kicks a user!",
  usage: "h!kick [Mention] <Reason>"
}

exports.aliases = ["boot"]
