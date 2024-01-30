const mjSubscribemsg = uniCloud.importObject('miaoji-subscribemsg')

module.exports = {
	_before: function () { // 通用预处理器

	},
	// 定时任务触发函数
	_timing: function (params) {
		const dbJQL = uniCloud.databaseForJQL({ // 获取JQL database引用，此处需要传入云对象的clientInfo
			clientInfo: this.getClientInfo()
		})
		// 指定操作角色为admin
		dbJQL.setUser({
			role: ['admin']
		})
	}
}
