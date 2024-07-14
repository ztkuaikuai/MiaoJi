const service = require('./service/index.js');

class UniSubscribemsg {

	// 构造函数
	constructor(data = {}) {
		let {
			dcloudAppid,
			provider, // 平台 weixin-mp 微信小程序 weixin-h5 微信公众号
		} = data;

		this.config = {
			dcloudAppid,
			provider
		}
	}

	// API - 发送订阅消息
	async sendSubscribeMessage(data = {}) {
		let res = await this._call("sendSubscribeMessage", data);
		return res;
	}

	// API - 发送公众号模板消息
	async sendTemplateMessage(data = {}) {
		let res = await this._call("sendTemplateMessage", data);
		return res;
	}
	
	// API - 检测用户是否关注了公众号
	async getSubscribeUserInfo(data = {}) {
		let res = await this._call("getSubscribeUserInfo", data);
		return res;
	}

	// 测试API - 获取当前登录用户的openid（此接口仅测试时使用）
	async getOpenid(data = {}) {
		let res = await this._call("getOpenid", data);
		return res;
	}

	// 私有函数
	async _call(name, data = {}) {
		let runService = service[this.config.provider];
		if (!runService) {
			throw new Error(`不支持平台：${this.config.provider}`);
		}
		let runFunction = runService[name];
		if (!runFunction) {
			throw new Error(`平台：${this.config.provider}不支持：${name}`);
		}
		let res = await runFunction.call(this, data);
		return res;
	}

}

module.exports = UniSubscribemsg;
