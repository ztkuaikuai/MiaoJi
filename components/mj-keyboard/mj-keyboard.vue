<template>
	<view class="content">
		<view class="fixed">
			<view class="tags">
				<view class="item">
					<view><u-icon name="rmb-circle"></u-icon></view>
					<view>微信钱包</view>
				</view>
				<view class="item">
					<view><u-icon name="rmb-circle"></u-icon></view>
					<view>8月31日</view>
				</view>
				<view class="item">
					<view><u-icon name="rmb-circle"></u-icon></view>
					<view>模板</view>
				</view>
			</view>
			<view class="bgc">
				<view class="header">
					<view class="textarea">
						<u--textarea v-model="model.message" placeholder="备注信息(最多输入60字)" autoHeight border="none" :fixed="true" maxlength="60"></u--textarea>
					</view>
					<view class="num">
						<u--text mode="price" text="96222224.32" color="#dd524d" bold size="36rpx"></u--text>
					</view>
				</view>
			</view>
			<!-- 安全区适配 配置底部安全区 -->
			<u-safe-bottom></u-safe-bottom>
		</view>
		<view class="keyboard">
			<!-- 修改了u-number-keyboard中的样式,逻辑 -->
			<u-keyboard mode="number" :show="true" :tooltip="false" :overlay="false" @change="tapKeyboard" @backspace="tapBackspace"></u-keyboard>
		</view>
	</view>
</template>

<script>
	export default {
		name:"mj-keyboard",
		data() {
			return {
				model: {
					message: ''
				}
			};
		},
		methods: {
			change(e) {
				console.log(e);
			},
			// keyboard被点击（不包含退格键）
			tapKeyboard(e) {
				console.log(e);
			},
			// 退格键被点击
			tapBackspace() {
				console.log("退格键");
			}
		}
	}
</script>

<style lang="scss">
.content {
	.fixed {
		position: fixed;
		bottom: 424rpx;
		left: 0;
		right: 0;
		.tags {
			display: flex;
			justify-content: start;
			.item {
				margin-right: 20rpx;
				display: flex;
				justify-content: start;
				align-items: center;
				box-sizing: border-box;
				padding: 12rpx;
				border-radius: 36rpx;
				background-color: #f1f1f1;
				font-size: 24rpx;
			}
			// 父级选择器 & 可以选中当前的父元素
			&:first-child {
				margin-left: 20rpx;
			}
		}
		.bgc {
			background-color: #fff;
			border-top: 1px solid #f3f3f3;
			margin-top: 8rpx;
			.header {
				display: flex;
				justify-content: space-between;
				align-items: center;
				.textarea {
					min-width: 430rpx;
				}
				.num {
					max-width: 320rpx;
					text-align: right;
				}
			}
		}
	}
}
</style>