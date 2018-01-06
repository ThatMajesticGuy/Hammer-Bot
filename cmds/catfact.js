const got = require('got');
const catFacts = require('cat-facts');

let randomFact = catFacts.random();

exports.run = async (bot, message, args) => {
  let randomFact = catFacts.random();
  message.channel.send(`Did you know?\n**__${randomFact}__**`)
}

exports.help = {
  name: "catfact",
  description: "Get a random cat fact!",
  usage: "h!catfact"
}

exports.aliases = ["cfact"]
