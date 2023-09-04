<template>
	<view class="mj-icon">
		<uni-icons :type="type" :size="size" :color="color"></uni-icons>
	</view>
</template>

<script>
	export default {
		name:"mj-icon-with-background",
		props: ['type','size','color'],
		data() {
			return {
				
			};
		}
	}
</script>

<style lang="scss">
.mj-icon {
	width: 80rpx;
	height: 80rpx;
	background-color: #f0f0f0;
	border-radius: 50%;
	display: flex;
	justify-content: center;
	align-items: center;
}
</style>