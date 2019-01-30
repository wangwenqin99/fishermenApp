// productType  1：供应 2：求购
// groupType   1品类   2区域

<template>
  <div class="list">
      <navigator :title="title"></navigator>
      <ul>
          <li class='title'>
              <p>{{name}}</p>
              <p>{{unit}}</p>
          </li>
          <li class="first">
              <p>合计</p>
              <p>{{total}}</p>
          </li>
          <li class='item' v-for='(item,index) in list' :key='index'>
              <p>{{item.title}}</p>
              <p>{{item.value}}</p>
          </li>
      </ul>
  </div>
</template>

<script>
import { publicFun } from "../assets/js/publicFunc.js";
export default {
  data() {
    return {
        title:'供应统计',
        name:'',
        list:[],
        total:0,
        unit:'斤数'
    }
  },

  mounted() {
      this.$vux.loading.show();
      let t1 = '';
      let t2 = '';
      if(this.$route.query.productType == 1){
          t1 = '供应'
      }else if(this.$route.query.productType == 2){
          t1='求购'
      }else{
          t1='成交'
          if(this.$route.query.sortType == 0) {
              this.unit = '笔数'
          }else if(this.$route.query.sortType == 1) {
              this.unit = '金额'
          }else{
              this.unit = '斤数'
          }
      }
      if(this.$route.query.groupType == 2){
          t2 = '品类'
          this.name = t2 + '名称'
      }else{
          t2='区域'
          this.name = t2
      }
      this.title=t2 + t1;
      
      if(this.$route.query.productType == 3) {
          this.getList2();
      }else{
          this.getList();
      }
      document.title = this.title;
  },

  methods: {
      getList(){
          let pa = {
                token: window.localStorage.getItem('token'), //凭证 必填
                sortType: 201,
                groupType:this.$route.query.groupType,
                productType:this.$route.query.productType
            };
            this.$get(this.$apiUrl.statistics, pa, res => {
                this.$vux.loading.hide();
                let total = 0;
                res.list.forEach(el => {
                    if(this.$route.query.groupType == 2){
                        el.title = el.catIdName||'未知'
                    }else{
                        el.title = el.cityName + el.districtName||'未知'
                    }
                   el.value=el.quantity||0;
                   total += el.value;
                })
                this.total = total;
                this.list = res.list;
            })
      },
      getList2(){
          let pa = {
                token: window.localStorage.getItem('token'), //凭证 必填
                sortType: this.$route.query.sortType,
            };
            this.$get(this.$apiUrl.orderaccount, pa, res => {
                this.$vux.loading.hide();
                let total = 0;
                res.list.forEach(el => {
                    if(this.$route.query.groupType == 2){
                        el.title = el.catIdName||'未知'
                    }else{
                        el.title =el.cityName +  el.districtName||'未知'
                    }
                     if(this.$route.query.sortType == 0) {
                        el.value = el.totalOrderCount||0;
                    }else if(this.$route.query.sortType == 1) {
                        el.value = el.totalMoneyCount||0;
                    }else{
                        el.value = el.totalQuantityCount||0;
                    }
                   total += el.value;
                })
                this.total = total;
                this.list = res.list;
            })
      },

  }
}
</script>

<style scoped lang="less">
.list{
    ul{
        li{
            height:36px;
            align-items: center;
            display: flex;
            color:#666;
            font-size: 14px;
            p{
                flex:1;
                text-align: center;
            }
            
        }
        .title{
            height: 40px;
            line-height: 40px;;
            background:#F5F5F5;
            color:#333333;
            font-size: 14px;
        }
        .first{
            height: 44px;
            line-height: 44px;
            border-top: 1px solid #eee;
            font-size: 18px;
            font-weight: bolder;
            color:#3B8BFC;
        }
        .item{
            height: 36px;
            line-height: 36px;
            border-top: 1px solid #eee;
            &:nth-child(2n+1){
                background:#FAFBFC;
            }
            p:nth-child(1){
                font-size: 16px;
                color:#1A1A1A;
            }
            p:nth-child(2){
                font-size: 17px;
                color:#B2B2B2;
            }
        }
    }
}
</style>
