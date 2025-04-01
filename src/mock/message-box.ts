import Mock from 'mockjs';
import setupMock, { successResponseWrap } from '@/utils/setup-mock';

const haveReadIds: number[] = [];
const getMessageList = () => {
  return [
    {
      id: 1,
      type: 'message',
      title: '张教授',
      subTitle: '的设备请求',
      avatar: '/src/assets/avatar.png',
      content: '电子显微镜维护请求已发送，请查收',
      time: '2025-03-28 09:30:01',
    },
    {
      id: 2,
      type: 'message',
      title: '李工程师',
      subTitle: '的设备报告',
      avatar: '/src/assets/avatar.png',
      content: '质谱仪校准完成，校准报告已上传',
      time: '2025-03-28 08:45:01',
    },
    {
      id: 3,
      type: 'message',
      title: '王技术员',
      subTitle: '的维修反馈',
      avatar: '/src/assets/avatar.png',
      content: '光学显微镜镜头损坏已修复，可以正常使用',
      time: '2025-03-27 16:20:01',
    },
    {
      id: 4,
      type: 'notice',
      title: '设备维护提醒',
      subTitle: '',
      avatar: '',
      content: '分析天平季度校准将于2025-03-30到期，请提前安排校准…',
      time: '2025-03-27 15:30:01',
      messageType: 3,
    },
    {
      id: 5,
      type: 'notice',
      title: '新设备入库通知',
      subTitle: '',
      avatar: '',
      content: '高效液相色谱仪于2025-03-25入库成功并完成安装调试',
      time: '2025-03-25 11:20:01',
      messageType: 1,
    },
    {
      id: 6,
      type: 'todo',
      title: '设备使用培训',
      subTitle: '',
      avatar: '',
      content: '新进核磁共振仪使用培训将于2025-03-29 14:30进行，请相关人员…',
      time: '2025-03-20 10:20:01',
      messageType: 0,
    },
  ].map((item) => ({
    ...item,
    status: haveReadIds.indexOf(item.id) === -1 ? 0 : 1,
  }));
};

setupMock({
  setup: () => {
    Mock.mock(new RegExp('/api/message/list'), () => {
      return successResponseWrap(getMessageList());
    });

    Mock.mock(new RegExp('/api/message/read'), (params: { body: string }) => {
      const { ids } = JSON.parse(params.body);
      haveReadIds.push(...(ids || []));
      return successResponseWrap(true);
    });
  },
});
