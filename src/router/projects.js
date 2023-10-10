import ProjectsManagement from '@/views/project';


const projectRoutes = [
    {
        path: 'projects/list',
        name: 'ProjectIndex',
        component: () => ProjectsManagement,
        meta: {
            requiresAuth: true
        }
    },
];

export default projectRoutes;
