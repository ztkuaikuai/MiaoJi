export default {
  // 调试模式
  debug: false,
  isAdmin: false, // 区分管理端与用户端
  loginTypes: [
    "weixin"
  ],
  // 政策协议
  agreements: {
    serviceUrl: 'https://xxx', // 用户服务协议链接
    privacyUrl: 'https://xxx', // 隐私政策条款链接
    // 哪些场景下显示，1.注册（包括登录并注册，如：微信登录、苹果登录、短信验证码登录）、2.登录（如：用户名密码登录）
    scope: ['register', 'login']
  },
  // 提供各类服务接入（如微信登录服务）的应用id
  appid: {
    weixin: {
      // 微信公众号的appid
      h5: 'wx3c9ce7c6b461f399'
    }
  },
  passwordStrength: 'medium',
  /**
	 * 登录后允许用户设置密码（只针对未设置密码得用户）
	 * 开启此功能将 setPasswordAfterLogin 设置为 true 即可
	 * "setPasswordAfterLogin": false
	 *
	 * 如果允许用户跳过设置密码 将 allowSkip 设置为 true
	 * "setPasswordAfterLogin": {
	 *   "allowSkip": true
	 * }
	 * */
  setPasswordAfterLogin: false
}
