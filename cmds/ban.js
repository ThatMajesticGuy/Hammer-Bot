const Discord = require('discord.js');
var random = require('random-integer')
const dateformat = require('dateformat');

exports.run = (bot, message, args) => {
  const member = message.mentions.members.first();
  var reason = args[1]
  if (message.author.id === bot.user.id) return message.channel.send("Why the heck would you ban me?");
  if (!message.member.permissions.has("BAN_MEMBERS")) return message.channel.send("**ERROR**\nYou do not have permissions to ***BAN_MEMBERS***, if you have permissions, please contact ThatMajesticGuy immediatly!")
  if (!reason) reason = "No Reason";
  if (!member) return message.channel.send("**ERROR**\nYou did not give a reason, please specify your reason!\nUsage is `h!ban [Mention] <Reason>`")
  if (!member.bannable) return message.channel.send("**ERROR**\nThis user is not bannable!\nPossible Reasons: This person has a higher role than me, They are the owner, Some other error")
  member.ban(reason)
  message.channel.send(`**__${member.user.username}__** has been banned by **__${message.author.username}__**! for ${reason}!`)
  const channel = bot.channels.get("398285904248045579")
  var embed = new Discord.RichEmbed()
  .setTitle("Member Banned")
  .setColor("RED")
  .setThumbnail(member.user.displayAvatarURL)
  .setAuthor(`Banned by ${message.author.username}`, message.author.displayAvatarURL)
  .addField(":spy: User Banned :spy:", `__**${member.user.tag}**__`)
  .addField(":spy: Banned User's ID :spy:", `__**${member.user.id}**__`)
  .addField(":cop: Banned By :cop:", `__**${message.author.tag}**__`)
  .addField(":calendar_spiral: Banned On :calendar_spiral:", `${dateformat(Date.now(), "**__mmmm dS, yyyy, On a dddd, h:MM:ss TT, Z__**")}`)
  .addField(":mag: The reason Is :mag:", `__**${reason}**__`)
  .addField("Case ID", `#${random(1000, 10000)}`)
  channel.send({ embed: embed })
}

exports.help = {
  name: "ban",
  description: "Bans a user!",
  usage: "h!ban [Mention] <User>"
}

exports.aliases = ["bean"]
