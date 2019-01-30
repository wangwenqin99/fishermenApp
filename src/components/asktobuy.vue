<template>
    <div class="asktobuy">
        <navigator title="求购统计"></navigator>
        <div ref="echart"
            style="width:350px; height:500px"
        ></div>
    </div>
</template>

<script>
import echarts from "echarts";
export default {
    name: 'asktobuy',
    data() {
        return {
            msg: 'Welcome to Your Vue.js App'
        }
    },
    mounted() {
        // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(this.$refs.echart);
        // 绘制图表
        myChart.setOption({
            title: { 
                text: 'ECharts 入门示例' ,
                x:"center"
            },
            tooltip: {},
            xAxis: {
                data: ["衬衫", "衫", "雪衫", "裤子", "鞋", "袜子"]
            },
            yAxis: {},
            series: [{
                name: '销量',
                type: 'bar',
                data: [5, 20, 36, 10, 10, 20]
            }]
        });

    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">

</style>
