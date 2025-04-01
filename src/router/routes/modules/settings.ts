import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const SETTINGS: AppRouteRecordRaw = {
    path: '/settings',
    name: 'settings',
    component: DEFAULT_LAYOUT,
    meta: {
        locale: 'menu.settings',
        requiresAuth: true,
        icon: 'icon-settings',
        order: 4,
    },
    children: [
        {
            path: 'system',
            name: 'settings.system',
            component: () => import('@/views/settings/system/index.vue'),
            meta: {
                locale: 'menu.settings.system',
                requiresAuth: true,
                roles: ['admin'],
            },
        },
    ],
};

export default SETTINGS; 