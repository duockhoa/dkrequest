# Cấp duyệt Phó phòng Kỹ thuật

BE DK Request áp dụng cho hồ sơ mới do nhân viên phòng Kỹ thuật tạo: **0637 → các cấp hiện tại**. 0637 tự tạo không qua chính mình; Trưởng phòng tạo không qua 0637. BE xác định danh tính/phòng ban, giữ chuỗi đã lưu của hồ sơ cũ và luồng của phòng khác.

FE vẫn dùng API `GET /requestapprover/getbytype/:requesttype/:userid`. Không hardcode người duyệt hoặc mã 0637 ở FE. Danh sách có thể dài hơn, được hiển thị theo cấp BE trả về; cấp Phó phòng có metadata `approvalRole: technical_deputy`.

Form không gửi khi chưa tải xong đúng danh sách duyệt hoặc API đang lỗi. Có nút thử lại. Khi đổi loại đề nghị, bỏ danh sách cũ và bỏ qua phản hồi đến trễ của lần tải trước. Cập nhật người duyệt chỉ sửa `approvers`, không ghi đè các nội dung/số tiền/số lít người dùng đang nhập. Kết quả rỗng của luồng cũ vẫn là một lần tải thành công.

Triển khai BE kèm migration `database/technical_deputy_approval.sql` **trước khi khởi động BE mới**, rồi cập nhật/build FE. Chỉ restart tiến trình DK Request; không restart các dịch vụ khác. Chi tiết cấu hình và migration trong `docs/technical-approval.md` của repo BE `mysql`.

`npm run test:approval` chạy bộ kiểm thử FE mới cùng kiểm thử xăng dầu và quyền dev hiện có. Kiểm tra thực tế với nhân viên Kỹ thuật, 0637, Trưởng phòng và phòng khác; kiểm tra lần lượt xem trước, tạo hồ sơ, lượt duyệt và thông báo. Phân biệt hồ sơ cũ với hồ sơ mới khi đối chiếu số cấp.
