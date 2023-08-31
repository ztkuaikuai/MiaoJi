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
							<view class="icon">
								<u-icon :name="item.name" size="48rpx"></u-icon>
							</view>
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
						name: 'list-dot',
						title: '餐饮'
					},
					{
						name: 'rmb-circle',
						title: '购物'
					},
					{
						name: 'order',
						title: '交通'
					},
					{
						name: 'order',
						title: '住宿'
					},
					{
						name: 'order',
						title: '日常'
					},
					{
						name: 'order',
						title: '学习'
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
			background-color: $mj-theme-color;
			display: flex;
			justify-content: center;
		}

		.icon-grid {
			box-sizing: border-box;
			padding: 48rpx;

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