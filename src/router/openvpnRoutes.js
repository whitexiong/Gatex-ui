import user from '@/views/openvpn/user';
import certificate from '@/views/openvpn/certificate';
import configuration from '@/views/openvpn/configuration';
import dashboard from '@/views/openvpn/dashboard';
import network from '@/views/openvpn/network';


const openvpnRoutes = [
    {
        path: 'openvpn/user',
        name: 'VpnUserIndex',
        component: () => user,
        meta: {
            requiresAuth: true
        }
    },
    {
        path: 'openvpn/certificate',
        name: 'VpnCertificateIndex',
        component: () => certificate,
        meta: {
            requiresAuth: true
        }
    },
    {
        path: 'openvpn/configuration',
        name: 'VpnConfigurationIndex',
        component: () => configuration,
        meta: {
            requiresAuth: true
        }
    },
    {
        path: 'openvpn/dashboard',
        name: 'VpnDashboardIndex',
        component: () => dashboard,
        meta: {
            requiresAuth: true
        }
    },
    {
        path: 'openvpn/network',
        name: 'VpnNetworkIndex',
        component: () => network,
        meta: {
            requiresAuth: true
        }
    },
];

export default openvpnRoutes;
