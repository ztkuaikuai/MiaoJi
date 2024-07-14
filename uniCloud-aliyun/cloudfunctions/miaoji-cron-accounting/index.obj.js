// 云对象教程: https://uniapp.dcloud.net.cn/uniCloud/cloud-obj
// jsdoc语法提示教程：https://ask.dcloud.net.cn/docs/#//ask.dcloud.net.cn/article/129
const mjCronAccounting = uniCloud.importObject('miaoji-cron-accounting')

module.exports = {
	_before: function () { // 通用预处理器
		
	},
	// 定时任务触发函数
	// 每日凌晨4点半执行定时任务
	_timing: async function () {
		await mjCronAccounting.getTodayCronAccountingList()
	},
	async test() {
		await mjCronAccounting.getTodayCronAccountingList()
	},
	/**
	 * 获得当天需要执行的定时任务列表
	 * @returns {Promise<void>}
	 */
	async getTodayCronAccountingList() {
		// 1 获取今天的日期 'YYYY-MM-DD'
		// 2 查询 "状态为1 下次执行日期==今天的定时任务数据"，根据模板id联查模板数据
		// 3 遍历数据，依次执行定时任务
		
		function getTodayDate() {
		  // 创建一个新的Date对象，它将自动设置为当前日期和时间
		  const today = new Date();
		
		  // 获取年、月、日
		  const year = today.getFullYear();
		  const month = today.getMonth() + 1; // getMonth()返回的月份是从0开始的
		  const day = today.getDate();
		
		  // 格式化日期，确保月份和日期是两位数
		  const formattedMonth = month < 10 ? '0' + month : month;
		  const formattedDay = day < 10 ? '0' + day : day;
		
		  // 组合年、月、日，形成所需的格式
		  const formattedDate = `${year}-${formattedMonth}-${formattedDay}`;
		
		  return formattedDate;
		}
		
		const targetDay = getTodayDate()
		
		const db = uniCloud.databaseForJQL({ // 获取JQL database引用，此处需要传入云对象的clientInfo
			clientInfo: this.getClientInfo()
		})
		// 指定操作角色为admin
		db.setUser({
			role: ['admin']
		})
		
		const cronTemp = db.collection('mj-user-cron-accounting').where(`state == 1 && rule.expected_next_execution_time == "${targetDay}"`).getTemp()
		const templateTemp = db.collection("mj-user-templates").field('_id,user_id,category_type,bill_type,bill_amount,asset_id,bill_notes,transfer_amount,destination_asset_id').getTemp()
		const { data } = await db.collection(cronTemp, templateTemp).get()
		console.log('data: ',data);
		for (const oneCron of data) {
			// 
			await mjCronAccounting.addBillForUser(oneCron.template_id)
			await mjCronAccounting.updateUserAssets(oneCron.template_id)
			await mjCronAccounting.updateUserCronRule(oneCron)
		}
	},
	/**
	 * 根据定时任务数据，为用户添加账单
	 * @param {Object} data
	 */
	async addBillForUser(data) {
		
	},
	/**
	 * 根据模板数据，更新用户资产
	 * @param {Object} data
	 */
	async updateUserAssets(data) {
		
	},
	/**
	 * 更新定时任务的下次执行时间、执行次数、状态
	 */
	async updateUserCronRule() {
		
	},
	
	
	
	
	/**
	 * 根据id获取定时任务数据
	 * @param {String} id
	 * @returns {Promise<void>}
	 */
	async getCronAccountingById(id) {
		
	},
}
