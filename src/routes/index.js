import ErrorLayout from '../Layouts/ErrorLayout';
import Profile from '../pages/Profile';
import HeaderOnlyLayout from '../Layouts/HeaderOnlyLayout';
import Error from '../pages/Error';
import Request from '../pages/Request';

import items from '../pages/Items';
const publicRoutes = [
    {
        path: '/',
        component: Request,
    },
    { path: '/profile', component: Profile, layout: HeaderOnlyLayout },
    {
        path: '/advance-money',
        component: Request,
    },
    {
        path: '/leave-request',
        component: Request,
    },
    {
        path: '/payment-request',
        component: Request,
    },
    {
        path: 'advance-clearance',
        component: Request,
    },
    {
        path: '/supply-labor-protection',
        component: Request,
    },
    {
        path: '/supply-stationery',
        component: Request,
    },
    {
        path: '/material-evaluation',
        component: Request,
    },
    {
        path: '/overtime-request',
        component: Request,
    },
    {
        path: '/task-confirmation',
        component: Request,
    },
    {
        path: '/recruitment-request',
        component: Request,
    },
    {
        path: '/training-request',
        component: Request,
    },
    {
        path: '/market-approval-request',
        component: Request,
    },
    {
        path: '/goods-export-request',
        component: Request,
    },
    {
        path: '/refund-request',
        component: Request,
    },
    {
        path: '/meeting-room-request',
        component: Request,
    },
    {
        path: '/items',
        component: items,
    },
    {
        path: 'express-delivery-request',
        component: Request,
    },
    {
        path: 'office-equipment-repair',
        component: Request,
    },
    {
        path: '/office-document-request',
        component: Request,
    },

    {
        path: '/office-equipment-supply',
        component: Request,
    },
    {
        path: 'document-edit-request',
        component: Request,
    },
    {
        path: 'invoice-request',
        component: Request,
    },

    {
        path: 'union-payment-request',
        component: Request,
    },
    {
        path: 'notarization-request',
        component: Request,
    },
    {
        path: 'vehicle-request',
        component: Request,
    },
    {
        path: 'administrative-request',
        component: Request,
    },
    {
        path: 'lunch-stop-request',
        component: Request,
    },

    {
        path: '*',
        component: Error,
        layout: ErrorLayout,
    },
];

export { publicRoutes };
