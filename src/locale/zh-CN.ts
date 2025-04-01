import localeMessageBox from '@/components/message-box/locale/zh-CN';
import localeLogin from '@/views/login/locale/zh-CN';
import localeWorkplace from '@/views/dashboard/workplace/locale/zh-CN';
import localeUserCenter from '@/views/user/info/locale/zh-CN';
import localeSettings from './zh-CN/settings';

export default {
  'menu.dashboard': '仪表盘',
  'menu.server.dashboard': '仪表盘-服务端',
  'menu.server.workplace': '工作台-服务端',
  'menu.server.monitor': '实时监控-服务端',
  'menu.list': '列表页',
  'menu.result': '结果页',
  'menu.exception': '异常页',
  'menu.form': '表单页',
  'menu.profile': '详情页',
  'menu.visualization': '数据可视化',
  'menu.user': '个人中心',
  'menu.user.info': '个人信息',
  'menu.arcoWebsite': 'Arco Design',
  'menu.faq': '常见问题',
  'menu.equipment': '设备管理',
  'menu.equipment.reservation': '设备预约',
  'menu.equipment.approval': '预约审批',
  'menu.equipment.operation': '设备操作',
  'menu.equipment.history': '实验记录',
  'menu.settings': '系统设置',
  'menu.settings.system': '系统配置',
  'navbar.docs': '文档中心',
  'navbar.action.locale': '切换为中文',
  ...localeSettings,
  ...localeMessageBox,
  ...localeLogin,
  ...localeWorkplace,
  ...localeUserCenter,
};
