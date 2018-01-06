const Discord = require('discord.js');

exports.run = (bot, message, args) => {
  var answers =
    [
        "It is certain",
        "It is decidedly so",
        "Without a doubt",
        "Yes definitely",
        "You may rely on it",
        "As I see it, Yes",
        "Most likely",
        "Outlook seems good",
        "Yeah whatever keeps you smiling",
        "Signs are pointing to yes",
        "Reply is hazy, try again",
        "Ask me again later",
        "It's better not to tell you now",
        "I cannot predict right now",
        "Concentrate and ask me again",
        "Don't count on it",
        "Don't put your hopes on it",
        "My reply is No",
        "My sources are telling me no",
        "Outlook doesn't seem so good",
        "It's very doubtful"
    ]
  if (!args.join(" ")) {
   message.channel.send("**ERROR!**\nYou did not include arguments, Usage is `h!8ball [QUESTION]`")
   return;
  }
  
  var embed = new Discord.RichEmbed()
  .setDescription(`:8ball: **||** ${answers[Math.floor(Math.random() * answers.length)]}`)
  .setColor(0x000000)
  message.channel.send({ embed: embed })
}

exports.help = {
  name: "8ball",
  description: "Ask a question and get a response!",
  usage: "h!8ball [Question]"
}

exports.aliases = ["eightball"]
