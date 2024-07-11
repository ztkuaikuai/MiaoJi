<!-- 添加or修改定时任务 -->
<template>
	<view class="cron-accounting-edit">
		<view class="linear-gradient"></view>
		<mj-card title="任务规则">
			<div class="form-wrapper">
				<u--input
					placeholder="任务名称"
					border="surround"
					v-model="form.name"
					shape="circle"
					fontSize="24rpx"
					maxlength="20"
					:clearable="true"
				></u--input>
				<mj-section
					title="重复周期" 
					subTitle="根据规则执行自动记账" 
					iconType="mj-reloadtime" 
					translateY="translateY(1rpx)" 
					:customStyle="{'marginTop': '12px'}"
					@click.native="showRepetitionCycle = true" 
				>
					<template #right>
						<view class="section-right">
							<view class="section-text">
								每{{form.rule.repetition_cycle.count}}天
							</view>
							<view class="section-icon">
								<u-icon name="arrow-right" size="24rpx" bold color="#d0d0d0"></u-icon>
							</view>
						</view>
					</template>
				</mj-section>
				<mj-section 
					title="开始时间" 
					subTitle="执行定时记账的开始时间" 
					iconType="mj-second" 
					translateY="translateY(3rpx)"
					@click.native="showDatetimePicker = true"
				>
					<template #right>
						<view class="section-right">
							<view class="section-text">
								{{form.rule.start_time}}
							</view>
							<view class="section-icon">
								<u-icon name="arrow-right" size="24rpx" bold color="#d0d0d0"></u-icon>
							</view>
						</view>
					</template>
				</mj-section>
				<mj-section title="结束方式" subTitle="根据规则结束任务" iconType="mj-loop" @click.native="showEndManner = true">
					<template #right>
						<view class="section-right">
							<view class="section-text">
								{{form.rule.end_manner.type === 'infinite' ? '永不结束' : `执行${form.rule.end_manner.count}次结束`}}
							</view>
							<view class="section-icon">
								<u-icon name="arrow-right" size="24rpx" bold color="#d0d0d0"></u-icon>
							</view>
						</view>
					</template>
				</mj-section>
			</div>
		</mj-card>
		<mj-card title="账单模板" @click.native="showTemplate = true">
			<template #right>
				<view class="btn choose">
					选取
				</view>
			</template>
			<mj-bill-one-template v-if="currentTemplete" :oneTemplate="currentTemplete"></mj-bill-one-template>
			<view v-else style="text-align: center;font-size: 24rpx">请选择一个账单模板与定时任务绑定</view>
		</mj-card>
		<mj-card title="任务状态">
			<mj-section title="开启任务" subTitle="是否启用此周期任务" :showIcon="false">
				<template #right>
					<u-switch v-model="isStart" :activeColor="mjThemeColor"></u-switch>
				</template>
			</mj-section>
		</mj-card>
		<!-- 防挡 -->
		<view style="height: 64px;"></view>
		<!-- 固定定位，最底下 -->
		<view class="bottom-btn" >
			<u-button text="保存" :color="mjThemeColor" shape="circle" @click="saveForm"></u-button>
		</view>
		
		<!-- 重复周期 -->
		<u-picker 
			:show="showRepetitionCycle" 
			:columns="days"
			closeOnClickOverlay
			:defaultIndex="[form.rule.repetition_cycle.count - 1]"
			:confirmColor="mjThemeColor"
			@close="showRepetitionCycle = false"
			@cancel="showRepetitionCycle = false"
			@confirm="getCycleDay"
		></u-picker>
		<!-- 开始时间 -->
		<u-datetime-picker
			:show="showDatetimePicker"
			v-model="datePickerValue"
			mode="date"
			:minDate="Date.now()"
			:maxDate="Date.now() + 2592000000"
			:confirmColor="mjThemeColor"
			closeOnClickOverlay
			@close="showDatetimePicker = false"
			@cancel="showDatetimePicker = false"
			@confirm="showDatetimePicker = false"
		></u-datetime-picker>
		<!-- 结束方式 -->
		<u-picker
			:show="showEndManner" 
			:columns="endCount"
			closeOnClickOverlay
			:defaultIndex="[0]"
			:confirmColor="mjThemeColor"
			@close="showEndManner = false"
			@cancel="showEndManner = false"
			@confirm="getEndManner"
		></u-picker>
		<!-- 选取模板的popup -->
		<u-popup 
			:show="showTemplate" 
			round="20px" 
			zIndex="10076"
			:closeOnClickOverlay="true"
			@close="showTemplate = false" 
		>
			<view class="user-template-list">
				<view class="header">
					<view class="middle">
						帐单模板
					</view>
				</view>
				<view class="template-list" :style="{maxHeight: windowHeight * 0.6 + 'rpx'}">
					<mj-bill-template :templateList="templateList" pageType="account" @getTemp="getTemp"></mj-bill-template>
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	import { themeColor } from '@/uni.scss'
	
	const db = uniCloud.database()
	export default {
		onLoad({type}) {
			console.log('CronEditType:',type);
			this.pageType = type
		},
		async mounted() {
			await this.getUserTemplate()
		},
		data() {
			return {
				pageType: 'add', // 页面类型
				templateList: [], // 用户的模板列表
				days: [Array.from({ length: 90 }, (_, index) => index + 1)],
				endCount: [Array.from({ length: 13 }, (_, index) => {
					if (index === 0) return '永不结束'
					return index
				})],
				showRepetitionCycle: false,
				showDatetimePicker: false,
				showEndManner: false,
				showTemplate: false,
				currentTemplete: null,
				initState: undefined, // 任务最初状态，用来判断switch组件为false时状态为0 暂停还是 -1 结束
				// 存储表单数据
				form: {
					name: '',
					state: 1,
					template_id: undefined,
					rule: {
						repetition_cycle: {
							type: 'day',
							count: 7
						},
						start_time: uni.$u.timeFormat(Date.now()),
						end_manner: {
							type: 'infinite',
							count: 0
						},
						expected_next_execution_time: undefined,
						recent_execution_time: undefined,
						executed_count: 0
					}
				}
			}
		},
		computed: {
			mjThemeColor() {
				return themeColor
			},
			isStart: {
				get() {
					return this.form.state === 1
				},
				set(newValue) {
					if (newValue) {
						this.form.state = 1
					} else {
						this.form.state = this.initState
					}
				}
			},
			datePickerValue: {
				get() {
					return this.form.rule.start_time
				},
				set(newValue) {
					this.form.rule.start_time = uni.$u.timeFormat(newValue)
				}
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
			getTemp(temp) {
				this.currentTemplete = temp
				this.showTemplate = false
			},
			getCycleDay({value}) {
				this.form.rule.repetition_cycle.count = value[0]
				this.showRepetitionCycle = false
			},
			getEndManner({value}) {
				if (value[0] === '永不结束') {
					this.form.rule.end_manner.type = 'infinite'
				} else {
					this.form.rule.end_manner.type = 'count'
					this.form.rule.end_manner.count = value[0]
				}
				this.showEndManner = false
			},
			saveForm() {
				console.log('form:',this.form);
				// 表单验证
				// 验证name是否不为空
				if (!this.form.name) {
					uni.showToast({
						title:"请填写名称",
						icon:"none"
					})
					return
				}
				// 是否选取模板
				if (!this.currentTemplete) {
					uni.showToast({
						title:"请选择模板",
						icon:"none"
					})
					return
				}
				// 将模板id进行赋值
				this.form.template_id = this.currentTemplete._id
				
				// 判断是新增还是修改
				if (this.pageType === 'add') {
					this.addNewCron()
				} else {
					this.editCron()
				}
			},
			addNewCron() {
				// 1 下次执行时间就是开始时间
				this.form.rule.expected_next_execution_time = this.form.rule.start_time
				
				// 2 整理数据，添加至数据库
				
				// 3 判断是否需要立即执行一次
				
			},
			editCron() {
				// 1 判断规则是否发生改变,若改变,重新计算下次执行时间
				
				// 2 状态是否发生改变,若改变,更新相关受影响的数据
			},
			// 根据规则计算下次执行时间
			getNextExecutionTime(rule) {
				
			}
		}
	}
</script>

<style lang="scss">
.cron-accounting-edit {
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
	
	.form-wrapper {
		box-sizing: border-box;
		padding: 20rpx;
		.section-right {
			display: flex;
			justify-content: flex-end;
			align-items: center;
			height: 100%;
			.section-text {
				color: $mj-text-color-grey;
				font-size: 24rpx;
				padding-right: 8rpx;
			}
		}
	}
	
	.btn {
		display: flex;
		align-items: center;
		box-sizing: border-box;
		padding: 4px 8px;
		margin-right: 4px;
		border-radius: 16px;
		font-size: 24rpx;
	}
	.choose {
		color: $mj-text-color-grey;
		background-color: $mj-bg-color-grey;
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
	
	.user-template-list {
		.header {
			display: flex;
			justify-content: center;
			padding-top: 24rpx;
			.middle {
				text-align: center;
				// scss中font另一种写法
				font: {
					size: 32rpx;
					weight: bold;
				}
			}
		}
		.template-list {
			max-height: 667rpx;
			overflow: auto;
		}
	}
	
	
}
</style>
