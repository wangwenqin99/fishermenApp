<template>
	<div class="comm-filter">
		<a class="trigger-btn" v-if='type=="normal"' :class="{center: mode == '2'}"  @click="openFilter()">{{showText}}</a>
		<a class="trigger-btn" v-else-if='type=="special"' :class="{center: mode == '2'}"  @click="openFilter()">截止至 {{eDate.replace(/\-/g,'.')}}</a>
		<div class="filter-bar" v-show="showFilter">
			<div class="header">
				筛选
				<button class="back" @click="backFun()"></button>
				<button class="filter-btn" @click="close">完成</button>
			</div>
			<p class="title">统计日期</p>
			<ul class="option-list">
				<li v-for="(item, index) in option" :key="index" :class="{selected: index == currentOption}" @click="tipsFun(item, index)">{{item.name}}</li>
			</ul>
			<div class="picker-bar">
				<input type="text" :value="sDate" name="" class="start-picker" readonly placeholder="选择起始日期" @click="startPickFun">
				至
				<input type="text" :value="eDate" name="" class="end-picker" readonly placeholder="选择截止日期" @click="endPickFun">
			</div>
		</div>
	</div>
</template>
<script type="text/javascript">
import { publicFun } from "../../assets/js/publicFunc.js";
export default {
  name: "comm-filter",
  props: {
    type: {
      type: String,
      default: "normal"
    },
    mode: {
      type: String,
      default: "1"
    }
  },
  computed: {
    showText() {
      if(!this.sDate && !this.eDate) {
        return '截止至 ' + publicFun.getNowFormatDate().replace(/\-/g,'.');
      } else if(!this.sDate && this.eDate) {
        return '截止至 ' + this.eDate.replace(/\-/g,'.');
      } else if(this.sDate && !this.eDate){
          return this.sDate.replace(/\-/g,'.') + ' - ' + publicFun.getNowFormatDate().replace(/\-/g,'.');
        }else {
        return this.sDate.replace(/\-/g,'.') + ' - ' + this.eDate.replace(/\-/g,'.');
      }
    }
  },
  data() {
    return {
      currentOption: -1,
      showFilter: false,
      option: [
        {
            name: "本周",
            value: "week"
        },
        {
          name: "本月",
          value: "month"
        },
        {
          name: "半年内",
          value: "halfYear"
        },
        // {
        //   name: "上月",
        //   value: "lastMonth"
        // },
        {
          name: "今年内",
          value: "year"
        },
        {
          name: "不限",
          value: "none"
        },
      ],
      sDate: "",
      eDate: "",
      year: new Date().getFullYear(),
      month: new Date().getMonth() + 1,
      default: {}
    };
  },
  methods: {
	close() {
		this.showFilter = false;
		let datas = {
			sDate:this.sDate,
			eDate:this.eDate
		}
		this.$emit('close',datas)

	},
    startPickFun() {
      const _this = this;
      this.$vux.datetime.show({
        value: "", // 其他参数同 props
        onConfirm(val) {
          _this.sDate = val;
        },
        onShow() {
          const _this = this;
        },
        confirmText: "确认",
        cancelText: "取消",
        endDate: publicFun.getNowFormatDate()
      });
    },
    endPickFun() {
      const _this = this;
      this.$vux.datetime.show({
        value: "", // 其他参数同 props
        onConfirm(val) {
          _this.eDate = val;
        },
        onShow() {
          const _this = this;
        },
        confirmText: "确认",
        cancelText: "取消",
        endDate: publicFun.getNowFormatDate()
      });
    },
    tipsFun(item, index) {
      this.currentOption = index;
      var day = new Date().getDay();
      var diff = 7 - day;
      var date = new Date().getDate();
      switch (item.value) {
        case "week":
          //当月
          let prev = this.getThisWeekFirstDay();
          this.sDate = publicFun.formateDate(new Date(prev), "yyyy-MM-dd");
          this.eDate = this.year + '-' + this.month + '-' + date;
          break;
        case "month":
          //当月
          this.sDate = this.year + "-" + this.month + "-1";
            //   this.eDate =
            //     this.year +
            //     "-" +
            //     this.month +
            //     "-" +
            //     this.getMonthDays(this.month);
            this.eDate = this.year + '-' + this.month + '-' + date;
          break;
        case "lastMonth":
        let year = this.year;
        let month = this.month;
            if(this.month==1){
                year = this.year-1;
                month= 13;
            }
          this.sDate = year + "-" + (month - 1) + "-1";
          this.eDate =
            year +
            "-" +
            (month - 1) +
            "-" +
            this.getMonthDays(month - 1);
          break;
        case "halfYear":
            let nowTime = new Date().valueOf();
            let stime = nowTime - 3600 * 24 * 1000 * 366 / 2;
            this.sDate = publicFun.formateDate(new Date(stime), "yyyy-MM-dd");
            this.eDate = this.year + '-' + this.month + '-' + date;
          break;
        case "year":
          this.sDate = this.year + "-1-1";
        //   this.eDate = this.year + "-12-31";
          this.eDate = this.year + '-' + this.month + '-' + date;
          break;
        case "none":
          this.sDate = "";
          this.eDate = "";
          break;
        default:
          this.sDate = "";
          this.eDate = "";
          break;
      }
    },
    getMonthDays(month) {
      var sDate = new Date(this.year, month -1, 1);
      var eDate = new Date(this.year, month, 1);
      var days = (eDate - sDate) / (1000 * 60 * 60 * 24);
      return days;
    },
    openFilter() {
      this.default.sDate = this.sDate;
      this.default.eDate = this.eDate;
      this.showFilter = true;
    },
    backFun() {
      this.sDate = this.default.sDate;
      this.eDate = this.default.eDate;
      this.showFilter = false;
    },
    //本周初始 时间戳
    getThisWeekFirstDay() {
        var now = new Date();
        var day = now.getDay();
        var week = "1234567";
        var first = 0 - week.indexOf(day);
        var thisWeekfirstDay = new Date;
        thisWeekfirstDay.setDate(thisWeekfirstDay.getDate() + first);
        return thisWeekfirstDay.valueOf();
    }
  },
  created() {
    // 获取本周初始时间
    let prev = this.getThisWeekFirstDay();
    this.sDate = publicFun.formateDate(new Date(prev), "yyyy-MM-dd");
  }
};
</script>
<style lang="less" scoped>
@tcor: #ffffff;
@cor: #666;
@bgc: #3B8BFC;
.comm-filter {
    padding:11px 18px 17px 19px;
  .trigger-btn {
    height: 32px;
    width: 100%;
    // background: #fffbee;
    background: @tcor;
    // font-size: 16px;
    font-size: 12px;
    line-height: 32px;
    // color: #d56e3c;
    color: #1A1A1A;
    padding: 0 15px 0;
    display: block;
    box-sizing: border-box;
    position: relative;
    &:after {
      content: "";
      position: absolute;
      right: 15px;
      top: 0;
      height: 100%;
      width: 20px;
      background: url("./images/tjcx_icon_riqi@3x.png") no-repeat
        center center;
      background-size: 20px 20px;
    }
    &.center {
    //   height: 43px;
      padding: 0 0 0 15px;
    //   line-height: 43px;
    }
  }
  .filter-bar {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background-color: #fff;
    z-index: 211;
    .header {
      height: 44px;
      line-height: 44px;
      text-align: center;
      position: relative;
      font-size: 17px;
      background:@bgc;
      color: @tcor;
      border-bottom: 1px solid #e6e6e6;
      button {
        position: absolute;
        height: 100%;
        color: @tcor;
        font-size: 14px;
        top: 0;
        padding: 0 20px;
        &.back {
          left: 0;
          &:after {
            content: "";
            width: 14px;
            height: 14px;
            border: solid @tcor;
            border-width: 0 0 2px 2px;
            transform: rotate(45deg);
            position: absolute;
            left: 20px;
            box-sizing: border-box;
            top: 50%;
            margin-top: -6px;
          }
        }
        &.filter-btn {
          right: 0;
        }
      }
    }
    .title {
      padding: 20px;
      color: @cor;
      font-weight: 16px;
    }
    .option-list {
      padding: 0 20px;
      padding-right:0;
      font-size: 0;
      li {
        display: inline-block;
        width: 21%;
        margin-right: 3.3%;
        margin-bottom:15px;
        height: 30px;
        line-height: 30px;
        color: @cor;
        font-size: 14px;
        background-color: #f2f2f2;
        text-align: center;
        border-radius: 7px;
        &:last-child {
          margin-right: 0;
        }
        &.selected {
          background-color: @bgc;
          color:@tcor;
        }
      }
    }
    .picker-bar {
      margin-top: 57px;
      font-size: 14px;
      color: @cor;
      text-align: center;
      padding: 0 38px;
      position: relative;
      height: 37px;
      line-height: 37px;
      input {
        display: block;
        position: absolute;
        width: 30%;
        text-align: center;
        padding: 10px 0;
        border-bottom: 1px solid #333;
        color: @cor;
        font-size: 14px;
        top: 0;
        &.start-picker {
          left: 38px;
        }
        &.end-picker {
          right: 38px;
        }
        &::-webkit-input-placeholder {
          color: #999;
        }
      }
    }
  }
}
</style>