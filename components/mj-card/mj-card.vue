<template>
	<view class="card">
		<uni-section class="section" :title="title" type="line" titleFontSize="28rpx" titleColor="#212121" white="true"></uni-section>
		<view class="slot">
			<slot></slot>
		</view>
	</view>
</template>

<script>
	export default {
		name:"mj-card",
		data() {
			return {
			};
		},
		props: {
			title: {
				type: String,
				default: ''
			}
		}
	}
</script>

<style lang="scss" scoped>
.card {
	box-sizing: border-box;
	margin: 24rpx 20rpx;
	background-color: #fff;
	display: block;
	padding: 0 16rpx 16rpx;
	box-shadow: rgba(0, 0, 0, 0.03) 2.4px 2.4px 3.2px;
}
</style>