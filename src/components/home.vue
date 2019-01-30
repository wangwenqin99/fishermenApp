<template>
    <div class="home">
        <navigator title="统计查询"></navigator>
        <ul>
            <router-link
                tag='li'
                v-for="(item,index) in list"
                :to="item.to"
                :key="index"
            >
                <div class="wrapper" :class='item.bgClass'>
                    <div class="title">{{item.title}}</div>
                    <div class="text">{{item.text}}</div>
                </div>
                
            </router-link>
        </ul>
    </div>
</template>

<script>
export default {
    data() {
        return {
            list: [
                {
                    title: "供应统计",
                    text:'Supply statistics',
                    bgClass:'bg1',
                    to: '/support?productType=1'
                },
                {
                    title: "求购统计",
                    bgClass:'bg2',
                    text:'Purchase statistics',
                    to: '/support?productType=2'
                },
                {
                    title: "成交统计",
                    bgClass:'bg3',
                    text:'Transaction statistics',
                    to: '/support?productType=3'
                }
            ]
        }
    },

    created(){
        this.$vux.loading.show();
    },
    mounted() {
        this.$vux.loading.hide();
        let token = this.$route.query.token||'0b0e062d-93be-4016-8d6b-c76ea5ca8c37';
        window.localStorage.setItem('token', token);
        document.title = '统计查询'
    },

    methods: {

    }
}
</script>

<style scoped lang="less">
.home {
    height:100%;
    background:#6DA8FC;
    ul {
        padding-top:41px;
        li {
            margin-top: 25px;
            padding:0 18px;
            font-weight: bold;
            font-size: 18px;
            
            .wrapper{
                position: relative;
                height:116px;
                border-radius: 2px;
                // background:#fff;
                padding-left:49px;
                
                
            }
            .bg1{
                background:url('../assets/images/tjcx_bg_cjtj@3x.png') no-repeat left top;
                background-size: 100% 100%;
            }
            .bg2{
                background:url('../assets/images/tjcx_bg_gytj@3x.png') no-repeat left top;
                background-size: 100% 100%;
            }
            .bg3{
                background:url('../assets/images/tjcx_bg_qgtj@3x.png') no-repeat left top;
                background-size: 100% 100%;
            }
            .title{
                padding-top:26px;
                color:#1A1A1A;
            }
            .text{
                padding-top: 11px;
                color:#CCCCCC;
            }
        }
    }
}
</style>
