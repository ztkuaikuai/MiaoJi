<template>
	<view class="card">
		<uni-section :title="title" type="line" :titleFontSize="titleFontSize" titleColor="#212121" white="true" :sub-title="subTitle">
			<template v-slot:right>
				<slot name="right"></slot>
			</template>
		</uni-section>
		<template>
			<slot></slot>
		</template>
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
			},
			titleFontSize: {
				type: String,
				default: '32rpx'
			},
			subTitle: {
				type: String,
				default: ''
			}
		}
	}
</script>

<style lang="scss" scoped>
.card {
	box-sizing: border-box;
	overflow: hidden;
	border-radius: 20px;
	margin: 24rpx 20rpx;
	background-color: #fff;
	display: block;
	padding: 0 16rpx 16rpx;
	box-shadow: rgba(0, 0, 0, 0.03) 2.4px 2.4px 4.8px;
}
</style>