<template>
	<view class="cron-accounting">
		<view class="linear-gradient"></view>
		<mj-card title="食用说明">
			<view style="font-size: 28rpx;color: rgba(0, 0, 0, 0.6);">
				定时记账可<span style="font-weight: 700;">用于记录定期重复的账单，配置好规则即可自动记账</span>。如每30天买一张月卡花费30元，每天通勤花费8元等等，类似上述情况可设置为定时记账。
			</view>
		</mj-card>
		<!-- 定时任务卡片：遍历展示用户定时任务 -->
		<mj-card :title="cron.name" v-for="cron in cronDataList" :key="cron._id">
			<template #right>
				<view class="right-btns">
					<view class="btn del" @click="deleteCron(cron._id)">
						删除
					</view>
					<view class="btn edit" @click="editCron(cron._id)">
						修改
					</view>
				</view>
			</template>
			
			<mj-bill-one-template :oneTemplate="cron.template"></mj-bill-one-template>
			<view class="cron-info-wrapper">
				<div class="left">
					<div class="next-time">
						预计{{cron.rule.expected_next_execution_time}}执行
					</div>
					<div class="info">
						<span class="rule">
							{{cron.rule.end_manner.type === 'infinite' ? '永不结束' : `执行${cron.rule.end_manner.count}次结束`}}
						</span>
						<span>每{{cron.rule.repetition_cycle.count}}天</span>
						<span>已执行{{cron.rule.executed_count}}次</span>
					</div>
				</div>
				<div v-if="cron.state === 1" class="right start">
					进行中
				</div>
				<div v-else-if="cron.state === 0" class="right pause">
					已暂停
				</div>
				<div v-else class="right end">
					已结束
				</div>
			</view>
		</mj-card>
		
		<!-- 防挡 -->
		<view style="height: 64px;"></view>
		<!-- 固定定位，最底下 -->
		<view class="bottom-btn" >
			<u-button text="添加" :color="mjThemeColor" shape="circle" @click="addCron"></u-button>
		</view>
	</view>
</template>

<script>
	import { themeColor } from '@/uni.scss'
	import { formatOneTemplate } from '@/utils/formatTemplate.js'
	
	const db = uniCloud.database()
	export default {
		async onLoad() {
			// 这里先获取模板数据为的是在获取定时任务后通过模板id找到对应模板进行渲染
			// 获取用户的模板
			await this.getUserTemplate()
			// 获取用户的定时任务
			await this.getUserCron()
		},
		onShow(){
			if (this.isNeedUpdate) {
				this.getUserCron()
				this.isNeedUpdate = false
			}
		},
		data() {
			return {
				cronDataList: [],
				templateList: [],
				isNeedUpdate: false
			};
		},
		computed: {
			mjThemeColor() {
				return themeColor
			}
		},
		methods: {
			async getUserTemplate() {
				// 获取模板信息
				const temp = db.collection('mj-user-templates').where('user_id == $cloudEnv_uid').orderBy('template_creation_date desc').getTemp()
				const userAssets = db.collection("mj-user-assets").where('user_id == $cloudEnv_uid').field('_id,asset_type,user_id,asset_name').getTemp()
				const res = await db.collection(temp, userAssets).get()
				this.templateList = res.result.data
				console.log('templateList: ',this.templateList);
			},
			async getUserCron() {
				// 状态降序 下次执行时间升序
				const res = await db.collection('mj-user-cron-accounting').where('user_id == $cloudEnv_uid').orderBy('state desc, rule.expected_next_execution_time asc').get()
				this.cronDataList = res.result.data
				console.log('res: ',res);
				this.renderCronTemplates()
			},
			// 渲染任务绑定的模板
			renderCronTemplates() {
				this.cronDataList.forEach(cron => {
					const index = this.templateList.findIndex(item => item._id === cron.template_id)
					if (index !== -1) {
						cron.template = formatOneTemplate(this.templateList[index])
					}
				})
				console.log('this.cronDataList: ',this.cronDataList);
			},
			deleteCron(id) {
				uni.showModal({
					content: "你确定删除该任务吗？（删除之后不可恢复哦）",
					cancelColor: "rgba(0,0,0,0.6)",
					confirmColor: themeColor,
					success:async res =>  {
						if(res.confirm) {
							uni.showLoading({
								title: "删除中",
								mask: true
							})
							// 删除定时任务
							await db.collection('mj-user-cron-accounting').doc(id).remove()
							uni.hideLoading()
							uni.showToast({
								title: "删除成功",
								icon: "success"
							})
							await this.getUserCron()
						}
					}
				})
			},
			editCron(id) {
				// 跳转回该页面需要更新
				this.isNeedUpdate = true
				// 拿到数据暂存在本地缓存
				const cronData = this.cronDataList.find(item => item._id === id)
				uni.setStorageSync('oneCronData', cronData)
				// 进入编辑任务页面
				uni.navigateTo({
					url:"/pagesMy/cron-accounting-edit/cron-accounting-edit?type=edit",
				})
			},
			addCron() {
				// 跳转回该页面需要更新
				this.isNeedUpdate = true
				uni.navigateTo({
					url:"/pagesMy/cron-accounting-edit/cron-accounting-edit?type=add",
				})
			}
		}
	}
</script>

<style lang="scss">
.cron-accounting {
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
	
	.cron-info-wrapper {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-top: 16rpx;
		.left {
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			align-items: flex-start;
			color: $mj-text-color-grey;
			font-size: 24rpx;
			.info {
				margin-top: 8rpx;
				span {
					border-radius: 16px;
					border: 1px solid $mj-text-color-grey;
					margin-right: 8rpx;
					padding: 2rpx 8rpx;
					font-size: 20rpx;
				}
				.rule {
					color: $mj-bg-color;
					background-color: $mj-theme-color;
					border-color: $mj-theme-color;
				}
			}
		}
		.right {
			display: flex;
			align-items: center;
			box-sizing: border-box;
			padding: 4px 8px;
			margin-right: 4px;
			border-radius: 16px;
			font-size: 24rpx;
		}
		.start {
			border: 2rpx solid $mj-theme-color-black;
		}
		.pause {
			border: 2rpx solid $uni-color-warning;
		}
		.end {
			border: 2rpx solid $mj-color-red;
		}
	}
	
	.bottom-btn {
		box-sizing: border-box;
		z-index: 999;
		position: fixed;
		width: 100%;
		padding: 0 24rpx 12px;
		bottom: 20rpx;
		opacity: 0.98;
	}
	.right-btns {
		display: flex;
		justify-content: center;
		align-items: center;
		.btn {
			display: flex;
			align-items: center;
			box-sizing: border-box;
			padding: 4px 8px;
			margin-right: 4px;
			border-radius: 16px;
			font-size: 24rpx;
		}
		.del {
			color: $mj-color-red;
			border: 1px solid $mj-color-red;
		}
		.edit {
			color: $mj-bg-color;
			background-color: $mj-theme-color-2;
			border: 1px solid $mj-theme-color-2;
		}
	}
	
}
</style>
