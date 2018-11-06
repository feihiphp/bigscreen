var todayTakePriceChart = echarts.init(document.getElementById('todayTakePrice'));//初始化分时流量
var HotPriceChart = echarts.init(document.getElementById('HotPriceChart'));//初始化店内热度
var OtheroptionChart = echarts.init(document.getElementById('OtheroptionChart'));//初始化互动游戏与视频
var peopleStatroptionChart = echarts.init(document.getElementById('peopleStatroptionChart'));//初始化人群分布
var joinShopChart = echarts.init(document.getElementById('joinShopChart'));//初始化今日进店
// var basepath = "http://192.168.0.200:8080/hourStatistics";
Date.prototype.format = function (fmt) { //author: meizz
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}
// 获取指定的URL参数值 
// var cl;
// var st;
// function showWindowHref(sHref) {
//     var args = sHref.split('?');
//     if(args[0]== sHref){
//         return "";
//     }
//     var arr = args[1].split('&');
//     var obj = {};
//     for (var i = 0; i < arr.length; i++) {
//         var arg = arr[i].split('=');
//         // console.log(arg)
//         obj[arg[0]] = arg[1];                
//     }
//     return obj;
// }

// // var strUrl="http://www.book.com/jquery/bookmannger.html?channelid=12333&age=23";   //url例子
// var strUrl=window.location.href;
// var resultobj=showWindowHref(strUrl);
// var list=[];
// for(var key in resultobj){
//     // console.log(key+":"+resultobj[key]);
//     // console.log(key)
//     if (key=="clientId") {
//         cl=resultobj[key];
//     } else if(key=="storeId"){
//         st=resultobj[key];
//     }
//     var parameter = resultobj[key];
//     var Obj = {};
//     if (parameter=='') {
//             alert("无法获取参数")
//     }else{
//         Obj = resultobj[key];
//         list.push(Obj);
//     }

// }
// $.ajax({
//     type: 'get',
//     url: '',
//     dataType:'JSONP',
//     data: {
//         storeId: st,
//         clientId: cl,
//     },
//     success: function (data) {
//         console.log("成功")
//     },
//     error: function(data){
//         console.log("失败")
//     }
// });
// 分时流量
optionLine = {
    title: {
        text: '',
        subtext: ''
    },
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            type: 'cross',
            label: {
                backgroundColor: '#6a7985'
            }
        }
    },
    legend: {
        data:['分时人数'],
        right:60,
        top:0,
        textStyle:{//图例文字的样式
            color:'#fff',
            fontSize:12
        }
    },
    xAxis:  {
        type: 'category',
        boundaryGap: false,
        data: ["00:00","01:00","02:00","03:00","04:00","05:00"],
        splitLine:{show: false},
        axisLine: {
            show: true,
            lineStyle: {
                color: '#233876'
            }
        },
        axisLabel : {
            textStyle: {
                color: '#fff'
            }
        }
    },
    yAxis: {
        type: 'value',
        data: [12,5,2,24,52,24],
        splitLine:{show: false},
        axisLine: {
            show: true,
            lineStyle: {
                color: '#233876'
            }
        },
        axisLabel : {
            textStyle: {
                color: '#fff'
            }
        }
    },
    series: [
        {
            name:'分时人数',
            type:'line',
            data:[],
            markPoint: {
                data: [
                    {type: 'max', name: '最大值'},
                    {type: 'min', name: '最小值'}
                ]
            },
            smooth:true,
            symbol: 'circle',
            symbolSize:10,
            itemStyle: {
                normal: {
                    color: '#ae8407',
                    shadowBlur: 10,
                    shadowColor: '#fff'
                }
            },
            areaStyle: {normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                    offset: 0,
                    color: '#3f0b39'
                }, {
                    offset: 1,
                    color: 'rgba(29,26,63,11)'
                }]),
            }},
        }
    ]
};
//人群充值
$.ajax({
    type: 'get',
    url: basepath + '/selectTimeSharingTrafficNumbers',
    dataType:'JSONP',
    // contentType: "application/json;charset=utf-8",
    data:{
        storeId: st,
        clientId: cl,
        'datetime': new Date(),
    },
    success: function (data) { 
        console.log(data.data)
        if (data.code) {
            return ;
        }
        for(var i=0;i<data.data.length;i++){   
            var count=data.data[i].count;   
            if (count==null || count==0) {
                count=0;
            } 
            optionLine.series[0].data.push(count);    //依次取出人群个数
        }
        //循环显示x坐标
        for(var i=0;i<data.data.length;i++){
                if (i>=10) {
                    var ii =String(i+":00");
                    // console.log(ii)
                    optionLine.xAxis.data.push(ii);
                }
                if(i<10){
                    var ii =String( "0" + i+":00");
                    optionLine.xAxis.data.push(ii);
                //   console.log(ii)
                }
            }
            // console.log(optionLine.xAxis.data)
            todayTakePriceChart.setOption(optionLine);
    },
    error: function(data){
    }
});

// 店内热区开始
var data=[{value:335, name:'饮料区',itemStyle: {color: '#049b93'}},
          {value:120, name:'日货区',itemStyle: {color: '#0888c1'}},
          {value:200, name:'零食区',itemStyle: {color: '#0941be'}},
          {value:150, name:'生鲜区',itemStyle: {color: '#4b2c92'}},
   ]
//这里才是关键整去掉下半部分的关键，
//计算data中value的总和
var a=0;
for(var i=0; i<data.length; i++)
{
  a+=data[i].value;
}
data.push({value:a, name:'__other', itemStyle:{normal:{color:'rgba(0,0,0,0)'}}});
console.log(data);

optionHotPlace = { //店内热区
    tooltip : {
        trigger: 'item',
        formatter: "{a} <br/>{b} : {c} ({d}%)"
    },
    legend: {
        data:['饮料区','日货区','零食区','生鲜区'],
        right:40,
        top:0,
        orient: 'vertical',
        textStyle:{//图例文字的样式
            color:'#fff',
            fontSize:12
        }
    },
    series : [
        {
            name: '访问来源',
            type: 'pie',
            startAngle:180,
            radius :  ['60%', '100%'],
            center: ['50%', '90%'],
            data:data,
            itemStyle: {
                emphasis: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
            }
        }
    ]
};
// 店内热区结束

// 互动游戏与视频开始


var colors = ['#0941be', '#ae8407'];
Otheroption = {
    color: colors,
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            type: 'cross'
        }
    },
    grid: {
        left: '20%'
    },
    legend: {
        data:['广告视频','互动游戏'],
        right:40,
        top:0,
        textStyle:{//图例文字的样式
            color:'#fff',
            fontSize:12
        }
    },
    xAxis: [
        {
            type: 'category',
            axisTick: {
                alignWithLabel: true
            },
            splitLine:{show: false},//去掉网格线
            data: ['7:00','10:00','13:00','16:00','19:00'],
            axisLabel : {
                textStyle: {
                    color: '#fff'
                }
            }
        }
    ],
    yAxis: [
        {
            type: 'value',
            name: '广告视频',
            min: 0,
            max: 300,
            position: 'left',
            splitLine:{show: false},//去掉网格线
            axisLine: {
                lineStyle: {
                    color: colors[0],
                }
            },
            axisLabel: {
                formatter: '{value}'
            }
        },
        {
            type: 'value',
            name: '互动游戏',
            min: 0,
            max: 300,
            position: 'left',
            offset: 60,
            splitLine:{show: false},//去掉网格线
            axisLine: {
                lineStyle: {
                    color: colors[1],
                }
            },
            axisLabel: {
                formatter: '{value}'
            }
        },
    ],
    series: [
        {
            name:'广告视频',
            type:'bar',
            data:[10, 160, 50, 200, 100],
            barWidth : 20
        },
        {
            name:'互动游戏',
            type:'bar',
            yAxisIndex: 1,
            data:[100, 60, 90, 120, 60],
            barWidth : 20,
            
        },
    ]
};
//互动游戏与视频结束



// 人群分布开始
Peoplestartoption = {
    tooltip : {
        trigger: 'axis',
        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
        }
    },
    legend: {
        data:[ '先生', '女士'],
        textStyle:{//图例文字的样式
            color:'#fff',
            fontSize:12
        }
    },
    grid: {
        left: '3%',
        bottom: '3%',
        containLabel: true
    },
    xAxis : [
        {
            type : 'value',
            splitLine:{show: false},//去掉网格线
            axisLabel : {
                textStyle: {
                    color: '#fff'
                }
            }
        }
    ],
    yAxis : [
        {
            type : 'category',
            axisTick : {show: false},
            data : ['青少年','中年','老年'],
            splitLine:{show: false},//去掉网格线
            axisLabel : {
                textStyle: {
                    color: '#fff'
                }
            }
        }
    ],
    series : [
        {
            name:'先生',
            type:'bar',
            stack: '总量',
            label: {
                normal: {
                    show: true
                }
            },
            data:[ -374, -390, -450],
            barWidth : 50,
            color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [{
                offset: 0,
                color: '#0941be'
            }, {
                offset: 1,
                color: '#0941be'
            }]),
        },
        {
            name:'女士',
            type:'bar',
            stack: '总量',
            label: {
                normal: {
                    show: true,
                    position: 'left'
                }
            },
            data:[134, 190, 230],
            barWidth : 50,
            
            color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [{
                        offset: 0,
                        color: '#ae8407'
                    }, {
                        offset: 1,
                        color: '#ae8407'
                    }]),
        }
    ]
};


// 人群分布结束

// 人群分布

// $.ajax({
//     type: 'get',
//     url: basepath + '/selectPopulationDistributionNumbers',
//     dataType:'JSONP',
//     data: {
//         storeId: st,
//         clientId: cl,
//         'date': (new Date()).format('yyyy-MM-dd'),
//     },
//     success: function (data) {
//         if (data.code) {
//             return ;
//         }
//         // console.log(data.data[0].youthMale)
//         // console.log(data.data[0].middleMale)
//         // console.log(data.data[0].oldMale)
//         // console.log(data.data[0].youthFemale)
//         // console.log(data.data[0].middleFemale)
//         // console.log(data.data[0].oldFemale)
//         // console.log(Peoplestartoption.series[0].data[0])
//         Peoplestartoption.series[0].data[0]=data.data[0].youthMale;
//         Peoplestartoption.series[0].data[1]=data.data[0].middleMale;
//         Peoplestartoption.series[0].data[2]=data.data[0].oldMale;

//         Peoplestartoption.series[1].data[0]=data.data[0].youthFemale;
//         Peoplestartoption.series[1].data[1]=data.data[0].middleFemale;
//         Peoplestartoption.series[1].data[2]=data.data[0].oldFemale;
//         peopleStatroptionChart.setOption(Peoplestartoption);
//     },
//     error: function(data){
//         console.log(1)
//     }
// });


//今日进店人数

option = {
    series: [
    {
    name: '购物转化率',
    type: 'pie',
    radius: ['25%', '30%'],
    center:['15%','20%'],
    color:'#049b93',
    label: {
        normal: {
            position: 'center'
        }
    },
    data: [{
        value: 32,
        name: '吊销注销数',
        label: {
            normal: {
                formatter: '{d} %',
                textStyle: {
                    fontSize: 20,
                    fontFamily:'impact'
                },
                 
            },

        },
    }, {
        value: 72,
        name: '其他类型数',
        label: {
            normal: {
                formatter: '\n购物转化率',
                textStyle: {
                    color: '#fff',
                    fontSize: 14,
                },
                
            }
        },
        itemStyle: {
            normal: {
                color: '#989898'
            },
            emphasis: {
                color: '#989898'
            }
        },
    }]
    },{
        name: '停留时间',
        type: 'pie',
        radius: ['25%', '30%'],
        center:['40%','20%'],
        color:'#0888c1',
        label: {
            normal: {
                position: 'center'
            }
        },
        data: [{
            value: 54,
            name: '停留时间',
            
            label: {
                normal: {
                    formatter: '{d} %',
                    textStyle: {
                        fontSize: 20,
                        fontFamily:'impact'
                    }
                }
            },
        }, {
            value: 50,
            name: '其他类型数',
            label: {
                normal: {
                    formatter: '\n停留时间',
                    textStyle: {
                        color: '#fff',
                        fontSize: 14
                    }
                }
            },
            itemStyle: {
                normal: {
                    color: '#989898'
                },
                emphasis: {
                    color: '#989898'
                }
            },
        }]
    },{
        name: '女性用户',
        type: 'pie',
        radius: ['25%', '30%'],
        center:['63%','20%'],
        color:'#4b2c92',
        label: {
            normal: {
                position: 'center'
            }
        },
        data: [{
            value: 10,
            name: '女性用户',
            
            label: {
                normal: {
                    formatter: '{d} %',
                    textStyle: {
                        fontSize: 20,
                        fontFamily:'impact'
                    }
                }
            },
            tooltip:{
                 trigger: 'item',
                 formatter: "{a} <br/>计算公式:占比率=({b}/注销总数)*100%<br/> 申请注销数 : {c}"
            }
        }, {
            value: 10,
            name: '其他类型数',
            label: {
                normal: {
                    formatter: '\n女性用户',
                    textStyle: {
                        color: '#fff',
                        fontSize: 14
                    }
                }
            },
            itemStyle: {
                normal: {
                    color: '#989898'
                },
                emphasis: {
                    color: '#989898'
                }
            },
        }]
    },{
        name: '男性用户',
        type: 'pie',
        radius: ['25%', '30%'],
        center:['87%','20%'],
        color:'#4b2c92',
        label: {
            normal: {
                position: 'center'
            }
        },
        data: [{
            value: 10,
            name: '男性用户',
            
            label: {
                normal: {
                    formatter: '{d} %',
                    textStyle: {
                        fontSize: 20,
                        fontFamily:'impact'
                    }
                }
            },
        }, {
            value: 10,
            name: '其他类型数',
            label: {
                normal: {
                    formatter: '\n男性用户',
                    textStyle: {
                         color: '#fff',
                        fontSize: 14
                    }
                }
            },
            itemStyle: {
                normal: {
                    color: '#989898'
                },
                emphasis: {
                    color: '#989898'
                }
            },
        }]
    },{
        name: '老用户',
        type: 'pie',
        radius: ['25%', '30%'],
        center:['15%','65%'],
        color:'#0941be',
        label: {
            normal: {
                position: 'center'
            }
        },
        data: [{
            value: 34,
            name: '老用户',
            
            label: {
                normal: {
                    formatter: '{d} %',
                    textStyle: {
                        fontSize: 20,
                        fontFamily:'impact'
                    }
                }
            },
        }, {
            value: 66,
            name: '其他类型数',
            label: {
                normal: {
                    formatter: '\n老用户',
                    textStyle: {
                        color: '#fff',
                        fontSize: 14
                    }
                }
            },
            itemStyle: {
                normal: {
                    color: '#989898'
                },
                emphasis: {
                    color: '#989898'
                }
            },
        }]
    },{
        name: '新用户',
        type: 'pie',
        radius: ['25%', '30%'],
        center:['40%','65%'],
        color:'#0941be',
        label: {
            normal: {
                position: 'center'
            }
        },
        data: [{
            value: 66,
            name: '申请注销数2',
            
            label: {
                normal: {
                    formatter: '{d} %',
                    textStyle: {
                         fontSize: 20,
                         fontFamily:'impact'
                    }
                }
            },
        }, {
            value: 34,
            name: '其他类型数',
            label: {
                normal: {
                    formatter: '\n新用户',
                    textStyle: {
                        color: '#fff',
                        fontSize: 14
                    }
                }
            },
            itemStyle: {
                normal: {
                    color: '#989898'
                },
                emphasis: {
                    color: '#989898'
                }
            },
        }]
    },{
        name: 'IOS',
        type: 'pie',
        radius: ['25%', '30%'],
        center:['63%','65%'],
        color:'#ae8407',
        label: {
            normal: {
                position: 'center'
            }
        },
        data: [{
            value: 18,
            name: 'IOS',
            
            label: {
                normal: {
                    formatter: '{d} %',
                    textStyle: {
                         fontSize: 20,
                         fontFamily:'impact'
                    }
                }
            },
        }, {
            value: 86,
            name: '其他类型数',
            label: {
                normal: {
                    formatter: '\nIOS',
                    textStyle: {
                        color: '#fff',
                        fontSize: 14
                    }
                }
            },
            itemStyle: {
                normal: {
                    color: '#989898'
                },
                emphasis: {
                    color: '#989898'
                }
            },
        }]
    },{
        name: '安卓',
        type: 'pie',
        radius: ['25%', '30%'],
        center:['87%','65%'],
        color:'#ae8407',
        label: {
            normal: {
                position: 'center'
            }
        },
        data: [{
            value: 18,
            name: '安卓',
            
            label: {
                normal: {
                    formatter: '{d} %',
                    textStyle: {
                        fontSize: 20,
                        fontFamily:'impact'
                    }
                }
            },
        }, {
            value: 86,
            name: '其他类型数',
            label: {
                normal: {
                    formatter: '\n安卓',
                    textStyle: {
                        color: '#fff',
                        fontSize: 14
                    }
                }
            },
            itemStyle: {
                normal: {
                    color: '#989898'
                },
                emphasis: {
                    color: '#989898'
                }
            },
        }]
    }]
};
// // 获取女性个数
// $.ajax({
//     type: 'get',
//     url: basepath + '/selectFemaleNumbers',
//     dataType:'JSONP',
//     data: {
//         storeId: st,
//         clientId: cl,
//         'date': (new Date()).format('yyyy-MM-dd'),
//     },
//     success: function (data) {
//         if (data.code) {
//             return ;
//         }
//               option.series[2].data[0].value=data.data;
//               option.series[3].data[1].value=data.data;
//               joinShopChart.setOption(option);
//     },
//     error: function(data){
//     }
// });
// // 获取男性个数
// $.ajax({
//     type: 'get',
//     url: basepath + '/selectMaleNumbers',
//     dataType:'JSONP',
//     data: {
//         storeId: st,
//         clientId: cl,
//         'date': (new Date()).format('yyyy-MM-dd'),
//     },
//     success: function (data) {
//         if (data.code) {
//             return ;
//         }
//               option.series[2].data[1].value=data.data;
//               option.series[3].data[0].value=data.data;
//               joinShopChart.setOption(option);
//     },
//     error: function(data){
//     }
// });
// // 获取ios个数
// $.ajax({
//     type: 'get',
//     url: basepath + '/selectIPhoneNumbers',
//     dataType:'JSONP',
//     data: {
//         storeId: st,
//         clientId: cl,
//         'date': (new Date()).format('yyyy-MM-dd'),
//     },
//     success: function (data) {
//         if (data.code) {
//             return ;
//         }
//               option.series[6].data[0].value=data.data;
//               option.series[7].data[1].value=data.data;
//               joinShopChart.setOption(option);
//     },
//     error: function(data){
//     }
// });
// // 获取androidr使用人数个数
// $.ajax({
//     type: 'get',
//     url: basepath + '/selectAndroidNumbers',
//     dataType:'JSONP',
//     data: {
//         storeId: st,
//         clientId: cl,
//         'date': (new Date()).format('yyyy-MM-dd'),
//     },
//     success: function (data) {
//         if (data.code) {
//             return ;
//         }
//               option.series[6].data[1].value=data.data;
//               option.series[7].data[0].value=data.data;
//               joinShopChart.setOption(option);
//     },
//     error: function(data){
//     }
// });
joinShopChart.setOption(option);
todayTakePriceChart.setOption(optionLine);
HotPriceChart.setOption(optionHotPlace);
OtheroptionChart.setOption(Otheroption);
peopleStatroptionChart.setOption(Peoplestartoption);