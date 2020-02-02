/*
嵌入tasaki 量化交易引擎
最后一次修改：2020-1-22
*/

import {Log} from './log'
import {Bar,Account,Trade,Order} from './constant'
import {EventEngine} from './eventEngine'

let log:any=new Log()
let event=new EventEngine()

export class TradeEngine{
    strategy:any

    init(strategy:any):void{
        // function : 交易引擎初始化函数
        log.print('交易引擎初始化开始')
        this.strategy=strategy
    }

    sendOrder(order:any):number{
        // function : 发单函数
        // param order : 订单详情
        event.emit("ORDER",order)
        return 0
    }

    cancelOrder():void{
        // function : 取消订单函数 hasaki-quant不需要撤单
    }

    eventIn():void{
        // function : 接收事件的输入
        event.on('TICK',this.tickRecv)
        event.on('POSITION',this.updatePposition)
        event.on('ACCOUNT',this.updateAccount)
    }

    tickRecv(tick:any):void{
        // function : 接受api接口的tick 行情并传输到策略
        // param tick : tick行情
        this.strategy.onTick(tick)
    }

    updatePposition(position:any):void{
        // functin : 接收交易所返回的持仓信息
        // param position : 持仓数据
        this.strategy.pos=position
    }

    updateAccount(account:any):void{
        // function : 接收交易所返回的账户信息
        // param account : 账户数据
    }

    barRecv(bar:any):void{
        // function : 接受交易所的一分钟的K线并传给策略
        this.strategy.onBar(bar)
    }

    loadPreHistory(data:any[]):any{
        // function : 加载预热数据
        
    }

}