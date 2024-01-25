const {
	getAccessToken
} = require('uni-open-bridge-common')

module.exports = {
	// 发送模板消息
	sendTemplateMessage: async function(obj = {}) {
		let {
			touser, // 接收者（用户）的 openid
			template_id, // 所需下发的订阅模板id
			url, // 点击模板卡片后的跳转的链接地址。该字段不填则模板无跳转。
			miniprogram, // 跳小程序所需数据，不需跳小程序可不用传该数据
			data, // 模板内容，格式形如 { "key1": { "value": any }, "key2": { "value": any } }
			client_msg_id, // 防重入id。对于同一个openid + client_msg_id, 只发送一条消息,10分钟有效,超过10分钟不保证效果。若无防重入需求，可不填
		} = obj;
		let getAccessTokenRes = await getAccessToken({
			dcloudAppid: this.config.dcloudAppid,
			provider: 'weixin-h5'
		});
		let access_token = getAccessTokenRes.access_token;
		let requestUrl = `https://api.weixin.qq.com/cgi-bin/message/template/send?access_token=${access_token}`;
		let requestRes = await uniCloud.httpclient.request(requestUrl, {
			method: "POST",
			dataType: "json",
			headers: {
				"content-type": "application/json"
			},
			data: {
				touser,
				template_id,
				url,
				miniprogram,
				data,
				client_msg_id
			},
			useContent: true
		})
		let result = requestRes.data;
		let res = {
			errCode: result.errcode || 0,
			errMsg: result.errmsg,
			result: result
		};
		return res;
	},
	// 检测用户是否关注了公众号
	getSubscribeUserInfo: async function(obj = {}) {
		let {
			openid, // 用户openid
		} = obj;
		let getAccessTokenRes = await getAccessToken({
			dcloudAppid: this.config.dcloudAppid,
			provider: 'weixin-h5'
		});
		let access_token = getAccessTokenRes.access_token;
		let requestUrl = `https://api.weixin.qq.com/cgi-bin/user/info?access_token=${access_token}&openid=${openid}&lang=zh_CN`;
		let requestRes = await uniCloud.httpclient.request(requestUrl, {
			method: "GET",
			dataType: "json",
			headers: {
				"content-type": "application/json"
			}
		})
		let result = requestRes.data;
		let res = {
			errCode: result.errcode || 0,
			errMsg: result.errmsg,
			subscribe: result.subscribe === 1 ? true : false,
			result: result
		};
		return res;
	},
	
}
