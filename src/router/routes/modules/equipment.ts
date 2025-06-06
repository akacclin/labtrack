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
    {
      path: 'approval',
      name: 'equipment.approval',
      component: () => import('@/views/equipment/approval/index.vue'),
      meta: {
        locale: 'menu.equipment.approval',
        requiresAuth: true,
        roles: ['admin', 'manager', 'supervisor'], // 只有管理员、经理和主管可以访问
      },
    },
    {
      path: 'operation',
      name: 'equipment.operation',
      component: () => import('@/views/equipment/operation/index.vue'),
      meta: {
        locale: 'menu.equipment.operation',
        requiresAuth: true,
        roles: ['*'],
      },
    },
    {
      path: 'history',
      name: 'equipment.history',
      component: () => import('@/views/equipment/history/index.vue'),
      meta: {
        locale: 'menu.equipment.history',
        requiresAuth: true,
        roles: ['*'],
      },
    },
  ],
};

export default EQUIPMENT; 