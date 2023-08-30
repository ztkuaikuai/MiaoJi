<template>
	<view class="charts">
		<view class="header-fixed">
			<!-- 日期类型选择器 需要输出选择类型和时间戳，之后数据库进行筛选，拿到数据进行渲染 -->
			<mj-datetype-picker></mj-datetype-picker>
			<view class="tabs">
				<u-tabs :list="chartType" @click="clickTab" lineColor="#2e3548"></u-tabs>
			</view>
			<view class="filter">
				筛选
			</view>
		</view>
		<view class="card-chart">
			<view class="ucharts">
				图表放置位置
			</view>
		</view>
		<!-- 组件放置位置，传递分类，分类支出，交易数量信息进去，渲染分类百分比卡片 -->
		<view class="card-category">
			<mj-category-card></mj-category-card>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				chartType: [{name:'饼图'},{name: '日历'}],
			};
		},
		methods: {
			clickTab(e) {
				console.log(e);
			}
		}
	}
</script>

<style lang="scss">
.charts {
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
		.tabs {
			padding-right: 120rpx;
		}
	}
	.card-chart {
		margin: 0 28rpx;
		margin-top: 96rpx;
		box-sizing: border-box;
		background-color: #fff;
		height: 660rpx;
		border-radius: 36rpx;
		padding: 8rpx;
		box-shadow: rgba(0, 0, 0, 0.03) 0px 20px 25px -5px, rgba(0, 0, 0, 0.01) 0px 10px 10px -5px;
	}
	.card-category {
		margin-top: 8rpx;
	}
}
</style>
