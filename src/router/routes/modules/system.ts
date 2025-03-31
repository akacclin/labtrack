import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const SYSTEM: AppRouteRecordRaw = {
    path: '/system',
    name: 'system',
    component: DEFAULT_LAYOUT,
    meta: {
        locale: 'menu.system',
        requiresAuth: true,
        icon: 'icon-settings',
        order: 4,
    },
    children: [
        {
            path: 'settings',
            name: 'system.settings',
            component: () => import('@/views/system/settings/index.vue'),
            meta: {
                locale: 'menu.system.settings',
                requiresAuth: true,
                roles: ['admin'],
            },
        },
    ],
};

export default SYSTEM; 