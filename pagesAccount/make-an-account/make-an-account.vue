<template>
	<view class="keep-accounts">
		<view class="header-tabs">
			<view class="tabs"><u-tabs :list="tabList" @click="clickTab" lineColor="#2e3548" :itemStyle="{ height: '76rpx' }"></u-tabs></view>
		</view>
		<view class="icon-grid">
			<!-- grid组件 -->
			<u-grid :border="false" @click="clickCategory" col="5">
				<u-grid-item v-for="item in categoryList">
					<view class="content">
						<view class="grid-item">
							<mj-icon-with-background :type="item.type" size="48rpx"></mj-icon-with-background>
							<view class="grid-text">{{item.title}}</view>
						</view>
					</view>
				</u-grid-item>
			</u-grid>
		</view>
		<view class="mj-keyboard">
			<!-- 组件为固定定位 -->
			<mj-keyboard></mj-keyboard>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				tabList: [{
					name: '支出'
				}, {
					name: '收入'
				}, {
					name: '转账'
				}],
				categoryList: [{
						type: 'cloud-download',
						title: '餐饮'
					},
					{
						type: 'checkbox',
						title: '购物'
					},
					{
						type: 'cloud-download',
						title: '交通'
					},
					{
						type: 'mail-open-filled',
						title: '住宿'
					},
					{
						type: 'cloud-download',
						title: '日常'
					},
					{
						type: 'redo',
						title: '学习'
					},
					{
						type: 'redo',
						title: '娱乐'
					},
					{
						type: 'redo',
						title: '美妆'
					},
					{
						type: 'redo',
						title: '旅游'
					},
					{
						type: 'redo',
						title: '医疗'
					},
					{
						type: 'redo',
						title: '会员租用'
					},
					{
						type: 'redo',
						title: '通讯'
					},
					{
						type: 'redo',
						title: '人情'
					},
					{
						type: 'redo',
						title: '投资'
					},
					{
						type: 'redo',
						title: '母婴'
					},
					{
						type: 'redo',
						title: '宠物'
					},
					{
						type: 'redo',
						title: '装修'
					},
					{
						type: 'redo',
						title: '其他'
					}
				]
			};
		},
		methods: {
			clickTab({
				name
			}) {
				console.log(name);
			},
			// 点击分类icon触发
			clickCategory(index) {
				console.log(index);
			}
		}
	}
</script>

<style lang="scss" scoped>
	.keep-accounts {
		.header-tabs {
			position: fixed;
			top: 0;
			width: 100%;
			height: 80rpx;
			background-color: $mj-theme-color;
			display: flex;
			justify-content: center;
			z-index: 99;
		}

		.icon-grid {
			box-sizing: border-box;
			padding: 48rpx;
			margin-top: 80rpx;
			margin-bottom: 568rpx;
			.content {
				padding-bottom: 14px;

				.grid-item {
					display: flex;
					flex-direction: column;
					justify-content: center;
					align-items: center;
					width: 148rpx;
					height: 124rpx;
					color: $mj-text-color;
					.icon {
						width: 80rpx;
						height: 80rpx;
						background-color: #f1f1f1;
						border-radius: 50%;
						display: flex;
						justify-content: center;
						align-items: center;
					}
					.grid-text {
						font-size: 28rpx;
					}
				}
			}
		}
		.mj-keyboard {
			
		}
	}
</style>