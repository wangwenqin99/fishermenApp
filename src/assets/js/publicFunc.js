
let publicFun = {
    // 验证手机号
    isPhoneNo: function (phone) {
        var pattern = /^1\d{10}$/;
        return pattern.test(phone);
    },
    formateDate: function (date, fm) {
        if (/(y+)/.test(fm)) {
            fm = fm.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
        }
        var o = {
            'M+': date.getMonth() + 1,
            'd+': date.getDate(),
            'h+': date.getHours(),
            'm+': date.getMinutes(),
            's+': date.getSeconds()
        }
        for (let k in o) {
            if (new RegExp(`(${k})`).test(fm)) {
                let str = o[k] + ''
                fm = fm.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : padLeftZero(str))
            }
        }
        return fm
    },
    removeDuplicatedItem: function (ar) {
        var ret = [];
        for (var i = 0, j = ar.length; i < j; i++) {
            if (ret.indexOf(ar[i]) === -1) {
                ret.push(ar[i]);
            }
        }

        return ret;
    },
    //获取当前日期方法
    getNowFormatDate() {
        var date = new Date();
        var seperator1 = "-";
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var strDate = date.getDate();
        if (month >= 1 && month <= 9) {
            month = "0" + month;
        }
        if (strDate >= 0 && strDate <= 9) {
            strDate = "0" + strDate;
        }
        var currentdate = year + seperator1 + month + seperator1 + strDate;
        return currentdate;
    },
    //本周初始 时间戳
    getThisWeekFirstDay() {
        var now = new Date();
        var day = now.getDay();
        var week = "1234567";
        var first = 0 - week.indexOf(day);
        var thisWeekfirstDay = new Date(new Date(new Date().toLocaleDateString()).getTime());
        thisWeekfirstDay.setDate(thisWeekfirstDay.getDate() + first);
        return thisWeekfirstDay.valueOf();
    },

    //本月初始 时间戳
    getThisMonthFirstDay() {
        var date = new Date();
        date.setDate(1);
        return date.valueOf();
    },
    // 本年初始时间戳
    getFirstDayOfYear() {
        var date = new Date();
        date.setDate(1);
        date.setMonth(0);
        return date.valueOf();
    },
    // 去年初始时间戳
    getLastFirstDayOfYear() {
        var date = new Date();
        var nowYear = date.getFullYear();
        date.setFullYear(nowYear - 1);
        date.setDate(1);
        date.setMonth(0);
        return date.valueOf();
    },
    //获得上月开始时间戳
    getLastMonthStartDate() {
        var lastMonthStartDate = new Date(nowYear, lastMonth, 1);
        return lastMonthStartDate.valueOf();
    },
    //获得上月结束时间戳
    getLastMonthEndDate() {
        var lastMonthEndDate = new Date(nowYear, lastMonth, getMonthDays(lastMonth));
        return lastMonthEndDate.valueOf();
    },
    //获得某月的天数
    getMonthDays(myMonth) {
        var monthStartDate = new Date(nowYear, myMonth, 1);
        var monthEndDate = new Date(nowYear, myMonth + 1, 1);
        var days = (monthEndDate - monthStartDate) / (1000 * 60 * 60 * 24);
        return days;
    }

}

function padLeftZero(str) {
    return ('00' + str).substr(str.length)
}

import Vue from 'vue'
import axios from 'axios'
var axiosApi = {
    Post: function (url, param, callback, errCallBack) {
        var token = localStorage.getItem('audience_token') ? localStorage.getItem('audience_token') : '';
        return axios.post(url, param, {
            headers: {
                'access_token': token,
                'Content-type': 'application/json;charset=UTF-8'
            }
        }).then((res) => {
            if (res.data.errCode == 1011) {//没有userInfo跳到登陆页

            }
            if (res.data.errCode == 0 || !res.data.error) {
                callback(res.data)
            } else {
                errCallBack && errCallBack(res.data);
                Vue.$vux.loading.hide();
                if (res.data.errCode == 1011) {
                    Vue.$vux.alert.show({
                        content: res.data.errInfo,
                        onHide() {
                            _goLoginPage();
                        }
                    });
                } else {
                    Vue.$vux.alert.show({
                        content: res.data.errInfo
                    });
                }

            }
        })
            .catch((error) => {
                Vue.$vux.loading.hide();
            })
    },

    Get(url, param, callback) {
        var token = localStorage.getItem('audience_token') ? localStorage.getItem('audience_token') : '';
        return axios.get(url, {
            params: param,
            headers: {
                'access_token': token,
                'contentType': 'application/json',
                'Content-type': 'application/json;charset=UTF-8'
            }
        }).then((res) => {
            if (res.data.errCode == 0 || !res.data.error) {
                callback(res.data)
            } else {
                Vue.$vux.loading.hide();
                if (res.data.errCode == 1011) {
                    Vue.$vux.alert.show({
                        content: res.data.errInfo,
                        onHide() {
                            _goLoginPage();
                        }
                    });
                } else {
                    Vue.$vux.alert.show({
                        content: res.data.errInfo
                    });
                }

            }
        })
        .catch((error) => {
            console.log(error);
            Vue.$vux.loading.hide();
            Vue.$vux.toast.text('服務器異常', 'middle')

        })
    },
    cancel() {
        axios.CancelToken.source().cancel();
    }
}
export {
    publicFun,
    axiosApi
}

