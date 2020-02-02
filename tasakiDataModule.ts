/*
tasaki 数据处理模块
1，下载历史数据到本地项目的data目录里面
2，数据处理

调用方法：
实例化DataEngine后，如果是实盘那就先setConfig()然后再调用实盘的接口
*/
import {workspace} from 'vscode'
import {Log} from './log'
import {readJson} from './common'
import {gate} from './gateio'

let log= new Log()

export class DataEngine{
    dataPath:string=""    // 本地data目录路径
    configPath:string=""  // 本地用户配置文件的路径
    getLocalKey(path:string):any{
        // function : 加载本地json配置文件
        // param path : 本地json配置文件的路径
        // return : 返回json内容
        return readJson(path)
    }

    setConfig():void{
        // function : 把用户配置加载到内存中
        let config:any=this.getLocalKey(this.configPath)
        gate.gateKEY=config["gate"]["api_key"]
        gate.gateSECRET=config["gate"]["secret_key"]
    }

    getDataPath():string{
        // function : 返回本地工程目录data目录的路径
        if (workspace.workspaceFolders!=undefined){
            this.configPath=workspace.workspaceFolders[0].uri.fsPath+"/config.json"
            this.dataPath=workspace.workspaceFolders[0].uri.fsPath+"/data"
            return this.dataPath
        }else{
            log.printError("coudnt find the data catelogue")
            return ""
        }      
    }

    getGateBTC1min():void{
        // function : 请求下载gateio交易所的BTC现货一分钟数据并保存在本地data目录中
    }

    getGateETH1min():void{
        // fucntion : 请求下载gateio交易所ETH现货一分钟数据并保存在本地的data目录中
    }

    getGateioEOS1min():void{
        // fucntion : 请求下载gateio交易所EOS现货一分钟数据并保存在本地的data目录中
    }

    getAStock1min():void{
        // function : 请求下载A股股票1分钟数据
    }
}