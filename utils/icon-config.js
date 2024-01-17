


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

// 查询icon缓存是否过期
function checkIconExpired() {
	
}

// 刷新icon缓存
function refreshIconExpired() {
	
}

export function getCategoryIconListForExpend() {
	/** 
	 * 查询icon缓存是否已过期
	 * 	如果未过期，缓存中是否有分类-支出样式
	 * 		如果有，返回
	 * 		如果没有，则从工具库进行赋值，并存入缓存
	 * 	如果过期，刷新icon缓存过期时间，并从工具库进行赋值，将数据存入缓存
	*/
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

export function getCategoryIconListForIncome() {
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


export function getAssetsStyle() {
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


export function getAllIconList() {
	let allIconList = []
	// 缓存中是否有分类-支出样式  如果有 则取缓存，如果没有，则从工具库进行赋值，并存入缓存
	if (uni.getStorageSync('mj-category-style-for-expend')) {
		allIconList.push(...uni.getStorageSync('mj-category-style-for-expend')) 
	} else {
		const iconListForExpend = categoryIconListForExpend()
		uni.setStorage({
			key: 'mj-category-style-for-expend',
			data: iconListForExpend
		})
		allIconList.push(...iconListForExpend)
	}
	// 缓存中是否有分类-收入样式  如果有 则取缓存，如果没有，则从工具库进行赋值，并存入缓存
	if (uni.getStorageSync('mj-category-style-for-income')) {
		allIconList.push(...uni.getStorageSync('mj-category-style-for-income'))
	} else {
		const iconListForIncome = categoryIconListForIncome()
		uni.setStorage({
			key: 'mj-category-style-for-income',
			data: iconListForIncome
		})
		allIconList.push(...iconListForIncome)
	}
	
	// 加入其他icon样式
	allIconList.push(...categoryIconListForOther())
	
	return allIconList
}