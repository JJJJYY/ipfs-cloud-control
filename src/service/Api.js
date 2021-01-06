import * as request from '../utils/reqGenerator';

// ----------------------- SysUser -----------------------
export async function sysUserLogin(params) {
  console.log(params);
  return request.post('staff/user/login', params);
}

export async function sysUserLogout() {
  return request.post('staff/user/logout');
}

export async function sysUserAdd(params) {
  return request.post('staff/admin/add', params);
}

export async function sysUserUpdate(params) {
  return request.post('staff/admin/update', params);
}

export async function sysUserList(params) {
  return request.post('staff/admin/list', params);
}

export async function sysUserRole(params) {
  return request.post('staff/sys/user-role/user-role', params);
}

export async function sysUserMenu() {
  return request.post('staff/user/menu');
}

// ----------------------- SysUserRole -----------------------
export async function sysUserRoleAdd(params) {
  return request.post('Portal.SysUserRole.Add', params);
}

// ----------------------- SysRole -----------------------
export async function sysRoleAdd(params) {
  return request.post('staff/sys/role/add', params);
}

export async function sysRoleUpdate(params) {
  return request.post('staff/sys/role/update', params);
}

export async function sysRoleList(params) {
  return request.post('staff/sys/role/list', params);
}

export async function sysRoleTree(params) {
  return request.post('staff/sys/role/roleTree', params);
}

export async function sysRoleOperate(params) {
  return request.post('staff/sys/role/roleOperate', params);
}

// ----------------------- SysRoleModule -----------------------
export async function sysRoleModuleEdit(params) {
  return request.post('staff/sys/role-module/editModules', params);
}

// ----------------------- SysRoleOperate -----------------------

export async function sysRoleOperateEdit(params) {
  return request.post('Portal.SysRoleOperate.EditOperate', params);
}

// ----------------------- SysModule -----------------------
export async function sysModuleAdd(params) {
  console.log(params);
  return request.post('staff/sys/module/add', params);
}

export async function sysModuleUpdate(params) {
  return request.post('staff/sys/module/update', params);
}

export async function sysModuleTree(params) {
  return request.post('staff/sys/module/tree', params);
}

// ----------------------- SysOperate -----------------------
export async function sysOperateAdd(params) {
  return request.post('Portal.SysOperate.Add', params);
}

export async function sysOperateList(params) {
  return request.post('Portal.SysOperate.List', params);
}

export async function sysOperateUpdate(params) {
  return request.post('Portal.SysOperate.Update', params);
}

// ----------------------- 七牛 -----------------------
export async function qiniu() {
  return request.post('staff/qiniu/token');
}

// ----------------------- Overview -----------------------
export async function overviewHome(params) {
  return request.post('Portal.Overview.Home', params);
}

// ----------------------- AuthUser -----------------------
export async function authUserUpdate(params) {
  return request.post('staff/user/update', params);
}
export async function authUserList(params) {
  return request.post('staff/user/list', params);
}

export async function authUserInvitationList(params) {
  return request.post('staff/user/info', params);
}

export async function authUserInviteDetailList(params) {
  return request.post('Portal.AuthUser.InviteDetailList', params);
}

export async function authUserDetail(params) {
  return request.post('staff/user/info', params);
}

export async function authUserExport(params) {
  return request.download('Portal.AuthUser.ExportAuthUser', params);
}

export async function authUserInvitationExport(params) {
  return request.download('Portal.AuthUser.ExportInvitation', params);
}

export async function authUserInviteDetailExport(params) {
  return params.all && params.agent
    ? request.post('Portal.AuthUser.ExportInviteDetail', params)
    : request.download('Portal.AuthUser.ExportInviteDetail', params);
}

export async function authUserCheckInvitationDetailExport(params) {
  return request.post('Portal.AuthUser.CheckInvitationDetailExport', params);
}

// ----------------------- UserIdInfo -----------------------
export async function userIdInfoList(params) {
  return request.post('Portal.UserIdInfo.List', params);
}

export async function userIdInfoUpdate(params) {
  return request.post('Portal.UserIdInfo.Update', params);
}

// ----------------------- Balance -----------------------
export async function balanceExchange(params) {
  return request.post('Portal.Balance.Exchange', params);
}

// ----------------------- BalanceModify -----------------------
export async function balanceModifyList(params) {
  return request.post('Portal.BalanceModify.List', params);
}

export async function balanceModifyExport(params) {
  return request.download('Portal.BalanceModify.Export', params);
}

// ----------------------- Income -----------------------
export async function incomeList(params) {
  return request.post('Portal.Income.List', params);
}

export async function incomeRewardBy24H(params) {
  return request.post('Portal.Income.RewardBy24H', params);
}

export async function incomeExport(params) {
  return request.download('Portal.Income.Export', params);
}

// ----------------------- Weight -----------------------
export async function weightList(params) {
  return request.post('Portal.Weight.List', params);
}

export async function weightTopList(params) {
  return request.post('staff/order/index', params);
}

export async function weightUpdate(params) {
  return request.post('staff/order/edit', params);
}

export async function weightId(params) {
  return request.post('staff/order/info', params);
}

// ----------------------- ReplenishmentRecord -----------------------
export async function replenishmentRecordList(params) {
  return request.post('staff/order/index', params);
}

export async function replenishmentRecordAdd(params) {
  return request.post('staff/order/add', params);
}

// export async function replenishmentRecordUpdate(params) {
//   return request.post('staff/order/audit_info', params);
// }

export async function replenishmentRecordUpdate(params) {
  return request.post('staff/order/edit', params);
}

export async function replenishmentRecordBatchAudit(params) {
  return request.post('staff/product/groupList', params);
}

export async function replenishmentRecordAudit(params) {
  return request.download('staff/order/audit', params);
}

// ----------------------- Deposit -----------------------
export async function depositList(params) {
  return request.post('Portal.Deposit.List', params);
}

export async function depositExport(params) {
  return request.download('Portal.Deposit.Export', params);
}

// ----------------------- Withdrawal -----------------------
export async function withdrawalList(params) {
  return request.post('Portal.Withdrawal.List', params);
}

export async function withdrawalAudit(params) {
  return request.post('Portal.Withdrawal.Audit', params);
}

export async function withdrawalExport(params) {
  return request.download('Portal.Withdrawal.Export', params);
}

export async function withdrawalUSDTBalance(params) {
  return request.post('Portal.Withdrawal.WithdrawalUSDTBalance', params);
}

export async function withdrawalExportFILTxt(params) {
  return request.post('Portal.Withdrawal.ExportFILTxt', params);
}

// ----------------------- Goods -----------------------
export async function goodsList(params) {
  return request.post('staff/product/index', params);
}

export async function goodsId(params) {
  return request.post(`staff/product/index`, params);
}

export async function goodsUpdate(params) {
  return request.post('staff/product/edit', params);
}

export async function goodsAdd(params) {
  return request.post('staff/product/edit', params);
}

export async function goodsGet(params) {
  return request.post('staff/product/type', params);
}
export async function goodsChange(params) {
  return request.post('staff/product/change', params);
}
export async function groupList(params) {
  return request.post('staff/product/info', params);
}
// export async function goodsGetActive() {
//   return request.post('Portal.Goods.GetActive');
// }

// ----------------------- Announcement -----------------------
export async function announcementList(params) {
  return request.post('staff/announcement/list', params);
}

export async function announcementUpdate(params) {
  return request.post('staff/announcement/update', params);
}

export async function announcementAdd(params) {
  return request.post('staff/announcement/add', params);
}

export async function announcementGet(params) {
  return request.post('staff/announcement/get', params);
}

// ----------------------- Banner -----------------------
export async function bannerList(params) {
  return request.post('staff/banner/list', params);
}

export async function bannerUpdate(params) {
  return request.post('staff/banner/update', params);
}

export async function bannerAdd(params) {
  return request.post('staff/banner/add', params);
}

// ----------------------- Channel -----------------------
export async function channelList(params) {
  return request.post('Portal.Channel.List', params);
}

export async function channelUpdate(params) {
  return request.post('Portal.Channel.Update', params);
}

export async function channelAdd(params) {
  return request.post('Portal.Channel.Add', params);
}

// ----------------------- Asset -----------------------
export async function assetList(params) {
  return request.post('Portal.Asset.List', params);
}

export async function assetUpdate(params) {
  return request.post('Portal.Asset.Update', params);
}

export async function assetAdd(params) {
  return request.post('Portal.Asset.Add', params);
}

// ----------------------- Level -----------------------
export async function levelList(params) {
  return request.post('Portal.Level.List', params);
}

export async function levelUpdate(params) {
  return request.post('Portal.Level.Update', params);
}

export async function levelAdd(params) {
  return request.post('Portal.Level.Add', params);
}

// ----------------------- LinksInfo -----------------------
export async function linksInfoList(params) {
  return request.post('Portal.LinksInfo.List', params);
}

export async function linksInfoUpdate(params) {
  return request.post('Portal.LinksInfo.Update', params);
}

export async function linksInfoAdd(params) {
  return request.post('Portal.LinksInfo.Add', params);
}

// ----------------------- PartnerInfo -----------------------
export async function partnerInfoList(params) {
  return request.post('staff/partner_info/list', params);
}

export async function partnerInfoUpdate(params) {
  return request.post('staff/partner_info/update', params);
}

export async function partnerInfoAdd(params) {
  return request.post('staff/partner_info/add', params);
}

// ----------------------- HelpInfo -----------------------
export async function helpInfoList(params) {
  return request.post('staff/help_info/list', params);
}

export async function helpInfoUpdate(params) {
  return request.post('staff/help_info/update', params);
}

export async function helpInfoAdd(params) {
  return request.post('staff/help_info/add', params);
}

export async function helpInfoGet(params) {
  return request.post('staff/help_info/get', params);
}

// ----------------------- AdvertisementInfo -----------------------
export async function advertisementInfoList(params) {
  return request.post('Portal.AdvertisementInfo.List', params);
}

export async function advertisementInfoUpdate(params) {
  return request.post('Portal.AdvertisementInfo.Update', params);
}

export async function advertisementInfoAdd(params) {
  return request.post('Portal.AdvertisementInfo.Add', params);
}

export async function advertisementInfoGet(params) {
  return request.post('Portal.AdvertisementInfo.Get', params);
}

// ----------------------- TextInfo -----------------------
export async function textInfoList(params) {
  return request.post('Portal.TextInfo.List', params);
}

export async function textInfoUpdate(params) {
  return request.post('Portal.TextInfo.Update', params);
}

export async function textInfoAdd(params) {
  return request.post('Portal.TextInfo.Add', params);
}

export async function textInfoGet(params) {
  return request.post('Portal.TextInfo.Get', params);
}

// ----------------------- AppVersion -----------------------
export async function appList(params) {
  return request.post('Portal.AppVersion.List', params);
}

export async function appUpdate(params) {
  return request.post('Portal.AppVersion.Update', params);
}

export async function appAdd(params) {
  return request.post('Portal.AppVersion.Add', params);
}

// ----------------------- AuthAgent -----------------------
export async function authAgentList(params) {
  return request.post('Portal.AuthAgent.List', params);
}

export async function authAgentUpdate(params) {
  return request.post('Portal.AuthAgent.Update', params);
}

export async function authAgentAdd(params) {
  return request.post('Portal.AuthAgent.Add', params);
}

// ----------------------- FlashSaleOrders -----------------------
export async function flashSaleOrdersList(params) {
  return request.post('Portal.FlashSaleOrders.List', params);
}

export async function flashSaleOrdersUpdate(params) {
  return request.post('Portal.FlashSaleOrders.Update', params);
}

// ----------------------- Pledged -----------------------
export async function pledgedList(params) {
  return request.post('Portal.Pledged.List', params);
}

// ----------------------- Loan -----------------------
export async function loanList(params) {
  return request.post('Portal.Loan.List', params);
}

// ----------------------- UserAdjPower -----------------------
export async function userAdjPowerList(params) {
  return request.post('Portal.UserAdjPower.List', params);
}

// ----------------------- IncomeRecord -----------------------
export async function incomeRecordList(params) {
  return request.post('Portal.IncomeRecord.List', params);
}

// ----------------------- DailyFilpoolMinerStatistics -----------------------
export async function dailyFilpoolMinerStatisticsList(params) {
  return request.post('Portal.DailyFilpoolMinerStatistics.List', params);
}
