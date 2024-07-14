const subscribemsg = uniCloud.importObject('miaoji-subscribemsg')
/**
 * 订阅单个模板消息
 * @param {Array} tmplIds 模板消息组成的数组
 */
export const subscribeMessage = async (tmplIds) => {
	const res = await uni.requestSubscribeMessage({tmplIds})
	// 用户成功订阅
	if (res[tmplIds[0]] === 'accept') {
		// 调用云对象的订阅，传入信息模板id
		subscribemsg.subscribe(tmplIds[0])
	}
}