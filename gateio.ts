/*
数字货币交易所gateio API
文档：https://gateio.org/api2#spot
*/
//let request = require('request');
let https = require('https')
let crypto = require('crypto');
let querystring = require('querystring');
import {Log} from './log'

let log = new Log()

const API_QUERY_URL = 'data.gateio.life';
const API_TRADE_URL = 'api.gateio.life';
const PAIRS_URL = '/api2/1/pairs';
const MARKETINFO_URL = '/api2/1/marketinfo';
const MARKETLIST_URL = '/api2/1/marketlist';
const TICKERS_URL = '/api2/1/tickers';
const TICKER_URL = '/api2/1/ticker';
const ORDERBOOKS_URL = '/api2/1/orderBooks';
const ORDERBOOK_URL = '/api2/1/orderBook';
const TRADEHISTORY_URL = '/api2/1/tradeHistory';

const BALANCE_URL = '/api2/1/private/balances';
const DEPOSITADDRESS_URL = '/api2/1/private/depositAddress';
const DEPOSITSWITHDRAWALS_URL = '/api2/1/private/depositsWithdrawals';
const BUY_URL = '/api2/1/private/buy';
const SELL_URL = '/api2/1/private/sell';
const CANCELORDER_URL = '/api2/1/private/cancelOrder';
const CANCELALLORDERS_URL = '/api2/1/private/cancelAllOrders';
const GETORDER_URL = '/api2/1/private/getOrder';
const OPENORDERS_URL = '/api2/1/private/openOrders';
const MYTRADEHISTORY_URL = '/api2/1/private/tradeHistory';
const WITHDRAW_URL = '/api2/1/private/withdraw';

const USER_AGENT = '';

function Request (params:any,cp:any):void{
    // params : {"method":GET,"url":"",headers:{},from}
    let options={
        method:params.method,
        hostname:params.url,
        headers:params.headers,
        path:params.path,
        form:params.form
    }
    let req=https.request(options,function (res:any) {
        console.log('状态码 : ',res.statusCode)
        res.on('data',(data:any)=>{
            let jsonData=JSON.parse(data.toString())
            // 统一返回一个json结构给下游函数
            cp(jsonData)
        })
    })
    req.on('error', (e:any) => {
        log.printError(e)
      });
    if (options.method=='POST'){
        req.write(querystring.stringify(options.form))
    }
    req.end()
}

function getSign(str:string) {
    let unescapeStr = querystring.unescape(str);
    return crypto.createHmac('sha512', gate.gateSECRET).update(unescapeStr).digest('hex').toString();
}

var gate = {
    // add your key and secret
    gateKEY : 'your key',
    gateSECRET  : 'your secret',

    getPairs: function(cp:any) {
        Request({method: 'GET', url: API_QUERY_URL ,path: PAIRS_URL, headers: { 'User-Agent' : USER_AGENT } },cp);
    },

    getMarketinfo:function(cp:any) {
        Request({method: 'GET', url: API_QUERY_URL ,path: MARKETINFO_URL, headers: { 'User-Agent' : USER_AGENT } },cp);
    },

    getMarketlist:function (cp:any) {
        Request({method: 'GET', url: API_QUERY_URL ,path: MARKETLIST_URL, headers: { 'User-Agent' : USER_AGENT } },cp);
    },

    getTickers:function (cp:any) {
        Request({method: 'GET', url: API_QUERY_URL ,path: TICKERS_URL, headers: { 'User-Agent' : USER_AGENT } },cp);
    },

    getTicker:function (param:any,cp:any) {
        // param : eos_usdt
        Request({method: 'GET', url: API_QUERY_URL ,path:TICKER_URL + '/'+ param, headers: { 'User-Agent' : USER_AGENT } },cp);
    },

    orderBooks:function (cp:any) {
        Request({method: 'GET', url: API_QUERY_URL ,path:ORDERBOOKS_URL, headers: { 'User-Agent' : USER_AGENT } },cp);
    },

    orderBook:function (param:any,cp:any) {
        Request({method: 'GET', url: API_QUERY_URL ,path:ORDERBOOK_URL+  '/'+ param, headers: { 'User-Agent' : USER_AGENT } },cp);
    },

    tradeHistory:function (param:any,cp:any) {
         Request({method: 'GET', url: API_QUERY_URL ,path: TRADEHISTORY_URL+  '/'+ param, headers: { 'User-Agent' : USER_AGENT } },cp);
    },

    getBalances:function (cp:any) {
        let form = {};
        let header = {"KEY":"","SIGN":""};
        header.KEY = this.gateKEY;
        header.SIGN = getSign(querystring.stringify(form));
        Request({method: 'POST', url: API_TRADE_URL ,path:BALANCE_URL, headers: header, form:form },cp);
    },

    depositAddress:function (currency:string, cp:any) {
        let form = {'currency':currency};
        let header = {"KEY":"","SIGN":""};
        header.KEY = this.gateKEY;
        header.SIGN = getSign(querystring.stringify(form));
        console.log(header);
        console.log(querystring.stringify(form));
        console.log(API_TRADE_URL + DEPOSITADDRESS_URL);
        Request({method: 'POST', url: API_TRADE_URL,path: DEPOSITADDRESS_URL, headers: header, form:form },cp);
    },


    depositsWithdrawals:function (start:string,end:string, cp:any) {
        // param start && end : example=>'1508225535','1508311935'
        let form = {'start':start,'end':end};
        let header = {"KEY":"","SIGN":""};
        header.KEY = this.gateKEY;
        header.SIGN = getSign(querystring.stringify(form));
        Request({method: 'POST', url: API_TRADE_URL,path:DEPOSITSWITHDRAWALS_URL, headers: header, form:form },cp);
    },

    buy:function (currencyPair:string, rate:string, amount:string, cp:any) {
        // param rate : 成交价、
        // param amount : 成交量
        let form = {'currencyPair':currencyPair,'rate':rate,'amount':amount};
        let header = {"KEY":"","SIGN":"","Content-Type":"application/x-www-form-urlencoded"};
        header.KEY = this.gateKEY;
        header.SIGN = getSign(querystring.stringify(form));
        Request({method: 'POST', url: API_TRADE_URL ,path: BUY_URL, headers: header, form:form },cp);
    },

    sell:function (currencyPair:string, rate:string, amount:string, cp:any) {
        let form = {'currencyPair':currencyPair,'rate':rate,'amount':amount};
        let header = {"KEY":"","SIGN":"","Content-Type":"application/x-www-form-urlencoded"};
        header.KEY = this.gateKEY;
        header.SIGN = getSign(querystring.stringify(form));
        Request({method: 'POST', url: API_TRADE_URL ,path: SELL_URL, headers: header, form:form },cp);
    },

    cancelOrder:function (orderNumber:string, currencyPair:string , cp:any) {
        let form = {'currencyPair':currencyPair,'orderNumber':orderNumber};
        let header = {'Content-Type':'application/x-www-form-urlencoded',"KEY":"","SIGN":""};
        header.KEY = this.gateKEY;
        header.SIGN = getSign(querystring.stringify(form));
        Request({method: 'POST', url: API_TRADE_URL,path:CANCELORDER_URL, headers: header, form:form },cp);
    },

    cancelAllOrders:function (type:string, currencyPair:string , cp:any) {
        let form = {'currencyPair':currencyPair,'orderNumber':type};
        let header = {'Content-Type':'application/x-www-form-urlencoded',"KEY":"","SIGN":""};
        header.KEY = this.gateKEY;
        header.SIGN = getSign(querystring.stringify(form));
        Request({method: 'POST', url: API_TRADE_URL ,path:CANCELALLORDERS_URL, headers: header, form:form },cp);
    },

    getOrder:function (orderNumber:string, currencyPair:string , cp:any) {
        let form = {'currencyPair':currencyPair,'orderNumber':orderNumber};
        let header = {'Content-Type':'application/x-www-form-urlencoded',"KEY":"","SIGN":""};
        header.KEY = this.gateKEY;
        header.SIGN = getSign(querystring.stringify(form));
        Request({method: 'POST', url: API_TRADE_URL ,path: GETORDER_URL, headers: header, form:form },cp);
    },

    openOrders:function ( cp:any) {
        let form = {};
        let header = {'Content-Type':'application/x-www-form-urlencoded',"KEY":"","SIGN":""};
        header.KEY = this.gateKEY;
        header.SIGN = getSign(querystring.stringify(form));
        Request({method: 'POST', url: API_TRADE_URL ,path: OPENORDERS_URL, headers: header, form:form },cp);
    },

    myTradeHistory:function (currencyPair:string, orderNumber:string, cp:any) {
        let form = {'currencyPair':currencyPair,'orderNumber':orderNumber};
        let header = {'Content-Type':'application/x-www-form-urlencoded',"KEY":"","SIGN":""};
        header.KEY = this.gateKEY;
        header.SIGN = getSign(querystring.stringify(form));
        Request({method: 'POST', url: API_TRADE_URL ,path: MYTRADEHISTORY_URL, headers: header, form:form },cp);
    },

    withdraw:function (currency:string,amount:string, address:string, cp:any) {
        let form = {'currency':currency,'amount':amount,'address':address};
        let header = {'Content-Type':'application/x-www-form-urlencoded',"KEY":"","SIGN":""};
        header.KEY = this.gateKEY;
        header.SIGN = getSign(querystring.stringify(form));
        Request({method: 'POST', url: API_TRADE_URL,path:WITHDRAW_URL, headers: header, form:form },cp);
    },

};


export {gate}