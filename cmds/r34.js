const Discord = require("discord.js");
const xml2js = require('xml2js');
const _request 	= require("request");

exports.run = (bot, message) => {
    
    var args1 = message.content.split(' ').slice(1);
const args = args1.join(' ');
if (!args) return message.reply("Search something!");

 if (!message.channel.nsfw) {
    return message.channel.send("Please be a bit more respectful, this is not an NSFW channel...");
 } else {
    if (args1.includes('loli') || args1.includes('lolicon') || args1.includes('shota') || args1.includes('shotacon') || args1.includes('child') || args1.includes('kid') || args1.includes('kids') || args1.includes('children')) return message.reply('please dont be that grosskthxz');
    let url = "http://www.rule34.xxx/index.php?page=dapi&s=post&q=index&tags=" + args;
    _request(url, function(error, response, body) {
    if (error) {
        console.log("Error rule34.js: ", error);
    }
    xml2js.parseString(body, function(error, result) {
        if (error) {
        console.log("Error rule34.js: ", error);
        }
        try {
        var amountOfPosts = result.posts.post.length;
        var randomPost = Math.floor(Math.random() * amountOfPosts);
        var imageLink = "http://www.r" + result.posts.post[randomPost].$.file_url.substr(7);
        console.log(imageLink)
        var embed = new Discord.RichEmbed()
        .setAuthor(`Rule34 Search \"${args}\"`)
        .setFooter("Thank you Immortality#2312 for command")
        .setURL(imageLink)
        .setImage(imageLink)
        .setTimestamp();
        message.channel.send(embed);
        } catch (e) {
        message.reply("No Results.");
        }
    });
    });
};
    
}

exports.help = {
    name: "r34",
    description: "Does it need one?",
    usage: "h!r34 <What-You-Want-To-See>"
}

exports.aliases = ["rule34", "porn"]
