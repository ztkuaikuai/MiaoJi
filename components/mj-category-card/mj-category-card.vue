<template>
	<view>
		<view v-for="item in 7">
			<view class="category-card">
				 <view class="left">
				 	<u-avatar icon="star-fill" font-size="48rpx" ></u-avatar>
					<view class="main">
						<view class="font">
							餐饮<text>42.38%</text>
						</view>
						<view class="progress">
							<u-line-progress :percentage="42.38" activeColor="#9fcba7" :showText="false" height="16rpx"></u-line-progress>
						</view>
					</view>
				 </view>
				 <view class="right">
				 	<view class="money">
				 		￥400.83
				 	</view>
					<view class="num">
						42笔
					</view>
				 </view>
			</view>
			<view class="line" v-if="item != 6">
				<u-line length="80%"></u-line>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name:"mj-category-card",
		data() {
			return {
				imgSrc: '/static/icons/home.png'
			};
		}
	}
</script>

<style lang="scss" scoped>
.category-card {
	box-sizing: border-box;
	padding: 16rpx 28rpx;
	display: flex;
	justify-content: space-between;
	align-items: center;
	.left {
		display: flex;
		justify-content: start;
		align-items: center;
		.main {
			margin-left: 20rpx;
			color: $mj-text-color;
			font-size: 28rpx;
			font-weight: bold;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: flex-start;
			.font>text {
				color: $mj-text-color-grey;
				font-size: 24rpx;
				font-weight: normal;
			}
			.progress {
				margin-top: 4px;
				width: 420rpx;
			}
		}
	}
	.right {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: flex-end;
		.money {
			color: $mj-color-red;
			font-size: 28rpx;
			font-weight: bold;
		}
		.num {
			color: $mj-text-color-grey;
			font-size: 24rpx;
		}
	}
}
.line {
	display: flex;
	justify-content: center;
}

</style>