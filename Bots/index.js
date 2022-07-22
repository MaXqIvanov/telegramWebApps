const { Telegraf } = require('telegraf')
require('dotenv').config()
const express = require('express');
const { default: axios } = require('axios');
const expressApp = express()

let PORT = process.env.PORT | 3000;

const bot = new Telegraf('5460453079:AAECrP-8PyXD4vIcDeV7fpgMuBcbhilano8', { webHook : { PORT : PORT} })

// bot.hears(/./, (ctx) => ctx.reply('Welcome', {reply_markup:{keyboard:[[{ text: 'заказать', web_app: {url: web_link}}]]}}))

bot.hears(/./, async (ctx) =>{ 

    const chat = ctx.message
    const web_link = `https://lambent-praline-e00ab7.netlify.app/`
    let chat_id;
    let user_id;
    //console.log(ctx.match);
    //console.log(chat);

    if(ctx.match.input.includes('/start ')){
        chat_id = chat.text.split(' ')
        user_id = chat.from.id;
        console.log(chat_id[1]);
        console.log(user_id);
        await axios.post(`https://everyservices.itpw.ru/chat/telegram_chat/`,{
            "user": String(user_id),
            "chat": String(chat_id)
        }).catch((e)=> {}).then((response)=> console.log(response))
    }
try {
       await ctx.telegram.sendMessage(chat.from.id, `Здраствуйте ${chat.from.first_name}!, Вы собираитесь записаться на услуги к мастеру, для этого нажмите на кнопку ниже`, {
            reply_markup: { 
                selective: true,
                resize_keyboard: true,
                inline_keyboard: [[{ text: `Записаться на услугу`, web_app: {url: web_link}}]]
                },
                parse_mode: 'Markdown',
        })    

    //?? block for delete messages //!! important   need work for this func
    
    for(let i = 0; i <= 200; i++ ){
        if(ctx.message.from.id === ctx.message.chat.id){
            try {
                // console.log(ctx);
                // console.log({...ctx.message});
                k =  ctx.message.message_id-i;
                await ctx.deleteMessage(k)   
            } catch (error) {
                
            }
        }
    }
    //?? block for delete messages
    //5097262048
    } catch (error) {
    //console.log(error);
}

},
)
bot.startPolling()
// http://dev1.itpw.ru:8005/marketplace/telegram_chat/

// Логика - пользователь постит пост - оставляет ссылку в формате https://t.me/IT_Power_new_bot?start=kD7Z0aaJKhY3ZThi
// https://t.me/IT_Power_new_bot?start=https://t.me/kD7Z0aaJKhY3ZThi
// **ссылка на бота + имя канала после ?start
// !! Если получается, что поле инпут равно '/start/ - значит пользователь уже пользуется нашим ботом и в базе данных есть его айди и номер канала
// !! если ссылка содержит после /start +наименование группы - значит пользователь или зашёл из другой группы в бота или он впервые 
// !! регистрируется у нас в системе - и его айдишник ещё не занесён в базу данных 
// ?? также важно хранить айди сообщений пользователя и бота - чтобы их в дальнейшем удалять - данный функционал реализован иначе

// https://t.me/IT_Power_new_bot?start=kD7Z0aaJKhY3ZThi

