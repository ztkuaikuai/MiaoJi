<template>
	<view>
		<mj-card title="提示">
			<view style="font-size: 28rpx;color: rgba(0, 0, 0, 0.6);">
				账单模板可用于经常购买或记帐的账单，如每天都吃香菇滑鸡11元，可保存为帐单模板方便快速记账。
			</view>
		</mj-card>
		<!-- 传入用户模板账单组成的数组，组件内进行遍历 -->
		<view class="bill-template-wrapper">
			<mj-bill-template></mj-bill-template>
		</view>
		<!-- 固定定位，最底下 -->
		<view class="bottom-btn" >
			<u-button text="添加模板" color="#9fcba7" shape="circle" @click="clickBottomBtn"></u-button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			};
		},
		onLoad() {
			
		},
		methods: {
			clickBottomBtn() {
				console.log("添加模板");
			}
		}
	}
</script>

<style lang="scss" scoped>
	.bottom-btn {
		box-sizing: border-box;
		z-index: 999;
		position: fixed;
		width: 100%;
		padding: 0 24rpx 12px;
		bottom: 20rpx;
		opacity: 0.98;
	}
</style>