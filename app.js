const { Telegraf } = require('telegraf');
const dotenv = require('dotenv');

//bring the function from utils folder
const { currencyChecker, getCurrencyDetails } = require('./utils/currencies');

//to fetch the secret data from .env file
dotenv.config({ path: './config/.env' });

const bot = new Telegraf(process.env.BOT_TOKEN);

//listen to every message events
bot.on('message', async (ctx) => {
  try {
    /* const isGroup = isBurencyGroup(ctx);
    if (!isGroup) {
      return ctx.reply(
        "you can't use the bot here and this bot is for burency Only"
      );
    }*/

    //check if the purpose from the message is checking price details
    const isCurrency = currencyChecker(ctx.message.text);
    //if is calling currency details
    if (isCurrency) {
      let { message, currency } = await getCurrencyDetails(ctx.message.text);
      //check if the function return message or the coin/token does't exist
      /*if (!message) {
          return undefined;
        }*/

      //HANDLE BTC ETF BECAUSE THE FORM OF THE URL TO THE BTC IS NOT THE SAME OF OTHER COINS
      if (currency === 'BTC3S') {
        currency = 'BTCXXS';
      } else if (currency === 'BTC3L') {
        currency = 'BTCXXL';
      }

      if (ctx.chat.type === 'private') {
        return undefined;
      }
      //send the details of the bot with the button
      return bot.telegram.sendMessage(ctx.chat.id, message, {
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: 'Trade',
                url: `https://www.burency.com/exchange/${currency}/USDT`,
              },
            ],
          ],
        },
      });
    }
  } catch (error) {
    console.log(error.message);
  }
});

//catch the error that came from the bot
bot.catch((err, ctx) => {
  console.log(`Ooops, encountered an error for ${ctx.updateType}`, err);
});

//launch the bot and let him work
bot.launch().then(() => {
  console.log('the bot is working now');
});

//this function to check if the message from the burency group or not.
/*const isBurencyGroup = (ctx) => {
  if (ctx.chat.id.toString() !== process.env.CHAT_ID) {
    console.log(ctx.chat.id.toString());
    return false;
  }

  return true;
};*/
