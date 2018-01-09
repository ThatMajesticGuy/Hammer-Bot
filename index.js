const Discord = require('discord.js');
const bot = new Discord.Client();
const prefix = "h!";
const dateformat = require('dateformat');
const fs = require('fs');
const queue = new Map();

bot.login(process.env.BOT_TOKEN);

bot.on('ready', ready => {
  console.log("Ready to serve the hammer kingdom!")
  bot.user.setGame(`with ${bot.users.size} people!`)
});

bot.commands = new Discord.Collection();
bot.aliases = new Discord.Collection();

fs.readdir("./cmds/", (err, files) => {
    if(err) console.error((err));
    let jsfiles = files.filter(f => f.split(".").pop() === "js");
    if(jsfiles.length <= 0) {
        console.log("Do you mind making the commands first?".red);
        return;
    }


    console.log(`Loading ${jsfiles.length} commands!`);

    jsfiles.forEach((f, i) => {
        delete require.cache[require.resolve(`./cmds/${f}`)]
        let props = require(`./cmds/${f}`)
        console.log(`${i + 1}: ${f} loaded!`);
        bot.commands.set(props.help.name, props);
        props.aliases.forEach(alias => {
        bot.aliases.set(alias, props.help.name);
    });

    });
 });

 bot.on("message", async message => {
    if(message.author.bot) return;

     if(message.channel.type === "dm") {
        var embed = new Discord.RichEmbed()
        .setTitle("ERROR!")
        .setColor("RANDOM")
        .setThumbnail(`${message.author.displayAvatarURL}`)
        .setTimestamp()
        .addField("ERROR!", "I currently don't work in DMs")
         message.channel.send({ embed: embed })
         return;
    }

    let messageArray = message.content.split(/\s+/g);
    let command = messageArray[0];
    let args = messageArray.slice(1);

    if(!command.startsWith(prefix)) return;

    if (bot.aliases.has(command.slice(prefix.length).toLowerCase())) {
        bot.commands.get(bot.aliases.get(command.slice(prefix.length).toLowerCase())).run(bot, message, args, queue)
    }
        if (bot.commands.has(command.slice(prefix.length).toLowerCase())) {
         bot.commands.get(command.slice(prefix.length).toLowerCase()).run(bot, message, args, queue)
        }

});

bot.on("guildMemberAdd", member => {
    let avatar;
  if (!member.user.avatarURL) avatar = member.guild.iconURL;
  if (member.user.avatarURL) avatar = member.user.avatarURL;
  const log = bot.channels.get("399228331834212354")
  var embed = new Discord.RichEmbed()
  .setTitle("Welcome <:blobwave:399237241035030538>")
  .setColor("#2bc237")
  .setTimestamp()
  .setThumbnail(avatar)
  .setAuthor("Hammer Kingdom", member.guild.iconURL)
  .addField(`:bust_in_silhouette: Ayyy its __${member.user.username}__! :bust_in_silhouette:`, ":wave: Welcome to the **__Hammer Kingdom!__** :wave:")
  .addField("Make sure to **__read the rules__**", "And have fun! <:owo:317007752465743872>")
log.send({ embed: embed })
})

bot.on("guildMemberDelete", member => {
  let avatar;
  if (!member.user.avatarURL) avatar = member.guild.iconURL;
  if (member.user.avatarURL) avatar = member.user.avatarURL;
      const log = bot.channels.get("399228344719114251")
      var embed = new Discord.RichEmbed()
      .setTitle("Goodbye <:down:317008439316578314>")
      .setColor("BLUE")
      .setTimestamp()
      .setThumbnail(avatar)
      .setAuthor("Hammer Kingdom", member.guild.iconURL)
      .addField(`<:weep:317012456327348225> __${member.user.username}__ has left the server... <:weep:317012456327348225>`, "Lets hope we see them soon!")
      log.send({ embed: embed })
});
]


process.on('unhandledRejection', error => {
    console.log(`Unhandled Error Found! \n ${error.stack}`)
});
