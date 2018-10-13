/*
* 随机生成
* 客户端执行
* 依赖lodash
* */
define(function(){
    let defOpt = {
        batchInterval: 1,
        batchSize: 1666, //每批生成大小
        count: 1000000, //随机的次数,默认1万次
    };
    //随机生成
    let rand = function(start,end,num,canRepeat){
        let res = [];
        let nList = [];
        let shuffle = _.shuffle;
        for(let i = start,n = end; i <= n; i++){
            let nnn = i;
            if( nnn < 10 ){
                nnn = "0" + nnn;
            }
            nList.push( nnn );
        }
        let L = Array.from(nList);
        for (let i = 0,n = num; i < n; i++){
            //如果允许重复，则每次生成一个新的数字序列
            if( canRepeat ){
                L = Array.from(nList);
            }
            L = shuffle( L );
            res.push( L.shift() );
        }
        return res;
    };
    //获取一个随机种类
    function getRandByKind(kind){
        let res = [];
        for(let i = 0,n = kind.part.length; i < n ;i++){
            let part = kind.part[i];
            res.push(rand( part.s,part.e,part.n,part.r ));
        }
        return res;
    }
    /*
    * 核心实现类
    * */
    class core{
        onProgress(count,p,res){}
        onFinish( res ){}
        onError(){}
        /*
        * 开始运行
        * */
        run(){
            let opt = _.extend({},defOpt,this.opt);
            let kind = this.kind;
            let allCount = parseInt(opt.count);
            let batchCount = Math.ceil(opt.count / opt.batchSize);
            let count = 0;
            let that = this;
            this.timer = null;
            function batch(){
                let i = 0;
                let res = null;
                while( (i++) < opt.batchSize && (count++) < allCount){
                    res = getRandByKind( kind );
                    that.onProgress(count,(count/allCount * 100).toFixed(0),res);
                }
                //结束
                if( (count) >= allCount ){
                    that.onFinish(res);
                }
                else if( batchCount-- ){
                    that.timer = setTimeout(batch,opt.batchInterval);
                }
            }
            batch();
        }
        /*
        * 停止运行
        * */
        stop(){
            this.onProgress = function(){};
            this.onError = function(){};
            this.onFinish = function(){};
            if( this.timer ){
                clearTimeout(this.timer);
                this.timer = null;
            }
        }
    }
    /*
    * 导出类
    * */
    return core;
});