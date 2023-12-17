<template>
	<view class="one-bill-template">
		<template v-if="oneTemplate">
			<view class="left">
				<mj-icon-with-background :type="oneTemplate.billStyle.icon" size="48rpx" customPrefix="miaoji"></mj-icon-with-background>
				<view class="info">
					<view>{{oneTemplate.billStyle.title}}</view>
					<view class="minor" v-if="oneTemplate.bill_notes"><u--text :lines="1" :text="oneTemplate.bill_notes" color="rgba(0,0,0, 0.6)" size="24rpx"></u--text></view>
				</view>
			</view>
			<view class="right" v-if="oneTemplate.bill_type !== 2">
				<u--text mode="price" :text="oneTemplate.bill_amount" :color="oneTemplate.bill_type === 0 ? '#dd524d' : '#219a6d'" size="32rpx" bold></u--text>
				<view class="minor">{{oneTemplate.asset_id[0].asset_name || oneTemplate.assetStyle.title}}</view>
			</view>
			<view class="right" v-else>
				<u--text mode="price" :text="oneTemplate.transfer_amount / 100" color="#212121" size="32rpx" bold></u--text>
				<view class="minor">{{oneTemplate.asset_id[0].asset_name || oneTemplate.assetStyle.title}}</view>
			</view>
		</template>
		<template v-else>
			<view class="left">
				<mj-icon-with-background></mj-icon-with-background>
				<view class="info">
					<view>未绑定模板</view>
					<view class="minor" v-if="true"><u--text :lines="1" :text="fromType ? '点我绑定模板' : '快去点击修改按钮绑定模板吧!'" color="rgba(0,0,0, 0.6)" size="24rpx"></u--text></view>
				</view>
			</view>
		</template>
	</view>
</template>

<script>
	export default {
		name:"mj-bill-one-template",
		props: ['oneTemplate','fromType'],
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