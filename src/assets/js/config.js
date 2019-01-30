let pre = 'http://112.47.5.20:18867/V1.0';//接口前缀

// 接口地址
let apiUrl = {
	// 主流程
    statistics: pre+'/product/statistics',//供应/求购统计【front】
    getCatagory: pre+'/category/cats/0',//获取所有品类
    catdayaccount: pre+'/catdayaccount',//成交统计
    orderaccount: pre+'/orderaccount',//获取订单饼图统计
    columaccount: pre+'/columaccount',//区域成交统计
}
export {
	apiUrl
}