const fs = require('fs');
const Koa = require('koa');
const route = require('koa-route');
const staticServe = require('koa-static');
const kind = require("./kind");
const queryString = require('query-string');
const app = new Koa();

/*
* 输出全局配置
* 彩票终类信息
* 生成器算法信息列表
* */
app.use(route.get('/global/conf', function( ctx ){
    let gconf = { kind,generator:{} };
    let generatorPath = "./generator/";
    fs.readdirSync(generatorPath).forEach(g => {
        let info = JSON.parse(fs.readFileSync(generatorPath + g + "/info.json", 'utf8'));
        gconf.generator[g] = info;
    });
    ctx.response.type = '.js';
    ctx.response.body = `(function( global ){ global.GCONF = ${ JSON.stringify(gconf) } })( window || {} );`;
}));
/*
* 服务端生成器调用
* */
app.use(route.get('/generator/server', function( ctx ){
    let urlParams = queryString.parseUrl(ctx.url);
    let name = urlParams.query.name || null;
    let kind = urlParams.query.kind || null;
    let opt = urlParams.query.opt || "{}";
    let generatorFile = __dirname + "/generator/" + name + "/server.js";
    if( !kind || !name || !fs.existsSync( generatorFile ) ){
        ctx.status = 404;
    }
    else{
        let generator = require( generatorFile );
        ctx.response.body = generator(kind,JSON.parse(opt));
    }
}));

app.use(staticServe('.'));
app.listen(500);
