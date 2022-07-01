require('dotenv').config();
const { Telegraf } = require('telegraf')

const bot = new Telegraf(process.env.BOT_TOKEN)
const web_link = 'https://lambent-praline-e00ab7.netlify.app/' 

bot.start((ctx) => ctx.reply('Welcome', {reply_markup:{keyboard:[[{ text: 'заказать', web_app: {url: web_link}}]],},}))
bot.launch()