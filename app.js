require('dotenv').config();
const https = require('https');
const token = process.env.BOT_TOKEN;

const { Client } = require('discord.js');
const client = new Client();

const PREFIX = '$';

client.on('message', (message) => {
  if (message.author.bot) return;
  if (message.content.startsWith(PREFIX)) {
    const [CMD_NAME, ...args] = message.content
      .trim()
      .substring(PREFIX.length)
      .split(/\s+/);
    if (CMD_NAME == 'wiki') {
      var search_uri = '';

      for (let i = 0; i < args.length; i++) {
        const text = args[i];
        if (i === args.length) {
          search_uri += text;
        } else {
          search_uri += `${text} `;
        }
      }

      https.get(
        `https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro&explaintext&redirects=1&indexpageids&titles=${search_uri}`,
        (response) => {
          response.on('data', (data) => {
            const jsonData = JSON.parse(data);

            if (jsonData.query.pageids[0] === '-1') {
              message.reply('Please make the query clear... Not found.');
            } else {
              const extractedData =
                jsonData.query.pages[jsonData.query.pageids[0]].extract;

              message.reply(
                `${extractedData.substring(
                  0,
                  1000
                )} \n - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  \n or you can read more at \n https://en.wikipedia.org/?curid=${
                  jsonData.query.pageids[0]
                }`
              );
            }
          });
        }
      );
    }
  }
});

client.login(token);
