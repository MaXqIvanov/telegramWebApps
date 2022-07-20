const { Telegraf } = require('telegraf')
require('dotenv').config()
const express = require('express')
const expressApp = express()

let PORT = process.env.PORT | 3000;

const bot = new Telegraf('5460453079:AAECrP-8PyXD4vIcDeV7fpgMuBcbhilano8', { webHook : { PORT : PORT} })

// bot.hears(/./, (ctx) => ctx.reply('Welcome', {reply_markup:{keyboard:[[{ text: 'заказать', web_app: {url: web_link}}]]}}))

bot.hears(/./, (ctx) =>{ 
    const num = Math.floor(Math.random() * 2)
    const chat = ctx.message
    const web_link = `https://lambent-praline-e00ab7.netlify.app/?chat=${chat.chat.id}&params=#${chat.chat.id}` 
    //ctx.reply(chat.chat.title)
    //ctx.reply(chat.from.id)

    // const web_link = `https://localhost:8080/?chat=${chat.chat.id}` 
    
    // ctx.reply(chat.from.first_name, `Hello`)
    const mainButton = 
    ctx.telegram.sendMessage(chat.from.id, `Здраствуйте ${chat.from.first_name}!, Вы собираитесь записаться на услуги к мастеру из группы ${chat.chat.title}, для этого нажмите на кнопку ниже`, {
        reply_markup: { 
            inline_keyboard: [[{ text: `Записаться на услугу`, web_app: {url: web_link}}]]},
            parse_mode: 'Markdown',
        })
    },
    )
bot.startPolling()
// keyboard:[[{ text: `Записаться на услугу`, web_app: {url: web_link}}]]},