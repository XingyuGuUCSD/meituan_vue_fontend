<template>
    <div class="seller">
        <div class="seller-wrapper">
            <div class="seller-view">
                <div class="address-wrapper">
                    <div class="address-left">
                        {{seller.address}}
                    </div>
                    <div class="address-right">
                        <div class="content"></div>
                    </div>
                </div>
                <div class="pics-wrapper" ref="picsView">
                    <ul class="pics-list" v-if="seller.poi_env" ref="picsList">
                        <li class="pics-item" v-for="(imgurl, index) in seller.poi_env.thumbnails_url_list" :key="index" ref="picsItem">
                            <img :src="imgurl" />
                        </li>
                    </ul>
                </div>
                <div class="safety-wrapper">
                    查看食品安全档案
                    <span class="icon-keyboard_arrow_right"></span>
                </div>
            </div>

            <Split></Split>
            <div class="tip-wrapper">
                <div class="delivery-wrapper">
                    配送服务:{{seller.app_delivery_tip}}
                </div>
                <div class="shipping-wrapper">
                    配送时间:{{seller.shipping_time}}
                </div>
            </div>
            
            <Split></Split>
            <div class="other-wrapper">
                <div class="server-wrapper">
                    商家服务
                    <div class="poi-server" v-for="(item, index) in seller.poi_service" :key="index">
                        <img :src="item.icon" />
                        {{item.content}}
                    </div>
                </div>
                <div class="discounts-wrapper">
                    <div class="discounts-item" v-for="(item, index) in seller.discounts2" :key="index">
                        <div class="icon">
                            <img :src="item.icon_url" />
                        </div>
                        <div class="text">
                            {{item.info}}
                        </div>
                    </div>
                </div>
            </div>
            <Split class="split-bottom"></Split>
        </div>
    </div>
</template>

<script>
    import Split from "components/split/Split.vue"
    import BScroll from "better-scroll"
    export default{
        data(){
            return {
                seller: {},
            }
        },
        created(){
            let that = this;
            this.$axios.get('/api/seller')
                .then(function(response){
                    var dataSource = response.data;
                    if(dataSource.code == 0){
                        that.seller = dataSource.data;

                        that.$nextTick(()=>{
                            if(that.seller.poi_env.thumbnails_url_list){
                                let imgW = that.$refs.picsItem[0].clientWidth;
                                let marginR = 11;

                                // 为了让实际的宽度超过限制宽度，从而可以使用BScroll
                                let width = (imgW + marginR) * that.seller.poi_env.thumbnails_url_list.length;
                                that.$refs.picsList.style.width = width + "px";

                                that.scroll = new BScroll(that.$refs.picsView,{
                                    scrollX: true,
                                })

                            }
                        });
                    }
                })
                .catch(function(error){
                    console.log(error)
                });
        },
        components: {
            Split,
            BScroll,
        },
    }
</script>

<style>
    @import url("Seller.css");
</style>

