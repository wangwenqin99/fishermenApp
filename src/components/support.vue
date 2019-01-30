<template>
    <div class="support">
        <navigator :title="title+'统计'"></navigator>
        
        <comm-filter
            :type='type'
            @close='close'
            mode="2"
        ></comm-filter>
        <div class="top-title" v-if='productType == 3'>
            <div v-for="(item,index) in compList" :key='index' class='wrap' @click='selectType(item)'>
                <p :class="{'h-text':sortType == index}">{{item.text}}</p>
                <p :class="{'btn-line':sortType == index}"></p>
            </div>
        </div>
        <time-filter :sDate='sDate' :eDate ='eDate' :changeIndex='changeIndex' :productType='productType' :sortType='sortType' @getIndex='getIndex'></time-filter>
        <div class="h-12"></div>
        <catagory-filter :sDate='sDate' :eDate ='eDate' :changeIndex='changeIndex'  :productType='productType' :sortType='sortType' @getIndex='getIndex'></catagory-filter>
        <div class="h-12"></div>
        <area-filter :sDate='sDate' :eDate ='eDate' :changeIndex='changeIndex' :productType='productType' :sortType='sortType' @getIndex='getIndex'></area-filter>
    </div>
</template>

<script>
import echarts from "echarts";
import Swiper from "swiper";
import commFilter from "./common/comm-filter";
import { publicFun } from "../assets/js/publicFunc.js";
import  timeFilter  from "./statistic/timeFilter";
import  catagoryFilter  from "./statistic/catagoryFilter";
import  areaFilter  from "./statistic/areaFilter";
export default {
    components: {
        commFilter,
        'time-filter':timeFilter,
        'catagory-filter':catagoryFilter,
        'area-filter':areaFilter,
    },
    name: 'support',
    data() {
        return {
            type: "normal",
            changeIndex:0,
            sDate: publicFun.getThisWeekFirstDay(),
            eDate: new Date(new Date(new Date().toLocaleDateString()).getTime()+24*60*60*1000-1).getTime(),
            productType:this.$route.query.productType,
            title:'供应',
            compList:[
                {
                    text:'按成交笔数',
                    sortType:0
                },
                {
                    text:'按成交金额',
                    sortType:1
                },
                {
                    text:'按成交斤数',
                    sortType:2
                },
            ],
            apiIndex:0,
            sortType:0
        }
    },
    methods: {
        selectType(item) {
            this.changeIndex++;
            this.sortType = item.sortType;
            this.apiIndex = 0;
            this.$vux.loading.show();
        },
        close(e) {
            this.apiIndex = 0;
            this.$vux.loading.show();
            this.changeIndex++;
            this.type = "normal";
            let s = e.sDate.split("-");
            let sDate = new Date();
            sDate.setFullYear(s[0], s[1] - 1, s[2]);
            let sDateFirst = new Date(new Date(sDate.toLocaleDateString()).getTime())
            this.sDate = parseInt(sDateFirst.getTime());
            let ed = e.eDate.split("-");
            let eDate = new Date();
            eDate.setFullYear(ed[0], ed[1] - 1, ed[2]);
            console.log(eDate.getTime());
            let eDateFirst = new Date(new Date(eDate.toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 -1)
            console.log(eDateFirst.getTime());
            
            this.eDate = parseInt(eDateFirst.getTime());
        },
        getIndex(){
            console.log(this.apiIndex);
            
            ++this.apiIndex;
            if(this.apiIndex == 3){
                this.$vux.loading.hide();
                
            }
        }

    },
    mounted() {
        // this.productType = this.$route.query.productType;
        this.$vux.loading.show();
        if(this.$route.query.productType == 1){
            this.title='供应'
        }else if(this.$route.query.productType == 2){
            this.title="求购"
        }else{
            this.title="成交"
        }
        document.title = this.title + "统计"
    }
}
</script>

<style scoped lang="less">
.support{
    background:#F5F5F5;
    .top-title{
        height:40px;
        line-height: 40px;
        background:#fff;
        border-bottom: 1px solid #eee;
        display: flex;
        .wrap{
            flex:1;
            text-align: center;
            position: relative;
            color:#999999;
            font-size: 14px;
            .btn-line{
                width:28px;
                position: absolute;
                left:50%;
                bottom:2px;
                margin-left: -14px;
                border-top:2px solid #3975F9;

            }
        }
        .h-text{
            color:#1A1A1A;
            font-size: 16px;
        }
    }
}

.h-12{
    height:12px;
}
</style>
