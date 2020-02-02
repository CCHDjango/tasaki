/*
tasaki engine log module
*/

export class Log{
    print(content:string):void{
        console.log(content)
    }

    printError(content:string):void{
        // function : 错误信息打印
        console.error(content)
    }
    
    printLocal(content:string):void{
        // function : 保存到本地的日志,主要是记录用户的操作，方便用户检查操作
        // 格式 : 2020-1-31 10:58:00 info: content
        
    }
}