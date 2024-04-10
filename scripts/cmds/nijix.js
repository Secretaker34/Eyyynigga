const axios=require("axios");const { getStreamFromURL } = global.utils;const { Niji } = require('@rehat666/nijijourney');module.exports.config={name:"nijix",version:"1.0",author:"SiAM|Turtle APIs",countDown:5,role:0,description:"Text to Image",category:"utility",guide:{en:"{pn}prompt --ar [ratio] or reply an image"}};module.exports.onStart=async function({api, args, message, event}){try {let prompt="";let imageUrl="";let aspectRatio="";const aspectIndex=args.indexOf("--ar");if (aspectIndex !== -1 && args.length > aspectIndex + 1) {aspectRatio = args[aspectIndex + 1];args.splice(aspectIndex, 2);}if (event.type === "message_reply" && event.messageReply.attachments && event.messageReply.attachments.length > 0 && ["photo", "sticker"].includes(event.messageReply.attachments[0].type)) {imageUrl = encodeURIComponent(event.messageReply.attachments[0].url);} else if (args.length === 0) {message.reply("Please provide a prompt or reply to an image.");return;}if (args.length > 0) {prompt = encodeURIComponent(args.join(" "));}const processingMessage = await message.reply("⏳ Processing your request...");const data = await Niji( prompt, imageUrl, aspectRatio );const body = (`Your Imagination Is Created 🌟\n\nDownload Link: `) + data;await message.reply({body: body,attachment: await getStreamFromURL(data)});message.unsend(processingMessage.messageID);await message.reaction("✅", event.messageID);} catch (error) {console.error(error);message.reply("❌ |An error occurred.");message.reaction("❌", event.messageID);}};