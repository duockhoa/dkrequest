import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { publicRoutes } from './routes';
import { DefaultLayout } from './Layouts';
import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUser } from './redux/slice/userSlice';
import { io } from 'socket.io-client'; // Thêm dòng này
import { setNotifications } from './redux/slice/notificationSlice';
import Cookies from 'js-cookie';
function App() {
    const dispatch = useDispatch();
    const socketRef = useRef(null); // Thêm dòng này
    const user = useSelector((state) => state.user.userInfo);
    const unreadCount = useSelector((state) => state.notification.unreadCount);
    useEffect(() => {
        if (user.name === '') {
            const accessToken = Cookies.get('accessToken');
            if (!accessToken) {
                window.location.href = process.env.REACT_APP_FRONTEND_ROOT_URL + '/login';
                return; // Thoát sớm nếu không có token
            } else {
                dispatch(fetchUser());
                return; // Thoát sớm, chờ fetchUser hoàn thành
            }
        }

        // Chỉ tạo socket khi đã có user
        if (user.name && !socketRef.current) {
            socketRef.current = io(process.env.REACT_APP_BACKEND_URL);

            socketRef.current.on('connect', () => {
                console.log('Socket connected');
            });

            socketRef.current.on('receiveNotification', (message) => {
                dispatch(setNotifications(message));
            });
        }

        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
                socketRef.current = null;
            }
        };
    }, [dispatch, user.name]); // Hoặc chỉ [dispatch, user.id]

    // Tham gia room khi user.id đã có
    useEffect(() => {
        if (socketRef.current && user?.id) {
            socketRef.current.emit('joinRoom', user.id);
            console.log('Join room with userId:', user.id);
        }
    }, [user, socketRef]);
    useEffect(() => {
        if (unreadCount > 0) {
            document.title = `DK REQUEST(${unreadCount})`;
        } else {
            document.title = 'DK REQUEST';
        }
    }, [unreadCount]);

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
