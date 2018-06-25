<template>
    <div class="goods">
        <!-- 左侧分类 -->
       <div class="menu-wrapper" ref="menuScroll">
           <ul>
               <li class="menu-item" :class="{'current': currentIndex===0}" @click="selectMenu(0)">
                   <p class="text">
                       <img :src="container.tag_icon" v-if="container.tag_icon" class="icon">
                       {{container.tag_name}}
                   </p>
               </li>

               <li class="menu-item" v-for="(item, index) in goods" :key="index" :class="{'current': currentIndex===index+1}" @click="selectMenu(index+1)">
                   <p class="text">
                       <img :src="item.icon" v-if="item.icon" class="icon">
                       {{item.name}}
                   </p>

                   <i class="num" v-show="calculateCount(item.spus)">{{calculateCount(item.spus)}}</i>
               </li>
           </ul>
       </div>

       <!-- 商品列表 -->
       <div class="foods-wrapper" ref="foodScroll">
           <ul>
               <!-- 专场 -->
               <li class="container_list food-list-hook">
                    <div v-for="(item, index) in container.operation_source_list" :key="index">
                        <img :src="item.pic_url" alt="">
                    </div>
               </li>
               <!-- 具体的分类 -->
               <li v-for="(item, index) in goods" :key="index"  class="food_list food-list-hook">
                   <h3 class="title">{{item.name}}</h3>
                   <!-- 具体商品 -->
                   <ul>
                       <li v-for="(food, index_2) in item.spus" :key="index_2" class="food_item"  @click="showDetail(food)">
                           <div class="icon" :style="head_bg(food.picture)"></div>
                           <div class="content">
                               <h3 class="name">{{food.name}}</h3>
                               <p class="description" v-if="food.description">{{food.description}}</p>
                               <div class="extra">
                                   <span class="saled">{{food.month_saled_content}}</span>
                                   <span class="praise">{{food.praise_content}}</span>
                                   <img class="product" v-if="food.product_label_picture" :src="food.product_label_picture" alt="">
                                   <p class="price">
                                       <span class="text">￥{{food.min_price}}</span>
                                       <span class="unit">/{{food.unit}}</span>
                                   </p>
                               </div>
                           </div>
                           <div class="control-wrapper">
                               <CartControl :food="food" :selectFoods="selectFoods"></CartControl>
                           </div>
                       </li>
                   </ul>
               </li>
           </ul>
       </div>

       <ShopCart :poiInfo="poiInfo" :selectFoods="selectFoods"></ShopCart>
       <!-- 商品详情 -->
       <Food :food="selectFood" ref="foodView"></Food>
    </div>
</template>

<script>
    // 导入better-scrol
    import BScroll from "better-scroll"
    import ShopCart from "components/shopCart/ShopCart.vue"
    import CartControl from "components/cartControl/CartControl.vue"
    import Food from "components/food/Food.vue"

    export default{
        data(){
            return {
                container: {},
                goods: [],
                poiInfo:{},
                listHeight: [],
                menuScroll: {},
                foodScroll: {},
                scrollY: 0,
                selectFood: {},
            }
        },
        created(){//vue生命周期，发起异步请求，获取数据
            // Make a request for a user with a given ID
            var that = this
            this.$axios.get('/api/goods')
            .then(function (response) {
                var dataSource = response.data;
                if(dataSource.code == 0){
                    that.container = dataSource.data.container_operation_source;
                    that.goods = dataSource.data.food_spu_tags;
                    that.poiInfo = dataSource.data.poi_info;
                    //create时，dom元素没有进行渲染，即高度有问题
                    //所以这边用nextTick()
                    that.$nextTick(() =>{
                        that.initScroll();
                        that.calculateHeight();
                    });
                }
            })
            .catch(function (error) {
                console.log(error);
            });
        },
        computed:{
            currentIndex(){//根据右侧滚动位置，确定对应的索引
                for(let i = 0; i < this.listHeight.length; i++){
                    //获取商品的位置区间
                    let height1 = this.listHeight[i];
                    let height2 = this.listHeight[i+1];
                    
                    //判断是否在上述区间中
                    if(this.scrollY >= height1 && this.scrollY <=height2){
                        return i;
                    }
                }
                return 0;
            },
            selectFoods(){
                let foods = []
                this.goods.forEach((good) => {
                    good.spus.forEach((food) => {
                        if(food.count > 0){
                            foods.push(food);
                        }
                    });
                });
                // console.log(foods)
                return foods;
            },
            
        },
        methods: {
            head_bg(imgName){
                return "background-image: url(" + imgName + ");"
            },
            //初始化滚动
            initScroll(){
                //ref属性就是用来绑定某个dom元素或某个组件，然后在this.$refs中
                this.menuScroll = new BScroll(this.$refs.menuScroll, {
                    click: true,
                });
                this.foodScroll = new BScroll(this.$refs.foodScroll, {
                    probeType: 3,
                    click: true,
                });

                //添加滚动监听事件
                this.foodScroll.on("scroll", (pos) => {
                    this.scrollY = Math.abs(Math.round(pos.y));
                    
                });
            },
            calculateHeight(){
                //通过$refs获取到对应的元素
                let foodlist = this.$refs.foodScroll.getElementsByClassName('food-list-hook');
                //添加到数组区间
                // 0-216 第一个区间（专场）
                // 217 - 1342 第二个区间（热销）
                let height = 0;
                this.listHeight.push(height);
    
                for(let i=0; i < foodlist.length; i++){
                    let item=foodlist[i];

                    height += item.clientHeight;
                    this.listHeight.push(height);
                }
            },
            selectMenu(index){
                let foodlist = this.$refs.foodScroll.getElementsByClassName('food-list-hook');
                //根据下标滚动到相对应的元素
                let el = foodlist[index];
                this.foodScroll.scrollToElement(el, 250);
            },
            calculateCount(spus){
                let count = 0;
                spus.forEach((food) => {
                    if (food.count > 0){
                        count += food.count;
                    }
                });
                return count;
            },
            showDetail(food){
                //传值
                this.selectFood = food;
                //显示详情页
                this.$refs.foodView.showView();

            }

        },
        components:{
            BScroll,
            ShopCart,
            CartControl,
            Food,
        },
    }
</script>

<style>

@import url("../../common/styles/icon.css");
.goods{
    display: flex;

    /* 通过这种方式确定高度，因为是滚动显示，所以不需要显示完整 */
    position: absolute;
    top: 190px;
    bottom: 51px;


    overflow: hidden;
    width: 100%;
}

.goods .menu-wrapper{
    flex: 0 0 85px;
    background: #f4f4f4;
}

.goods .foods-wrapper{
    flex: 1;
    background: white;
}

.goods .menu-wrapper .menu-item{
    padding: 16px 23px 15px 10px;
    border-bottom: 1px solid #e4e4e4;
    position: relative;
}

.goods .menu-wrapper .menu-item .num{
    position: absolute;
    right: 5px;
    top: 5px;
    width: 13px;
    height: 13px;
    border-radius: 50%;
    color: white;
    background: red;
    text-align: center;
    font-size: 7px;
    line-height: 13px;

}

.goods .menu-wrapper .current{
    background: white;
    font-weight: bold;
}

.goods .menu-wrapper .menu-item .text{
    font-size: 13px;
    line-height: 17px;
    color: #333333;
    vertical-align: middle;

    /* 多行显示,适用于支持webkit的浏览器 */
    -webkit-line-clamp: 2;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    overflow:hidden;

}

.goods .menu-wrapper .menu-item .text .icon{
    width: 15px;
    height: 15px;
    vertical-align: middle;
}

.goods .foods-wrapper .container_list{
    padding: 11px 11px 0px 11px;
    border-bottom: 1px solid #E4E4E4;
}

.goods .foods-wrapper .container_list img{
    width: 100%;
    margin-bottom: 11px;
    border-radius: 5px;
}

.goods .foods-wrapper .food_list{
    padding: 11px;
}

.goods .foods-wrapper .food_list .title{
    font-size: 13px;
    height: 13px;
    background: url(btn_yellow_highlighted@2x.png) no-repeat left center;
    background-size: 2px 10px;
    padding-left: 7px;
    margin-bottom: 13px;
}
.goods .foods-wrapper .food_list .food_item{
    display: flex;
    margin-bottom: 11px;
    position: relative;
}

.goods .foods-wrapper .food_list .food_item .control-wrapper{
    position: absolute;
    right: 0;
    bottom: 0;
}

.goods .foods-wrapper .food_list .food_item .icon{
    flex: 0 0 63px;
    background-position: center;
    background-size: 120% 100%;
    background-repeat: no-repeat;
    margin-right: 11px;
    height: 75px;
}

.goods .foods-wrapper .food_list .food_item .content{
    flex: 1;
}

.goods .foods-wrapper .food_list .food_item .content .name{
    font-size: 16px;
    line-height: 21px;
    color: #333333;
    margin-bottom: 10px;
    margin-right: 27px;
}

.goods .foods-wrapper .food_list .food_item .content .description{
    font-size: 10px;
    line-height: 19px;
    color: #bfbfbf;
    margin-bottom: 8px;

    /* 超出部分省略号 */
    -webkit-line-clamp: 1;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    overflow:hidden;
}

.goods .foods-wrapper .food_list .food_item .content .extra{
    font-size: 10px;
    color: #bfbfbf;
    margin-bottom: 7px;
}

.goods .foods-wrapper .food_list .food_item .content .extra .saled{
    margin-right: 14px;
    margin-bottom: 6px;
}

.goods .foods-wrapper .food_list .food_item .content .extra .praise{
    height: 15px;
    margin-bottom: 6px;
}

.goods .foods-wrapper .food_list .food_item .content .extra .product{
    height: 15px;
    width: 60px;
    display: block;
    margin-top: 6px;
}

.goods .foods-wrapper .food_list .food_item .content .extra .price{
    margin-top: 6px;
    font-size: 0;
}

.goods .foods-wrapper .food_list .food_item .content .extra .price .text{
    font-size: 14px;
    color: #fb4e44;
}

.goods .foods-wrapper .food_list .food_item .content .extra .price .unit{
    font-size: 12px;
    color: #bfbfbf;
}

</style>

