import {getAllIconList, getAssetsStyle} from "@/utils/icon-config.js";

const iconGather = getAllIconList()
const assetsStyle = getAssetsStyle()

// 格式化一条模板数据，用于界面展示
export function formatOneTemplate(oneTemplate) {
	// 获取用户资产信息
	const assets = uni.getStorageSync('mj-user-assets')
	const tempObj = uni.$u.deepClone(oneTemplate)
	// 1 修改金额单位 变为元
	// 2 通过category_type给每一条添加对应billStyle
	// 3 通过asset_type给每一条添加对应的assetStyle
	// 4 如果转入资产的id，给其添加对应的destinationAssetStyle
	tempObj.bill_amount /= 100
	tempObj.billStyle = iconGather.find(item => item.type === tempObj.category_type)
	// 如果为undefined，则对应的资产被用户删除
	const asset_type = assets.find(item => item._id ===  tempObj.asset_id[0]?._id)?.asset_type
	// 判断模板的资产id对应的资产有没有被用户删除
	if(asset_type) {
		tempObj.assetStyle = assetsStyle.find(item => item.type === asset_type)
		// hasAsset 用户是否存在对应资产
		tempObj.hasAsset = true
	} else {
		tempObj.assetStyle = {}
		tempObj.assetStyle.title = '资产已删除'
		tempObj.hasAsset = false
	}
	const destination_asset_type = assets.find(item => item._id ===  tempObj.destination_asset_id[0]?._id)?.asset_type
	if(destination_asset_type) {
		tempObj.destinationAssetStyle = assetsStyle.find(item => item.type === destination_asset_type)
		tempObj.hasDestinationAsset = true
	} else {
		tempObj.destinationAssetStyle = {}
		tempObj.destinationAssetStyle.title = '资产已删除'
		tempObj.hasDestinationAsset = false
	}
	return tempObj
}