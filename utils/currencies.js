//https://api.burency.com/openapi/quote/v1/ticker/24hr?symbol=BTCUSDT TO GET THE ALL DATA YOU WANT EXCEPT THE CHANGE(%)
const superAgent = require('superagent');

//this function return if the user choice currency exist in Burency Exchange
const getCurrencyDetails = (data) => {
  return new Promise(async (resolve, reject) => {
    //delete the spaces from the both sides
    data = data.trim();
    //delete the dollar sign
    data = data.substr(1, data.length);
    //delete every spaces in the message
    data = data.split(' ').join('');
    //make every letter in the currency in Capital letters
    const currency = data.toUpperCase();

    //create the url of burency api to get the details of the currency
    const url = `https://api.burency.com/openapi/quote/v1/ticker/24hr?symbol=${currency}USDT`;
    //send the request to the burency exchange to get the details of the currency
    const request = await superAgent.get(url);
    //check if there is any problem in the request

    if (request.body.code) {
      console.log('not exist');
      return reject('the Coin does not exist');
    }

    //calculate the change of the price in the last 24h (%)
    let change =
      ((request.body.lastPrice - request.body.openPrice) /
        request.body.openPrice) *
      100;
    //determine the decimals to 2
    change = change.toFixed(2);
    //create the opject of the necssary information
    const currencyDetails = {
      currency,
      Price: request.body.lastPrice,
      change,
      High: request.body.highPrice,
      Low: request.body.lowPrice,
      Volume: parseFloat(request.body.quoteVolume).toFixed(4),
    };

    //create the message by this function
    const message = createMessage(currencyDetails);
    resolve({ message, currency });
  });
};

//this function to check if the client want to check specific currency
const currencyChecker = (data) => {
  //return the index of the $ sign
  const dollarSign = data.indexOf('$');
  //check if the message start with the dollar sign and return true if is it otherwise it not the currency so return false
  if (dollarSign === 0) {
    return true;
  }

  return false;
};

const createMessage = (currencyDetails) => {
  //if the coin does not exist
  if (!currencyDetails) {
    return undefined;
  }
  //change the string to the number to check the price is up or down
  let change = parseFloat(currencyDetails.change);
  let emo;
  if (change >= 0) {
    emo = '📈';
  } else {
    emo = '📉';
  }
  //else return this message
  const message = ` ${currencyDetails.currency}(${currencyDetails.currency})
  Price: $ ${currencyDetails.Price}
  Change:(${emo}${currencyDetails.change}%)
  High: $ ${currencyDetails.High}
  Low: $ ${currencyDetails.Low}
  Volume: $ ${currencyDetails.Volume}`;

  return message;
};

module.exports = { currencyChecker, getCurrencyDetails };
//to get the change in the last 24h => (lastPrice - openprice) / lastPrice * 100
//3.13
