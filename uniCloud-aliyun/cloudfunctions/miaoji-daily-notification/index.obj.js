const mjSubscribemsg = uniCloud.importObject('miaoji-subscribemsg')
const mjDailyNoti = uniCloud.importObject('miaoji-daily-notification')

module.exports = {
	_before: function () { // 通用预处理器

	},
	// 定时任务触发函数
	// 每日下午7点半执行，向订阅用户发送每日记账提醒
	_timing: async function () {
		mjDailyNoti.dailyNotification()
	},
	async dailyNotification(){
		const tmplId = 'n2kSsJNErg1EWpRrKqTDz2yZvyqC-LH7pLmudAsWNDE'
		
		const dbJQL = uniCloud.databaseForJQL({ // 获取JQL database引用，此处需要传入云对象的clientInfo
			clientInfo: this.getClientInfo()
		})
		// 指定操作角色为admin
		dbJQL.setUser({
			role: ['admin']
		})
		
		const usersInfo = await mjSubscribemsg.getUsersInfoByTmplId(tmplId)
		
		// 引入uni-subscribemsg公共模块
		const UniSubscribemsg = require('uni-subscribemsg');
		// 初始化实例
		let uniSubscribemsg = new UniSubscribemsg({
			dcloudAppid: "__UNI__EE89725",
			provider: "weixin-mp",
		})
		
		
		const today = new Date()
		const year = today.getFullYear()
		const month = today.getMonth() + 1
		const formattedMonth = month < 10 ? '0' + month : month
		const formattedDate = `${year}-${formattedMonth}`
		
		function getYesterdayDate() {
		  // 创建一个新的Date对象，它将自动设置为当前日期和时间
		  const today = new Date();
		
		  // 获取昨天的日期，通过减去一天来实现
		  const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
		
		  // 获取年、月、日
		  const year = yesterday.getFullYear();
		  const month = yesterday.getMonth() + 1; // getMonth()返回的月份是从0开始的
		  const day = yesterday.getDate();
		
		  // 格式化日期，确保月份和日期是两位数
		  const formattedMonth = month < 10 ? '0' + month : month;
		  const formattedDay = day < 10 ? '0' + day : day;
		
		  // 组合年、月、日，形成所需的格式
		  const formattedDate = `${year}-${formattedMonth}-${formattedDay}`;
		
		  return formattedDate;
		}
		const yesterdayDate = getYesterdayDate()
		
		
		for (const userInfo of usersInfo) {
			console.log('userInfo',userInfo)
			// 获取昨日支出、收入
			const yesterdayRes = await dbJQL.collection("mj-user-bills").where(`user_id == "${userInfo.uid}" && dateToString(add(new Date(0),bill_date),"%Y-%m-%d","+0800") == "${yesterdayDate}"`).groupBy('bill_type').groupField('sum(bill_amount) as bill_amount_total').orderBy('bill_type asc').get()
			console.log('yesterdayRes: ',yesterdayRes);
			const yesterExpenseTemp = yesterdayRes.data.filter(item => item.bill_type === 0)[0]?.bill_amount_total / 100 || '0'
			const yesterTransferBalanceTemp = yesterdayRes.data.filter(item => item.bill_type === 2)[0]?.bill_amount_total / 100 || '0'
			const yesterIncomeTemp = yesterdayRes.data.filter(item => item.bill_type === 1)[0]?.bill_amount_total / 100 || '0'
			// 昨日支出和收入
			const yesterdayExpense = Number(yesterExpenseTemp) + Number(yesterTransferBalanceTemp)
			const yesterdayIncome = Number(yesterIncomeTemp)
			
			// 获取本月支出
			// 筛选条件 bill_date 日期格式化成 2023-09 的字段，按照账单类型进行分组，并计算每个分组的总价
			const res = await dbJQL.collection("mj-user-bills").where(`user_id == "${userInfo.uid}" && dateToString(add(new Date(0),bill_date),"%Y-%m","+0800") == "${formattedDate}"`).groupBy('bill_type').groupField('sum(bill_amount) as bill_amount_total').orderBy('bill_type asc').get()
			console.log(res)
			const monthlyExpenseTemp = res.data.filter(item => item.bill_type === 0)[0]?.bill_amount_total / 100 || '0'
			const transferBalanceTemp = res.data.filter(item => item.bill_type === 2)[0]?.bill_amount_total / 100 || '0'
			// 月支出 = 月支出 + 转账的手续费
			const monthlyExpense = Number(monthlyExpenseTemp) + Number(transferBalanceTemp)
			
			// 发送订阅消息
			let response = await uniSubscribemsg.sendSubscribeMessage({
				touser: userInfo.openId,
				template_id: tmplId,
				page: "pages/index/index", // 小程序页面地址
				miniprogram_state: "formal", // 跳转小程序类型：developer为开发版；trial为体验版；formal为正式版；默认为正式版
				lang: "zh_CN",
				data: {
					"thing3": {
						"value": "记得记记记账啊啊啊！"
					},
					"amount6": {
						"value": `${yesterdayExpense.toFixed(2)}元`
					},
					"amount10": {
						"value": `${yesterdayIncome.toFixed(2)}元`
					},
					"amount7": {
						"value": `${monthlyExpense.toFixed(2)}元`
					}
				}
			})
			console.log('response', response);
			
		}
		// 将用户订阅代币-1
		mjSubscribemsg.minusCount(tmplId)
	}
	
	
}
