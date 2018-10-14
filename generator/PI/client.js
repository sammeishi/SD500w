/*
* PI圆周率取值
* 服务端执行
* */
define(function(){
    return class{
        run(){
            let that = this;
            this.ajaxer = $.ajax({
                url:"generator/server",
                method:"GET",
                dataType:"json",
                data:{ name:"PI", kind: this.kindName },
                success:function( res ){
                    let pos = $.isNumeric(res.findPos) ? (res.findPos/10000).toFixed(2) : 0;
                    let posUnit = "万";
                    if( pos > 10000 ){
                        pos = (pos / 10000).toFixed(2);
                        posUnit = "亿";
                    }

                    let msg = "在" + pos + posUnit  + "处找到！";
                    if( res.res === null ){
                        msg = "无法搜索到！";
                    }
                    that.onFinish(res.res || [],msg );
                },
                error:function(){
                    that.onFinish( [] ,"发生错误！" );
                }
            });
        }
        stop(){
            this.ajaxer.abort();
            this.onFinish( [] ,"您停止了！" );
        }
    }
});