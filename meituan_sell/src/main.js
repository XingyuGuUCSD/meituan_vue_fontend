// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import VueRouter from 'vue-router'
import Axios from 'axios'

//1导入组件
import Goods from "./components/goods/Goods"
import Ratings from "./components/ratings/Ratings"
import Seller from "./components/seller/Seller"


Vue.config.productionTip = false;
//安装vuerouter插件
Vue.use(VueRouter);

//如果县能够在其他组件中使用axios，需要改写为VUE原型属性
Vue.prototype.$axios = Axios;

//2定义路由
const routes =[
  {
    path: "/",
    //重定向
    redirect: "/goods",
  },
  {
    path:"/goods",
    component: Goods
  },
  {
    path:"/ratings",
    component: Ratings
  },
  {
    path:"/seller",
    component: Seller
  },
]

//3创建router实例
const router = new VueRouter({
  routes,
  //选中后的样式类名
  linkActiveClass: 'active',
})

//4创建和挂载实例



/* eslint-disable no-new */
new Vue({
  el: '#app',
  components: { App },
  template: '<App/>',
  router,
})
