import Mock from 'mockjs';
import setupMock, { successResponseWrap } from '@/utils/setup-mock';

const haveReadIds: number[] = [];
const getMessageList = () => {
  return [
    {
      id: 1,
      type: 'message',
      title: '设备管理员',
      subTitle: '的审批请求',
      avatar:
        '//p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/8361eeb82904210b4f55fab888fe8416.png~tplv-uwbnlip3yd-webp.webp',
      content: '新的设备使用申请已提交，请及时审批',
      time: '今天 12:30:01',
    },
    {
      id: 2,
      type: 'message',
      title: '系统通知',
      subTitle: '设备维护提醒',
      avatar:
        '//p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/3ee5f13fb09879ecb5185e440cef6eb9.png~tplv-uwbnlip3yd-webp.webp',
      content: '电子显微镜需要进行定期维护，请安排时间',
      time: '今天 12:30:01',
    },
    {
      id: 3,
      type: 'message',
      title: '实验室主任',
      subTitle: '的回复',
      avatar:
        '//p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/3ee5f13fb09879ecb5185e440cef6eb9.png~tplv-uwbnlip3yd-webp.webp',
      content: '设备使用申请已通过，请按时使用并注意安全',
      time: '今天 12:20:01',
    },
    {
      id: 4,
      type: 'notice',
      title: '设备使用期限提醒',
      subTitle: '',
      avatar: '',
      content: '您预约的离心机使用时间即将结束，如需继续使用请重新预约',
      time: '今天 12:20:01',
      messageType: 3,
    },
    {
      id: 5,
      type: 'notice',
      title: '新设备入库通知',
      subTitle: '',
      avatar: '',
      content: '新一批实验设备已完成入库，包括：分光光度计、pH计等',
      time: '今天 12:20:01',
      messageType: 1,
    },
    {
      id: 6,
      type: 'todo',
      title: '设备使用培训',
      subTitle: '',
      avatar: '',
      content: '新设备使用培训将于明天下午2:00在实验室进行，请相关人员准时参加',
      time: '今天 12:20:01',
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
