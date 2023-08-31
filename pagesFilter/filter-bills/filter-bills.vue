<template>
	<view class="filter-bills">
		<view class="header-tabs">
			<view class="tabs"><u-tabs :list="tabList" @click="clickTab" lineColor="#2e3548" :itemStyle="{ height: '76rpx' }"></u-tabs></view>
			<view class="reset" @tap="tapReset">
				重置
			</view>
		</view>
		<view class="filter-wrapper">
			<view class="filter-base" v-show="currentTabIndex == 0">
				<mj-card title="时间" >
					<mj-datetype-picker></mj-datetype-picker>
				</mj-card>
				<mj-card title="金额区间">
					<view style="margin-bottom: 16rpx;">
						<u-input placeholder="最小金额" type="digit" clearable maxlength="10" fontSize="30rpx" color="#212121" shape="circle" ></u-input>
					</view>
					<u-input placeholder="最大金额" type="digit" clearable maxlength="10" fontSize="30rpx" color="#212121" shape="circle" ></u-input>
				</mj-card>
				<mj-card title="备注">
					<u-input placeholder="备注信息" clearable maxlength="60" fontSize="30rpx" color="#212121" shape="circle" ></u-input>
				</mj-card>
			</view>
			<view class="filter-category" v-show="currentTabIndex == 1">
				<mj-card title="支出">
					<!-- 这里遍历支出分类 -->
					<view class="tags" @tap="tapTag">
						<view class="tag">
							餐饮
						</view>
						<view class="tag active">
							购物
						</view>
					</view>
				</mj-card>
				<mj-card title="收入">
					<view class="tags" @tap="tapTag">
						<view class="tag">
							职业收入
						</view>
						<view class="tag active">
							零花钱
						</view>
					</view>
				</mj-card>
				<mj-card title="其他">
					<view class="tags" @tap="tapTag">
						<view class="tag active">
							内部转账
						</view>
					</view>
				</mj-card>
			</view>
			<view class="filter-account" v-show="currentTabIndex == 2" >
				<view class="accounts"  v-for="item in 3"> <!-- 此处遍历，输入 icon，资产名 -->
					<view class="oneAccount"> 
						<view class="left">
							<u-avatar icon="weixin-fill" fontSize="24" ></u-avatar>
							<view class="info">
								<view>微信钱包</view>
							</view>
						</view>
						<view class="right"><view class="mj-circle-outer"><view class="mj-circle-inner" v-show="true"></view></view></view>
					</view>
					<view class="line" v-if="item != 3">
						<u-line length="80%"></u-line>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				tabList: [{name: '基本'},{name: '分类'},{name: '账户'}],
				currentTabIndex: 0,
				isTagActive: false,
			};
		},
		methods: {
			clickTab({name,index}) {
				if(this.currentTabIndex == index) return
				// 如果点击了其他tabs，则跳转到对应页面 ：用v-if\show   （那么如何丝滑的跳转？）
				this.currentTabIndex = index
			},
			tapReset() {
				console.log("点击了重置按钮");
			},
			tapTag() {
				console.log('点击了tag？还没完全点击');
			}
		}
	}
</script>

<style lang="scss" scoped>
.filter-bills {
	.header-tabs {
		position: relative;
		height: 80rpx;
		background-color: $mj-theme-color;
		display: flex;
		justify-content: center;
		.reset {
			position: absolute;
			right: 28rpx;
			font-size: 30rpx;
			color: #606266;
			line-height: 80rpx;
		}
	}
	.filter-wrapper {
		.filter-category {
			.tags {
				display: flex;
				justify-content: start;
				flex-wrap: wrap;
				box-sizing: border-box;
				padding: 0 36px 10px;
				.tag {
					box-sizing: border-box;
					padding: 12rpx 32rpx;
					background-color: #f4f4f4;
					color: $mj-text-color;
					font-size: 32rpx;
					line-height: 36rpx;
					border-radius: 28rpx;
					margin: 0 4px;
					&.active {
						background-color: $mj-theme-color;
						color: #fff;
					}
				}
			}
		}
		.filter-account {
			.accounts {
				.oneAccount {
					background-color: $mj-bg-color;
					display: flex;
					justify-content: space-between;
					height: 100rpx;
					color: $mj-text-color;
					font-size: 32rpx;
					padding-top: 16rpx;
					.left {
						padding-left: 24rpx;
						display: flex;
						justify-content: right;
						align-items: center;
						.info {
							display: flex;
							flex-direction: column;
							justify-content: center;
							padding-left: 24rpx;
						}
					}
					.right {
						display: flex;
						flex-direction: column;
						justify-content: center;
						align-items: flex-end;
						padding-right: 20rpx;
						.mj-circle-outer {
							box-sizing: border-box;
							padding: 4rpx;
							width: 32rpx;
							height: 32rpx;
							border: 1px solid $mj-theme-color;
							border-radius: 50%;
							.mj-circle-inner {
								width: 100%;
								height: 100%;
								border-radius: 50%;
								background-color: $mj-theme-color;
							}
						}
						
					}
				}
				.line {
					display: flex;
					justify-content: center;
				}
			}
		}
	}
}
</style>
