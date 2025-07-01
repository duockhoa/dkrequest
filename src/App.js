import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { publicRoutes } from './routes';
import { DefaultLayout } from './Layouts';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { fetchUser } from './redux/slice/userSlice';
import { checkTokenService } from './services/checkTokenService';

function App() {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(fetchUser());
        const checkToken = async () => {
            try {
                const response = await checkTokenService();
                if (!response) {
                    window.location.href = 'https://dkpharma.io.vn';
                }
            } catch (error) {
                window.location.href = 'https://dkpharma.io.vn';
            }
        };
        checkToken();
    }, [dispatch]);
    return (
        <Router>
            <div className="App">
                <Routes>
                    {publicRoutes.map((route, index) => {
                        const Page = route.component;
                        const Layout = route.layout || DefaultLayout;
                        return (
                            <Route
                                key={index}
                                path={route.path}
                                element={
                                    <Layout>
                                        <Page></Page>
                                    </Layout>
                                }
                            ></Route>
                        );
                    })}
                </Routes>
            </div>
        </Router>
    );
}

export default App;
