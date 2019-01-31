<template>
    <div class="support">
        <div class="title">
            <p>
                <span v-show='productType == 1'>区域供应</span>
                <span v-show='productType == 2'>区域求购</span>
                <span v-show='productType == 3'>区域成交</span>
                <span class='right-text'>/单位：{{unit}} </span></p>
            <p @click='gotoDetail'>更多<span class='u-arrow u-arrow-right'></span></p>
        </div>
        <div
            v-show='charList.length > 0'
            class="swiper-container"
        >
            <div class="swiper-wrapper">
                <div
                    class="swiper-slide"
                    v-for='(item,index) in allChart'
                    :key='index'
                >
                    <div
                        :id="'ech'+index"
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
        <div
            class='empty'
            v-show='charList.length == 0'
        >暂无数据。。。</div>
    </div>
</template>

<script>
import echarts from "echarts";
import Swiper from "swiper"
import { publicFun } from "../../assets/js/publicFunc.js";
export default {
    components: {
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
            default: 0
        }

    },
    data() {
        return {
            swiper: null,
            selectIndex: 0,
            allChart: null,
            unit: '斤',
            charList: []
        }
    },
    watch: {
        changeIndex(newD, oldD) {
            if (oldD != newD) {
                if (this.productType == 3) {
                    this.getData2();
                } else {
                    this.getData();
                }
            }
        }

    },
    methods: {
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
        gotoDetail() {
            // productType  1：供应 2：求购
            // groupType   2品类   6区域
            // sortType  成交类型  0 总单数 1 总金额 2 总斤数
            this.$router.push({ path: '/filterList', query: { productType: this.productType, groupType: 6, sortType: this.sortType } })
        },
        getData() {
            let pa = {
                token: window.localStorage.getItem('token'), //凭证 必填
                sortType: 201,
                productType: this.productType,
                startTime: this.sDate,
                endTime: this.eDate,
                groupType: 6,
            };
            this.$get(this.$apiUrl.statistics, pa, res => {
                this.$emit('getIndex');
                this.charList = res.list;
                let allChart = this.sliceArray(res.list, 5);
                this.allChart = allChart;

                for (let index = 0; index < allChart.length; index++) {
                    let titleList = [];
                    let valueList = []
                    allChart[index].forEach(el => {
                        valueList.push(el.quantity || 0)
                        titleList.push(el.cityName + el.districtName || '未知')
                    })
                    setTimeout(() => {
                        let dom = document.getElementById('ech' + index);
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
                                    }
                                },
                                axisLabel: {
                                    show: true,
                                    interval: 0,
                                    rotate: 45,
                                    textStyle: {
                                        color: '#999',//坐标值得具体的颜色
                                        fontSize:12
                                    },
                                    formatter: function (value) {
                                        // console.log(value);
                                        var valueDetal = value.split("-").join("");
                                        // console.log(valueDetal);
                                        var ret = ""; //拼接加\n返回的类目项  
                                        var maxLength = 6; //每项显示文字个数  
                                        var valLength = valueDetal.length; //X轴类目项的文字个数
                                        // console.log(valLength);
                                        var rowN = Math.ceil(valLength / maxLength); //类目项需要换行的行数 
                                        if (rowN > 1) { //如果类目项的文字大于3,
                                            // for (var i = 0; i < rowN; i++) {
                                                var temp = ""; //每次截取的字符串  
                                                var start = 0 * maxLength; //开始截取的位置  
                                                var end = start + 5; //结束截取的位置  
                                                //这里也可以加一个是否是最后一行的判断，但是不加也没有影响，那就不加吧  
                                                temp = valueDetal.substring(start, end) + "...\n";
                                                ret = temp; //凭借最终的字符串  
                                            // }
                                            return ret;
                                        } else {
                                            return valueDetal;
                                        }
                                    }
                                }


                            },
                            yAxis: {
                                axisTick: {//去除刻度
                                    show: false
                                },
                                splitLine: {//去掉网格线
                                    show: false
                                },
                                show: false
                            },
                            series: [{
                                name: '销量',
                                type: 'bar',
                                data: valueList,
                                barWidth: 30,
                                itemStyle: {
                                    normal: {
                                        color: '#3B8BFC',
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
                            }]
                        });
                    }, 1);

                }

            });
        },
        getData2() {
            if (this.sortType == 0) {
                this.unit = '笔'
            } else if (this.sortType == 1) {
                this.unit = '元'
            } else {
                this.unit = '斤'
            }
            let pa = {
                token: window.localStorage.getItem('token'), //凭证 必填
                start: this.sDate,
                end: this.eDate,
                sortType: this.sortType,
                groupType: 1
            };
            this.$get(this.$apiUrl.columaccount, pa, res => {
                this.$emit('getIndex');
                this.charList = res.list;
                let allChart = this.sliceArray(res.list, 5);
                this.allChart = allChart;

                for (let index = 0; index < allChart.length; index++) {
                    let titleList = [];
                    let valueList = []
                    allChart[index].forEach(el => {
                        let month = 0;
                        if (this.sortType == 0) {
                            month = el.totalOrderCount || 0
                        } else if (this.sortType == 1) {
                            month = el.totalMoneyCount || 0
                        } else {
                            month = el.totalQuantityCount || 0
                        }
                        valueList.push(month)
                        titleList.push(el.cityName + el.districtName || '未知')
                    })
                    setTimeout(() => {
                        let dom = document.getElementById('ech' + index);
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
                                    }
                                },
                                axisLabel: {
                                    show: true,
                                    interval: 0,
                                    rotate: 45,
                                    textStyle: {
                                        color: '#999',//坐标值得具体的颜色
                                        fontSize:12
                                    },
                                    formatter: function (value) {
                                        // console.log(value);
                                        var valueDetal = value.split("-").join("");
                                        // console.log(valueDetal);
                                        var ret = ""; //拼接加\n返回的类目项  
                                        var maxLength = 6; //每项显示文字个数  
                                        var valLength = valueDetal.length; //X轴类目项的文字个数
                                        // console.log(valLength);
                                        var rowN = Math.ceil(valLength / maxLength); //类目项需要换行的行数 
                                        if (rowN > 1) { //如果类目项的文字大于3,
                                            // for (var i = 0; i < rowN; i++) {
                                                var temp = ""; //每次截取的字符串  
                                                var start = 0 * maxLength; //开始截取的位置  
                                                var end = start + 5; //结束截取的位置  
                                                //这里也可以加一个是否是最后一行的判断，但是不加也没有影响，那就不加吧  
                                                temp = valueDetal.substring(start, end) + "...\n";
                                                ret = temp; //凭借最终的字符串  
                                            // }
                                            return ret;
                                        } else {
                                            return valueDetal;
                                        }
                                    }
                                }


                            },
                            yAxis: {
                                axisTick: {//去除刻度
                                    show: false
                                },
                                splitLine: {//去掉网格线
                                    show: false
                                },
                                show: false
                            },
                            series: [{
                                name: '销量',
                                type: 'bar',
                                data: valueList,
                                barWidth: 30,
                                itemStyle: {
                                    normal: {
                                        color: '#3B8BFC',
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
                            }]
                        });
                    }, 1);

                }

            });
        },

    },
    mounted() {
        if (this.productType == 3) {
            this.getData2();
        } else {
            this.getData();
        }
        var _this = this;
        this.swiper = new Swiper('.swiper-container', {
            observer: true,
            observeParents: true,
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
@col: #666666;
@bgc: #3b8bfc;
.support {
    background: #fff;
    .title {
        height: 44px;
        padding: 3px 20px 0 19px;
        border-bottom: 1px solid #e6e6e6;
        display: flex;
        justify-content: space-between;
        align-items: center;
        color: #999;
        font-size: 14px;
        p {
            &:nth-child(1) {
                font-size: 18px;
                color: #1a1a1a;
                .right-text {
                    margin-left: 3px;
                    color: #666666;
                    font-size: 14px;
                }
            }
            &:nth-child(2) {
                font-size: 14px;
                color: @bgc;
            }
        }
    }
    .empty {
        height: 50px;
        line-height: 50px;
        text-align: center;
        color: #999;
    }
}

.u-arrow {
    display: inline-block;
    vertical-align: top;
    margin-top: 3px;
    width: 7px;
    height: 7px;
    border-top: 1px solid @bgc;
    border-right: 1px solid @bgc;
}
.u-arrow-right {
    transform: rotate(45deg);
}
</style>
