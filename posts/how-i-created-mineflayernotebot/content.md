# How I Created MineflayerNotebot

24-08-2023

Hey there! Today, I wanted to share with you the story behind the creation of MineflayerNotebot. As an avid Minecraft player and developer, I wanted to combine my passion for both and create something fun and useful for the Minecraft community.

MineflayerNotebot is a notebot built using the Mineflayer library, which is a powerful tool for creating Minecraft bots. With MineflayerNotebot, players can easily play .nbs files (which can be generated from midi files using Noteblock Studio).

---

I started by creating a simple mineflayer bot that would listen for chat commands and print them to the console. The code for that looks something like this:

```javascript
const mineflayer = require('mineflayer');

const serverHost = 'localhost';
const serverPort = 25565;
const username = 'notebot';

// Create a new bot instance
const bot = mineflayer.createBot({
  host: serverHost,
  port: serverPort,
  username: username,
});

// Listen for the 'chat' event
bot.on('chat', (username, message) => {
  console.log(`${username}: ${message}`);
});

// Wait for the bot to spawn in the world
bot.once('spawn', () => {
  console.log('Bot has spawned!');
});
```