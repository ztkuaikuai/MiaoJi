function assetIconList() {
	return [{
		icon: 'mj-zhifubao',
		title: '支付宝',
		type: 'zhifubao',
		color: '#06b4fd'
	}, {
		icon: 'mj-weixinzhifu',
		title: '微信钱包',
		type: 'weixin',
		color: '#6bcc03'
	}, {
		icon: 'mj-yinhangqia',
		title: '银行卡',
		type: 'bank',
		color: '#ffcc01'
	}, {
		icon: 'mj-yue',
		title: '余额',
		type: 'yue',
		color: '#fe9c01'
	}, {
		icon: 'mj-creditcard',
		title: '默认账户',
		type: 'default',
		color: '#212121'
	}]
}

function categoryIconListForExpend() {
	return [{
			icon: 'mj-wucan',
			title: '餐饮',
			type: 'dining'
		},
		{
			icon: 'mj-duogouwu',
			title: '购物',
			type: 'shopping'
		},
		{
			icon: 'mj-jiaotong',
			title: '交通',
			type: 'traffic'
		},
		{
			icon: 'mj-zhusu',
			title: '住宿',
			type: 'accommodation'
		},
		{
			icon: 'mj-fuzhi',
			title: '日常',
			type: 'daily'
		},
		{
			icon: 'mj-youji',
			title: '学习',
			type: 'study'
		},
		{
			icon: 'mj-yule',
			title: '娱乐',
			type: 'recreation'
		},
		{
			icon: 'mj-meizhuang',
			title: '美妆',
			type: 'beauty-makeup'
		},
		{
			icon: 'mj-ziranfengguang',
			title: '旅游',
			type: 'tour'
		},
		{
			icon: 'mj-yiliao',
			title: '医疗',
			type: 'medical'
		},
		{
			icon: 'mj-huiyuan',
			title: '会员租用',
			type: 'vip'
		},
		{
			icon: 'mj-shouji',
			title: '通讯',
			type: 'communication'
		},
		{
			icon: 'mj-renwen',
			title: '人情',
			type: 'favour'
		},
		{
			icon: 'mj-huobiduihuan',
			title: '投资',
			type: 'investment'
		},
		{
			icon: 'mj-qinzi',
			title: '母婴',
			type: 'maternal-and-infant'
		},
		{
			icon: 'mj-xiedaichongwu',
			title: '宠物',
			type: 'pet'
		},
		{
			icon: 'mj-dianpuzhuangxiu',
			title: '装修',
			type: 'decoration'
		},
		{
			icon: 'mj-qita',
			title: '其他',
			type: 'other'
		}
	]
}

function categoryIconListForIncome() {
	return [{
			icon: 'mj-gaoxiaofei',
			title: '主要收入',
			type: 'primary-income'
		},
		{
			icon: 'mj-dixiaofei',
			title: '其他收入',
			type: 'other-income'
		}
	]
}

function getCategoryIconListForExpend() {
	// 缓存中是否有分类-支出样式  如果有 则取缓存，如果没有，则从工具库进行赋值，并存入缓存
	if (uni.getStorageSync('mj-category-style-for-expend')) {
		return uni.getStorageSync('mj-category-style-for-expend')
	} else {
		const iconListForExpend = categoryIconListForExpend()
		uni.setStorage({
			key: 'mj-category-style-for-expend',
			data: iconListForExpend
		})
		return iconListForExpend
	}
}

function getCategoryIconListForIncome() {
	// 缓存中是否有分类-收入样式  如果有 则取缓存，如果没有，则从工具库进行赋值，并存入缓存
	if (uni.getStorageSync('mj-category-style-for-income')) {
		return uni.getStorageSync('mj-category-style-for-income')
	} else {
		const iconListForIncome = categoryIconListForIncome()
		uni.setStorage({
			key: 'mj-category-style-for-income',
			data: iconListForIncome
		})
		return iconListForIncome
	}
}


function getAssetsStyle() {
	// 缓存中是否有资产样式  如果有 则取缓存，如果没有，则从工具库进行赋值，并存入缓存
	if (uni.getStorageSync('mj-assets-style')) {
		return uni.getStorageSync('mj-assets-style')
	} else {
		const assetsStyle = assetIconList()
		uni.setStorage({
			key: 'mj-assets-style',
			data: assetsStyle
		})
		return assetsStyle
	}
}

export default {
	getCategoryIconListForExpend,
	getCategoryIconListForIncome,
	getAssetsStyle
}