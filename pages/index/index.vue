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
					<u--text mode="price" text="7212.32" size="72rpx" color="#000"></u--text>
					<view class="eye" @tap="tapEye">
						<uni-icons v-if="isEyeShow" type="eye" size="56rpx" color="rgba(0,0,0, 0.6)"></uni-icons>
						<uni-icons v-else type="eye-slash" size="56rpx" color="rgba(0,0,0, 0.6)"></uni-icons>
					</view>
				</view>
				<view class="footer">
					<text>本月收入<text class="bold">2,134.84</text></text>
					<text>月结余<text class="bold">1,234.56</text></text>
				</view>
				<!-- 占位 -->
				<view class="bottom"></view>
			</swiper-item>
			<swiper-item class="swiper-item">
				<view class="header">
					净资产(元)
				</view>
				<view class="moneyContent">
					<u--text mode="price" :text="totalAssets" size="72rpx" color="#000"></u--text>
					<view class="eye" @tap="tapEye">
						<uni-icons v-if="isEyeShow" type="eye" size="56rpx" color="rgba(0,0,0, 0.6)"></uni-icons>
						<uni-icons v-else type="eye-slash" size="56rpx" color="rgba(0,0,0, 0.6)"></uni-icons>
					</view>
				</view>
				<view class="footer">
					<text>总资产<text class="bold">{{totalAssets.toFixed(2)}}</text></text>
				</view>
				<!-- 占位 -->
				<view class="bottom"></view>
			</swiper-item>
		</swiper>
		<view class="bills" v-show="!isIndexShow">
			<view class="header">
				<uni-icons type="list" size="48rpx" color="#212121"></uni-icons>
				<text>近三日账单</text>
			</view>
			<!-- 组件：账单卡片 -->
			<mj-bill-card v-for="item in 3"></mj-bill-card>
		</view>
		
		<view class="asset" v-if="isIndexShow">
			<view class="header">
				<uni-icons type="wallet" size="48rpx" color="#212121"></uni-icons>
				<text>我的资产</text>
			</view>
			<mj-asset-card :userAssetsFromDB="userAssets"></mj-asset-card>
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
				
			}
		},
		computed: {
			// 计算总资产
			totalAssets() {
				// 筛选出计入总资产的资产项
				let userAssetsIncludeInTotalAssets = this.userAssets.filter(item => item.include_in_total_assets == true)
				return userAssetsIncludeInTotalAssets.reduce((lastValue, currentArr) => lastValue + currentArr.asset_balance , 0)
			}
		},
		onReady() {
			const state = UT.checkUserTokenExpierd() // 检查老用户的token是否过期，如果过期则跳转登录，并返回true；没过期返回false
			if(state) return
			// console.log("用户token没过期，继续执行下面的逻辑");
			// 获取用户资产列表
			this.getUserAssets()
			uni.$on('updateAssetsList',this.getUserAssets)
		},
		methods: {
			tapEye() {
				this.isEyeShow = !this.isEyeShow
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
			async getUserAssets() {
				// console.log("getUserAssets");
				const res = await db.collection("mj-user-assets").where(" auth.uid == doc.user_id ").get()
				this.userAssets = []
				this.userAssets = res.result.data
				// 统一修改金额
				this.userAssets.forEach(item => item.asset_balance = item.asset_balance / 100)
			}
		},
		onUnload(){
			uni.$off('updateAssetsList')
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
				color: #000;
				font-size: 32rpx;
				text {
					padding-left: 8rpx;
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