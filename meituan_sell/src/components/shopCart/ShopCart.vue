<template>
    <div class="shopcart">
        <div class="shopcart-wrapper" :class="{'highlight': totalCount>0}">
            <div class="content-left">
                <div class="logo-wrapper" :class="{'highlight': totalCount>0}" @click="toggleList">
                    <span class="icon-shopping_cart logo" :class="{'highlight': totalCount>0}"></span>
                    <i class="num" v-show="totalCount">{{totalCount}}</i>
                </div>
                <div class="desc-wrapper">
                    <p class="total-price" v-show="totalPrice">￥{{totalPrice}}</p>
                    <p class="tip" :class="{highlight: totalCount>0}">{{poiInfo.shipping_fee_tip}}</p>
                </div>
            </div>
            <div class="content-right" :class="{highlight: totalCount>0}">
                {{payStr}}
            </div>
        
            <div class="shopcart-list" v-show="listShow" :class="{'show':listShow}">
                <div class="list-top" v-if="poiInfo.discounts2">
                    {{poiInfo.discounts2[0].info}}
                </div>
                <div class="list-header">
                    <h3 class="title">1号口袋</h3>
                    <div class="empty" @click="emptyFn">
                        <img src="./ash_bin.png" alt="">
                        <span>清空购物车</span>
                    </div>
                </div>
                <div class="list-content" ref="listContent">
                    <ul>
                        <li class="food-item" v-for="(food, index) in selectFoods" :key="index">
                            <div class="desc-wrapper">
                                <div class="desc-left">
                                    <p class="name">{{food.name}}</p>
                                    <p class="unit" v-show="!food.description">{{food.unit}}</p>
                                    <p class="description" v-show="food.description">{{food.description}}</p>
                                </div>
                                <div class="desc-right">
                                    <span class="price">￥{{food.min_price}}</span>
                                </div>
                            </div>
                            <div class="cartcontrol-wrapper">
                                <CartControl :food="food"></CartControl>
                            </div>
                        </li>
                    </ul>
                </div>
                <div class="list-bottom"></div>
            </div>
        </div>
        <div class="shopcart-mask" v-show="listShow" @click="hideMask"></div>
    </div>
</template>

<script>
    import CartControl from "components/cartControl/CartControl.vue"
    import BScroll from "better-scroll" 
    export default{
        data(){
            return {
                fold: true,
            }
        },
        props:{
            poiInfo: {
                type: Object,
                defult: {},
            },
            selectFoods: {
                type: Array,
                default(){
                    return [];
                }
            },
        },
        computed:{
            totalCount(){
                let num = 0;
                this.selectFoods.forEach((food) => {
                    num += food.count;
                });
                // console.log("Shopcart")
                // console.log(this.selectFoods)
                return num;
            },

            totalPrice(){
                let total = 0;
                this.selectFoods.forEach((food) => {
                    total += food.min_price * food.count;
                });
                return total;
            },
            // 结算按钮显示
            payStr(){
                if(this.totalCount > 0){
                    return "去结算";
                }
                else{
                    return this.poiInfo.min_price_tip;
                }
            },
            listShow(){
                if(!this.totalCount){
                    this.fold = true;
                    return false;
                }
                let show = !this.fold;
                console.log("listShow");
                console.log(show);
                //BScroll
                this.$nextTick(() => {
                    if(show){
                        if(!this.shopScroll){
                            this.shopScroll = new BScroll(this.$refs.listContent, {
                                click: true,
                            });
                        }else{
                            this.shopScroll.refresh();
                        }
                    }
                });

                return show;
            },
        },

        methods: {
            toggleList() {
                if(!this.totalCount){
                    return;
                }
                this.fold = !this.fold;
            },

            emptyFn(){
                this.selectFoods.forEach((food) => {
                    food.count = 0;
                });
            },
            hideMask(){
                this.fold = true;
            },
        },

        components:{
            CartControl,
            BScroll,
        }

    }
</script>

<style>
    /* @import url("../../common/styles/icon.css"); */
    @import url("ShopCart.css");
</style>

