import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const EQUIPMENT: AppRouteRecordRaw = {
  path: '/equipment',
  name: 'equipment',
  component: DEFAULT_LAYOUT,
  meta: {
    locale: 'menu.equipment',
    requiresAuth: true,
    icon: 'icon-computer',
    order: 3,
  },
  children: [
    {
      path: 'reservation',
      name: 'equipment.reservation',
      component: () => import('@/views/equipment/reservation/index.vue'),
      meta: {
        locale: 'menu.equipment.reservation',
        requiresAuth: true,
        roles: ['*'],
      },
    },
  ],
};

export default EQUIPMENT; 