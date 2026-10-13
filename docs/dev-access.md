# Dev full access — DK Request

Tài khoản được yêu cầu: mã nhân viên **0947**. BE `mysql` cấp quyền theo `src/configs/devAccess.json`, dùng thông tin người dùng đã xác thực từ DB. Có thể ghi đè bằng `DEV_FULL_ACCESS_EMPLOYEE_CODES`/`DEV_FULL_ACCESS_EMAILS` trong môi trường BE. FE không tự cấp quyền theo mã nhân viên hoặc phòng ban.

`GET /api/v1/users/me` phải trả:

```json
{
  "permissions": {
    "devFullAccess": true,
    "exportFuelPaymentReport": true
  }
}
```

FE tải quyền sau khi nhận tài khoản đăng nhập. Dev mở được báo cáo chung ở mọi luồng, báo cáo xăng dầu ở Đề nghị thanh toán, danh mục VPP, các nút duyệt/chuyển tiếp/từ chối, tiếp nhận, hoàn thành, hủy và sửa chi tiết hóa đơn/VPP theo trạng thái hồ sơ. Danh sách tự tải lại sau khi nhận quyền để lấy tất cả hồ sơ BE cho phép xem.

Quyền dev không tự thao tác dữ liệu, không đổi phòng ban, không bỏ qua JWT/validation/thứ tự duyệt. Đây là quyền trong DK Request; không cấp quyền quản trị HRM hoặc dịch vụ đăng nhập.

Triển khai cả FE và BE: pull từng repo, build FE, khởi động lại tiến trình BE bằng cách máy chủ đang dùng, rồi tải lại trang và đăng nhập bằng tài khoản 0947. Nếu biến môi trường BE đã ghi đè danh sách mã nhân viên, cần thêm 0947 vào danh sách đó. Không cần migration DB cho quyền dev.

Kiểm tra tài khoản 0947 thấy nút **Xuất báo cáo** trên các luồng; tài khoản thường vẫn giữ quyền cũ. Trong luồng Đề nghị thanh toán, chọn **Báo cáo thanh toán xăng dầu** và tháng cần đối chiếu. Thu hồi quyền bằng cấu hình BE, restart BE và tải lại FE.
