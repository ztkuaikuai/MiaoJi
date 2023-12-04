<template>
	<view class="seconds">
		<view class="linear-gradient"></view>
		<mj-card title="提示">
			<view style="font-size: 28rpx;color: rgba(0, 0, 0, 0.6);">
				秒记可用于记录经常购买的账单，如每天喝咖啡9.9元，可设置为秒记方便快速记账。
			</view>
			<view style="font-size: 28rpx;color: rgba(0, 0, 0, 0.6);">
				<span style="font-weight: 700;">秒记比模板更加方便</span>，在记一笔页面使用秒记相当于使用模板+点击保存。
			</view>
		</mj-card>
		<mj-card title="秒记1" subTitle="我是人啊">
			我是秒记1
			<template #right>点我修改</template>
		</mj-card>
		<mj-card title="秒记2">
			我是秒记2
		</mj-card>
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

<style lang="scss" scoped>
.seconds {
	position: relative;
	.linear-gradient {
		position: absolute;
		top: -24rpx;
		left: 0;
		right: 0;
		height: 130rpx;
		background-image: linear-gradient(#9fcba7, #fafafa);
		z-index: -1;
	}
}
</style>
