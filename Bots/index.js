const { Telegraf } = require('telegraf')
require('dotenv').config()
const express = require('express')
const { default: axios } = require('axios');
const expressApp = express()

const port = process.env.PORT || 3000
expressApp.get('/', (req, res) => {
  res.send('Bot!')
})
expressApp.listen(port, () => {
  console.log(`Listening on port ${port}`)
})

const bot = new Telegraf('5460453079:AAECrP-8PyXD4vIcDeV7fpgMuBcbhilano8', { webHook : { PORT : port} })


try {
    
} catch (error) {
    
}

bot.hears(/./, async (ctx) =>{ 
  const chat = ctx.message
  const web_link = `https://lambent-praline-e00ab7.netlify.app/`
  let chat_id;
  let user_id;

  if(ctx.match.input.includes('/start ')){
      chat_id = chat.text.split(' ')
      user_id = chat.from.id;
    //   console.log(chat_id[1]);
    //   console.log(user_id);

      // delete this line
      // end delete this line
      await axios.post(`https://everyservicesapi.itpw.ru/chat/telegram_chat/`,{
          "user_telegram_id": String(user_id),
          "chat_telegram_id": String(chat_id[1])
      }).catch((e)=> console.log(e)).then((response)=> console.log(response))
  }
try {
  if(ctx.match.input.includes('/start')){
      await ctx.telegram.sendMessage(chat.from.id, `Здраствуйте ${chat.from.first_name}!, Вы собираитесь записаться на услуги к мастеру, для этого нажмите на кнопку ниже`, {
          reply_markup: { 
              selective: true,
              resize_keyboard: true,
              inline_keyboard: [[{ text: `Записаться на услугу ❗`, web_app: {url: web_link}}]]
              },
              parse_mode: 'Markdown',
      })    
  }
  if(ctx.match.input.includes('/post')){
      let text = ctx.update.message.text.split('/post')
      if(text[0] == '' && text[1] == ''){
        text = 'вы не ввели сообщение'
      }else {
        text = text[1]
      }
      await ctx.deleteMessage(ctx.message.message_id)   
      ctx.telegram.sendMessage(ctx.chat.id, `${text}`, {
          reply_markup: {
              resize_keyboard: true,
              parse_mode: 'Markdown',
              inline_keyboard: [
                  [{text: 'Записаться к мастеру ❗', url: `https://t.me/IT_Power_new_bot?start=${ctx.update.message.chat.username}`}]
              ]
          }
      })
  }



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
  } catch (error) {
  //console.log(error);
}

},
)

// this function need if admin send photo for post 
try {
    bot.on('message', async msg => {
        if(msg.update.message?.caption?.includes('/img')){
            let text = msg.update.message.caption.split('/img')
            text = text[1]
            await msg.deleteMessage(msg.update.message.message_id)   
            msg.telegram.sendPhoto(msg.update.message.chat.id, msg.update.message?.photo[0]?.file_id, {
                caption: `${text}`,
                reply_markup: {
                    resize_keyboard: true,
                    parse_mode: 'Markdown',
                    inline_keyboard: [
                        [{text: 'Записаться к мастеру ❗', url: `https://t.me/IT_Power_new_bot?start=${msg.update.message.chat.username}`}]
                    ]
                }
            })
        }
      })   
} catch (error) {
    
}


bot.startPolling()
// http://dev1.itpw.ru:8005/marketplace/telegram_chat/

// Логика - пользователь постит пост - оставляет ссылку в формате https://t.me/IT_Power_new_bot?start=kD7Z0aaJKhY3ZThi
// https://t.me/IT_Power_new_bot?start=https://t.me/kD7Z0aaJKhY3ZThi
// **ссылка на бота + имя канала после ?start
// !! Если получается, что поле инпут равно '/start/ - значит пользователь уже пользуется нашим ботом и в базе данных есть его айди и номер канала
// !! если ссылка содержит после /start +наименование группы - значит пользователь или зашёл из другой группы в бота или он впервые 
// !! регистрируется у нас в системе - и его айдишник ещё не занесён в базу данных 
// ?? также важно хранить айди сообщений пользователя и бота - чтобы их в дальнейшем удалять - данный функционал реализуются с добав
// ?? лением доп таблички на бэк - при желании и необходимости

// https://t.me/IT_Power_new_bot?start=kD7Z0aaJKhY3ZThi

// docks: 
// you can use following commands:
// ** /button - для публикации поста с кнопкой для перехода в бота сообщества 
// ** пост отправится от имени бота и перезапишет пост отправленный пользователем
// ** /img - для публикации поста с картинкой - записывается в блоке с Заголовком /caption

// отловить ошибку у бота - с сервером 