<template>
	<view class="home">
		<swiper class="swiper" circular :indicator-dots="true" indicator-dots="rgba(0, 0, 0, .3)"
			indicator-active-color="#303344" duration="500" :circular="false" @change="swiperChange">
			<swiper-item class="swiper-item">
				<view class="header">
					本月支出(元)
				</view>
				<view class="moneyContent">
					<!-- 如果钱超出一定范围，会导致布局有误 -->
					<u--text v-if="isEyeShow" mode="price" :text="monthlyExpense" size="72rpx" color="#000"></u--text>
					<view v-else>
						￥*****
					</view>
					<view class="eye" @click="clickEye">
						<uni-icons v-if="isEyeShow" type="eye" size="56rpx" color="rgba(0,0,0, 0.6)"></uni-icons>
						<uni-icons v-else type="eye-slash" size="56rpx" color="rgba(0,0,0, 0.6)"></uni-icons>
					</view>
				</view>
				<view class="footer">
					<text>本月收入<text class="bold" v-if="isEyeShow">{{monthlyIncome.toFixed(2)}}</text><text class="bold" v-else>*****</text></text>
					<text>月结余<text class="bold" v-if="isEyeShow">{{(monthlyIncome - monthlyExpense).toFixed(2)}}</text><text class="bold" v-else>*****</text></text>
				</view>
				<!-- 占位 -->
				<view class="bottom"></view>
			</swiper-item>
			<swiper-item class="swiper-item">
				<view class="header">
					净资产(元)
				</view>
				<view class="moneyContent">
					<u--text v-if="isEyeShow" mode="price" :text="totalAssets" size="72rpx" color="#000"></u--text>
					<view v-else="isEyeShow">
						￥*****
					</view>
					<view class="eye" @click="clickEye">
						<uni-icons v-if="isEyeShow" type="eye" size="56rpx" color="rgba(0,0,0, 0.6)"></uni-icons>
						<uni-icons v-else type="eye-slash" size="56rpx" color="rgba(0,0,0, 0.6)"></uni-icons>
					</view>
				</view>
				<view class="footer">
					<text>总资产<text class="bold" v-if="isEyeShow">{{totalAssets.toFixed(2)}}</text><text class="bold" v-else>*****</text></text>
				</view>
				<!-- 占位 -->
				<view class="bottom"></view>
			</swiper-item>
		</swiper>
		<view class="bills" v-show="!isIndexShow">
			<view class="header">
				<view class="left">
					<uni-icons type="list" size="48rpx" color="#212121"></uni-icons>
					<text>近三日账单</text>
				</view>
			</view>
			<!-- 组件：账单卡片 -->
			<view v-for="index in 3" :key="index">
				<mj-bill-card :userBillsFromDB="userBills[index].data" :userAssetsFromDB="userAssets" :indexTemp="index"></mj-bill-card>
			</view>
			<view v-show="userBillsCount === 0">
				<u-empty mode="list" text="近日没有账单哦,快去记一笔吧"></u-empty>
			</view>
		</view>
		<view class="asset" v-if="isIndexShow">
			<view class="header">
				<view class="left">
					<uni-icons type="wallet" size="48rpx" color="#212121"></uni-icons>
					<text>我的资产</text>
				</view>
				<view class="right" @click="toMyAssets">
					管理
				</view>
			</view>
			<mj-asset-card :userAssetsFromDB="userAssets" :isEyeShow="isEyeShow" :safeAreaInsetBottom="false"></mj-asset-card>
		</view>
		<!-- 固定定位，最底下 -->
		<view class="bottom-btn" >
			<u-button  :text="bottomBtnText" color="#9fcba7" shape="circle" @click="clickBottomBtn"></u-button>
		</view>
	</view>
</template>

<script>
	import UT from '@/utils/user-state.js'
	const db = uniCloud.database()
	export default {
		data() {
			return {
				isEyeShow: true,
				isIndexShow: 0,  // 0 展示首页  1 展示资产页
				bottomBtnText: '点我记账',
				userAssets: [],
				userBills: [],
				currentDate: uni.$u.timeFormat(Date.now(), 'yyyy-mm'),
				monthlyExpense: 0,
				monthlyIncome: 0,
			}
		},
		computed: {
			// 计算总资产
			totalAssets() {
				// 筛选出计入总资产的资产项
				let userAssetsIncludeInTotalAssets = this.userAssets.filter(item => item.include_in_total_assets == true)
				return userAssetsIncludeInTotalAssets.reduce((lastValue, currentArr) => lastValue + currentArr.asset_balance , 0)
			},
			// 计算近三日账单个数
			userBillsCount() {
				let count = 0
				for (const bills of this.userBills) {
					for(const data of bills.data) {
						// 如果有账单，则count++
						count ++
					}
				}
				return count
			}
		},
		onReady() {
			const state = UT.checkUserTokenExpierd() // 检查老用户的token是否过期，如果过期则跳转登录，并返回true；没过期返回false
			if(state) return
			// console.log("用户token没过期，继续执行下面的逻辑");
			
			// 获取用户3日账单列表
			this.getUserBills()
			uni.$on('updateBillsList',this.getUserBills)
			// 获取用户资产列表
			this.getUserAssets()
			uni.$on('updateAssetsList',this.getUserAssets)
			// 获取用户本月支出和本月收入
			this.getUserMonthlyBillBalance()
			uni.$on('updateMonthlyBillBalance',this.getUserMonthlyBillBalance)
		},
		methods: {
			clickEye() {
				this.isEyeShow = !this.isEyeShow
			},
			toMyAssets() {
				uni.navigateTo({
					url:"/pagesMy/my-assets/my-assets"
				})
			},
			swiperChange(res) {
				this.isIndexShow = res.detail.current
				this.isIndexShow ? this.bottomBtnText = '添加资产' : this.bottomBtnText = '点我记账'
			},
			clickBottomBtn() {
				// 判断用户是否登录，如果未登录 则跳转到登录页
				const {uid} = uniCloud.getCurrentUserInfo()
				if (!uid) {
					uni.redirectTo({
						url: "/uni_modules/uni-id-pages/pages/login/login-withoutpwd"
					})
					return
				}
				let url = ''
				this.isIndexShow ? url = '/pagesAccount/make-an-asset/make-an-asset' : url = '/pagesAccount/make-an-account/make-an-account'
				uni.navigateTo({
					url
				})
			},
			// 获取用户3日账单列表
			async getUserBills() {
				const res = await this.get3DayBills()
				this.userBills = []
				this.userBills = res
				// 统一修改金额
				this.userBills.forEach(item => {
					item.data.forEach(bill => bill.bill_amount /= 100)
				})
				console.log('userBills',this.userBills)
				uni.setStorage({
					key:'mj-user-bills',
					data: this.userBills
				})
			},
			async get3DayBills() {
				const today = uni.$u.timeFormat(Date.now(), 'yyyy-mm-dd')
				const yesterday = uni.$u.timeFormat(Date.now() - 86400000, 'yyyy-mm-dd')
				const theDaybeforeYesterday = uni.$u.timeFormat(Date.now() - 172800000, 'yyyy-mm-dd')
				// 分别获取今天，昨天，前天的账单列表
				const day1 = db.collection("mj-user-bills").where(`user_id == $cloudEnv_uid && bill_date > (new Date().getTime() - 86400000) && dateToString(add(new Date(0),bill_date),"%Y-%m-%d","+0800") == "${today}"`).orderBy('bill_date desc').getTemp()
				const day2 = db.collection("mj-user-bills").where(`user_id == $cloudEnv_uid && bill_date > (new Date().getTime() - 172800000) && dateToString(add(new Date(0),bill_date),"%Y-%m-%d","+0800") == "${yesterday}"`).orderBy('bill_date desc').getTemp()
				const day3 = db.collection("mj-user-bills").where(`user_id == $cloudEnv_uid && bill_date > (new Date().getTime() - 259200000) && dateToString(add(new Date(0),bill_date),"%Y-%m-%d","+0800") == "${theDaybeforeYesterday}"`).orderBy('bill_date desc').getTemp()
				// 使用联表查询，将资产id对应的资产添加到bill里
				const userAssets = db.collection("mj-user-assets").where('user_id == $cloudEnv_uid').field('_id,asset_type,user_id').getTemp()
				const res1 = db.collection(day1,userAssets).getTemp()
				const res2 = db.collection(day2,userAssets).getTemp()
				const res3 = db.collection(day3,userAssets).getTemp()
				const resAll = await db.multiSend(res1,res2,res3)
				return resAll.result.dataList
			},
			// 获取用户月账单的本月支出和本页收入
			async getUserMonthlyBillBalance() {
				// 筛选条件 bill_date 日期格式化成 2023-09 的字段，按照账单类型进行分组，并计算每个分组的总价
				const res = await db.collection("mj-user-bills").where(`user_id == $cloudEnv_uid && dateToString(add(new Date(0),bill_date),"%Y-%m","+0800") == "${this.currentDate}"`).groupBy('bill_type').groupField('sum(bill_amount) as bill_amount_total').orderBy('bill_type asc').get()
				// console.log(res.result.data)
				const monthlyExpenseTemp = res.result.data.filter(item => item.bill_type === 0)[0]?.bill_amount_total / 100 || '0'
				const transferBalanceTemp = res.result.data.filter(item => item.bill_type === 2)[0]?.bill_amount_total / 100 || '0'
				const monthlyIncomeTemp = res.result.data.filter(item => item.bill_type === 1)[0]?.bill_amount_total / 100 || '0'
				// 分别计算月支出和月收入	月支出 = 月支出 + 转账的手续费	月收入 = 月收入
				this.monthlyExpense = Number(monthlyExpenseTemp) + Number(transferBalanceTemp)
				this.monthlyIncome = Number(monthlyIncomeTemp)
			},
			// 获取用户资产列表
			async getUserAssets() {
				// console.log("getUserAssets");
				const res = await db.collection("mj-user-assets").where(" user_id == $cloudEnv_uid ").get()
				this.userAssets = []
				this.userAssets = res.result.data
				// 如果用户资产列表为空，则创建默认资产，并且设置记账使用的默认资产
				if(!this.userAssets.length) {
					await db.collection("mj-user-assets").add({
						asset_type: 'default',
						asset_balance: 0,
						default_asset: true
					})
					const defalutAsset = await db.collection("mj-user-assets").where(" user_id == $cloudEnv_uid ").get()
					this.userAssets = []
					this.userAssets = defalutAsset.result.data
				}
				// 统一修改金额
				this.userAssets.forEach(item => item.asset_balance /= 100)
				// 保存在缓存中
				uni.setStorage({
					key:'mj-user-assets',
					data: this.userAssets
				})
			}
		},
		onUnload(){
			uni.$off('updateAssetsList')
			uni.$off('updateBillsList')
			uni.$off('updateMonthlyBillBalance')
		}
	}
</script>

<style lang="scss" scoped>
	.home {
		.swiper {
			height: 300rpx;
			background-color: $mj-theme-color;
			border-radius: 0 0 40rpx 40rpx;
			
			.swiper-item {
				display: flex;
				flex-direction: column;
				justify-content: space-between;
				box-sizing: border-box;
				padding: 0 28rpx;

				.header {
					color: $mj-text-color-grey;
					font-size: 28rpx;
				}

				.moneyContent {
					display: flex;
					justify-content: space-between;
					align-items: center;
					font-size: 72rpx;
				}

				.footer {
					display: flex;
					color: $mj-text-color-grey;
					font-size: 28rpx;
					>text {
						flex: 1;
						width: 375rpx;
						.bold {
							margin-left: 12rpx;
							color: $mj-text-color;
							font-weight: bold;
						}
					}
				}
				.bottom {
					height: 40rpx;
				}
			}
		}
		.bills,.asset {
			padding-bottom: 104rpx;
			.header {
				margin: 16rpx 0;
				padding-left: 12rpx;
				display: flex;
				align-items: center;
				justify-content: space-between;
				color: $mj-text-color;
				font-size: 32rpx;
				text {
					padding-left: 8rpx;
				}
				.left {
					display: flex;
					align-items: center;
				}
				.right {
					display: flex;
					align-items: center;
					box-sizing: border-box;
					padding: 4px 8px;
					margin-right: 8px;
					background-color: $mj-theme-color;
					border-radius: 16px;
					font-size: 28rpx;
					color: $mj-bg-color;
				}
			}
		}
		.bottom-btn {
			box-sizing: border-box;
			z-index: 999;
			position: fixed;
			width: 100%;
			padding: 0 24rpx 12px;
			bottom: 0;
			opacity: 0.98;
		}
	}
</style>