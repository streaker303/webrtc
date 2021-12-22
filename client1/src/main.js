import Vue from 'vue'
import App from './App.vue'
import router from './router'
import socket from './utils/socket';
import './assets/base.css'

Vue.config.productionTip = false


socket.on('connect', ()=>{
  console.log('连接成功');
});
socket.on('disconnect', ()=>{
  console.log('连接断开了');
});

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
