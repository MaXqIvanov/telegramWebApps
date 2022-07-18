const { Telegraf } = require('telegraf')

let PORT = process.env.PORT | 3000;

const bot = new Telegraf('5460453079:AAECrP-8PyXD4vIcDeV7fpgMuBcbhilano8', { webHook : { PORT : PORT} })
const web_link = 'https://lambent-praline-e00ab7.netlify.app/' 

bot.start((ctx) => ctx.reply('Welcome', {reply_markup:{keyboard:[[{ text: 'заказать', web_app: {url: web_link}}]]}}))

bot.launch()