import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { publicRoutes } from './routes';
import { DefaultLayout } from './Layouts';
import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUser } from './redux/slice/userSlice';
import { io } from 'socket.io-client';
import { setNotifications } from './redux/slice/notificationSlice';
import Cookies from 'js-cookie';

function App() {
    const dispatch = useDispatch();
    const socketRef = useRef(null);
    const user = useSelector((state) => state.user.userInfo);
    const unreadCount = useSelector((state) => state.notification.unreadCount);

    useEffect(() => {
        const accessToken = Cookies.get('accessToken');

        // 1. Kiểm tra đăng nhập
        if (user.name === '') {
            if (!accessToken) {
                // Nên dùng window.location.replace để không lưu lịch sử back lại trang này
                window.location.replace(process.env.REACT_APP_FRONTEND_ROOT_URL + '/login');
                return;
            } else {
                dispatch(fetchUser());
                return; // Chờ fetchUser xong thì useEffect sẽ chạy lại do user.name thay đổi
            }
        }

        // 2. Logic Socket
        // Chỉ tạo kết nối nếu chưa có socket và đã có user
        if (user.name && user.id && !socketRef.current) {
            socketRef.current = io(process.env.REACT_APP_BACKEND_URL, {
                auth: { token: accessToken }, // Lấy token mới nhất
                autoConnect: false, // Bạn đang tắt auto connect
            });

            socketRef.current.on('connect', () => {
                console.log('Socket connected with ID:', socketRef.current.id);

                // --- SỬA LỖI ---
                // Emit join room ngay khi kết nối thành công để đảm bảo chắc chắn
                // (Nếu server chưa xử lý tự động qua Token)
                socketRef.current.emit('joinRoom', user.id);
            });

            socketRef.current.on('receiveNotification', (message) => {
                dispatch(setNotifications(message));
            });

            socketRef.current.on('connect_error', (err) => {
                console.error('Socket connection error:', err.message);
            });

            // --- QUAN TRỌNG: Phải gọi lệnh này vì bạn để autoConnect: false ---
            socketRef.current.connect();
        }

        // Cleanup function
        return () => {
            // Chỉ disconnect khi component unmount hẳn (ít xảy ra ở App.js)
            // hoặc khi user logout (user.name thay đổi về rỗng)
            if (socketRef.current) {
                socketRef.current.disconnect();
                socketRef.current = null;
            }
        };
    }, [dispatch, user.name, user.id]); // Thêm user.id vào dependency cho chắc chắn

    // 3. Logic Title
    useEffect(() => {
        document.title = unreadCount > 0 ? `DK REQUEST(${unreadCount})` : 'DK REQUEST';
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
                                        <Page />
                                    </Layout>
                                }
                            />
                        );
                    })}
                </Routes>
            </div>
        </Router>
    );
}

export default App;
