// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import './assets/css/reset.css' 
import './assets/css/swiper.min.css' 
import './assets/js/scale.js' 
import Swiper from "swiper"
import axios from 'axios'
import navigator from './components/common/navigator'
import {axiosApi} from './assets/js/publicFunc.js'
import {apiUrl} from './assets/js/config.js'
import {DatetimePlugin, ConfirmPlugin ,LoadingPlugin, ToastPlugin, AlertPlugin } from 'vux'
Vue.use(DatetimePlugin)
Vue.use(ConfirmPlugin)
Vue.use(LoadingPlugin)
Vue.use(ToastPlugin)
Vue.use(AlertPlugin)


Vue.component('navigator', navigator);
Vue.prototype.$get = axiosApi.Get
Vue.prototype.$post = axiosApi.Post
Vue.prototype.$apiUrl = apiUrl

Vue.config.productionTip = false 
router.afterEach((to, from) => {
	Vue.$vux.loading.hide();
	Vue.$vux.alert.hide()
	Vue.$vux.confirm.hide()
})

new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>' 
})

//safari 缩放问题
if (/Safari/.test(window.navigator.userAgent) && !/Chrome/.test(window.navigator.userAgent)) {
  document.addEventListener('touchstart',function (event) {
    if(event.touches.length>1){
      event.preventDefault();
    }
  });
  var lastTouchEnd=0;
  document.addEventListener('touchend',function (event) {
    var now=(new Date()).getTime();
    if(now-lastTouchEnd<=300){
      event.preventDefault();
    }
    lastTouchEnd=now;
  },false);
  document.addEventListener('gesturestart', function (event) {
    event.preventDefault();
  });

}
