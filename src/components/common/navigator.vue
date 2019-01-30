<template>
    <div class="navigator">
        <div class="nav-wrap">
            <div class="max-wrap">
                <button
                    class="left-btn back-btn"
                    @click="back()"
                ></button>
                <p
                    class="title"
                    v-if="title"
                >{{title}}</p>
            </div>

        </div>
        <div class="empty"></div>
    </div>
</template>
<script>
export default {
    name: 'navigator',
    props: {
        title: {
            type: String,
            default: ''
        },
    },

    data() {
        return {
        }
    },
    methods: {
        close() {
            this.$refs.searchBar.closeBar();
        },
        back() {
            if(this.title == '统计查询') { 
                try{
                    if (window.JsInterface) {
                        window.JsInterface.closeWebView();
                    }
                }
                catch(err){
                    console.log(err);
                }
            }else{
                window.history.go(-1);
            }
        }

    }
}
</script>
<style lang="less" scoped>
@cor: #ffffff;
.navigator {
    .nav-wrap {
        position: fixed;
        width: 100%;
        left: 0;
        top: 0;
        height: 44px;
        background-color: #3B8BFC;
        z-index: 100;
        text-align: center;
        .max-wrap {
            // border-bottom: 1px solid rgba(218, 218, 229, 0.7);
        }
        .left-btn {
            position: absolute;
            height: 100%;
            top: 0;
            left: 10px;
            color: @cor;
            font-size: 16px;
            line-height: 44px;
            &.back-btn {
                background: url("./images/back.png") no-repeat
                    left center;
                background-size: 21px 21px;
                padding-left: 18px;
            }
           
        }
        .title {
            text-align: center;
            color: @cor;
            font-size: 18px;
            line-height: 44px;
        }
    }
    .empty {
        height: 44px;
    }
}
</style>