import localeMessageBox from '@/components/message-box/locale/en-US';
import localeLogin from '@/views/login/locale/en-US';
import localeWorkplace from '@/views/dashboard/workplace/locale/en-US';
import localeUserCenter from '@/views/user/info/locale/en-US';
import localeSettings from './en-US/settings';

export default {
  'menu.dashboard': 'Dashboard',
  'menu.server.dashboard': 'Dashboard-Server',
  'menu.server.workplace': 'Workplace-Server',
  'menu.server.monitor': 'Monitor-Server',
  'menu.list': 'List',
  'menu.result': 'Result',
  'menu.exception': 'Exception',
  'menu.form': 'Form',
  'menu.profile': 'Profile',
  'menu.visualization': 'Data Visualization',
  'menu.user': 'User Center',
  'menu.user.info': 'Personal Info',
  'menu.arcoWebsite': 'Arco Design',
  'menu.faq': 'FAQ',
  'menu.equipment': 'Equipment',
  'menu.equipment.reservation': 'Reservation',
  'menu.equipment.approval': 'Approval',
  'menu.equipment.operation': 'Operation',
  'menu.equipment.history': 'History Records',
  'menu.settings': 'System Settings',
  'menu.settings.system': 'System Configuration',
  'navbar.docs': 'Docs',
  'navbar.action.locale': 'Switch to English',
  ...localeSettings,
  ...localeMessageBox,
  ...localeLogin,
  ...localeWorkplace,
  ...localeUserCenter,
};
