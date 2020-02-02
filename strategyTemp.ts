/*
tasaki @R typescript language startegy module

typescript 实现的策略模板
*/
import {Bar,Trade,Order,Tick} from './constant'
import {Log} from './log'

let log:any=new Log()

export class Startegy{
    pos:number=0             // 策略持仓
    engine:any               // 引擎对象
    // 订单结构
    order:Order = {symbol:'',direction:'',price:0,volume:0,orderID:''}
    // 成交数据对象              
    trade:Trade={direction:'',symbol:'',price:0,volume:0,time:'',tradeID:''}

    init():void{

    }

    start():void{

    }

    onBar(bar:Bar):void{
        // function : 接收K线数据行情
        
    }

    onTick(tick:Tick):void{
        // function : 接收交易所tick数据的行情
    }

    onOrder(order:Order):void{
        // function : 订单回报
    }

    onTrade(trade:Trade):void{
        // function : 成交回报
    }

    buy(symbol:string,price:number,volume:number):void{
        // function : 多单
        log.print('策略下买单')
        this.order.symbol=symbol
        this.order.price=price
        this.order.volume=volume
        this.order.direction='buy'
        this.engine.setStrategyOrder(this.order)
    }

    sell(symbol:string,price:number,volume:number):void{
        // function : 下卖单函数
        log.print('策略下卖单')
        this.order.symbol=symbol
        this.order.price=price
        this.order.volume=volume
        this.order.direction='sell'
        this.engine.setStrategyOrder(this.order)
    }
}