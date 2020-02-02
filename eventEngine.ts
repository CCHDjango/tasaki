/*
hasaki-quant事件引擎
*/
import {EventEmitter} from 'events'
import {Log} from './log'

let log:any = new Log()

export class EventEngine extends EventEmitter{
    init():void{
        // function : 事件引擎初始化
        log.print('事件引擎初始化')
    }

    setEvent(typeName:string,data:any):void{
        // fhunction : 传入事件
        this.emit(typeName,data)
    }

    run():void{
        // function : 运行
        
    }
}