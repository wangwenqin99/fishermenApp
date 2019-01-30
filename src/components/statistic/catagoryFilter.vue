<template>
    <div class="support">
        <div class="title">
            <p>
                <span v-show='productType == 1'>品类供应</span>
                <span v-show='productType == 2'>品类求购</span>
                <span v-show='productType == 3'>品类成交</span>
                <span class='right-text'>/单位：{{unit}} </span> </p>
            <p @click='gotoDetail'>更多<span class='u-arrow u-arrow-right'></span></p>
        </div>
        <div
            v-show='charList.length>0'
            ref="echart"
            style="width:350px; height:350px"
        ></div>
        <div class='empty' v-show='charList.length == 0'>暂无数据。。。</div>
    </div>
</template>

<script>
import echarts from "echarts";
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
        changeIndex:{
            type:Number,
            default:0
        },
        productType:{
            default:1
        },
        sortType: { //成交类型  0 总单数 1 总金额 2 总斤数
            default:0
        }
    },
    data() {
        return {
            unit:'斤',
            charList:[]
        }
    },
    watch:{
        changeIndex(newD,oldD){
            if(oldD != newD){
                if(this.productType == 3) {
                    this.getData2();
                }else{
                    this.getData();
                }
            }
        }

    },
    methods: {
        gotoDetail(){
            // productType  1：供应 2：求购
            // groupType   2品类   6区域
            // sortType  成交类型  0 总单数 1 总金额 2 总斤数
            this.$router.push({path:'/filterList',query:{productType:this.productType,groupType:2,sortType:this.sortType}})
        },
        getData() {
            let pa = {
                token: window.localStorage.getItem('token'), //凭证 必填
                sortType: 201,
                startTime: this.sDate,
                productType:this.productType,
                endTime: this.eDate,
                groupType:2 //分组类型（1：日期 2：二级品类 3：一级品类 4：省 5：市 6：县/区）
                // pageIndex:1,
                // pageSize:10
            };
            this.$get(this.$apiUrl.statistics, pa, res => {
                this.$emit('getIndex');
                let titleList = [];
                let valueList = []
                res.list.forEach(el => {
                   titleList.push(el.catIdName||'未知')
                    valueList.push({
                        name: el.catIdName||'未知',
                        value: el.quantity||0
                    })
                })
                this.charList = res.list;
                var myChart = echarts.init(this.$refs.echart);
                // 绘制图表
                myChart.setOption({
                   title: {
                        x: 'center',
                    },
                    tooltip: {
                        trigger: 'item',
                        formatter: "{b} : {d}%"
                    },
                    legend: {

                    },
                    color:['#F93B7D','#27C9A3','#F469B6','#F5A715','#F9584E','#50DBDA'],
                    series: [
                        {
                            type: 'pie',
                            radius: ['30%', '60%'],
                            center: ['50%', '60%'],//饼图的中心（圆心）坐标
                            data: valueList,
                            itemStyle: {},
                            label:{            //饼图图形上的文本标签
                                normal:{
                                    show:true,
                                    // position:'inner', //标签的位置
                                    textStyle : {
                                        // fontWeight : 300 ,
                                        fontSize : 12    //文字的字体大小
                                    },
                                    formatter:'{b} {c}'

                                    
                                }
                            },
                        }
                    ]
                });

            });
        },
        getData2() {
            if(this.sortType == 0) {
                this.unit = '笔'
            }else if(this.sortType == 1) {
                this.unit = '元'
            }else{
                this.unit = '斤'
            }
            let pa = {
                token: window.localStorage.getItem('token'), //凭证 必填
                start: this.sDate,
                end: this.eDate,
                sortType:this.sortType,
            };
            this.$get(this.$apiUrl.orderaccount, pa, res => {
                this.$emit('getIndex');
                let titleList = [];
                let valueList = []
                res.list.forEach(el => {
                   titleList.push(el.catName||'未知');
                   let month = 0;
                   if(this.sortType == 0) {
                        month = el.totalOrderCount || 0
                    }else if(this.sortType == 1) {
                        month = el.totalMoneyCount || 0
                    }else{
                        month = el.totalQuantityCount || 0
                    }
                    valueList.push({
                        name: el.catName||'未知',
                        value: month||0
                    })
                })
                var myChart = echarts.init(this.$refs.echart);
                // 绘制图表
                myChart.setOption({
                   title: {
                        x: 'center',
                    },
                    tooltip: {
                        trigger: 'item',
                        formatter: "{b} : {d}%"
                    },
                    legend: {
                    },
                    color:['#F93B7D','#27C9A3','#F469B6','#F5A715','#F9584E','#50DBDA'],
                    series: [
                        {
                            // name: '访问来源',
                            type: 'pie',
                            radius: ['30%', '60%'],
                            // radius: '55%',//饼图的半径
                            center: ['50%', '60%'],//饼图的中心（圆心）坐标
                            data: valueList,
                            itemStyle: {},
                            label:{            //饼图图形上的文本标签
                                normal:{
                                    show:true,
                                    // position:'inner', //标签的位置
                                    textStyle : {
                                        // fontWeight : 300 ,
                                        fontSize : 12    //文字的字体大小
                                    },
                                    formatter:'{b} {c}'

                                    
                                }
                            },
                        }
                    ]
                });

            });
        }

    },
    mounted() {
        if(this.productType == 3) {
            this.getData2();
        }else{
            this.getData();
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
@col:#666666;
@bgc:#3B8BFC;
.support{
    background:#fff;
    .title{
        height:44px;
        padding: 3px 20px 0 19px;
        border-bottom: 1px solid #E6E6E6;
        display: flex;
        justify-content: space-between;
        align-items: center;
        color:#999;
        font-size: 14px;
        p{

            &:nth-child(1){
                font-size: 18px;
                color:#1A1A1A;
                .right-text{
                    margin-left:3px;
                    color:#666666;
                    font-size: 14px;
                }
            }
            &:nth-child(2){
                font-size: 14px;
                color:@bgc;
            }
        }
        
    }
    .empty{
        height:50px;
        line-height: 50px;
        text-align: center;
        color:#999;
    }
}

.u-arrow {
    display: inline-block;
    vertical-align: top;
    margin-top:3px;
    width: 7px;
    height: 7px;
    border-top: 1px solid @bgc;
    border-right: 1px solid @bgc;
}
.u-arrow-right {
    transform: rotate(45deg);
}
</style>
