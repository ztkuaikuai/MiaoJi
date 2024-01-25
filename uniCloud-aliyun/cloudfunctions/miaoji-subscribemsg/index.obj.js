module.exports = {
	_before: function () { // 通用预处理器
		
	},
	
	/**
	 * 订阅模板
	 * @param {Object} tmplId 存放模板id
	 * @returns 消息订阅id
	 */
	async subscribe(tmplId) {	
		const dbJQL = uniCloud.databaseForJQL({ // 获取JQL database引用，此处需要传入云对象的clientInfo
			clientInfo: this.getClientInfo()
		})
		return await dbJQL.collection('mj-submsg').add({
			msg_temp_id: tmplId
		})
	},
	
	/**
	 * 发布订阅消息
	 * @param {Object} tmplId 信息模板id
	 * @param {Object} data	模板数据
	 */
	async publish(tmplId, data) {
		const dbJQL = uniCloud.databaseForJQL({ // 获取JQL database引用，此处需要传入云对象的clientInfo
			clientInfo: this.getClientInfo()
		})
		// 根据模板id获取订阅此模板的用户数据
		const pubsubList = dbJQL.collection('mj-submsg').where(` msg_temp_id == "${tmplId}" `).getTemp()
		const userList = dbJQL.collection('uni-id-users').field('_id,wx_openid').getTemp()
		const res = await dbJQL.collection(pubsubList, userList).get()
		// 查询有无数据
		if (!res.affectedDocs) {
			throw new Error('此模板信息没有用户订阅')
		}
		// 数据中所有订阅用户的openid构成的数组
		let openIds = res.data.map((item) => item.user_id[0].wx_openid.mp)
		// 去重
		openIds = Array.from(new Set(openIds))
		console.log('openIds: ',openIds)
		
		// 引入uni-subscribemsg公共模块
		const UniSubscribemsg = require('uni-subscribemsg');
		// 初始化实例
		let uniSubscribemsg = new UniSubscribemsg({
			dcloudAppid: "__UNI__EE89725",
			provider: "weixin-mp",
		})
		
		// 循环openIds，给每个订阅用户发送信息
		for (openId of openIds) {
			// 发送订阅消息
			let response = await uniSubscribemsg.sendSubscribeMessage({
				touser: openId,
				template_id: tmplId,
				page: "pages/index/index", // 小程序页面地址
				miniprogram_state: "developer", // 跳转小程序类型：developer为开发版；trial为体验版；formal为正式版；默认为正式版
				lang: "zh_CN",
				data
			})
			console.log('response', response);
		}
		
	}
}
