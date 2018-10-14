const fs = require('fs');
const kindList = require("./../../kind");
/*
* PI文件读取器
* */
class PIReader{
    constructor( file ){
        this.file = file || __dirname + "/data.txt";
        this.ignoreSize = "3.".length; //忽略的位置数量。3.1415126  3.将会被忽略
        this.position = this.ignoreSize; //当前读取位置,初始化为 3. 之后
        this.FD = fs.openSync(this.file,"r"); //打开文件
        this.isFileEnd = false;
        let fileInfo = fs.statSync( this.file );
        this.fileSize = fileInfo.size;
    }
    /*
    * 继续读取，len代表读取的PI数量
    * @return null 到达文件末尾，无法读取
    * */
    get(len){
        let buffer = Buffer.alloc(len);
        let bytesRead = fs.readSync(this.FD, buffer, 0, len, this.position);
        //如果读取数量小于给与，则到达末尾
        if( bytesRead < len || bytesRead === 0 ){
            this.isFileEnd = true;
        }
        //到达末尾
        if( bytesRead === 0 ){
            return null;
        }
        else{
            this.position += len;
            return buffer.slice(0, bytesRead).toString();
        }
    }
    /*
    * 移动位置
    * */
    goPos( p ){
        this.position = p + this.ignoreSize;
    }
    getPos(){
        return this.position - this.ignoreSize;
    }
    /*
    * 关闭
    * */
    destory(){
        fs.closeSync( this.FD );
    }
}
/*
* in array
* */
function inArray(needle, haystack){
    for (let i = 0, len = haystack.length ;i < len; i++) {
        if(haystack[i] === needle){
            return true;
        }
    }
    return false;
}
/*
* 读取器
* */
let reader = null;
let findPos = null; //如果成功查找到的位置
/*
*  查找部分
*  查找后会自动移动当前位置
* */
function findPart( part ){
    let isRepeat = part.r;
    let min = parseInt( part.s );
    let max = parseInt( part.e );
    let n = part.n;
    let width = max.toString().length;
    let res = [];
    //遍历
    for(let i = 0; i < n; i++){
        //读取一个球
        let ball = reader.get( width );
        //如果球的位数不够，说明到达文件末尾，返回null
        if( ball === null ||  ball.length < width){
            return null;
        }
        //转换位数字类型,如果不再正确区间，返回null
        ball = parseInt(ball);
        if( ball < min || ball > max ){
            return null;
        }
        //如果不允许重复，则判断是否数组存在，重复在呃返回null
        if( !isRepeat ){
            if( inArray(ball,res) ){
                return null;
            }
        }
        //球加入
        res.push( ball );
    }
    return res;
}
/*
* 尝试生成一注
* 遍历每个组成部分
* */
function createOne( kind ){
    let res = [];
    let pos = reader.getPos();
    for(let i in kind.part){
        let pRes = findPart( kind.part[i] );
        if( pRes === null ){
            return null;
        }
        else{
            res.push( pRes );
        }
    }
    findPos = pos;
    return res;
}
/*
* 生成一个随机的pos
* */
function randPos(){
    let min = 0;
    let max = reader.fileSize;
    if (max == null) {
        max = min;
        min = 0;
    }
    return min + Math.floor(Math.random() * (max - min + 1));
}
/*
* 生成入口
* */
function run( kindName,opt ){
    reset();
    let kind = kindList[ kindName ];
    let res = null;
    let error = null;
    let maxFindCount = opt.maxFindCount || 100000;
    maxFindCount = parseInt(maxFindCount);
    try{
        reader = new PIReader();
        reader.goPos( randPos() );
        while( maxFindCount-- ){
            res = createOne( kind );
            //生成成功
            if( res !== null ){
                break;
            }
            //文件到达末尾，退出生成
            if( reader.isFileEnd ){
                res = null;
                error = "FILE_END";
                break;
            }
        }
        if( maxFindCount <= 0 && !error ){
            error = "MAX_FIND";
        }
        reader.destory();
        reader = null;
        return { res,error ,findPos};
    }
    catch (e) {
        reader.destory();
        reader = null;
        return { findPos, res: null,error:e.toString() }
    }
}
/*
* 重置初始化
* */
function reset(){
    if( reader ){
        reader.destory();
        reader = null;
    }
}
/*
* 导出
* */
module.exports = run;