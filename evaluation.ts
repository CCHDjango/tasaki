/*
hasaki-quant evaluation module
1,统计盈亏
2,输出评价指标
3,显示结果图
*/
import {Log} from './log'

let log = new Log()

export class Evaluation{
    tradeData:any[]=[]           // 成交数据结果
    position:any[]=[]            // 持仓数据
    account:any[]=[]             // 账户信息数据
    barList:any[]=[]             // K线序列
    closeList:number[]=[]        // 收盘价序列
    posWinList:number[]=[]       // 持仓收益曲线
    capitalWinList:number[]=[]   // 总资产变化曲线

    initCapital:number=0         // 初始总资产

    init():void{
        // function : 评价指标模块的初始化
        log.print('tasaki 投后分析-评价指标模块初始化')
        
        // 生成收盘价序列
        for (let i of this.barList){
            this.closeList.push(i['close'])
        }

    }

    setBacktestTradeData(tradeList:any[],positionList:any[],accountList:any[],barList:any[]):void{
        // function : 获取回测结束后的交易-持仓-账户数据
        // param tadeList : 成交结果列表
        // param positionList : 持仓结果列表
        // param accountList : 账户信息结果
        // param barList : K线序列
        this.tradeData=tradeList
        this.position=positionList
        this.account=accountList
        this.barList=barList
        this.initCapital=this.account[0].capital
    }

    start():void{
        // function : 开始创建评价指标
        log.print('评价指标模块开始运行')
        this.makePosWinList()
        this.calWinList()
        console.log('初始金额为 : ',this.initCapital)
    }

    makePosWinList():void{
        // function : 生成持仓收益曲线
        if (this.position.length!=this.closeList.length){
            throw new Error('持仓序列的长度不等于收盘价序列的长度,检查数据流过程的缺失')
        }
        
        for (let p in this.position){
            if (this.position[p]<0){
                // 做空的情况
                log.print('====')

            }else if(this.position[p]>0){
                // 做多的情况
                let priceRate:number
                if (p=='0'){
                    priceRate=0
                }else{
                    priceRate=0//(this.closeList[p]-this.closeList[String(Number(p)-1)])/this.closeList[p] * 100
                }
                this.posWinList.push(priceRate)
            }else{
                // 空仓的情况
                this.posWinList.push(0)
            }
        }
    }

    calWinList():void{
        // function : 计算浮盈，把持仓列表叠加上持仓收益曲线
        if (this.position.length!=this.posWinList.length){
            throw new Error('持仓序列的长度不等于收益曲线的长度，tasaki内部处理数据错误了')
        }

        for (let i in this.position){
            // 这里计算总资产的浮动与我想象有点出入，没想好
            this.capitalWinList.push(this.account[i])
        }
    }

    // end
}