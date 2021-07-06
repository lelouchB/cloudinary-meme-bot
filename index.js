require("dotenv").config();
const Discord = require("discord.js");
var cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

const client = new Discord.Client();

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on("message", async (message) => {
  if (message.content === "ping") {
    message.reply("Pong!");
  }
  let splitMessage = message.content.split(" ");

  if (splitMessage[0] === "!meme") {
    const textOverlay = splitMessage.slice(1, splitMessage.length).join(" ");
    let publicId = "";

    await cloudinary.api.resources(
      { type: "upload", max_results: 10, prefix: "cloudinary-meme-bot" },
      function (error, result) {
        if (error) {
          console.error(error);
        }
        const randomIndex = Math.floor(Math.random() * result.resources.length);

        publicId = result.resources[randomIndex].public_id;
      }
    );

    const image = cloudinary.image(publicId, {
      transformation: [
        { width: 400, height: 250, gravity: "face", crop: "fill" },
        {
          overlay: {
            font_family: "Cookie",
            font_size: 48,
            text: `Hey ${textOverlay}!`,
          },
          color: "#000",
        },
        {
          flags: "layer_apply",
          gravity: "north",
        },
      ],
    });

    const imageUrl = image.replace(`<img src='`, "").replace(`' />`, "");
    message.channel.send(imageUrl);
  }
});

client.login(process.env.BOT_TOKEN);
