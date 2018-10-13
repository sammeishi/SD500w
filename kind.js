/*
* 彩票种类
* s = 号码起始
* e = 号码结束
* r = 是否可重复
* n = 数量
* */
module.exports = {
    ssq:{
        show: "双色球",
        part:[
            { s: 1, e: 33, r: false, n : 6 },
            { s: 1, e: 16, r: false, n : 1 },
        ],
    },
    pls:{
        show: "排列3",
        part:[
            { s: 0, e: 9, r: true, n : 3 },
        ],
    },
    plw:{
        show: "排列5",
        part:[
            { s: 0, e: 9, r: true, n : 5 },
        ],
    },
    dlt:{
        show: "大乐透",
        part:[
            { s: 1, e: 35, r: false, n : 5 },
            { s: 1, e: 12, r: false, n : 2 },
        ],
    },
};