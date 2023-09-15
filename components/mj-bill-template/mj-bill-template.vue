<template>
	<view class="bill-template">
		<mj-card title="支出">
			<view class="one-bill-template">
				<view class="left">
					<mj-icon-with-background type="mj-wucan" size="48rpx" customPrefix="miaoji"></mj-icon-with-background>
					<view class="info">
						<view>餐饮</view>
						<view class="minor"><u--text :lines="1" text="我是备注我是备注" color="rgba(0,0,0, 0.6)" size="24rpx"></u--text></view> <!-- 设置超过一行就... 可以使用u-text组件 -->
					</view>
				</view>
				<view class="right">
					<u--text mode="price" text="1234222" color="#dd524d" size="32rpx" bold></u--text>
					<view class="minor">银行卡</view>
				</view>
			</view>
		</mj-card>
	</view>
</template>

<script>
	export default {
		name:"mj-bill-template",
		data() {
			return {
				
			};
		}
	}
</script>

<style lang="scss" scoped>
.bill-template {
	.one-bill-template {
		display: flex;
		justify-content: space-between;
		color: $mj-text-color;
		
		font-size: 32rpx;
		padding: 8rpx 0;
	
		.left {
			display: flex;
			justify-content: right;
			align-items: center;
	
			.info {
				display: flex;
				flex-direction: column;
				justify-content: center;
				padding-left: 24rpx;
			}
		}
	
		.right {
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: flex-end;
			padding-right: 20rpx;
			
		}
		.minor {
			color: $mj-text-color-grey;
			font-size: 24rpx;
		}
	
		
	}
}
</style>