<template>
	<view class="one-bill-template">
		<view class="left">
			<mj-icon-with-background type="mj-shuiguoshucai" size="48rpx" customPrefix="miaoji"></mj-icon-with-background>
			<view class="info">
				<view>水果蔬菜</view>
				<view class="minor" v-if="true"><u--text :lines="1" text="橘子" color="rgba(0,0,0, 0.6)" size="24rpx"></u--text></view>
			</view>
		</view>
		<view class="right">
			<u--text mode="price" text="233.00" color="#dd524d" size="32rpx" bold></u--text>
			<view class="minor">老佛爷</view>
		</view>
	</view>
</template>

<script>
	export default {
		name:"mj-bill-one-template",
		data() {
			return {
				
			};
		}
	}
</script>

<style lang="scss">
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
</style>