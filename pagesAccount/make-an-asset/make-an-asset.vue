<template>
	<view>
		<u-cell-group :border="false" >
			<u-cell :icon="asset.icon" :title="asset.title" :isLink="true" @click="clickAsset(index)" v-for="asset,index in assets"></u-cell>
		</u-cell-group>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				assets: [{
					icon: 'zhifubao',
					title: '支付宝',
					type: 'zhifubao'
				},{
					icon: 'weixin-fill',
					title: '微信钱包',
					type: 'wx'
				},{
					icon: 'rmb-circle',
					title: '零元购',
					type: 'lyg'
				}],
			};
		},
		methods: {
			clickAsset(index) {
				uni.navigateTo({
					url: `/pagesAccount/set-asset/set-asset?type=${this.assets[index].type}`,
				})
			}
		}
	}
</script>

<style lang="scss" scoped>

</style>
