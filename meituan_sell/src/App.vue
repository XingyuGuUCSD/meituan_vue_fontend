<template>
  <div id="app">
    <MyHeader :poiInfo='poiInfo'></MyHeader>
    <MyNav :commentNum = 'commentNum'></MyNav>
    <!-- 路由出口 -->
    <keep-alive>
      <router-view></router-view>
    </keep-alive>  
  </div>
</template>

<script>
import MyHeader from './components/header/Header.vue'
import MyNav from './components/nav/Nav.vue'
export default {
  name: 'App',
  components: {
    MyHeader,
    MyNav,
  },
  data(){
    return{
      //header组件需要的信息
      poiInfo:{},
      commentNum: 0,

    }
  },
  created(){//vue生命周期，发起异步请求，获取数据
    // Make a request for a user with a given ID
    var that = this
    this.$axios.get('/api/goods')
      .then(function (response) {
         var dataSource = response.data;
         if(dataSource.code == 0){
           that.poiInfo = dataSource.data.poi_info;
          //  console.log(that.poiInfo);
         }
      })
      .catch(function (error) {
        console.log(error);
      });

    this.$axios.get('/api/ratings')
      .then(function (response) {
         var dataSource = response.data;
         if(dataSource.code == 0){
           that.commentNum = dataSource.data.comment_num;
          //  console.log(that.poiInfo);
         }
      })
      .catch(function (error) {
        console.log(error);
      });
  }
}
</script>

<style>
</style>
