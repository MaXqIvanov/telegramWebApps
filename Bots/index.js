const { Telegraf } = require('telegraf')
require('dotenv').config()
const express = require('express');
const { default: axios } = require('axios');
const expressApp = express()

let PORT = process.env.PORT | 3000;

const bot = new Telegraf('5460453079:AAECrP-8PyXD4vIcDeV7fpgMuBcbhilano8', { webHook : { PORT : PORT} })

// bot.hears(/./, (ctx) => ctx.reply('Welcome', {reply_markup:{keyboard:[[{ text: 'заказать', web_app: {url: web_link}}]]}}))

bot.hears(/./, (ctx) =>{ 
    const num = Math.floor(Math.random() * 2)
    const chat = ctx.message
    const web_link = `https://lambent-praline-e00ab7.netlify.app/` 
try {
    // axios.post(`https://everyservices.itpw.ru/chat/telegram_chat/`,{
    //     "user": String(chat.from.id),
    //     "chat": String(chat.chat.id)
    // }).catch((e)=> console.log(e)).then((response)=> console.log(response.data)).then(()=>{
        ctx.telegram.sendMessage(chat.from.id, `Здраствуйте ${chat.from.first_name}!, Вы собираитесь записаться на услуги к мастеру из группы ${chat.chat.title}, для этого нажмите на кнопку ниже`, {
            reply_markup: { 
                inline_keyboard: [[{ text: `Записаться на услугу`, web_app: {url: web_link}}]]},
                parse_mode: 'Markdown',
            })    
    // })
    
   
} catch (error) {
    console.log(error);
}

    },
    )
bot.startPolling()
// http://dev1.itpw.ru:8005/marketplace/telegram_chat/