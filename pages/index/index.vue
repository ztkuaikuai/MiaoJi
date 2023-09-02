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
						<u-icon v-if="isEyeShow" name="eye-fill" size="56rpx" color="rgba(0,0,0, 0.4)"></u-icon>
						<u-icon v-else name="eye-off" size="56rpx" color="rgba(0,0,0, 0.4)"></u-icon>
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
					<u--text mode="price" text="998.32" size="72rpx" color="#000"></u--text>
					<view class="eye" @tap="tapEye">
						<u-icon v-if="isEyeShow" name="eye-fill" size="56rpx" color="rgba(0,0,0, 0.4)"></u-icon>
						<u-icon v-else name="eye-off" size="56rpx" color="rgba(0,0,0, 0.4)"></u-icon>
					</view>
				</view>
				<view class="footer">
					<text>总资产<text class="bold">2,134.84</text></text>
				</view>
				<!-- 占位 -->
				<view class="bottom"></view>
			</swiper-item>
		</swiper>
		<view class="bills" v-show="!isIndexShow">
			<view class="header">
				<u-icon name="order" size="48rpx" color="#212121"></u-icon>
				<text>近三日账单</text>
			</view>
			<!-- 组件：账单卡片 -->
			<mj-bill-card v-for="item in 3"></mj-bill-card>
		</view>
		
		<view class="asset" v-if="isIndexShow">
			<view class="header">
				<u-icon name="rmb-circle" size="48rpx" color="#212121"></u-icon>
				<text>我的资产</text>
			</view>
			<mj-asset-card></mj-asset-card>
		</view>
		<!-- 固定定位，最底下 -->
		<view class="bottom-btn" >
			<u-button  :text="bottomBtnText" color="#9fcba7" shape="circle" @click="clickBottomBtn"></u-button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				isEyeShow: true,
				isIndexShow: 0,  // 0 展示首页  1 展示资产页
				bottomBtnText: '点我记账'
			}
		},
		onLoad() {
			
		},
		onReady() {
			this.checkUserTokenExpierd()
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
					uni.navigateTo({
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
			// 检查老用户的token是否过期，如果过期则跳转登录
			checkUserTokenExpierd() {
				const tokenExpierd = uni.getStorageSync('uni_id_token_expired')
				if(tokenExpierd != 0 && tokenExpierd <= Date.now()) {
					console.log("检查到token过期");
					uni.navigateTo({
						url: "/uni_modules/uni-id-pages/pages/login/login-withoutpwd"
					})
				}
			}
			
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