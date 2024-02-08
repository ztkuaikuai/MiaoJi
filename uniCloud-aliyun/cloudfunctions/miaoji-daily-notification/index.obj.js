const mjSubscribemsg = uniCloud.importObject('miaoji-subscribemsg')

module.exports = {
	_before: function () { // 通用预处理器

	},
	// 定时任务触发函数
	// 每日下午7点半执行，向订阅用户发送每日记账提醒
	_timing: async function () {
		const dbJQL = uniCloud.databaseForJQL({ // 获取JQL database引用，此处需要传入云对象的clientInfo
			clientInfo: this.getClientInfo()
		})
		// 指定操作角色为admin
		dbJQL.setUser({
			role: ['admin']
		})
		const usersInfo = await mjSubscribemsg.getUsersInfoByTmplId('n2kSsJNErg1EWpRrKqTDz2yZvyqC-LH7pLmudAsWNDE')
		
		for (let userInfo of usersInfo) {
			console.log('userInfo',userInfo);
		}
	},
	
	async test(){
		const dbJQL = uniCloud.databaseForJQL({ // 获取JQL database引用，此处需要传入云对象的clientInfo
			clientInfo: this.getClientInfo()
		})
		// 指定操作角色为admin
		dbJQL.setUser({
			role: ['admin']
		})
		
		const usersInfo = await mjSubscribemsg.getUsersInfoByTmplId('n2kSsJNErg1EWpRrKqTDz2yZvyqC-LH7pLmudAsWNDE')
		
		// 引入uni-subscribemsg公共模块
		const UniSubscribemsg = require('uni-subscribemsg');
		// 初始化实例
		let uniSubscribemsg = new UniSubscribemsg({
			dcloudAppid: "__UNI__EE89725",
			provider: "weixin-mp",
		})
		
		for (const userInfo of usersInfo) {
			console.log('userInfo',userInfo)
			// 获取昨日支出、收入
			
			// 获取本月支出
			// 筛选条件 bill_date 日期格式化成 2023-09 的字段，按照账单类型进行分组，并计算每个分组的总价
			const res = await db.collection("mj-user-bills").where(`user_id == "${userInfo.uid}" && dateToString(add(new Date(0),bill_date),"%Y-%m","+0800") == "${this.currentDate}"`).groupBy('bill_type').groupField('sum(bill_amount) as bill_amount_total').orderBy('bill_type asc').get()
			// console.log(res.result.data)
			const monthlyExpenseTemp = res.result.data.filter(item => item.bill_type === 0)[0]?.bill_amount_total / 100 || '0'
			const transferBalanceTemp = res.result.data.filter(item => item.bill_type === 2)[0]?.bill_amount_total / 100 || '0'
			// 分别计算月支出和月收入	月支出 = 月支出 + 转账的手续费	月收入 = 月收入
			const monthlyExpense = Number(monthlyExpenseTemp) + Number(transferBalanceTemp)
		}
	}
}
