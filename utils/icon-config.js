


// 图标若更新了font-class样式，替换掉icon即可；type值关联账单，资产，不宜修改
function assetIconList() {
	return [{
		icon: 'mj-alipay',
		title: '支付宝',
		type: 'zhifubao',
		color: '#06b4fd'
	}, {
		icon: 'mj-wechat',
		title: '微信钱包',
		type: 'weixin',
		color: '#6bcc03'
	}, {
		icon: 'mj-bank-card',
		title: '银行卡',
		type: 'bank',
		color: '#ffcc01'
	}, {
		icon: 'mj-balance',
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
			icon: 'mj-meal',
			title: '餐品',
			type: 'dining'
		},
		{
			icon: 'mj-tea',
			title: '饮品',
			type: 'drink'
		},
		{
			icon: 'mj-fruit',
			title: '水果蔬菜',
			type: 'fruits'
		},
		{
			icon: 'mj-shopping',
			title: '购物',
			type: 'shopping'
		},
		{
			icon: 'mj-bus',
			title: '交通',
			type: 'traffic'
		},
		{
			icon: 'mj-earth',
			title: '住宿',
			type: 'accommodation'
		},
		{
			icon: 'mj-blank-calendar',
			title: '日常',
			type: 'daily'
		},
		{
			icon: 'mj-study',
			title: '学习',
			type: 'study'
		},
		{
			icon: 'mj-recreation',
			title: '娱乐',
			type: 'recreation'
		},
		{
			icon: 'mj-lipstick',
			title: '化妆护肤',
			type: 'beauty-makeup'
		},
		{
			icon: 'mj-navigation-arrow',
			title: '旅游',
			type: 'tour'
		},
		{
			icon: 'mj-medical',
			title: '医疗',
			type: 'medical'
		},
		{
			icon: 'mj-vip',
			title: '会员租用',
			type: 'vip'
		},
		{
			icon: 'mj-communication',
			title: '通讯',
			type: 'communication'
		},
		{
			icon: 'mj-human-group',
			title: '人情',
			type: 'favour'
		},
		{
			icon: 'mj-yuan-circle',
			title: '投资',
			type: 'investment'
		},
		{
			icon: 'mj-flower',
			title: '亲子',
			type: 'maternal-and-infant'
		},
		{
			icon: 'mj-pet',
			title: '宠物',
			type: 'pet'
		},
		{
			icon: 'mj-paintbrush',
			title: '装修',
			type: 'decoration'
		},
		{
			icon: 'mj-loop',
			title: '其他',
			type: 'other'
		}
	]
}

function categoryIconListForIncome() {
	return [{
			icon: 'mj-income',
			title: '主要收入',
			type: 'primary-income'
		},
		{
			icon: 'mj-other-income',
			title: '其他收入',
			type: 'other-income'
		}
	]
}

function categoryIconListForOther() {
	return [{
		icon: 'mj-transfer',
		title: '内部转账',
		type: 'transfer'
	}]
}

/**
 * 查询icon缓存是否过期
 * 
 * @returns true 过期 | false 未过期
 */
function checkIconExpired() {
	const iconExpiredInfo = uni.getStorageSync('icon-expired')
	if (!iconExpiredInfo) return true
	// 当前时间时间戳 单位：秒
	const currentTime = Math.floor(new Date().getTime() / 1000)
	if (iconExpiredInfo < currentTime) return true
	return false
}

// 刷新icon缓存
function refreshIconExpired() {
	// 获取当前时间添加3天的毫秒数
	const threeDaysLater = new Date().getTime() + (3 * 24 * 60 * 60 * 1000)
	// 转换为时间戳
	const timestampAfter3Days = Math.floor(threeDaysLater / 1000)
	uni.setStorageSync('icon-expired', timestampAfter3Days)
}

export function getCategoryIconListForExpend() {
	const isExpired = checkIconExpired()
	if (!isExpired) {
		// icon缓存未过期
		//   缓存中是否有分类-支出样式 如果有，返回
		if (uni.getStorageSync('mj-category-style-for-expend')) {
			return uni.getStorageSync('mj-category-style-for-expend')
		}
	}
	// icon缓存过期 或者 本地存储中没有该数据
	// 1 刷新icon缓存时间
	refreshIconExpired()
	// 2 将新鲜数据存入缓存，并返回数据
	const iconListForExpend = categoryIconListForExpend()
	uni.setStorage({
		key: 'mj-category-style-for-expend',
		data: iconListForExpend
	})
	return iconListForExpend
}

export function getCategoryIconListForIncome() {
	const isExpired = checkIconExpired()
	if (!isExpired) {
		// icon缓存未过期
		//   缓存中是否有分类-收入样式 如果有，返回
		if (uni.getStorageSync('mj-category-style-for-income')) {
			return uni.getStorageSync('mj-category-style-for-income')
		}
	}
	// icon缓存过期 或者 本地存储中没有该数据
	// 1 刷新icon缓存时间
	refreshIconExpired()
	// 2 将新鲜数据存入缓存，并返回数据
	const iconListForIncome = categoryIconListForIncome()
	uni.setStorage({
		key: 'mj-category-style-for-income',
		data: iconListForIncome
	})
	return iconListForIncome
}


export function getAssetsStyle() {
	const isExpired = checkIconExpired()
	if (!isExpired) {
		// icon缓存未过期
		//   缓存中是否有资产样式 如果有，返回
		if (uni.getStorageSync('mj-assets-style')) {
			return uni.getStorageSync('mj-assets-style')
		}
	}
	// icon缓存过期 或者 本地存储中没有该数据
	// 1 刷新icon缓存时间
	refreshIconExpired()
	// 2 将新鲜数据存入缓存，并返回数据
	const assetsStyle = assetIconList()
	uni.setStorage({
		key: 'mj-assets-style',
		data: assetsStyle
	})
	return assetsStyle
}

/**
 * 获取所有记一笔页面的分类icon
 */
export function getAllIconList() {
	let allIconList = []
	// 支出icon
	allIconList.push(...getCategoryIconListForExpend())
	// 收入icon
	allIconList.push(...getCategoryIconListForIncome())
	// 其他icon
	allIconList.push(...categoryIconListForOther())
	return allIconList
}