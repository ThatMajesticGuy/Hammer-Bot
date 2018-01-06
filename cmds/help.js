const Discord = require("discord.js");


exports.run = (bot, message, args) => {
    const prefix = "h!";
    let blank = args[0];
    if (!blank) {
        const commandNames = Array.from(bot.commands.keys());
        const longest = commandNames.reduce((long, str) => Math.max(long, str.length), 0);

        // > Send to Author the commands list
        message.author.send(`= Command List Part 1 =\n\n[Use ${prefix}help <commandname> for details]\n\n${bot.commands.map(c => `${prefix}${c.help.name}${' '.repeat(longest - c.help.name.length)} :: ${c.help.usage}`).slice(0, 27).join('\n')}`, {code:'asciidoc'});
        // > Send in channel that we sent commands list
        message.channel.send(":e_mail: Check your DM's :incoming_envelope:")
    } else {
        let command = blank;
        let alias = blank;
        if (bot.commands.has(command)) {
            command = bot.commands.get(command);
          }
          if (bot.commands.has(alias)) {
            command = bot.commands.get(alias)
            alias = bot.aliases.get(command)
          }
            message.channel.send(`= ${command.help.name} = \nDescription :: ${command.help.description}\nUsage :: ${command.help.usage}\nAliases :: ${command.aliases}`, {code:'asciidoc'});
    }
}

exports.help = {
    name: "help",
    description: "Shows all of the available commands that are available to be used",
    usage: "h!help"
}

exports.aliases = ["cmds", "commands"]
