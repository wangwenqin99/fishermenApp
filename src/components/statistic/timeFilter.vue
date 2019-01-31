<template>
    <div class="support">
        <div class="title">
            <p>单位：{{unit}}</p>
            <!-- <p>品种：全部<span class='u-arrow u-arrow-down'></span></p> -->
            <p><span class='catagory'>品种：</span>
                <!-- <span class='btn'>全部<span class='arrow-down'></span></span> -->
                <span class='btn'><popup-picker style='display:inline-block;' :title="title" :data="catagoryList" :columns="2"  @on-hide="isSure" @on-shadow-change='changeVal'  ref="picker3"></popup-picker><span class='arrow-down'></span></span>
            </p>
        </div>
         
        <div class="swiper-container">
            <div class="swiper-wrapper">
                <div
                    class="swiper-slide"
                    v-for='(item,index) in allChart'
                    :key='index'
                >
                    <div
                        :id="'echart'+index"
                        style="width:100%;height:350px"
                    ></div>
                </div>
            </div>
            <div
                class="swiper-button-next"
                style='outline:none;'
            ></div>
            <div
                class="swiper-button-prev"
                style='outline:none;'
            ></div>
        </div>
    </div>
</template>

<script>
import Swiper from "swiper"
import echarts from "echarts";
import { publicFun } from "../../assets/js/publicFunc.js";
import { PopupPicker } from 'vux'
export default {
    components: {
        PopupPicker
    },
    name: 'support',
    props: {
        sDate: {
            // type: String,
            default: publicFun.getThisWeekFirstDay()
        },
        eDate: {
            // type: String,
            default: new Date().valueOf()
        },
        changeIndex: {
            type: Number,
            default: 0
        },
        productType: {
            default: 1
        },
        sortType: { //成交类型  0 总单数 1 总金额 2 总斤数
            default:0
        }

    }, 
    data() {
        return {
            selectIndex: 0,
            isShow:false,
            groupType: 1,
            allChart:null,
            swiper:null,
            catagoryList: [],
            selectCatagory:[null,null],
            sureCatagory:[null,null],
            unit:'斤',
            title:'全部'
        }
    },
    watch: {
        changeIndex(newD, oldD) {
            if (oldD != newD) {
                if(this.productType == 3) {
                    this.getData2();

                }else{
                    this.getData();
                }
                // this.getAllTime();
            }
        }
    },
    methods: {
        isSure (value) {//选择品类
            if(value) {
                this.$vux.loading.show();
                this.sureCatagory = JSON.parse(JSON.stringify(this.selectCatagory))
                this.catagoryList.forEach(el=>{
                    if(el.value == this.sureCatagory[1]){
                        this.title = el.name
                    }
                })
                if(this.productType == 3) {
                    this.getData2('改变');

                }else{
                    this.getData('改变');
                }
            }
        },
        changeVal (value) {
            this.selectCatagory = value;
            console.log(value);
            
        },
        /*
        * 将一个数组分成几个同等长度的数组
        * array[分割的原数组]
        * size[每个子数组的长度]
        */
        sliceArray(array, size) {
            var result = [];
            for (var x = 0; x < Math.ceil(array.length / size); x++) {
                var start = x * size;
                var end = start + size;
                result.push(array.slice(start, end));
            }
            return result;
        },
        //获得初始月的天数
        getMonthDays() {
            let nowYear = new Date(this.sDate).getFullYear();
            let myMonth = new Date(this.sDate).getMonth();
            var monthStartDate = new Date(nowYear, myMonth, 1);
            var monthEndDate = new Date(nowYear, myMonth + 1, 1);
            var days = (monthEndDate - monthStartDate) / (1000 * 60 * 60 * 24);
            return days;
        },
        getAllTime(list) {
            let maxDay = this.getMonthDays();
            let stime = this.sDate * 1;
            let etime = this.eDate * 1;
            let allTime = parseInt((etime - stime) / (24 * 3600 * 1000)) + 1;
            let arr = []
            let smonth = new Date(this.sDate).getMonth() + 1;
            let nowMonth = smonth +1;
            let sday = new Date(this.sDate).getDate();
            if (this.groupType == 1) {//天
                this.groupType = 1;
                for (let i = 0; i < allTime; i++) {
                    let ddate = sday + i;
                    if(ddate>maxDay){
                        ddate -= maxDay;
                        smonth = nowMonth;
                    }
                    if(smonth>12){
                        smonth = 1;
                    }
                    let val = smonth + '.' + ddate;
                    let arrs = { times: val };
                    for (let j = 0; j < list.length; j++) {
                        let sm = new Date(list[j].time).getMonth() + 1;
                        let sd = new Date(list[j].time).getDate();
                        let va = sm + '.' + sd;
                        if (val == va) {
                            list[j].times = va;
                            arrs = list[j]
                        }
                    }
                    arr.push(arrs)
                }
            } else {
                this.groupType = 0;
                stime = new Date(stime).getMonth() + 1;
                etime = new Date(etime).getMonth() + 1;
                
                if (etime < stime) {
                    etime = etime + 12 - stime;
                }
                
                for (let i = 0; i <= etime; i++) {
                    let nTime = stime + i > 12 ? stime + i - 12 : stime + i;
                    let arrs = { times: nTime + '月' };
                    // let arrs = { times: stime + i + '月'};
                    for (let j = 0; j < list.length; j++) {
                        list[j].times = new Date(list[j].monthTime).getMonth() + 1 + '月';
                        
                        if (arrs.times == list[j].times) {

                            arrs = list[j]
                        }
                    }
                    arr.push(arrs);
                }
            }
            console.log(arr);
            
            return arr;
        },
        getAllTime2(list) {
            let maxDay = this.getMonthDays();
            let stime = this.sDate * 1;
            let etime = this.eDate * 1;
            let allTime = parseInt((etime - stime) / (24 * 3600 * 1000)) + 1;
            let arr = []
            let smonth = new Date(this.sDate).getMonth() + 1;
            let nowMonth = smonth +1;
            let sday = new Date(this.sDate).getDate();
            if (this.groupType == 1) {//天
                this.groupType = 1;
                for (let i = 0; i < allTime; i++) {
                    let ddate = sday + i;
                    if(ddate>maxDay){
                        ddate -= maxDay;
                        smonth = nowMonth;
                    }
                    if(smonth>12){
                        smonth = 1;
                    }
                    let val = smonth + '.' + ddate;
                    let arrs = { times: val };
                    for (let j = 0; j < list.length; j++) {
                        let sm = new Date(list[j].orderTime).getMonth() + 1;
                        let sd = new Date(list[j].orderTime).getDate();
                        let va = sm + '.' + sd;
                        if (val == va) {
                            list[j].times = va;
                            arrs = list[j]
                        }
                    }
                    arr.push(arrs)
                }
            } else {
                this.groupType = 0;
                stime = new Date(stime).getMonth() + 1;
                etime = new Date(etime).getMonth() + 1;
                
                if (etime < stime) {
                    etime = etime + 12 - stime;
                }
                
                for (let i = 0; i <= etime; i++) {
                    let nTime = stime + i > 12 ? stime + i - 12 : stime + i;
                    let arrs = { times: nTime + '月' };
                    // let arrs = { times: stime + i + '月'};
                    for (let j = 0; j < list.length; j++) {
                        list[j].times = new Date(list[j].orderMonth).getMonth() + 1 + '月';
                        
                        if (arrs.times == list[j].times) {

                            arrs = list[j]
                        }
                    }
                    arr.push(arrs);
                }
            }
            console.log(arr);
            
            return arr;
        },
        getData(callback) {
            let stime = this.sDate * 1;
            let etime = this.eDate * 1;
            let allTime = parseInt((etime - stime) / (24 * 3600 * 1000)) + 1;
            if (allTime < 32) {
                this.groupType = 1;
            } else {
                this.groupType = 0;
            }
            let pa = {
                token: window.localStorage.getItem('token'), //凭证 必填
                sortType: 201,
                startTime: this.sDate,
                endTime: this.eDate,
                productType: this.productType,
                groupType: this.groupType,//0：按月日期 1：按天日期
                catPid:this.sureCatagory[0],
                catId:this.sureCatagory[1],
                // pageIndex:1,
                // pageSize:10
            };
            this.$get(this.$apiUrl.statistics, pa, res => {
                this.$emit('getIndex');
                if(callback) {
                    this.$vux.loading.hide();
                }
                let arrs = this.getAllTime(res.list);
                let allChart = this.sliceArray(arrs,7);
                this.allChart = allChart;
                for (let index = 0; index < this.allChart.length; index++) {
                    let titleList = [];
                    let valueList = [];
                    this.allChart[index].forEach(el => {
                        titleList.push(el.times)
                        valueList.push(el.quantity || 0)
                    })
                    setTimeout(() => {
                        let dom = document.getElementById('echart' + index);
                        let myChart = echarts.init(dom);
                        // 绘制图表
                        myChart.setOption({
                            title: {
                                x: "center"
                            },

                            tooltip: {},
                            xAxis: {
                                data: titleList,
                                axisTick: {//去除刻度
                                    show: false
                                },
                                axisLine: {
                                    lineStyle: {
                                        type: 'solid',
                                        color: '#ddd',//左边线的颜色
                                        // width:'.5'//坐标线的宽度
                                    }
                                },
                                axisLabel: {
                                    textStyle: {
                                        color: '#999',//坐标值得具体的颜色
                
                                    }
                                }
                                

                            },
                            yAxis: {
                                axisTick: {//去除刻度
                                    show: false
                                },
                                splitLine:{//去掉网格线
                                    show:false
                                },
                                show:false
                            },
                            series: [{
                                name: '销量',
                                type: 'bar',
                                data: valueList,
                                barWidth: 30,
                                itemStyle:{
                                    normal:{
                                        color:'#3B8BFC',
                                        }
                                },
                                label: {
                                    normal: {
                                        show: true,
                                        position: 'top',
                                        formatter: function (params) {
                                            //如果值大于0 正常显示，否则不显示
                                            if (params.value > 0) {	
                                                return params.value;
                                            } else {
                                                return '';
                                            }
                                        },
                                    },
                                },

                            }],
                            
                        });
                    }, 1);
                }
            });
        },

        getData2(callback) {
            if(this.sortType == 0) {
                this.unit = '笔'
            }else if(this.sortType == 1) {
                this.unit = '元'
            }else{
                this.unit = '斤'
            }
            let stime = this.sDate * 1;
            let etime = this.eDate * 1;
            let allTime = parseInt((etime - stime) / (24 * 3600 * 1000)) + 1;
            let groupType = 0;
            if (allTime < 32) {
                this.groupType = 1;
                groupType = 0;
            } else {
                this.groupType = 0;
                groupType = 1;
            }
            let pa = {
                token: window.localStorage.getItem('token'), //凭证 必填
                // sortType: 201,
                start: this.sDate,
                end: this.eDate,
                // productType: this.productType,
                sortType:this.sortType,
                timeType: groupType,//0 天 1 月
                fcatId:this.sureCatagory[0],
                catId:this.sureCatagory[1],
                // pageIndex:1,
                // pageSize:10
            };
            this.$get(this.$apiUrl.catdayaccount, pa, res => {
                this.$emit('getIndex');
                if(callback) {
                    this.$vux.loading.hide();
                }
                let arrs = this.getAllTime2(res.list);
                let allChart = this.sliceArray(arrs,7);
                this.allChart = allChart;
                for (let index = 0; index < this.allChart.length; index++) {
                    let titleList = [];
                    let valueList = [];
                    this.allChart[index].forEach(el => {
                        titleList.push(el.times)
                        if(this.sortType == 0) {
                            valueList.push(el.totalOrderCount || 0)
                        }else if(this.sortType == 1) {
                            valueList.push(el.totalMoneyCount || 0)
                        }else{
                            valueList.push(el.totalQuantityCount || 0)
                        }
                    })
                    setTimeout(() => {
                        let dom = document.getElementById('echart' + index);
                        let myChart = echarts.init(dom);
                        // 绘制图表
                        myChart.setOption({
                            title: {
                                x: "center"
                            },

                            tooltip: {},
                            xAxis: {
                                data: titleList,
                                axisTick: {//去除刻度
                                    show: false
                                },
                                axisLine: {
                                    lineStyle: {
                                        type: 'solid',
                                        color: '#ddd',//左边线的颜色
                                        // width:'.5'//坐标线的宽度
                                    }
                                },
                                axisLabel: {
                                    textStyle: {
                                        color: '#999',//坐标值得具体的颜色
                
                                    }
                                }
                                

                            },
                            yAxis: {
                                axisTick: {//去除刻度
                                    show: false
                                },
                                splitLine:{//去掉网格线
                                    show:false
                                },
                                show:false
                            },
                            series: [{
                                name: '销量',
                                type: 'bar',
                                data: valueList,
                                barWidth: 30,
                                itemStyle:{
                                    normal:{
                                        color:'#3B8BFC',
                                        }
                                },
                                label: {
                                    normal: {
                                        show: true,
                                        position: 'top',
                                        formatter: function (params) {
                                            //如果值大于0 正常显示，否则不显示
                                            if (params.value > 0) {	
                                                return params.value;
                                            } else {
                                                return '';
                                            }
                                        },
                                    },
                                },

                            }],
                            
                        });
                    }, 1);
                }
            });
        },

        //获取全部品类
        getCatagoryParent() {
            let pa = {
                token:window.localStorage.getItem('token'),
                isAll:1
            }
            this.$get(this.$apiUrl.getCatagory, pa, (data) => {
                let pArr = [];
                let cArr = [];
                data.list.forEach(el=>{
                    let item = {
                        value:el.id + '',
                        parent:el.pid + '',
                        name:el.name + ''
                    }
                    pArr.push(item)
                    el.child = el.child || []
                    el.child.forEach(ele=>{
                        let element = {
                            value:ele.id + '',
                            parent:ele.pid + '',
                            name:ele.name + ''
                        }
                        cArr.push(element);
                    })
                })
                this.catagoryList = pArr.concat(cArr);
            })
        }

    },
    mounted() {
        console.log(this.productType);
        
        if(this.productType == 3) {
            
            this.getData2();
        }else{
            this.getData();
        }
        this.getCatagoryParent()
        var _this = this;
        this.swiper = new Swiper('.swiper-container', {
            observer:true,
            observeParents:true,
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
            on: {
                slideChange: function () {
                    console.log(_this.swiper.activeIndex);
                    _this.selectIndex = _this.swiper.activeIndex
                }
            }
        });
        
            
        

        
        
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
@col:#666666;
@bgc:#3B8BFC;
.support {
    background:#fff;
    .title {
        height: 44px;
        padding: 3px 20px 0 19px;
        border-bottom: 1px solid #E6E6E6;
        display: flex;
        justify-content: space-between;
        align-items: center;
        color: @col;
        font-size: 14px;
        p{
            // height:20px;
            // line-height: 20px;
            .btn{
                display: inline-block;
                color:#ffffff;
                background:@bgc;
                padding:0px 10px;
                border-radius: 15px;
                
            }
            .catagory{
                vertical-align: top;
                height:20px;
                line-height: 20px;
            }
        }
        
        // span {
        //     vertical-align: top;
        //     margin-left: 5px;
        // }
    }
}
.u-arrow {
    display: inline-block;
    width: 7px;
    height: 7px;
    border-top: 1px solid #999;
    border-right: 1px solid #999;
}
.u-arrow-down {
    transform: rotate(135deg);
}
.arrow-down{
    display:inline-block;
    width: 0;
    height: 0;
    border-left: 4px solid transparent;
    border-right: 4px solid transparent;
    border-top: 4px solid #ffffff;
    vertical-align: top;
    margin-top: 9px;
    // margin-left:3px;
    
}
</style>
