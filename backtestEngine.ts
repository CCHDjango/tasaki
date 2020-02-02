/*
嵌入tasaki量化引擎
最后一次修改时间：2020-1-25
*/
import {Bar,Account,Trade,Order} from './constant'
import {Log} from './log'
import {Evaluation} from './evaluation'

let log:any=new Log()
let evaluation:any = new Evaluation()

export class Backtest{
    initData : any                  // 策略需要的预热历史数据
    testData : any                  // 回测需要的历史数据
    endTest:boolean=false           // 回测是否结束
    strategy:any                    // 策略类对象
    commission:number=0             // 手续费
    initCapital:number=0            // 初始化总资产
    cash:number=0                   // 账户现金
    orderList : any[]=[]            // 委托列表
    tradeList : any[]=[]            // 成交列表
    positionList : number[]=[]      // 持仓序列,对应K线
    accountList : number[]=[]       // 账户信息序列,对应K线

    // 每个历史数据的map结构
    bar:Bar={symbol:'',exchange:'',price:0,volume:0,high:0,low:0,open:0,close:0,endTime:''}
    // 持仓对象
    position:number = 0
    // 账户对象
    account:Account={position:0,cash:0,capital:0,freeze:0}
    // 订单对象
    order:Order={symbol:'',direction:'',price:0,volume:0,orderID:''}
    // 成交对象
    trade:Trade={symbol:'',direction:'',price:0,volume:0,time:'',tradeID:''}

    init():void{
        // function : 初始化回测引擎
        // param initData : 策略需要的预热历史数据
        // param testData : 回测需要的历史数据
        log.print('回测引擎初始化')
        this.cash=this.initCapital
        this.account.cash=this.cash
        this.account.capital=this.initCapital
    }

    loadHistory(initData:any,testData:any):void{
        // function : 加载预热数据和历史数据
        this.initData=initData
        this.testData=testData
    }

    run():void{
        // function : 运行回测
        for (let data of this.testData){
            this.makeBar(data)
            this.bar2Strategy()
            this.crossOrder()
            this.updatePosition()
            this.updateAccount()
        }
        log.print('tasaki 回测结束')
        evaluation.setBacktestTradeData(this.tradeList,this.positionList,this.accountList,this.testData)
        evaluation.initCapital=this.initCapital
        evaluation.init()
        evaluation.start()
    }

    makeBar(barData:any):void{
        // function : 生成tasaki回测需要的K线
        this.bar.endTime=barData['time']
        if (!(barData['symbol'])){
            this.bar.symbol='null'
        }
        this.bar.open=barData['open']
        this.bar.high=barData['high']
        this.bar.low=barData['low']
        this.bar.close=barData['close']
        this.bar.volume=barData['volume']
    }

    bar2Strategy():void{
        // function : 推送历史数据到策略
        this.strategy.onBar(this.bar)
    }

    crossOrder():void{
        // function : 撮合成交
        // 注意  成交方式为 : 买单价格在最高价和收盘价之间成交,卖单最低价和收盘价之间成交
        if (!(this.orderList)){
            return
        }else{
            // 撮合成交
            for (let order of this.orderList){
                if (order.direction=='buy'){
                    if (this.judgeAccount(order.price,order.volume)){
                        // 符合撮合的情况
                        this.trade.symbol=order.symbol
                        this.trade.direction='buy'
                        this.trade.price=this.bar.close
                        this.trade.volume=order.volume
                        this.trade.time=this.bar.endTime
                        this.tradeList.push(this.trade)

                        // 账户数据更新
                        this.account.position+=order.volume
                        this.account.cash-=this.bar.close*order.volume
                        this.account.capital=this.account.cash+this.account.position*this.bar.close

                        // 更新到策略
                        this.strategy.pos+=order.volume
                        this.strategy.onTrade(this.trade)
                        
                        // 成交之后就要删除掉对应的委托订单
                        this.orderList=this.orderList.filter(item => item !== order)
                    }else{
                        log.print('账户余额不足以买进')
                        return
                    }

                }else{
                    if (this.judgePosition(order.volume)){
                        // 做空符合撮合的情况
                        this.trade.symbol=order.symbol
                        this.trade.direction='sell'
                        this.trade.price=this.bar.close
                        this.trade.volume=order.volume
                        this.trade.time=this.bar.endTime
                        this.tradeList.push(this.trade)

                        // 账户信息更新
                        this.account.position-=order.volume
                        this.account.cash+=this.bar.close*order.volume
                        this.account.capital=this.account.cash+this.account.position*this.bar.close

                        // 更新到策略
                        this.strategy.pos-=order.volume
                        this.strategy.onTrade(this.trade)

                        // 成交之后就要删除掉对应的委托订单
                        this.orderList=this.orderList.filter(item => item !== order)
                    }else{
                        log.print('持仓数量不足以卖出')
                        log.print('当前持仓数量为 : ')
                        log.print(this.strategy.pos)
                        return
                    }
                }
            }
        }
    }

    updatePosition():void{
        // function : 更新持仓
        this.positionList.push(this.account.position)
    }

    updateAccount():void{
        // function : 更行账户
        this.accountList.push(this.account.capital)
        this.cash=this.account.cash
    }

    judgePosition(volume:number):boolean{
        // function : 检测持仓能否卖出
        if (this.account.position>=volume){
            return true
        }else{
            log.print('持仓不足以交易')
            return false
        }
    }

    judgeAccount(price:number,volume:number):boolean{
        // function : 检测账户余额是否足以下单
        if (this.cash>price*volume){
            return true
        }else{
            log.print('账户余额不足以支持下单')
        return false
        }
    }

    setStrategyOrder(order:any):void{
        // function : 这里获取策略的发单
        this.order.symbol=order.symbol
        this.order.price=order.price
        this.order.volume=order.volume
        this.order.direction=order.direction
        if (order.type){
            this.order.type=order.type
        }
        if (order.exchange){
            this.order.exchange=order.exchange
        }
        this.orderList.push(this.order)

        this.strategy.onOrder(this.order)
        }
}
