import ChatManagement from '@/views/chat';


const chatRoutes = [
    {
        path: 'chat',
        name: 'ChatIndex',
        component: () => ChatManagement,
        meta: {
            requiresAuth: true
        }
    },
];

export default chatRoutes;
