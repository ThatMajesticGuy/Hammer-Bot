const Discord = require('discord.js');
const fs = require("fs");
const yt = require("ytdl-core");
const YouTube = require("simple-youtube-api");
const youtube = new YouTube(process.env.YOUTUBE_API_KEY);

exports.run = async(bot, message, args, queue) => {
  const args1 = message.content.split(' ');
const searchString = args1.slice(1).join(' ');
const url = args1[1] ? args1[1].replace(/<(.+)>/g, '$1') : '';
const serverQueue = queue.get(message.guild.id);

    const voiceChannel = message.member.voiceChannel

  if (message.channel.id !== "399548148315586580") return message.channel.send(":musical_note: :x: ***__You need to be in <#399548148315586580> To use this command!__*** :x: :musical_note:")
  if (message.member.voiceChannelID !== "399540529995710484" && !message.member.voiceChannelID) return message.channel.send(":musical_note: :x:***__You Must be in the music room to use this Command!__*** :x: :musical_note:")
  
  const permissions = voiceChannel.permissionsFor(bot.user);
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


        const Embed2 = new Discord.RichEmbed()
        .setTitle(":musical_note: Song Selection :musical_note:")
        .setDescription(videos.map(video2 => `**${++index} -** ${video2.title}`).join('\n'))
        .setColor("#503d82")
        .setFooter("Please provide a value to select one of the search results ranging from 1-10.")


        let msgtoDelete = await message.channel.send({embed: Embed2});
        // eslint-disable-next-line max-depth
        try {
          var response = await message.channel.awaitMessages(message2 => message2.content > 0 && message2.content < 11, {
            maxMatches: 1,
            time: 15000,
            errors: ['time']
          });
          msgtoDelete.delete();

        } catch (err) {
          console.error(err);
          return message.channel.send('No or invalid value entered, cancelling video selection.');
        }
        const videoIndex = parseInt(response.first().content);
        var video = await youtube.getVideoByID(videos[videoIndex - 1].id);
      } catch (err) {
        console.error(err);
        return message.channel.send(":sos: I have errored while grabbing the song. :sos:");
      }
    }
    return handleVideo(video, message, voiceChannel);
  }

  // Time for the functions

async function handleVideo(video, message, voiceChannel, playlist = false) {
const serverQueue = queue.get(message.guild.id);
const song = {
  id: video.id,
  title: video.title,
  url: `https://www.youtube.com/watch?v=${video.id}`,
  durationh: video.duration.hours,
  durationm: video.duration.minutes,
  durations: video.duration.seconds,
};
if (!serverQueue) {
  const queueConstruct = {
    textChannel: message.channel,
    voiceChannel: voiceChannel,
    connection: null,
    skippers: [],
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
  if (playlist) return undefined;
  else return message.channel.send(`✅ **${song.title}** has been added to the queue!`);
}
return undefined;
}

function play(guild, song) {
const serverQueue = queue.get(guild.id);

if (!song) {
  serverQueue.voiceChannel.leave();
  queue.delete(guild.id);
  return;
}

const dispatcher = serverQueue.connection.playStream(yt(song.url))
      .on('end', reason => {
          if (reason === 'Stream is not generating quickly enough.') console.log('Song ended.');
          else console.log(reason);
          serverQueue.songs.shift();
          setTimeout(() => {
              play(guild, serverQueue.songs[0]);
          }, 250);
      })
      .on('error', error => console.error(error));
  dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);

  //Modified playing messages that give you the song duration!

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
}





}


exports.help = {
  name: "play",
  description: "Sings music to you",
  usage: "h!play [song-name] || pr!play [url] || pr!play [playlist-url]"
}

exports.aliases = ["playmusic"]
