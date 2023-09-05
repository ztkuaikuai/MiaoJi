// 检查老用户的token是否过期，如果过期则跳转登录，并返回true；没过期返回false
function checkUserTokenExpierd() {
	const tokenExpierd = uni.getStorageSync('uni_id_token_expired')
	if (tokenExpierd != 0 && tokenExpierd <= Date.now()) {
		// console.log("检查到token过期");
		uni.navigateTo({
			url: "/uni_modules/uni-id-pages/pages/login/login-withoutpwd"
		})
		return true
	}
	return false
}


export default {
	checkUserTokenExpierd
}