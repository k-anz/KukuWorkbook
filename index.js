"use strict";
const Alexa = require('alexa-sdk');
// ステートの定義
const states = {
  WORKMODE: '_WORKMODE'
};
exports.handler = function(event, context, callback) {
  var alexa = Alexa.handler(event, context);
  // alexa.appId = process.env.APP_ID;
  alexa.registerHandlers(handlers, kukuHandlers); // 既存のハンドラに加えてステートハンドラ(後半で定義)も登録
  alexa.execute();
};
var handlers = {
  'LaunchRequest': function () {
    this.emit('AMAZON.HelpIntent');
  },
  'AMAZON.HelpIntent': function () {
    this.emit(':ask', '九九の練習をします。' +
                  'たとえば、さんの段の練習、と話しかけて下さい。');
  },
  'KukuIntent': function () {
    var sign = this.event.request.intent.slots.NumberSign.value;
    this.handler.state = states.WORKMODE; // WORKにステートをセット
    var row = 1;

    switch (sign) {
      case 'いちの段':
        row = 1;
        break;
      case 'にの段':
        row = 2;
        break;
      case 'さんの段':
        row = 3;
        break;
      case 'よんの段':
        row = 4;
        break;
      case 'ごの段':
        row = 5;
        break;
      case 'ろくの段':
        row = 6;
        break;
      case 'ななの段':
        row = 7;
        break;
      case 'はちの段':
        row = 8;
        break;
      case 'きゅうの段':
        row = 9;
        break;
    }
    this.attributes['row'] = row;
    this.attributes['column'] = 1;
    var message = sign + 'の練習をします。' +
                 row + 'かける1は？';
    var reprompt = row + 'かける1は？';
    this.emit(':ask', message, reprompt); // 相手の星座を聞くためにaskアクションに変更
    console.log(message);
  }
};
// ステートハンドラの定義
var kukuHandlers = Alexa.CreateStateHandler(states.WORKMODE, {
  'KukuIntent': function() {
    // 行と列をセッションアトリビュートから取得
    var row = this.attributes['row'];
    var column = this.attributes['column'];
    var userAnswer = this.event.request.intent.slots.NumberSign.value; // スロットから回答を取得
    var collectMessage = '';

    if (userAnswer == row * column) {
      // 正解の場合は次に進む
      this.attributes['column'] = column + 1;
      collectMessage = 'おめでとう！正解です。';

      if (column > 9) {
        // スキルの初期状態に戻すためステートをリセット
        this.handler.state = '';
        this.attributes['STATE'] = undefined;
        // 9までいったので終了
        var message = '最後までできましたね！これでドリルをおわります。';
        this.emit(':tell', message);
      }
    }
    var reprompt = collectMessage　+ row + 'かける' + column + 'は？';
    this.emit(':ask', reprompt, reprompt);
    console.log(message);
  },
  'Unhandled': function() {
    var row = this.attributes['row'];
    var reprompt = 'うまく聞き取れませんでした。' + row + 'かける1は？';
    this.emit(':ask', reprompt, reprompt);
  }
});