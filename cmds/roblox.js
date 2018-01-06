const Discord = require('discord.js');
const got = require('got');
const prefix = "m?";

exports.run = async (bot, message, args, err) => {
    if (args.length < 1) {
        message.channel.send("Please specify a user!")
        return;
      }
      const idjson = await got(`https://api.roblox.com/users/get-by-username?username=${args}`, { json: true });
        const id = idjson.body.Id
        const userjson = await got(`https://api.roblox.com/users/${id}`, {json: true});
        if (args.length > 1) return message.channel.send("My systems are telling me Roblox usernames dont have spaces in their names");
        if (!id) return message.channel.send(`User **${args[0]}** was not found`)
        if(!idjson.body.Username) return message.channel.send(`User **${args[0]}** was not found`)
      const friendsjson = await got(`https://www.roblox.com/friends/json?userId=${id}&currentPage=0&pageSize=20&imgWidth=110&imgHeight=110&imgFormat=jpeg&friendsType=BestFriends`, { json: true });
      const groupjson = await got(`https://www.roblox.com/Groups/GetPrimaryGroupInfo.ashx?users=${args}`, { json: true});



        try {
            const username = userjson.body.Username;
        const friends = friendsjson.body.TotalFriends
        if (!groupjson.body[username]) {
        var embed = new Discord.RichEmbed()
        .setTitle(`${username}`)
        .setColor("RANDOM")
        .setTimestamp()
        .setImage(`https://www.roblox.com/bust-thumbnail/image?userId=${id}&width=420&height=420&format=png`)
        .addField("ID", `${id}`)
        .addField("Friends", `${username} has **${friends}** friends`)
        .addField("Primary Group",  `**${username}** does __not__ have a primary group`)
        message.channel.send({ embed: embed })
        } else {
            const group = groupjson.body[username].GroupName
            var embed2 = new Discord.RichEmbed()
            .setTitle(`${username}`)
            .setColor("RANDOM")
            .setTimestamp()
            .setImage(`https://www.roblox.com/bust-thumbnail/image?userId=${id}&width=420&height=420&format=png`)
            .addField("ID", `${id}`)
            .addField("Friends", `${username} has **${friends}** friends`)
            .addField("Primary Group",  `${group}`)
            message.channel.send({ embed: embed2 })
        }
      } catch (err) {
        console.error(err)
      }}

      exports.help = {
        name: "roblox",
        description: "Gets a roblox character",
        usage: `h!roblox [roblox user]`
      }

      exports.aliases = ["rblxuser", "rbx"]
