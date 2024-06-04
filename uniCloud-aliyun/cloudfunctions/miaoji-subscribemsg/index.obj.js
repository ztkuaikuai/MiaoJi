const mjSubscribemsg = uniCloud.importObject('miaoji-subscribemsg')

module.exports = {
	_before: function () { // 通用预处理器
		
	},
	
	/**
	 * 订阅模板
	 * @param {String} tmplId 存放模板id
	 * @returns 消息订阅id
	 */
	async subscribe(tmplId) {
		const dbJQL = uniCloud.databaseForJQL({ // 获取JQL database引用，此处需要传入云对象的clientInfo
			clientInfo: this.getClientInfo()
		})
		// 查询是否已有数据
		const res = await dbJQL.collection('mj-submsg').where(`user_id == $cloudEnv_uid && msg_temp_id == "${tmplId}" `).get()
		if (res.affectedDocs) {
			// 有数据，count++
			const newCount = res.data[0].count + 1
			return await dbJQL.collection('mj-submsg').where(`user_id == $cloudEnv_uid && msg_temp_id == "${tmplId}" `).update({
				count: newCount
			})
		} else {
			// 无数据，新增
			return await dbJQL.collection('mj-submsg').add({
				msg_temp_id: tmplId
			})
		}
	},
	
	/**
	 * 发布订阅消息
	 * @param {string} tmplId 信息模板id
	 * @param {object} data	模板数据
	 */
	async publish(tmplId, data) {
		let usersInfo
		try{
			usersInfo = await mjSubscribemsg.getUsersInfoByTmplId(tmplId)
		}catch(e){
			return e
		}
		// 引入uni-subscribemsg公共模块
		const UniSubscribemsg = require('uni-subscribemsg');
		// 初始化实例
		let uniSubscribemsg = new UniSubscribemsg({
			dcloudAppid: "__UNI__EE89725",
			provider: "weixin-mp",
		})
		// 循环usersInfo，给每个订阅用户发送信息
		for (const userInfo of usersInfo) {
			const { openId } = userInfo
			// 发送订阅消息
			let response = await uniSubscribemsg.sendSubscribeMessage({
				touser: openId,
				template_id: tmplId,
				page: "pages/index/index", // 小程序页面地址
				miniprogram_state: "trial", // 跳转小程序类型：developer为开发版；trial为体验版；formal为正式版；默认为正式版
				lang: "zh_CN",
				data
			})
			console.log('response', response);
		}
		// 将用户订阅代币-1
		mjSubscribemsg.minusCount(tmplId)
	},
	/**
	 * 根据模板id获取由订阅用户组成的对象数组
	 * @param {string} tmplId 信息模板id
	 * @return {object} 包含用户id和openid的对象数组
	 */
	async getUsersInfoByTmplId(tmplId) {
		const dbJQL = uniCloud.databaseForJQL({ // 获取JQL database引用，此处需要传入云对象的clientInfo
			clientInfo: this.getClientInfo()
		})
		// 指定操作角色为admin
		dbJQL.setUser({
			role: ['admin']
		})
		// 根据模板id获取订阅此模板的用户数据
		const pubsubList = dbJQL.collection('mj-submsg').where(` msg_temp_id == "${tmplId}" && count > 0 `).getTemp()
		const userList = dbJQL.collection('uni-id-users').field('_id,wx_openid').getTemp()
		const res = await dbJQL.collection(pubsubList, userList).get()
		// 查询有无数据
		if (!res.affectedDocs) {
			throw new Error('此模板信息没有用户订阅')
		}
		let usersInfo = res.data.map(item => {
			return {
				count: item.count,
				uid: item.user_id[0]._id,
				openId: item.user_id[0].wx_openid.mp
			}
		})
		return usersInfo
	},
	/**
	 * 根据模板id消耗订阅用户的代币
	 * @param {string} tmplId 信息模板id
	 * @return 
	 */
	async minusCount (tmplId) {
		const db = uniCloud.database()
		const dbCmd = db.command
		
		// 根据模板id更新订阅此模板的用户数据
		await db.collection('mj-submsg').where({
			msg_temp_id: tmplId,
			count: dbCmd.gt(0)
		}).update({
			count: dbCmd.inc(-1)
		})
	}
}
