const Discord = require('discord.js');
const bot = new Discord.Client();
const prefix = "h!";
const dateformat = require('dateformat');
const fs = require('fs');

// Music Variables
const queue = new Map();
const YouTube = require('simple-youtube-api');
const ytdl = require('ytdl-core');
const youtube = new YouTube(process.env.YOUTUBE_API_KEY);
// -----------------

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

bot.on("guildMemberRemove", member => {
      const log = bot.channels.get("399228344719114251")
      var embed = new Discord.RichEmbed()
      .setTitle("Goodbye <:down:317008439316578314>")
      .setColor("BLUE")
      .setTimestamp()
      .setThumbnail(member.user.displayAvatarURL)
      .setAuthor("Hammer Kingdom", member.guild.iconURL)
      .addField(`<:weep:317012456327348225> __${member.user.username}__ has left the server... <:weep:317012456327348225>`, "Lets hope we see them soon!")
      log.send({ embed: embed })
});

bot.on("message", async message => {
	if (message.author.bot) return
	if (!message.content.startsWith(prefix)) return;

	const args = message.content.split(' ');
	const searchString = args.slice(1).join(' ');
	const url = args[1] ? args[1].replace(/<(.+)>/g, '$1') : '';
	const serverQueue = queue.get(message.guild.id);

	let command = message.content.toLowerCase().split(" ")[0];
	command = command.slice(prefix.length)

	if (command === `play`) {
		const voiceChannel = message.member.voiceChannel;
		if (!voiceChannel) return message.channel.send('I\'m sorry but you need to be in a voice channel to play music!');
		const permissions = voiceChannel.permissionsFor(message.bot.user);
		if (!permissions.has('CONNECT')) {
			return message.channel.send('I cannot connect to your voice channel, make sure I have the proper permissions!');
		}
		if (!permissions.has('SPEAK')) {
			return message.channel.send('I cannot speak in this voice channel, make sure I have the proper permissions!');
		}

		if (url.match(/^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/)) {
			const playlist = await youtube.getPlaylist(url);
			const videos = await playlist.getVideos();
			for (const video of Object.values(videos)) {
				const video2 = await youtube.getVideoByID(video.id); // eslint-disable-line no-await-in-loop
				await handleVideo(video2, message, voiceChannel, true); // eslint-disable-line no-await-in-loop
			}
			return message.channel.send(`✅ Playlist: **${playlist.title}** has been added to the queue!`);
		} else {
			try {
				var video = await youtube.getVideo(url);
			} catch (error) {
				try {
					var videos = await youtube.searchVideos(searchString, 10);
					let index = 0;
					message.channel.send(`
__**Song selection:**__
${videos.map(video2 => `**${++index} -** ${video2.title}`).join('\n')}
Please provide a value to select one of the search results ranging from 1-10.
					`);
					// eslint-disable-next-line max-depth
					try {
						var response = await message.channel.awaitMessages(message2 => message2.content > 0 && message2.content < 11, {
							maxMatches: 1,
							time: 10000,
							errors: ['time']
						});
					} catch (err) {
						console.error(err);
						return message.channel.send('No or invalid value entered, cancelling video selection.');
					}
					const videoIndex = parseInt(response.first().content);
					var video = await youtube.getVideoByID(videos[videoIndex - 1].id);
				} catch (err) {
					console.error(err);
					return message.channel.send('🆘 I could not obtain any search results.');
				}
			}
			return handleVideo(video, message, voiceChannel);
		}
	} else if (command === `skip`) {
		if (!message.member.voiceChannel) return message.channel.send('You are not in a voice channel!');
		if (!serverQueue) return message.channel.send('There is nothing playing that I could skip for you.');
		serverQueue.connection.dispatcher.end('Skip command has been used!');
		return;
	} else if (command === `stop`) {
		if (!message.member.voiceChannel) return message.channel.send('You are not in a voice channel!');
		if (!serverQueue) return message.channel.send('There is nothing playing that I could stop for you.');
		serverQueue.songs = [];
		serverQueue.connection.dispatcher.end('Stop command has been used!');
		return;
	} else if (command === `volume`) {
		if (!message.member.voiceChannel) return message.channel.send('You are not in a voice channel!');
		if (!serverQueue) return message.channel.send('There is nothing playing.');
		if (!args[1]) return message.channel.send(`The current volume is: **${serverQueue.volume}**`);
		serverQueue.volume = args[1];
		serverQueue.connection.dispatcher.setVolumeLogarithmic(args[1] / 5);
		return message.channel.send(`I set the volume to: **${args[1]}**`);
	} else if (command === `np`) {
		if (!serverQueue) return message.channel.send('There is nothing playing.');
		return message.channel.send(`🎶 Now playing: **${serverQueue.songs[0].title}**`);
	} else if (command === `queue`) {
		if (!serverQueue) return message.channel.send('There is nothing playing.');
		return message.channel.send(`
__**Song queue:**__
${serverQueue.songs.map(song => `**-** ${song.title}`).join('\n')}
**Now playing:** ${serverQueue.songs[0].title}
		`);
	} else if (command === `pause`) {
		if (serverQueue && serverQueue.playing) {
			serverQueue.playing = false;
			serverQueue.connection.dispatcher.pause();
			return message.channel.send('⏸ Paused the music for you!');
		}
		return message.channel.send('There is nothing playing.');
	} else if (command === `resume`) {
		if (serverQueue && !serverQueue.playing) {
			serverQueue.playing = true;
			serverQueue.connection.dispatcher.resume();
			return message.channel.send('▶ Resumed the music for you!');
		}
		return message.channel.send('There is nothing playing.');
	}

	return;
});

async function handleVideo(video, message, voiceChannel, playlist = false) {
	const serverQueue = queue.get(message.guild.id);
	console.log(video);
	const song = {
		id: video.id,
		title: Util.escapeMarkdown(video.title),
		url: `https://www.youtube.com/watch?v=${video.id}`
	};
	if (!serverQueue) {
		const queueConstruct = {
			textChannel: message.channel,
			voiceChannel: voiceChannel,
			connection: null,
			songs: [],
			volume: 5,
			playing: true
		};
		queue.set(message.guild.id, queueConstruct);

		queueConstruct.songs.push(song);

		try {
			var connection = await voiceChannel.join();
			queueConstruct.connection = connection;
			play(message.guild, queueConstruct.songs[0]);
		} catch (error) {
			console.error(`I could not join the voice channel: ${error}`);
			queue.delete(message.guild.id);
			return message.channel.send(`I could not join the voice channel: ${error}`);
		}
	} else {
		serverQueue.songs.push(song);
		console.log(serverQueue.songs);
		if (playlist) return;
		else return message.channel.send(`✅ **${song.title}** has been added to the queue!`);
	}
	return;
}

async function play(guild, song) {
	const serverQueue = queue.get(guild.id);

	if (!song) {
	const playlist = await youtube.getPlaylist("https://www.youtube.com/playlist?list=PLwVvrpUdZsNIylnjveUWu_kD0rwHzqzUs&jct=TFL6auNvUQ0PNzu3kDPoxWdVnSzgow");
	const videos = await playlist.getVideos();
	for (const video of Object.values(videos)) {
	const video2 = await youtube.getVideoByID(video.id);
	const dispatcher = serverQueue.connection.playStream(ytdl(video2.url))
			.on('end', reason => {
			if (reason === 'Stream is not generating quickly enough.') console.log('Song ended.');
			else console.log(reason);
			serverQueue.songs.shift();
			play(guild, serverQueue.songs[0]);
		})
		.on('error', error => console.error(error));
	dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
	}
	console.log(serverQueue.songs);

	const dispatcher = serverQueue.connection.playStream(ytdl(song.url))
		.on('end', reason => {
			if (reason === 'Stream is not generating quickly enough.') console.log('Song ended.');
			else console.log(reason);
			serverQueue.songs.shift();
			play(guild, serverQueue.songs[0]);
		})
		.on('error', error => console.error(error));
	dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);

	let durations = song.durations - 1
var secondslength = Math.log(durations) * Math.LOG10E + 1 | 0;
var mlength = Math.log(song.durationm) * Math.LOG10E + 1 | 0;
if(song.durationh !== 0) {
if(secondslength == 1 || secondslength == 0) {
  if(mlength == 1 || mlength == 0) {
  return serverQueue.textChannel.send(`🎶 Now playing: **${song.title}** (${song.durationh}:0${song.durationm}:0${durations})`);
}}}
if(song.durationh !== 0) {
if(secondslength == 1 || secondslength == 0) {
  if(mlength !== 1 || mlength !== 0) {
  return serverQueue.textChannel.send(`🎶 Now playing: **${song.title}** (${song.durationh}:${song.durationm}:0${durations})`);
}}};
if(song.durationh !== 0) {
  if(mlength == 1 || mlength == 0) {
    if(secondslength !== 1 || secondslength !== 0) {
    return serverQueue.textChannel.send(`🎶 Now playing: **${song.title}** (${song.durationh}:0${song.durationm}:${durations})`);
}}}
if(song.durationh !== 0) {
  if(mlength !== 1 || mlength !== 0) {
    if(secondslength !== 1 || secondslength !== 0) {
    return serverQueue.textChannel.send(`🎶 Now playing: **${song.title}** (${song.durationh}:${song.durationm}:${durations})`);
}}}
if(song.durationh == 0 && song.durationm !== 0) {
  if(secondslength == 1 || secondslength == 0) {
    return serverQueue.textChannel.send(`🎶 Now playing: **${song.title}** (${song.durationm}:0${durations})`);
}}
if(song.durationh == 0 && song.durationm !== 0) {
  if(secondslength !== 1 || secondslength !== 0) {
    return serverQueue.textChannel.send(`🎶 Now playing: **${song.title}** (${song.durationm}:${durations})`);
}}
if(song.durationh == 0 && song.durationm == 0 && song.durations !== 0) {
  return serverQueue.textChannel.send(`🎶 Now playing: **${song.title}** (${durations} Seconds)`);
} else {
  return serverQueue.textChannel.send(`🎶 Now playing: **${song.title}**`);
}
})};

process.on('unhandledRejection', error => {
    console.log(`Unhandled Error Found! \n ${error.stack}`)
});
