
const Discord = require("discord.js");
const fs = require("fs");
const yt = require('ytdl-core');
const YouTube = require('simple-youtube-api');
const youtube = new YouTube(process.env.YOUTUBE_API_KEY);

exports.run = async(bot, message, args, queue) => {
     const args1 = message.content.split(' ');
  const searchString = args1.slice(1).join(' ');
  const url = args1[1] ? args1[1].replace(/<(.+)>/g, '$1') : '';
  const serverQueue = queue.get(message.guild.id);


    const voiceChannel = message.member.voiceChannelID

  if (message.channel.id !== "399548148315586580") return message.channel.send(":musical_note: :x: ***__You need to be in <#399548148315586580> To use this command!__*** :x: :musical_note:")
  if (voiceChannel !== "399540529995710484" && !voiceChannel) return message.channel.send(":musical_note: :x:***__You Must be in the music room to use this Command!__*** :x: :musical_note:")
    if (!serverQueue) return message.channel.send('There is nothing playing! Add some music to play using: h!play [song-name]');
    return message.channel.send(`
__**Song queue:**__

${serverQueue.songs.map(song => `**-** ${song.title}`).slice(0, 16).join('\n')}

**Now playing:** ${serverQueue.songs[0].title}
    `);

    // > Functions

async function handleVideo(video, message, voiceChannel, playlist = false) {
  const serverQueue = queue.get(message.guild.id);
  console.log(video);
  const song = {
    id: video.id,
    title: video.title,
    url: `https://www.youtube.com/watch?v=${video.id}`
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
    console.log(serverQueue.songs);
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
  console.log(serverQueue.songs);

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

    serverQueue.textChannel.send(`🎶 Start playing: **${song.title}**`);
}
}


exports.help = {
    name: "queue",
    description: "Shows what music is in the queue",
    usage: "h!queue",
}

exports.aliases = ["list"]
