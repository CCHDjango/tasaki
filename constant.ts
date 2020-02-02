/*
tasaki量化引擎的公共变量
1,Bar对象
2,持仓对象
3,账户对象
*/


interface Tick{
    symbol:string,       // 品种代号
    exchange?:string,    // 交易所代号
    price:number,        // tick的行情价格
    volume:number,       // 当前成交量
    time:string          // tick的时间
}

interface Bar{
    symbol:string,       //  品种代号
    exchange?:string,    //  交易所名称
    price:number,        //  价格
    volume:number,       //  成交量
    high:number,         //  最高价
    low:number,          //  最低价
    open:number,         //  开盘价
    close:number,        //  收盘价
    endTime:string,      //  结束时间
    frequency?:string    //  K线的周期
}

interface Account{
    position:number,       // 账户持仓
    cash:number,           // 账户现金
    capital:number,        // 账户总资产
    freeze:number          // 账户冻结资产
}

interface Order{
    direction:string,      // 下单方向
    symbol:string,         // 下单品种
    exchange?:string,      // 下单交易所
    price:number,          // 下单价格
    volume:number,         // 下单量
    type?:string,          // 下单类型 市价单，限价单，被动委托，冰山成交
    orderID:string         // 订单id
}

interface Trade{
    direction:string,      // 成交的订单方向
    symbol:string,         // 成交的品种
    exchange?:string,      // 交易所代号
    price:number,          // 成交价格
    volume:number,         // 成交价格
    time:string,           // 成交时间
    tradeID:string         // 成交ID
}

export {Bar,Account,Trade,Order,Tick}