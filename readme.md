# DK Request

Ứng dụng web quản lý yêu cầu nội bộ, phát triển bởi phòng Đảm bảo Chất lượng (ĐBCL) - Công ty Cổ phần Dược Khoa.

## Mô tả

Hệ thống cho phép nhân viên:
- Tạo và theo dõi các loại đề nghị nội bộ.
- Xem chi tiết yêu cầu, bình luận, người duyệt, người theo dõi và tiến độ xử lý.
- Nhận thông báo realtime khi có cập nhật.

Một số nhóm yêu cầu đang có trong dự án:
- Thanh toán, tạm ứng, hoàn ứng.
- Xin nghỉ, tăng ca, xác nhận công việc.
- Văn phòng phẩm, sửa chữa/cấp phát thiết bị.
- Tuyển dụng, đào tạo, công văn, giao nhận, xe, công chứng, v.v.

## Công nghệ sử dụng

- React 18 (Create React App)
- Material UI v5 (`@mui/material`, `@mui/icons-material`, `@mui/x-data-grid`, `@mui/x-date-pickers`, `@mui/x-charts`)
- Redux Toolkit + React Redux
- React Router DOM v7
- Axios
- Socket.IO Client (thông báo realtime)
- React Hook Form + Yup (validate form)
- Sass + Emotion
- Bootstrap 5

## Cấu trúc dự án

```text
dkrequest/
├── public/
│   ├── index.html
│   ├── manifest.json
│   ├── logo-2024.png
│   └── other.png
├── src/
│   ├── App.js
│   ├── index.js
│   ├── theme.js
│   ├── routes/
│   ├── Layouts/
│   ├── pages/
│   ├── component/
│   │   ├── Form/
│   │   ├── LayoutComponent/
│   │   ├── SharedComponent/
│   │   └── GlobalStyle/
│   ├── redux/
│   ├── services/
│   ├── hooks/
│   ├── utils/
│   └── assets/
├── .env
└── package.json
```

## Yêu cầu môi trường

- Node.js >= 18
- npm >= 8

## Cài đặt và chạy

```bash
npm install
npm start
```

Mặc định app chạy tại: `http://localhost:3002`

## Build production

```bash
npm run build
```

## Chạy test

```bash
npm test
```

## Biến môi trường

Tạo file `.env` ở thư mục gốc và cấu hình tối thiểu:

```env
REACT_APP_BACKEND_URL=https://your-backend-domain
REACT_APP_AUTH_URL=https://your-auth-domain
REACT_APP_FRONTEND_ROOT_URL=https://your-frontend-root
REACT_APP_DOMAIN=.your-domain.com
```

Ý nghĩa nhanh:
- `REACT_APP_BACKEND_URL`: API backend chính và socket server.
- `REACT_APP_AUTH_URL`: API xác thực/refresh token.
- `REACT_APP_FRONTEND_ROOT_URL`: URL frontend để redirect login.
- `REACT_APP_DOMAIN`: domain dùng cho cookie (`accessToken`, `refreshToken`, ...).

## Scripts

- `npm start`: chạy app ở môi trường development (port 3002).
- `npm run build`: build production.
- `npm test`: chạy test bằng React Scripts.
- `npm run eject`: eject khỏi CRA (không thể hoàn tác).

## Ghi chú

- Dự án có sử dụng realtime notification qua Socket.IO.
- App yêu cầu đăng nhập hợp lệ; nếu thiếu token sẽ redirect đến trang `/login` theo `REACT_APP_FRONTEND_ROOT_URL`.

## Liên hệ

- Zalo: 0965155761 (Bình ĐBCL)

