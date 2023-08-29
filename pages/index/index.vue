<template>
	<view class="home">
		<swiper class="swiper" circular :indicator-dots="true" indicator-dots="rgba(0, 0, 0, .3)"
			indicator-active-color="#303344" duration="500" :circular="false">
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
		<view class="bills">
			<view class="header">
				<u-icon name="order" size="48rpx" color="#212121"></u-icon>
				<text>近三日账单</text>
			</view>
			<!-- 组件：账单卡片 -->
			<mj-bill-card v-for="item in 3"></mj-bill-card>
		</view>
		<!-- 固定定位，最底下 -->
		<view class="bottom-btn">
			<u-button  text="点我记账" color="#9fcba7" shape="circle"></u-button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				isEyeShow: true,
			}
		},
		onLoad() {

		},
		methods: {
			tapEye() {
				this.isEyeShow = !this.isEyeShow
			}
		}
	}
</script>

<style lang="scss" scoped>
	.home {
		.swiper {
			height: 300rpx;
			background-color: $mj-color-bgc;
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
		.bills {
			padding: 0 24rpx 104rpx;
			// margin-bottom: 92rpx;
			.header {
				margin: 16rpx 0;
				display: flex;
				align-items: center;
				color: #000;
				font-size: 32rpx;
			}
		}
		.bottom-btn {
			box-sizing: border-box;
			z-index: 999;
			position: fixed;
			width: 100%;
			padding: 0 24rpx 12rpx;
			bottom: 0;
		}
	}
</style>