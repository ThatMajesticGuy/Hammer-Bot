const got = require('got')


exports.run = async (bot, message, args) => {
  const res = await got("https://dog-api.kinduff.com/api/facts", {json: true})
  message.channel.send(`Did you know?\n**__${res.body.facts[0]}__**`)
}

exports.help = {
  name: "dogfact",
  description: "Gives a random Dog Fact!",
  usage: "h!dogfact"
}

exports.aliases = ["dfact"]
