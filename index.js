const fs = require('fs');
const Koa = require('koa');
const route = require('koa-route');
const staticServe = require('koa-static');
const kind = require("./kind");
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

app.use(staticServe('.'));
app.listen(500);
