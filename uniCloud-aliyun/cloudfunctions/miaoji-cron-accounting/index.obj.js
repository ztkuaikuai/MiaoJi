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
		
		for (const oneCron of data) {
			console.log('oneCron: ',oneCron);
			// 查询是否存在模板
			if (oneCron.template_id.length === 0) {
				// 该任务无模板(原因:用户将任务绑定的模板删除),将状态更新为0 暂停
				await db.collection('mj-user-cron-accounting').doc(oneCron._id).update({
					state: 0
				})
				continue
			}
			await mjCronAccounting.addBillForUser(oneCron.template_id)
			await mjCronAccounting.updateUserAssets(oneCron.template_id)
			await mjCronAccounting.updateUserCronRule(oneCron)
		}
	},
	/**
	 * 根据定时任务数据，为用户添加账单
	 * @param {Object} data
	 * @returns {Promise<void>}
	 */
	async addBillForUser(data) {
		const db = uniCloud.databaseForJQL({ // 获取JQL database引用，此处需要传入云对象的clientInfo
			clientInfo: this.getClientInfo()
		})
		// 指定操作角色为admin
		db.setUser({
			uid: data[0].user_id,
			role: ['USER']
		})
		
		const templateData = JSON.parse(JSON.stringify(data[0]))
		delete templateData._id
		templateData.bill_notes += ' 来自：定时记账'
		templateData.bill_date = Date.now()
		
		// 添加账单
		await db.collection("mj-user-bills").add(templateData)
	},
	/**
	 * 根据模板数据，更新用户资产
	 * @param {Object} data
	 * @returns {Promise<void>}
	 */
	async updateUserAssets(data) {
		const db = uniCloud.databaseForJQL({ // 获取JQL database引用，此处需要传入云对象的clientInfo
			clientInfo: this.getClientInfo()
		})
		// 指定操作角色为admin
		db.setUser({
			uid: data[0].user_id,
			role: ['USER']
		})
		
		const templateData = JSON.parse(JSON.stringify(data[0]))
		console.log('templateData: ',templateData);
		// 判断账单类型
		const { bill_type } = templateData
		if (bill_type === 0) {
			// 获得资产金额
			const {data} = await db.collection("mj-user-assets").doc(templateData.asset_id).field('asset_balance').get()
			// 计算新金额  若用户已删除绑定的资产账户，则为undefined
			const new_asset_balance = data[0]?.asset_balance - templateData.bill_amount
			new_asset_balance && await db.collection("mj-user-assets").doc(templateData.asset_id).update({
				asset_balance: new_asset_balance
			})
		} else if (bill_type === 1) {
			// 获得资产金额
			const {data} = await db.collection("mj-user-assets").doc(templateData.asset_id).field('asset_balance').get()
			// 计算新金额  若用户已删除绑定的资产账户，则为undefined
			const new_asset_balance = data[0]?.asset_balance + templateData.bill_amount
			new_asset_balance && await db.collection("mj-user-assets").doc(templateData.asset_id).update({
				asset_balance: new_asset_balance
			})
		} else {
			// 获得资产金额
			const {data} = await db.collection("mj-user-assets").where(`_id == "${templateData.asset_id}" || _id == "${templateData.destination_asset_id}"`).field('asset_balance').get()

			let transferOutAssetBalance = data.find(item => item._id === templateData.asset_id)?.asset_balance
			let transferIntoAssetBalance = data.find(item => item._id === templateData.destination_asset_id)?.asset_balance
			
			// 计算新金额
			transferOutAssetBalance = transferOutAssetBalance - templateData.bill_amount - templateData.transfer_amount
			transferIntoAssetBalance = transferIntoAssetBalance + templateData.transfer_amount
			
			// 更新
			transferOutAssetBalance && await db.collection("mj-user-assets").doc(templateData.asset_id).update({
				asset_balance: transferOutAssetBalance
			})
			transferIntoAssetBalance && await db.collection("mj-user-assets").doc(templateData.destination_asset_id).update({
				asset_balance: transferIntoAssetBalance
			})
		}
	},
	/**
	 * 更新定时任务的下次执行时间、执行次数、状态
	 * @param {Object} oneCronTask
	 * @returns {Promise<void>}
	 */
	async updateUserCronRule(oneCronTask) {
		const db = uniCloud.databaseForJQL({ // 获取JQL database引用，此处需要传入云对象的clientInfo
			clientInfo: this.getClientInfo()
		})
		// 指定操作角色为admin
		db.setUser({
			role: ['admin']
		})
		
		// 已执行次数++
		const executed_count = oneCronTask.rule.executed_count + 1
		// 判断该任务是否已结束
		let state = oneCronTask.state
		if (oneCronTask.rule.end_manner.type !== 'infinite' && executed_count >= oneCronTask.rule.end_manner.count) {
			state = -1
		}
		// 更新最近执行时间
		const recent_execution_time = oneCronTask.rule.expected_next_execution_time
		// 更新下次执行时间
		function getDateByTimestamp(timestamp) {
		  // 创建一个新的Date对象
		  const today = new Date(timestamp);
		
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
		const dayTimestamp = oneCronTask.rule.repetition_cycle.count * 24 * 60 * 60 * 1000
		const recentTimestamp = new Date(recent_execution_time).getTime()
		const expected_next_execution_time = getDateByTimestamp(recentTimestamp + dayTimestamp)
		
		// 更新定时任务
		await db.collection('mj-user-cron-accounting').doc(oneCronTask._id).update({
			state,
			rule: {
				executed_count,
				recent_execution_time,
				expected_next_execution_time
			}
		})
	},
	
	
	
	
	/**
	 * 根据id获取定时任务数据
	 * @param {String} id
	 * @returns {Promise<void>}
	 */
	async getCronAccountingById(id) {
		const db = uniCloud.databaseForJQL({ // 获取JQL database引用，此处需要传入云对象的clientInfo
			clientInfo: this.getClientInfo()
		})
		// 指定操作角色为admin
		db.setUser({
			role: ['admin']
		})
		
		const cronTemp = db.collection('mj-user-cron-accounting').where(`_id == "${id}"`).getTemp()
		const templateTemp = db.collection("mj-user-templates").field('_id,user_id,category_type,bill_type,bill_amount,asset_id,bill_notes,transfer_amount,destination_asset_id').getTemp()
		const { data } = await db.collection(cronTemp, templateTemp).get()
		const oneCron = data[0]
		
		await mjCronAccounting.addBillForUser(oneCron.template_id)
		await mjCronAccounting.updateUserAssets(oneCron.template_id)
		await mjCronAccounting.updateUserCronRule(oneCron)
	},
}
