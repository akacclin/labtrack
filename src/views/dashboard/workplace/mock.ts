import Mock from 'mockjs';
import qs from 'query-string';
import dayjs from 'dayjs';
import { GetParams } from '@/types/global';
import setupMock, { successResponseWrap } from '@/utils/setup-mock';

const textList = [
  {
    key: 1,
    clickNumber: '346.3w+',
    title: '实验室设备管理:高效的校准流程…',
    increases: 35,
  },
  {
    key: 2,
    clickNumber: '324.2w+',
    title: '质量控制:实验室仪器检测精度分析…',
    increases: 22,
  },
  {
    key: 3,
    clickNumber: '318.9w+',
    title: '2025年度实验室仪器设备安全规范更新…',
    increases: 9,
  },
  {
    key: 4,
    clickNumber: '257.9w+',
    title: '科研仪器采购与维护:成本效益分析…',
    increases: 17,
  },
  {
    key: 5,
    clickNumber: '124.2w+',
    title: '实验室自动化设备整合:案例分析…',
    increases: 37,
  },
];
const imageList = [
  {
    key: 1,
    clickNumber: '15.3w+',
    title: '新型光谱分析仪入驻化学实验室…',
    increases: 15,
  },
  {
    key: 2,
    clickNumber: '12.2w+',
    title: '图集:2025年度实验室设备展览会…',
    increases: 26,
  },
  {
    key: 3,
    clickNumber: '18.9w+',
    title: '先进材料测试设备应用在航空材料研发…',
    increases: 9,
  },
  {
    key: 4,
    clickNumber: '7.9w+',
    title: '气相色谱仪维护培训在京举行',
    increases: 0,
  },
  {
    key: 5,
    clickNumber: '5.2w+',
    title: '实验室安全事故防范:设备操作规范',
    increases: 4,
  },
];
const videoList = [
  {
    key: 1,
    clickNumber: '367.6w+',
    title: '实验室设备使用培训视频:电子显微镜',
    increases: 5,
  },
  {
    key: 2,
    clickNumber: '352.2w+',
    title: '质谱仪操作与数据分析指南',
    increases: 17,
  },
  {
    key: 3,
    clickNumber: '348.9w+',
    title: '实验室设备维护保养规范示范',
    increases: 30,
  },
  {
    key: 4,
    clickNumber: '346.3w+',
    title: '低温冷冻设备的安全操作流程',
    increases: 12,
  },
  {
    key: 5,
    clickNumber: '271.2w+',
    title: '新型核磁共振仪技术参数解析',
    increases: 2,
  },
];
setupMock({
  setup() {
    Mock.mock(new RegExp('/api/content-data'), () => {
      const presetData = [58, 81, 53, 90, 64, 88, 49, 79];
      const getLineData = () => {
        const count = 8;
        return new Array(count).fill(0).map((el, idx) => ({
          x: dayjs('2025-06-01')
            .day(idx - 2)
            .format('YYYY-MM-DD'),
          y: presetData[idx],
        }));
      };
      return successResponseWrap([...getLineData()]);
    });
    Mock.mock(new RegExp('/api/popular/list'), (params: GetParams) => {
      const { type = 'text' } = qs.parseUrl(params.url).query;
      if (type === 'image') {
        return successResponseWrap([...videoList]);
      }
      if (type === 'video') {
        return successResponseWrap([...imageList]);
      }
      return successResponseWrap([...textList]);
    });
  },
});
