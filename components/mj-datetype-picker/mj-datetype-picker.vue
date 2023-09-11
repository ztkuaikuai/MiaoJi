<template>
	<!-- 日期类型选择器 需要输出选择类型和时间戳，之后数据库进行筛选，拿到数据进行渲染 -->
	<view class="datetype-picker">
		<!-- 选择器 + 日期选择器DatetimePicker  -->
		<view class="item" @tap="tapDateBtn">
			{{today}}<u-icon name="arrow-down" size="24rpx" color="#212121" bold top="4rpx"></u-icon>
		</view>
		<!-- <u-picker @confirm="getDateType" @cancel="showPicker = false" @close="showPicker = false" :show="showPicker" :columns="columns" confirmColor="#9fcba7" :closeOnClickOverlay="true" ></u-picker> -->
		
		<u-datetime-picker
			@cancel="showMonthPicker = false"
			@confirm="getMonth"
			@close="showMonthPicker = false"
			:show="showMonthPicker"
			v-model="now"
			:maxDate="Date.now()"
			mode="year-month"
			title="请选择要查询的月份"
			confirmColor="#9fcba7"
			:closeOnClickOverlay="true"
		></u-datetime-picker>
		<!-- 年份选择器 -->
		<!-- <u-picker
			@confirm="getYear"	
			@cancel="showYearPicker = false"
			@close="showYearPicker = false"
			:show="showYearPicker"
			:columns="years"
			confirmColor="#9fcba7"
			title="请选择要查询的年份"
			:closeOnClickOverlay="true"
		></u-picker> -->
		<!-- 自定义选择:暂时不用 -->
		<!-- <u-popup :show="showCustom" @close="showCustom = false" :closeOnClickOverlay="false">
			<u-toolbar
				@confirm="getDates"
				@cancel="showCustom = false"
				confirmColor="#9fcba7"
			></u-toolbar>
			<u-cell-group :border="false">
				<u-cell title="开始时间" label="2023年8月1日" :isLink="true" arrow-direction="right" @click="customPicker"></u-cell>
				<u-cell title="结束时间" label="2023年8月31日" :isLink="true" @click="customPicker"></u-cell>
			</u-cell-group>
		</u-popup> -->
		
		<!-- <u-datetime-picker
			@confirm="getCustomDate"
			@cancel="showCustomPicker = false"
			:show="showCustomPicker"
			v-model="now"
			mode="date"
			:maxDate="Date.now()"
			title="请选择要查询的日期"
			confirmColor="#9fcba7"
		></u-datetime-picker> -->
		
	</view>
</template>

<script>
	export default {
		name:"mj-datetype-picker",
		data() {
			return {
				showPicker: false,
				showMonthPicker: false,
				showYearPicker: false,
				today: uni.$u.timeFormat(Date.now(), 'yyyy年mm月'),
				columns: [['月账单','年账单']],
				// columns: [['月账单','年账单','自选日期']],
				years: [[2020,2021,2022,2023]],
				now: Date.now(),
				// showCustom: false,
				// showCustomPicker: false
				
			};
		},
		methods: {
			// 触发了顶部日期按钮
			tapDateBtn() {
				this.showMonthPicker = true
			},
			// 获得用户选择的日期筛选类型  0 月账单  1 年账单    dateType
			// getDateType(res) {
			// 	// 根据类型展示对应的picker
			// 	this.showDatePicker(res.indexs[0])
			// },
			// showDatePicker(type) {
			// 	if(type == 0) {
			// 		this.showPicker = false
			// 		this.showMonthPicker = true
			// 	} else {
			// 		console.log("查询年账单");
			// 		this.showYearPicker = true
			// 	} 
				// else {
				// 	console.log("自定义查询");
				// 	this.showCustom = true
				// }
				
			// },
			// 点击月份选择器确认按钮
			getMonth(res) {
				this.today = uni.$u.timeFormat(res.value, 'yyyy年mm月'),
				this.$emit('pickDate',res)
				this.showMonthPicker = false
			},
			// getYear(res) {
			// 	console.log(res.value[0]);
			// 	this.showYearPicker = false
			// },
			// // 点击自定义 触发
			// customPicker() {
			// 	this.showCustomPicker = true
			// },
			// //  点击日期具体选择器确定按钮触发
			// getCustomDate(res) {
			// 	console.log(res);
			// },
			// // 点击2个日期选择器界面的确认按钮触发
			// getDates(res) {
			// 	console.log(res);
			// 	this.showCustom = false
			// }
		}
	}
</script>

<style lang="scss" scoped>
	.datetype-picker>.item {
		display: flex;
		justify-content: start;
		align-items: center;
		.uicon-arrow-down {
			padding-left: 8rpx;
		}
	}
</style>