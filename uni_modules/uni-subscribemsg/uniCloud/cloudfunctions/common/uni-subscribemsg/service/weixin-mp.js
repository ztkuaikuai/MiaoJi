const {
	getAccessToken
} = require('uni-open-bridge-common')

const configCenter = require('uni-config-center')
const uniIdConfig = configCenter({
	pluginId: 'uni-id'
});

module.exports = {
	// 发送订阅消息
	sendSubscribeMessage: async function(obj = {}) {
		let {
			touser, // 接收者（用户）的 openid
			template_id, // 所需下发的订阅模板id
			page, // 点击模板卡片后的跳转页面，仅限本小程序内的页面。支持带参数,（示例index?foo=bar）。该字段不填则模板无跳转。
			data, // 模板内容，格式形如 { "key1": { "value": any }, "key2": { "value": any } }
			miniprogram_state = "formal", // 跳转小程序类型：developer为开发版；trial为体验版；formal为正式版；默认为正式版
			lang = "zh_CN", // 进入小程序查看”的语言类型，支持zh_CN(简体中文)、en_US(英文)、zh_HK(繁体中文)、zh_TW(繁体中文)，默认为zh_CN
		} = obj;
		let getAccessTokenRes = await getAccessToken({
			dcloudAppid: this.config.dcloudAppid,
			provider: 'weixin-mp'
		});
		let access_token = getAccessTokenRes.access_token;
		let url = `https://api.weixin.qq.com/cgi-bin/message/subscribe/send?access_token=${access_token}`;
		let requestRes = await uniCloud.httpclient.request(url, {
			method: "POST",
			dataType: "json",
			headers: {
				"content-type": "application/json"
			},
			data: {
				touser,
				template_id,
				page,
				data,
				miniprogram_state,
				lang
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
	// 小程序发公众号模板消息
	sendTemplateMessage: async function(obj = {}) {
		let {
			appid,
			touser, // 接收者（用户）的 openid
			template_id, // 所需下发的订阅模板id
			url, // 点击模板卡片后的跳转的链接地址。该字段不填则模板无跳转。
			miniprogram, // 跳小程序所需数据，不需跳小程序可不用传该数据
			data, // 模板内容，格式形如 { "key1": { "value": any }, "key2": { "value": any } }
		} = obj;
		let getAccessTokenRes = await getAccessToken({
			dcloudAppid: this.config.dcloudAppid,
			provider: 'weixin-mp'
		});
		if (!appid) {
			try {
				appid = uniIdConfig.config()["web"].oauth["weixin-h5"].appid;
			} catch (err) {}
		}
		let access_token = getAccessTokenRes.access_token;
		let requestUrl = `https://api.weixin.qq.com/cgi-bin/message/wxopen/template/uniform_send?access_token=${access_token}`;
		let requestRes = await uniCloud.httpclient.request(requestUrl, {
			method: "POST",
			dataType: "json",
			headers: {
				"content-type": "application/json"
			},
			data: {
				touser,
				mp_template_msg: {
					appid,
					template_id,
					url,
					miniprogram,
					data
				}
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
	// 根据code获取openid（此接口仅为演示时使用，实际应该通过uniId的微信登录时就已经拿到了openid）
	getOpenid: async function(obj = {}) {
		let {
			code
		} = obj;
		let { appid, appsecret } = uniIdConfig.config()["mp-weixin"].oauth.weixin;
		let url =
			`https://api.weixin.qq.com/sns/jscode2session?appid=${appid}&secret=${appsecret}&js_code=${code}&grant_type=authorization_code`;
		let requestRes = await uniCloud.httpclient.request(url, {
			method: "get",
			dataType: "json",
			headers: {
				"content-type": "application/json"
			}
		})
		let result = requestRes.data;
		let res = {
			errCode: result.errcode || 0,
			errMsg: result.errmsg,
			openid: result.openid
		};
		return res;
	}
}
