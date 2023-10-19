import ProjectsManagement from '@/views/project';
import ProjectsApiEndpointsManagement from '@/views/project/api-endpoints';
import ViewMilestonesManagement from '@/views/project/view-milestones';


const projectRoutes = [
    {
        path: 'projects/list',
        name: 'ProjectIndex',
        component: () => ProjectsManagement,
        meta: {
            requiresAuth: true
        }
    },
    {
        path: 'projects/api-endpoints/list',
        name: 'ApiEndpointsIndex',
        component: () => ProjectsApiEndpointsManagement,
        meta: {
            requiresAuth: true
        }
    },
    {
        path: 'projects/view-milestones',
        name: 'ViewMilestonesIndex',
        component: () => ViewMilestonesManagement,
        meta: {
            requiresAuth: true
        }
    }
];


export default projectRoutes;
