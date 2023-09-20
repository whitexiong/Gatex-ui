import MenuManagement from '@/views/setting/menu';
import RoleManagement from '@/views/setting/role';
import UserManagement from '@/views/setting/user';
import RouteManagement from '@/views/setting/route';


const settingRoutes = [
    {
        path: 'setting/menu',
        name: 'MenuIndex',
        component: () => MenuManagement,
        meta: {
            requiresAuth: true
        }
    },
    {
        path: 'setting/role',
        name: 'RoleIndex',
        component: () => RoleManagement,
        meta: {
            requiresAuth: true
        }
    },
    {
        path: 'setting/user',
        name: 'UserIndex',
        component: () => UserManagement,
        meta: {
            requiresAuth: true
        }
    },
    {
        path: 'setting/route',
        name: 'RouteIndex',
        component: () => RouteManagement,
        meta: {
            requiresAuth: true
        }
    },
];

export default settingRoutes;
