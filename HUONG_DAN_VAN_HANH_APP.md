# Hướng Dẫn Vận Hành DK Request

Tài liệu này được viết theo mã nguồn hiện tại trong repo `dkrequest`. Repo này là frontend React của ứng dụng DK Request; backend/API server không nằm trong cây mã nguồn này, nên các mục API bên dưới là các endpoint mà frontend đang gọi.

## 1. Tổng quan ứng dụng

DK Request là ứng dụng web quản lý đề nghị nội bộ. Các chức năng chính:

- Tạo, xem danh sách và xem chi tiết các loại đề nghị nội bộ.
- Duyệt, từ chối, chuyển tiếp người duyệt.
- Hủy yêu cầu khi chưa có ai duyệt.
- Tiếp nhận và đánh dấu hoàn thành yêu cầu đã được duyệt.
- Bình luận, đính kèm file, xem/tải file đính kèm.
- Xuất file Word cho từng đề nghị và xuất báo cáo Excel.
- Quản lý danh mục văn phòng phẩm.
- Nhận thông báo realtime qua Socket.IO.

Stack chính:

- React 18, Create React App.
- Material UI, Bootstrap, Sass.
- Redux Toolkit, React Redux.
- React Router DOM.
- Axios.
- Socket.IO Client.
- React Hook Form/Yup có cài trong dependencies, nhưng nhiều form hiện đang validate thủ công trong component.

## 2. Cài đặt và chạy app

Yêu cầu môi trường:

- Node.js từ 18 trở lên.
- npm từ 8 trở lên.

Cài dependencies:

```bash
npm install
```

Chạy development:

```bash
npm start
```

Theo `package.json`, script `start` đang chạy:

```bash
PORT=3001 react-scripts start
```

Vì vậy mặc định truy cập:

```text
http://localhost:3001
```

Đóng app development:

- Tại terminal đang chạy `npm start`, bấm `Ctrl + C`.

Build production:

```bash
npm run build
```

Thư mục kết quả:

```text
build/
```

Chạy test:

```bash
npm test
```

## 3. Biến môi trường

Tạo file `.env` ở thư mục gốc. Không commit giá trị thật của token/domain nội bộ nếu có thông tin nhạy cảm.

Những biến đang được code sử dụng:

```env
REACT_APP_BACKEND_URL=https://your-backend-domain
REACT_APP_AUTH_URL=https://your-auth-domain
REACT_APP_FRONTEND_ROOT_URL=https://your-frontend-root
REACT_APP_DOMAIN=.your-cookie-domain
REACT_APP_ENABLE_APPROVAL_DEADLINE_HIDE=true
```

Ý nghĩa:

- `REACT_APP_BACKEND_URL`: backend API chính và Socket.IO server.
- `REACT_APP_AUTH_URL`: API xác thực, user, refresh token, logout.
- `REACT_APP_FRONTEND_ROOT_URL`: domain frontend gốc để redirect về `/login`.
- `REACT_APP_DOMAIN`: domain dùng khi set/remove cookie `accessToken`, `refreshToken`, `id`.
- `REACT_APP_ENABLE_APPROVAL_DEADLINE_HIDE`: nếu không khai báo hoặc bằng `true`, app áp dụng hạn duyệt cho request type `7` và `8`.

Biến có trong `.env` nhưng chưa thấy code `src/` sử dụng:

- `REACT_APP_API_URL`
- `REACT_APP_SOCKET_URL`
- `REACT_APP_FRONTEND_URL`
- `REACT_APP_VERSION`

## 4. Triển khai production

Quy trình build:

```bash
npm install
npm run build
```

Sau đó đưa nội dung thư mục `build/` lên static hosting hoặc Nginx/Apache.

Nếu dùng Nginx cho React Router, cần fallback về `index.html`:

```nginx
server {
    listen 80;
    server_name your-frontend-domain;

    root /var/www/dkrequest/build;
    index index.html;

    location / {
        try_files $uri /index.html;
    }
}
```

Lưu ý khi triển khai:

- Biến môi trường của CRA được đóng vào bundle lúc `npm run build`, nên đổi `.env` xong phải build lại.
- Backend phải cho phép CORS từ domain frontend.
- Cookie domain phải khớp `REACT_APP_DOMAIN`; nếu sai domain, app sẽ không đọc được token và bị redirect về login.
- Nếu chạy HTTPS, cookie sẽ được set `secure: true`.

## 5. Luồng khởi động và đăng nhập

File liên quan:

- `src/App.js`
- `src/services/customize-axios.js`
- `src/services/auth-axios.js`
- `src/services/usersService.js`

Luồng:

1. App đọc cookie `accessToken`.
2. Nếu chưa có user trong Redux và không có `accessToken`, redirect về:

   ```text
   REACT_APP_FRONTEND_ROOT_URL/login
   ```

3. Nếu có token, app gọi `fetchUser()` để lấy thông tin user.
4. Axios tự động gắn header:

   ```http
   Authorization: Bearer <accessToken>
   ```

5. Nếu API trả `401`, interceptor gọi:

   ```http
   POST REACT_APP_AUTH_URL/auth/refresh-token
   ```

6. Refresh thành công thì set lại cookie `accessToken` và retry request cũ.
7. Refresh thất bại thì xóa cookie và redirect về login.

## 6. Luồng vận hành chức năng

### 6.1 Menu và điều hướng

File liên quan:

- `src/routes/index.js`
- `src/component/LayoutComponent/Sidebar/index.js`
- `src/services/departmentService.js`
- `src/services/requestTypeService.js`

Luồng:

1. Sidebar gọi API lấy phòng ban kèm request type:

   ```http
   GET /department/getallinclude
   ```

2. Khi chọn một request type, app navigate tới `requestTypePath`.
3. Trang `Request` lấy danh sách request type:

   ```http
   GET /requesttype/getall
   ```

4. App so khớp `location.pathname` với `type.path` để set `requestTypeId`.
5. Nếu không khớp, app set `requestTypeId = "all"` để hiển thị tổng hợp.

### 6.2 Danh sách yêu cầu

File liên quan:

- `src/pages/Request/index.js`
- `src/component/SharedComponent/Requests/index.js`
- `src/redux/slice/requestSlice.js`
- `src/services/requestService.js`

API:

```http
GET /request/getall?requesttypeid=<id|all>&userid=<userId>&page=<page>&pageSize=<pageSize>
```

Tab hiện có:

- Tất cả
- Đến lượt duyệt
- Quá hạn
- Đang chờ duyệt
- Đã chấp nhận
- Đã hoàn thành
- Đã từ chối
- Đến lượt tiếp nhận

Danh sách được group theo ngày tạo, có phân trang, tìm kiếm có dấu/không dấu trong Redux, và có badge trạng thái.

### 6.3 Xem chi tiết yêu cầu

File liên quan:

- `src/pages/Request/index.js`
- `src/component/SharedComponent/RequestDetail/index.js`
- `src/redux/slice/requestDetailSlice.js`

Khi click một request, app navigate:

```text
?view=detail&requestid=<id>
```

Sau đó gọi:

```http
GET /request/getbyid/<id>
```

Màn hình chi tiết gồm:

- Thông tin chung.
- Component chi tiết theo `requestType_id`.
- Action duyệt/từ chối/chuyển tiếp nếu user là người đến lượt duyệt.
- More action: tiếp nhận, hoàn thành, hủy, xuất file.
- Bình luận.
- Người duyệt, người theo dõi.
- Tiến độ xử lý.

### 6.4 Tạo yêu cầu mới

File liên quan:

- `src/component/Form/AddRequestForm/index.js`
- `src/redux/slice/requestFormDataSlice.js`
- `src/utils/makeFromDataFromObject.js`
- `src/services/requestService.js`

Luồng:

1. User bấm `Thêm mới`.
2. App mở dialog `AddRequestForm`.
3. Form được render theo `requestTypeId`.
4. User nhập thông tin, chọn người theo dõi, người duyệt, đính kèm file.
5. Frontend validate các trường bắt buộc.
6. Dữ liệu được convert sang `FormData`.
7. Gọi API:

   ```http
   POST /request/create
   Content-Type: multipart/form-data
   ```

8. Tạo thành công thì đóng form và thêm request mới vào danh sách Redux.

### 6.5 Duyệt, từ chối, chuyển tiếp

File liên quan:

- `src/component/SharedComponent/Action/MainAction/index.js`
- `src/services/approverService.js`
- `src/utils/approvalDeadline.js`

Điều kiện hiện nút action:

- Request đang `pending`.
- User hiện tại là người duyệt ở step pending nhỏ nhất.
- Với request type `7` và `8`, nếu quá deadline thì không hiện action duyệt.

API:

```http
PUT /approver/updatestatus
```

Payload duyệt/từ chối:

```json
{
  "request_id": 123,
  "user_id": 10,
  "status": "approved",
  "note": "Ghi chú nếu có"
}
```

Chuyển tiếp:

```http
PUT /approver/forward
```

Payload:

```json
{
  "request_id": 123,
  "user_id": 10,
  "new_user_id": 11,
  "note": "Chuyển người phù hợp hơn"
}
```

### 6.6 Tiếp nhận, hoàn thành, hủy

File liên quan:

- `src/component/SharedComponent/Action/OtherAction/index.js`
- `src/component/SharedComponent/Button/MarkReceived/index.js`
- `src/component/SharedComponent/Button/MarkCompleted/index.js`
- `src/component/SharedComponent/Button/MarkCancel/index.js`
- `src/services/requestService.js`

Tiếp nhận:

- Chỉ hiện khi request đã `approved`, chưa `isReceived`.
- User phải thuộc phòng ban xử lý của request type.

```http
PUT /request/markreceived/
```

Hoàn thành:

- Chỉ hiện khi request đã `approved`, chưa `isCompleted`.
- User phải thuộc phòng ban xử lý của request type.

```http
PUT /request/markcompleted/
```

Hủy:

- Chỉ người tạo được hủy.
- Chỉ được hủy khi chưa có approver nào đã duyệt.

```http
PUT /updatestatus/cancel/
```

### 6.7 Bình luận và file đính kèm

File liên quan:

- `src/component/SharedComponent/Comment/index.js`
- `src/component/Form/CommentForm/index.js`
- `src/component/Form/FileUpload/index.js`
- `src/component/SharedComponent/PreviewFile/index.js`
- `src/services/commentService.js`

API:

```http
GET /comment/getbyrequestid/<requestId>
POST /comment/create
Content-Type: multipart/form-data
```

Xem file inline:

```text
REACT_APP_BACKEND_URL/api/v1/file/getinline?filepath=<encoded-file-path>
```

Tải file:

```text
REACT_APP_BACKEND_URL/api/v1/file/get?filepath=<encoded-file-path>
```

### 6.8 Thông báo realtime

File liên quan:

- `src/App.js`
- `src/component/SharedComponent/Notification/index.js`
- `src/component/SharedComponent/NotificationList/index.js`
- `src/services/notificationService.js`

Luồng:

1. Sau khi có user, app tạo Socket.IO client tới `REACT_APP_BACKEND_URL`.
2. Socket gửi auth token:

   ```js
   auth: { token: accessToken }
   ```

3. Khi connect, app emit:

   ```js
   socket.emit('joinRoom', user.id);
   ```

4. Khi nhận event:

   ```js
   receiveNotification
   ```

   app đẩy thông báo vào Redux.

API notification:

```http
GET /notifications
PUT /notifications/markread/<notificationId>
PUT /notifications/markreadall
```

### 6.9 Xuất file và xuất báo cáo

File liên quan:

- `src/component/SharedComponent/Button/ExportFile/index.js`
- `src/component/SharedComponent/Button/ExportReport/index.js`
- `src/component/Form/ExportReportForm/index.js`
- `src/services/exportsFileService.js`

Xuất Word từng đề nghị:

```http
POST /file/exportdoc
```

Payload:

```json
{
  "requestId": 123
}
```

Xuất Excel báo cáo:

```http
POST /exportreport
```

Payload:

```json
{
  "startDate": "2026-07-01",
  "endDate": "2026-07-31",
  "status": "all",
  "userId": 10,
  "requestTypeId": 1
}
```

### 6.10 Quản lý danh mục văn phòng phẩm

File liên quan:

- `src/pages/Items/index.js`
- `src/component/Form/ItemsForm/index.js`
- `src/services/itemsService.js`

Màn hình:

```text
/items
```

Nút vào màn hình này chỉ hiện khi:

- `requestTypeId === 4`
- user department là `HC`

API:

```http
GET /items/getall
POST /items/create
PUT /items/update/<product_code>
DELETE /items/delete/<product_code>
```

Chức năng:

- Tìm kiếm theo mã hoặc tên sản phẩm.
- Thêm mới sản phẩm.
- Sửa tên/đơn vị tính.
- Xóa sản phẩm có confirm.

## 7. API và nền tảng kết nối

### 7.1 Các nền tảng/API frontend đang kết nối

| Nền tảng/API | Cấu hình | Mục đích | Kết nối trực tiếp từ frontend |
| --- | --- | --- | --- |
| DK Request Backend API | `REACT_APP_BACKEND_URL + /api/v1` | Request, comment, notification, file, item, department, report | Có |
| Auth API | `REACT_APP_AUTH_URL` | User, password, avatar, refresh token, logout | Có |
| Socket.IO server | `REACT_APP_BACKEND_URL` | Thông báo realtime | Có |
| SAP/ERP qua backend | `/sapitems`, `/businesspartners` | Lấy danh sách item SAP và business partner | Không trực tiếp SAP, frontend gọi backend |
| File server qua backend | `/file/get`, `/file/getinline`, `/file/exportdoc` | Xem/tải/xuất file | Có qua backend |
| Google Sheets | Link cố định trong Sidebar | Thu thập góp ý | Mở tab mới, không dùng API |
| Danh sách ngân hàng | `src/services/bankService.js` | Chọn ngân hàng trong form thanh toán/tạm ứng | Data tĩnh trong frontend, không gọi API ngân hàng |

### 7.2 Demo kết nối Axios tới Backend API

```js
import axios from 'axios';
import Cookies from 'js-cookie';

const api = axios.create({
  baseURL: `${process.env.REACT_APP_BACKEND_URL}/api/v1`,
  timeout: 120000,
});

api.interceptors.request.use((config) => {
  const token = Cookies.get('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const response = await api.get('/request/getall?requesttypeid=1&userid=10&page=1&pageSize=100');
console.log(response.data);
```

### 7.3 Demo tạo request multipart/form-data

```js
const formData = new FormData();
formData.append('requestName', 'Nguyễn Văn A đề nghị thanh toán tiền');
formData.append('requestor_id', '10');
formData.append('requestType_id', '1');
formData.append('payment_type', 'invoice');
formData.append('payment_content', 'Thanh toán chi phí');
formData.append('amount', '1000000');

await api.post('/request/create', formData, {
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});
```

### 7.4 Demo kết nối Socket.IO

```js
import { io } from 'socket.io-client';
import Cookies from 'js-cookie';

const accessToken = Cookies.get('accessToken');
const socket = io(process.env.REACT_APP_BACKEND_URL, {
  auth: { token: accessToken },
  autoConnect: false,
});

socket.on('connect', () => {
  socket.emit('joinRoom', user.id);
});

socket.on('receiveNotification', (message) => {
  console.log('Notification:', message);
});

socket.connect();
```

### 7.5 Demo refresh token

```bash
curl -X POST "$REACT_APP_AUTH_URL/auth/refresh-token" \
  -H "Content-Type: application/json" \
  -d '{"refreshToken":"<refreshToken>"}'
```

### 7.6 Bảng endpoint frontend đang gọi

| Nhóm | Method | Endpoint | Mục đích |
| --- | --- | --- | --- |
| Request | GET | `/request/getall` | Lấy danh sách request theo type/user/page |
| Request | GET | `/request/getbyid/:id` | Lấy chi tiết request |
| Request | POST | `/request/create` | Tạo request mới |
| Request | PUT | `/request/markcompleted/` | Đánh dấu hoàn thành |
| Request | PUT | `/request/markreceived/` | Đánh dấu tiếp nhận |
| Request | PUT | `/updatestatus/cancel/` | Hủy request |
| Approver | PUT | `/approver/updatestatus` | Duyệt hoặc từ chối |
| Approver | PUT | `/approver/forward` | Chuyển tiếp người duyệt |
| Approver config | GET | `/requestapprover/getbytype/:requestTypeId/:userId` | Lấy người duyệt mặc định |
| Follower config | GET | `/requestfollower/getbytype/:requestTypeId/:userId` | Lấy người theo dõi mặc định |
| Comment | GET | `/comment/getbyrequestid/:requestId` | Lấy bình luận |
| Comment | POST | `/comment/create` | Tạo bình luận/đính kèm |
| Notification | GET | `/notifications` | Lấy thông báo |
| Notification | PUT | `/notifications/markread/:notificationId` | Đánh dấu đã đọc |
| Notification | PUT | `/notifications/markreadall` | Đánh dấu tất cả đã đọc |
| Department | GET | `/department/getallinclude` | Lấy phòng ban kèm request type |
| Request type | GET | `/requesttype/getall` | Lấy danh mục loại đề nghị |
| Users/Auth | GET | `/users/:id` | Lấy user theo cookie id |
| Users/Auth | GET | `/users` | Lấy danh sách user |
| Users/Auth | GET | `/users/me` | Lấy user hiện tại |
| Users/Auth | PUT | `/users/:id/password` | Đổi mật khẩu |
| Users/Auth | PUT | `/users/:id/avatar` | Cập nhật avatar |
| Users/Auth | PUT | `/user/update` | Cập nhật thông tin user |
| Auth | POST | `/auth/refresh-token` | Refresh access token |
| Auth | DELETE | `/auth/logout` | Đăng xuất |
| Items | GET | `/items/getall` | Lấy danh mục VPP |
| Items | POST | `/items/create` | Tạo mặt hàng |
| Items | PUT | `/items/update/:product_code` | Sửa mặt hàng |
| Items | DELETE | `/items/delete/:product_code` | Xóa mặt hàng |
| SAP | GET | `/sapitems` | Lấy item SAP qua backend |
| SAP | GET | `/businesspartners` | Lấy business partner qua backend |
| Leave/overtime | GET | `/leavehour/getbyuserid/:userId` | Lấy giờ nghỉ phép |
| Leave/overtime | GET | `/overtime/getbyuserid/:userId` | Lấy giờ làm thêm |
| Invoice | PUT | `/invoiceitems/` | Cập nhật dòng hóa đơn |
| Supply stationery | PUT | `/supplystationery/` | Cập nhật dòng VPP |
| File/report | POST | `/file/exportdoc` | Xuất file Word |
| File/report | POST | `/exportreport` | Xuất Excel |
| File/report | GET | `/file/getinline` | Xem file |
| File/report | GET | `/file/get` | Tải file |

## 8. Module đã phát triển

### 8.1 Module hạ tầng/chung

| Module | Trang/file chính | Trạng thái |
| --- | --- | --- |
| Layout, Header, Sidebar | `src/Layouts/Defaultlayout`, `src/component/LayoutComponent` | Đã có |
| Auth cookie, refresh token | `customize-axios.js`, `auth-axios.js` | Đã có |
| Profile, đổi mật khẩu, avatar | `src/pages/Profile` | Đã có |
| Danh sách request | `Requests/index.js` | Đã có |
| Chi tiết request | `RequestDetail/index.js` | Đã có |
| Tạo request | `AddRequestForm/index.js` | Đã có cho nhiều type |
| Duyệt/từ chối/chuyển tiếp | `Action/MainAction` | Đã có |
| Tiếp nhận/hoàn thành/hủy | `Button/MarkReceived`, `MarkCompleted`, `MarkCancel` | Đã có |
| Bình luận | `Comment`, `CommentForm` | Đã có |
| File đính kèm/preview | `FileUpload`, `PreviewFile`, `AttachmentsDetail` | Đã có |
| Notification realtime | `App.js`, `Notification`, `NotificationList` | Đã có |
| Xuất file/report | `ExportFile`, `ExportReport` | Đã có |
| Danh mục VPP CRUD | `pages/Items`, `ItemsForm` | Đã có |

### 8.2 Module request type đã có form và detail

| ID | Module | Route | Form tạo mới | Detail |
| --- | --- | --- | --- | --- |
| 1 | Đề nghị thanh toán | `/payment-request` | Có | Có |
| 2 | Đề nghị tạm ứng | `/advance-money` | Có | Có |
| 3 | Đề nghị xin nghỉ | `/leave-request` | Có | Có |
| 4 | Đề nghị cung ứng VPP | `/supply-stationery` | Có | Có |
| 7 | Đề nghị đăng ký làm thêm | `/overtime-request` | Có | Có |
| 8 | Đề nghị xác nhận công việc | `/task-confirmation` | Có | Có |
| 9 | Đề nghị tuyển dụng | `/recruitment-request` | Có | Có |
| 14 | Chuẩn bị phòng họp | `/meeting-room-request` | Có | Có |
| 15 | Chuyển phát nhanh | `/express-delivery-request` | Có | Có |
| 16 | Sửa chữa thiết bị văn phòng | `/office-equipment-repair` | Có | Có |
| 17 | Công tác văn thư | `/office-document-request` | Có | Có |
| 18 | Cung ứng thiết bị văn phòng | `/office-equipment-supply` | Có | Có |
| 19 | Sửa đổi tài liệu | `/document-edit-request` | Có | Có |
| 20 | Quyết toán tạm ứng | `/advance-clearance` | Có | Có |
| 21 | Đề nghị hóa đơn | `/invoice-request` | Có | Có |
| 22 | Thanh toán công đoàn | `/union-payment-request` | Có | Có |
| 23 | Công chứng/sao y | `/notarization-request` | Có | Có |
| 24 | Đề nghị đào tạo | `/training-request` | Có | Có |
| 25 | Đề nghị đặt xe | `/vehicle-request` | Có | Có |
| 26 | Yêu cầu hành chính | `/administrative-request` | Có | Có |
| 27 | Dừng ăn trưa | `/lunch-stop-request` | Có | Có |
| 28 | Business payment | `/business-payment-request` | Có | Có |
| 29 | Business advance money | `/advance-money-business` | Có | Có |
| 30 | Business advance clearance | `/business-advance-clearance` | Có | Có |
| 31 | Đề nghị bổ nhiệm | `/promotion-request` | Có | Có |
| 32 | Đề nghị thuyên chuyển | `/transfer-request` | Có | Có |
| 33 | Đơn xin thôi việc | `/resignation-request` | Có | Có |

## 9. Module còn dang dở hoặc cần đồng bộ

### 9.1 Route đã khai báo nhưng chưa thấy form/detail mapping

Các route này có trong `src/routes/index.js`, nhưng không thấy mapping `requestTypeId` tương ứng trong `AddRequestForm` và `RequestDetail`:

- `/supply-labor-protection`
- `/material-evaluation`
- `/market-approval-request`
- `/goods-export-request`
- `/refund-request`

Nếu backend trả các request type này, trang danh sách vẫn có thể hiện request chung, nhưng bấm `Thêm mới` hoặc xem detail riêng sẽ chưa có form/detail nghiệp vụ đầy đủ.

### 9.2 Sáng kiến cải tiến đang mới có form tạo

Request type `34`:

- Có khai báo trong `src/utils/organizationRequestTypes.js`.
- Có route `/innovation-proposal`.
- Có form `src/component/Form/InnovationProposalForm/index.js`.
- Có validate trong `AddRequestForm`.
- Chưa thấy component detail được map trong `src/component/SharedComponent/RequestDetail/index.js`.

Cần làm tiếp:

1. Tạo `InnovationProposalDetail`.
2. Map:

   ```jsx
   {requestTypeId === 34 ? <InnovationProposalDetail /> : ''}
   ```

3. Đảm bảo backend trả data field đúng với form: `innovation_name`, `description`, `implementer`, `expected_benefit`, `expected_cost`, `implementation_time`.

### 9.3 Request type bổ sung bằng hard-code frontend

File `src/utils/organizationRequestTypes.js` đang thêm cứng các type:

- `31` - Đề nghị bổ nhiệm
- `32` - Đề nghị thuyên chuyển
- `33` - Đơn xin thôi việc
- `34` - Sáng kiến cải tiến

`requestTypeService` và `departmentService` merge các type này vào data backend nếu backend chưa trả về.

Rủi ro:

- Backend và frontend có thể lệch ID/path/name.
- Phân quyền, người duyệt, phòng ban xử lý có thể không đồng bộ nếu backend chưa có cấu hình tương ứng.

Khuyến nghị:

- Đưa các request type này vào backend `/requesttype/getall` và `/department/getallinclude`.
- Sau khi backend trả đúng, có thể bỏ logic merge hard-code để giảm lệch dữ liệu.

### 9.4 Một số request type có form/detail nhưng validation/default name chưa đồng đều

Cần review thêm:

- ID `18`, `19`, `21`, `22`, `26`: có form render nhưng không có case tạo `requestName` mặc định trong `AddRequestForm`.
- ID `20`, `26`, `30`: có form/detail nhưng validation bắt buộc trong `AddRequestForm` còn thiếu hoặc chưa rõ.
- ID `34`: có form/default/validation nhưng thiếu detail.

### 9.5 Filter drawer mới là placeholder

File:

```text
src/component/SharedComponent/Filter/index.js
```

Hiện tại nội dung filter là thông báo thử nghiệm, chưa có bộ lọc thật. Nút filter đã hiện trên danh sách request, nhưng logic lọc nâng cao chưa được phát triển.

### 9.6 Một số việc kỹ thuật nên dọn dẹp

- `public/manifest.json` vẫn là metadata mặc định của Create React App.
- Còn một số `console.log`/debug log trong UI notification, action forward, add request, items.
- Một số tên file bị typo: `sibarSlice`, `updateUserServive`, `leavehoursSevice`, `OficceEquimentReuquestForm`, `RejectFrom`.
- `.env` có biến chưa được code sử dụng như `REACT_APP_SOCKET_URL`; socket hiện đang dùng `REACT_APP_BACKEND_URL`.

## 10. Hướng dẫn thêm/sửa/xóa/mở/đóng module

### 10.1 Thêm một loại đề nghị mới

Cần làm cả backend và frontend.

Backend cần có:

1. Request type mới trong API `/requesttype/getall`.
2. Department mapping trong `/department/getallinclude`.
3. Cấu hình approver/follower:

   ```http
   GET /requestapprover/getbytype/:requestTypeId/:userId
   GET /requestfollower/getbytype/:requestTypeId/:userId
   ```

4. API `/request/create` nhận đúng field mới.
5. API `/request/getbyid/:id` trả đúng data detail.
6. Template export Word nếu cần xuất file.

Frontend cần sửa:

1. Thêm route trong `src/routes/index.js` nếu route mới chưa có.
2. Tạo form trong `src/component/Form/<NewRequestForm>/index.js`.
3. Import và map form trong `src/component/Form/AddRequestForm/index.js`.
4. Thêm default `requestName` theo `requestTypeId`.
5. Thêm validation bắt buộc trong `validateForm`.
6. Tạo detail trong `src/component/SharedComponent/DetailComponents/<NewRequestDetail>/index.js`.
7. Import và map detail trong `src/component/SharedComponent/RequestDetail/index.js`.
8. Thêm icon trong `Sidebar/index.js` nếu cần icon riêng.
9. Test tạo mới, xem detail, duyệt, từ chối, xuất file.

### 10.2 Sửa một module đang có

Nếu sửa field nhập liệu:

1. Sửa form component tương ứng trong `src/component/Form`.
2. Sửa validation trong `AddRequestForm`.
3. Sửa detail component trong `DetailComponents`.
4. Kiểm tra payload key có khớp backend không.
5. Kiểm tra export Word/report nếu field có ảnh hưởng template.

Nếu sửa luồng duyệt:

1. Kiểm tra `requestapprover` backend.
2. Kiểm tra `Action/MainAction`.
3. Kiểm tra logic deadline trong `src/utils/approvalDeadline.js`.

### 10.3 Xóa hoặc đóng một module

Đóng tạm thời:

- Cách tốt nhất là cấu hình backend không trả request type đó trong `/department/getallinclude` và `/requesttype/getall`.
- Nếu request type đang hard-code trong `organizationRequestTypes.js`, cần xóa hoặc comment mapping hard-code đó.

Xóa khỏi frontend:

1. Xóa route trong `src/routes/index.js`.
2. Xóa mapping form trong `AddRequestForm`.
3. Xóa mapping detail trong `RequestDetail`.
4. Xóa icon mapping trong Sidebar nếu có.
5. Chỉ xóa component file khi chắc chắn không còn import.

Lưu ý:

- Không xóa backend data cũ nếu vẫn cần xem lịch sử request.
- Nếu muốn giữ lịch sử nhưng không cho tạo mới, hãy ẩn nút `Thêm mới` cho request type đó thay vì xóa detail.

### 10.4 Mở/đóng UI trong app

- Mở/đóng Sidebar: nút menu trên Header, state nằm trong `sibarSlice`.
- Mở/đóng form thêm mới: nút `Thêm mới` trong `Requests`, state `openForm`.
- Mở/đóng filter: nút icon filter trong `Requests`, hiện Drawer bên phải.
- Mở/đóng notification: click icon chuông trên Header.
- Mở/đóng More Action: click icon mũi tên trong `RequestDetail`.

## 11. Checklist vận hành nhanh

Khi deploy mới:

1. Kiểm tra `.env` đúng backend/auth/frontend root/domain.
2. Chạy `npm install`.
3. Chạy `npm run build`.
4. Upload `build/`.
5. Kiểm tra Nginx fallback về `index.html`.
6. Đăng nhập và tạo thử một request.
7. Kiểm tra notification realtime.
8. Kiểm tra xuất file Word và xuất report.
9. Kiểm tra refresh token sau khi token cũ hết hạn.

Khi thêm request type mới:

1. Backend trả request type và department mapping.
2. Frontend có route.
3. Frontend có form.
4. Frontend có validate.
5. Frontend có detail.
6. Approver/follower default hoạt động.
7. Tạo request thành công.
8. Duyệt/từ chối/chuyển tiếp hoạt động.
9. Xuất file/report nếu module cần.
