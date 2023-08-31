<template>
	<view class="userInfo">
		<mj-card title="我的">
			<view class="me">
				<u-avatar :src="avatarSrc" size="100rpx" @click="clickAvatar"></u-avatar>
				<view class="main">
					<view class="username">
						Hi 砖吐筷筷
					</view>
					<view class="day">
						2022年4月加入妙记
					</view>
				</view>
			</view>
		</mj-card>
		<mj-card title="个人信息">
			<u-cell-group :border="false">
				<u-cell icon="weixin-fill" title="会员编号" label="88484882" iconStyle="fontSize: 48rpx; paddingRight: 24rpx" :border="false" clickable></u-cell>
				<u-cell icon="info-circle" title="昵称" label="砖吐筷筷" iconStyle="fontSize: 48rpx; paddingRight: 24rpx" :border="false"></u-cell>
				<u-cell icon="info-circle" title="加入时间" label="2022-04-21" iconStyle="fontSize: 48rpx; paddingRight: 24rpx" :border="false"></u-cell>
			</u-cell-group>
		</mj-card>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				avatarSrc: '/static/头像.jpg',
			};
		},
		methods: {
			clickAvatar() {
				console.log("头像被点击");
			}
		}
	}
</script>

<style lang="scss" scoped>
.userInfo {
	.me {
		display: flex;
		justify-content: start;
		align-items: center;
	
		.main {
			margin-left: 20rpx;
			margin-top: 8rpx;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: flex-start;
	
			.username {
				font-size: 40rpx;
				line-height: 40rpx;
				color: $mj-text-color;
				margin-bottom: 16rpx;
			}
	
			.day {
				font-size: 28rpx;
				line-height: 28rpx;
				color: $mj-text-color-grey;
			}
		}
	}
}
</style>
