<template>
	<view class="bills">
		<view class="header-fixed">
			<!-- 日期类型选择器 需要输出选择类型和时间戳，之后数据库进行筛选，拿到数据进行渲染 -->
			<mj-datetype-picker></mj-datetype-picker>
			<view class="filter">
				筛选
			</view>
		</view>
		<view class="card-chart">
			<view class="ucharts">
				图表放置位置
			</view>
		</view>
		<view class="card-money">
			<view class="left">
				月结余：￥555.23
			</view>
			<view class="right">
				日均支出：￥55.23
			</view>
		</view>
		<view class="bill-list">
			<view class="header">
				<u-icon name="order" size="48rpx" color="#212121"></u-icon>
				<text>账单明细</text>
			</view>
			<!-- 需要底部钩子，按需加载 -->
			<mj-bill-card v-for="item in 3"></mj-bill-card>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			};
		},
		methods: {
			
		}
	}
</script>

<style lang="scss" scoped>
.bills {
	.header-fixed {
		position: fixed;
		width: 100%;
		top: 0;
		left: 0;
		box-sizing: border-box;
		padding: 0 28rpx;
		background-color: $mj-theme-color;
		height: 80rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-size: 32rpx;
		color: $mj-text-color;
		z-index: 999;
	}
	.card-chart {
		margin: 0 28rpx;
		box-sizing: border-box;
		margin-top: 96rpx;
		background-color: #fff;
		height: 368rpx;
		border-radius: 36rpx;
		padding: 8rpx;
		box-shadow: rgba(0, 0, 0, 0.03) 0px 20px 25px -5px, rgba(0, 0, 0, 0.01) 0px 10px 10px -5px;
	}
	.card-money {
		margin: 20px 28rpx 0;
		box-sizing: border-box;
		background-color: #fff;
		height: 88rpx;
		border-radius: 36rpx;
		font-size: 24rpx;
		display: flex;
		justify-content: space-around;
		align-items: center;
		color: $mj-text-color;
		box-shadow: rgba(0, 0, 0, 0.03) 0px 20px 25px -5px, rgba(0, 0, 0, 0.01) 0px 10px 10px -5px;
	}
	.bill-list {
		.header {
			margin: 16rpx 0;
			padding-left: 12rpx;
			display: flex;
			align-items: center;
			color: #000;
			font-size: 32rpx;
		}
	}
}
</style>
