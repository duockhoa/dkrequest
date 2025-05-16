import LoginLayout from '../Layouts/LoginLayout';
import ErrorLayout from '../Layouts/ErrorLayout';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Profile from '../pages/Profile';
import HeaderOnlyLayout from '../Layouts/HeaderOnlyLayout';
import Error from '../pages/Error';

const publicRoutes = [
    {
        path: 'login',
        component: Login,
        layout: LoginLayout,
    },
    {
        path: '/',
        component: Home,
    },
    { path: '/profile', component: Profile, layout: HeaderOnlyLayout },
    {
        path: '*',
        component: Error,
        layout: ErrorLayout,
    },
];

export { publicRoutes };
