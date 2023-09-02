<template>
	<view class="feedback">
		<view class="btn">
			<u-button text="点我反馈" openType="feedback" type="primary" plain ></u-button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			};
		}
	}
</script>

<style lang="scss">
.feedback {
	display: flex;
	justify-content: center;
	align-items: center;
	.btn {
		width: 375rpx;
		margin-top: 375rpx;
	}
}
</style>
