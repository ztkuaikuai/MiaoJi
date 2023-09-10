<template>
	<view>
		<view v-for="category in categoryList">
			<view class="category-card">
				 <view class="left">
					<mj-icon-with-background :type="category.category_icon" size="48rpx" customPrefix="miaoji"></mj-icon-with-background>
					<view class="main">
						<view class="font">
							{{category.category_title}}<text>{{(category.total_amount_percent * 100).toFixed(2)}}</text>
						</view>
						<view class="progress">
							<u-line-progress :percentage="(category.total_amount_percent * 100).toFixed(2)" activeColor="#9fcba7" :showText="false" height="16rpx"></u-line-progress>
						</view>
					</view>
				 </view>
				 <view class="right">
				 	<view class="money">
				 		￥{{category.total_amount.toFixed(2)}}
				 	</view>
					<view class="num">
						{{category.bill_count}}笔
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
	import ICONCONFIG from '@/utils/icon-config.js'
	export default {
		name:"mj-category-card",
		props: ['categoryListFromChart'],
		data() {
			return {
			};
		},
		computed: {
			categoryList(){
				const allIconList = ICONCONFIG.getAllIconList()
				const categoryListFromC = uni.$u.deepClone(this.categoryListFromChart)
				categoryListFromC.forEach(category => {
					category['category_title'] = allIconList.filter(item => item.type === category.category_type)[0].title
					category['category_icon'] = allIconList.filter(item => item.type === category.category_type)[0].icon
				})
				console.log('categoryList',categoryListFromC);
				return categoryListFromC
			},
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