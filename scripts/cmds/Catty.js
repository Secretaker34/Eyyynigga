const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');
const ytdl = require("ytdl-core");
const yts = require("yt-search");

async function lado(api, event, args, message) {
  try {
    const songName = args.join(" ");
    const searchResults = await yts(songName);

    if (!searchResults.videos.length) {
      message.reply("No song found for the given query.");
      return;
    }

    const video = searchResults.videos[0];
    const videoUrl = video.url;
    const stream = ytdl(videoUrl, { filter: "audioonly" });
    const fileName = `music.mp3`; 
    const filePath = path.join(__dirname, "tmp", fileName);

    stream.pipe(fs.createWriteStream(filePath));

    stream.on('response', () => {
      console.info('[DOWNLOADER]', 'Starting download now!');
    });

    stream.on('info', (info) => {
      console.info('[DOWNLOADER]', `Downloading ${info.videoDetails.title} by ${info.videoDetails.author.name}`);
    });

    stream.on('end', () => {
      const audioStream = fs.createReadStream(filePath);
      message.reply({ attachment: audioStream });
      api.setMessageReaction("✅", event.messageID, () => {}, true);
    });
  } catch (error) {
    console.error("Error:", error);
    message.reply("Sorry, an error occurred while processing your request.");
  }
}

async function kshitiz(api, event, args, message) {
  try {
    const query = args.join(" ");
    const searchResults = await yts(query);

    if (!searchResults.videos.length) {
      message.reply("No videos found for the given query.");
      return;
    }

    const video = searchResults.videos[0];
    const videoUrl = video.url;
    const stream = ytdl(videoUrl, { filter: "audioandvideo" }); 
    const fileName = `music.mp4`;
    const filePath = path.join(__dirname, "tmp", fileName);

    stream.pipe(fs.createWriteStream(filePath));

    stream.on('response', () => {
      console.info('[DOWNLOADER]', 'Starting download now!');
    });

    stream.on('info', (info) => {
      console.info('[DOWNLOADER]', `Downloading ${info.videoDetails.title} by ${info.videoDetails.author.name}`);
    });

    stream.on('end', () => {
      const videoStream = fs.createReadStream(filePath);
      message.reply({ attachment: videoStream });
      api.setMessageReaction("😺", event.messageID, () => {}, true);
    });
  } catch (error) {
    console.error(error);
    message.reply("Sorry, an error occurred while processing your request.");
  }
}

async function b(c, d, e, f) {
  try {
    const g = await axios.get(`https://gpt-four.vercel.app/gpt?prompt=${encodeURIComponent(c)}&uid=${d}`);
    return g.data.answer;
  } catch (h) {
    throw h;
  }
}

async function i(c) {
  try {
    const j = await axios.get(`https://sdxl-kshitiz.onrender.com/gen?prompt=${encodeURIComponent(c)}&style=3`);
    return j.data.url;
  } catch (k) {
    throw k;
  }
}

async function describeImage(prompt, photoUrl) {
  try {
    const url = `https://sandipbaruwal.onrender.com/gemini2?prompt=${encodeURIComponent(prompt)}&url=${encodeURIComponent(photoUrl)}`;
    const response = await axios.get(url);
    return response.data.answer;
  } catch (error) {
    throw error;
  }
}

async function l({ api, message, event, args }) {
  try {
    const m = event.senderID;
    let n = "";
    let draw = false;
    let sendTikTok = false;
    let sing = false;

    if (args[0].toLowerCase() === "draw") {
      draw = true;
      n = args.slice(1).join(" ").trim();
    } else if (args[0].toLowerCase() === "send") {
      sendTikTok = true;
      n = args.slice(1).join(" ").trim();
    } else if (args[0].toLowerCase() === "sing") {
      sing = true;
      n = args.slice(1).join(" ").trim();
    } else if (event.messageReply && event.messageReply.attachments && event.messageReply.attachments.length > 0) {
      const photoUrl = event.messageReply.attachments[0].url;
      n = args.join(" ").trim();
      const description = await describeImage(n, photoUrl);
      message.reply(`Description: ${description}`);
      return;
    } else {
      n = args.join(" ").trim();
    }

    if (!n) {
      return message.reply("Please provide a prompt.");
    }

    if (draw) {
      await drawImage(message, n);
    } else if (sendTikTok) {
      await kshitiz(api, event, args.slice(1), message); 
    } else if (sing) {
      await lado(api, event, args.slice(1), message); 
    } else {
      const q = await b(n, m);
      message.reply(q, (r, s) => {
        global.GoatBot.onReply.set(s.messageID, {
          commandName: a.name,
          uid: m 
        });
      });
    }
  } catch (t) {
    console.error("Error:", t.message);
    message.reply("An error occurred while processing the request.");
  }
}

async function drawImage(message, prompt) {
  try {
    const u = await i(prompt);

    const v = path.join(__dirname, 'cache', `image_${Date.now()}.png`);
    const writer = fs.createWriteStream(v);

    const response = await axios({
      url: u,
      method: 'GET',
      responseType: 'stream'
    });

    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
      writer.on('finish', resolve);
      writer.on('error', reject);
    }).then(() => {
      message.reply({
        body: "Meaaowww",
        attachment: fs.createReadStream(v)
      });
    });
  } catch (w) {
    console.error("Error:", w.message);
    message.reply("An error occurred while processing the request.");
  }
}

const a = {
  name: "catty",
  aliases: [""],
  version: "5.0",
  author: "TCA",
  countDown: 5,
  role: 0,
  longDescription: "Chat with catty",
  category: "ai",
  guide: {
    en: "{p}catty {prompt}"
  }
};

module.exports = {
  config: a,
  handleCommand: l,
  onStart: function ({ api, message, event, args }) {
    return l({ api, message, event, args });
  },
  onReply: function ({ api, message, event, args }) {
    return l({ api, message, event, args });
  }
};