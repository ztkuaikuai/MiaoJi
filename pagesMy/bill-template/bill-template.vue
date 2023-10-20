<template>
	<view>
		<mj-card title="提示">
			<view style="font-size: 28rpx;color: rgba(0, 0, 0, 0.6);">
				账单模板可用于经常购买或记帐的账单，如每天都吃香菇滑鸡11元，可保存为帐单模板方便快速记账。
			</view>
		</mj-card>
		<!-- 传入用户模板账单组成的对象数组，组件内进行遍历 -->
		<view class="bill-template-wrapper">
			<mj-bill-template :templateList="templateList" @updateList="getUserTemplate"></mj-bill-template>
		</view>
		<!-- 固定定位，最底下 -->
		<view class="bottom-btn" >
			<u-button text="添加模板" color="#9fcba7" shape="circle" @click="clickBottomBtn"></u-button>
		</view>
	</view>
</template>

<script>
	const db = uniCloud.database()
	export default {
		data() {
			return {
				templateList: []
			};
		},
		onLoad() {
			this.getUserTemplate()
		},
		onShow() {
			this.getUserTemplate()
		},
		methods: {
			clickBottomBtn() {
				uni.navigateTo({
					url: `/pagesAccount/make-an-account/make-an-account?type=template`
				})
			},
			async getUserTemplate() {
				// 获取模板信息
				const res = await db.collection('mj-user-templates').where('user_id == $cloudEnv_uid').orderBy('template_creation_date desc').get()
				this.templateList = res.result.data
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