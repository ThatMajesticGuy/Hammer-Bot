const Discord = require('discord.js');

exports.run = (bot, message, args) => {
  let user = message.mentions.users.first() || message.author
let member = message.guild.member(user)
let roles = member.roles.array().slice(1).sort((a, b) => a.comparePositionTo(b)).reverse().map(role => `<@&${role.id}>`);
let messageauthor = message.guild.member(message.author)
let authorroles = message.guild.member(message.author).roles.array().slice(1).sort((a, b) => a.comparePositionTo(b)).reverse().map(role => `<@&${role.id}>`)
if (roles.length < 1) roles = ['None']
const status = {
online: 'Online',
idle: 'Idle',
dnd: 'Do Not Disturb',
offline: 'Offline/Invisible'
};

let game = user.presence.game && user.presence.game && user.presence.game.name
if (!game) {
game = "User is not playing a game"
}
let botuser;
if (member.user.bot === true) botuser = 'Yes'
else botuser = 'No'
const randomColor = "#000000".replace(/0/g, function () { return (~~(Math.random() * 16)).toString(16); });

var authors = ["262410813254402048"]
if (authors.includes(message.author.id && user.id)) {
          var lastmsg = user.lastMessage;
          if (!lastmsg) {
              lastmsg = "Has not said a message yet"
          }
    let botuser;
if (member.user.bot === true) botuser = 'Yes'
else botuser = 'No'
let embed = new Discord.RichEmbed()
.setTitle("__Userinfo On The Owners!__ :prince:")
.setColor("#ffd700")
.setThumbnail(`${user.displayAvatarURL}`)
.addField("***Username and Discriminator*** :name_badge:", `***>***__${user.tag}__`)
.addField("***ID*** :id:", `***>***__${user.id}__`)
.addField("***Created Account On*** :heavy_plus_sign:", `***>***__${dateformat(user.createdAt, "***mmmm dS, yyyy***, On a ***dddd***, ***h:MM:ss TT, Z***")}__`)
.addField(`***Status***`, `***>***__${status[user.presence.status]}__`, true)
.addField("***Last Message*** :speech_left:", `***>***__${lastmsg}__`, true)
.addField(`***Joined ${message.guild.name} On*** :heavy_plus_sign:`, `***>***__${dateformat(member.joinedAt, "***mmmm dS, yyyy***, On a ***dddd***, ***h:MM:ss TT, Z***")}__`, true)
.addField("***Playing*** :video_game:", `***>***__${game}__`, true)
.addField("***Roles*** :scroll:", `***>***${roles.join(', ')}`, true)
.addField("***Bot?*** :robot:", `***>***__${botuser}__`, true)
message.channel.send({ embed: embed })
return;
}

if (!user) {


let embed = new Discord.RichEmbed()
.setTitle("**__Userinfo__**")
.setColor(randomColor)
.setThumbnail(`${message.author.displayAvatarURL}`)
.addField("***Username and Discriminator*** <:added:394910274177597491>", `***>***__${message.author.tag}__`)
.addField("***ID*** :id:", `***>***__${message.author.id}__`, true)
.addField("***Created At*** <:added:394910274177597491>", `***>***${message.author.createdAt}`)
.addField(`***Joined __${message.guild.name}__ On*** <:added_user:393802707267354645>`, `***>***__${messageauthor.joinedAt}__`)
.addField("Status", `${status[message.author.presence.status]}`, true)
.addField("Last Message", `${(lastmsg) || 'Has not said a message yet.'}`, true)
.addField("Playing", `${(message.author.presence.game && message.author.presence.game && message.author.presence.game.name) || 'Not playing a game.'}`, true)
.addField("Nickname", `${message.member.displayName}`, true)
.addField("Roles", `${roles.join(', ')}`, true)
.addField("Bot?", `${botuser}`, true)
.addField("Wait", "Why is t")
message.channel.send({embed});
} else {
console.log(user.presence)
let botuser;
if (member.user.bot === true) botuser = 'Yes'
else botuser = 'No'
let embed = new Discord.RichEmbed()
.setColor(randomColor)
.setThumbnail(`${user.displayAvatarURL}`)
.addField("***Username and Discriminator*** :name_badge:", `***>***__${user.tag}__`)
.addField("***ID*** :id:", `***>***__${user.id}__`)
.addField("***Created Account On*** :heavy_plus_sign:", `***>***__${dateformat(user.createdAt, "***mmmm dS, yyyy***, On a ***dddd***, ***h:MM:ss TT, Z***")}__`)
.addField(`***Status***`, `***>***__${status[user.presence.status]}__`, true)
.addField("***Last Message*** :speech_left:", `***>***__${lastmsg}__`, true)
.addField(`***Joined ${message.guild.name} On*** :heavy_plus_sign:`, `***>***__${dateformat(member.joinedAt, "***mmmm dS, yyyy***, On a ***dddd***, ***h:MM:ss TT, Z***")}__`, true)
.addField("***Playing*** :video_game:", `***>***__${game}__`, true)
.addField("***Roles*** :scroll:", `***>***${roles.join(', ')}`, true)
.addField("***Bot?*** :robot:", `***>***__${botuser}__`, true)
message.channel.send({embed});
}
}

exports.help = {
  name: "userinfo",
  description: "Gets a user's info!",
  usage: "h!userinfo <mention>"
}

exports.aliases = ["uinfo"]
