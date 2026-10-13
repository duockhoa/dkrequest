# Thanh toán xăng dầu: hợp đồng tích hợp FE/BE

FE đã triển khai trong repo này. Migration, validation phía server, quyền và workbook Excel dưới đây **chưa được triển khai** vì workspace không chứa BE. Cần hoàn thành BE trước khi đưa tính năng vào sử dụng.

## Tạo đề nghị thanh toán

Giữ `requestTypeId = 1` và API tạo đề nghị hiện tại; thêm giá trị `payment_type = fuel`. FE gửi multipart theo cấu trúc hiện tại:

```text
payment_request[payment_type] = fuel
payment_request[fuel_liters] = 40.25
payment_request[currency] = VND
payment_request[amount] = <số tiền theo hóa đơn>
files[invoices][0][file] = <File>
files[invoices][0][file_group] = invoices
```

`fuel_liters` nhập tổng số lít của các hóa đơn đính kèm, độc lập với số tiền. FE nhận dấu phẩy hoặc dấu chấm thập phân, giữ nguyên chuỗi trong lúc nhập và gửi chuỗi thập phân dùng dấu chấm. Không tính số tiền bằng đơn giá xăng dầu.

BE cần:

- Mở rộng enum/allowlist `payment_type` với `fuel`; giữ `invoice` và `no_invoice`.
- Thêm cột nullable `fuel_liters DECIMAL(12,3)` vào bảng thanh toán. Không backfill hồ sơ cũ và không suy đoán số lít từ nội dung thanh toán.
- Với `fuel`: yêu cầu số lít hữu hạn, lớn hơn 0, tối đa 9 chữ số phần nguyên và 3 chữ số thập phân; ít nhất một file hóa đơn hợp lệ, không rỗng. Kiểm tra ở server, kể cả với request tự gọi API.
- Giữ validation số tiền/tiền tệ hiện có. Không tự chuyển ngoại tệ sang VND.
- Với `invoice`/`no_invoice`: bỏ qua hoặc đặt `fuel_liters = NULL`. FE bỏ số lít và nhóm file không tương ứng trước khi gửi; các nhóm đính kèm khác vẫn gửi bình thường.
- Trả `paymentRegistration.payment_type`, `paymentRegistration.fuel_liters` trong API chi tiết. Định dạng số lít bằng chuỗi decimal để tránh mất độ chính xác.
- Lưu hồ sơ và hóa đơn cùng giao dịch nghiệp vụ; báo lỗi nếu lưu/upload hóa đơn thất bại.

## Quyền truy cập

FE giữ quyền hiển thị báo cáo chung theo phòng ban hiện có. Sau khi tải tài khoản từ dịch vụ đăng nhập, FE gọi `GET /api/v1/users/me` của BE request để lấy quyền báo cáo; không chờ API quyền mới hiển thị tài khoản. Để HC hoặc KTSX-DA có thể xuất báo cáo xăng dầu ngoài điều kiện đó, API này cần trả quyền do BE tính:

```json
{ "permissions": { "exportFuelPaymentReport": true } }
```

BE kiểm tra quyền từ người dùng đã xác thực và quy tắc tổ chức thật. Không tin `userId`, tên phòng ban hay permission do client gửi. Cờ trên chỉ phục vụ hiển thị giao diện. Người có quyền bổ sung chỉ được chọn báo cáo xăng dầu; không được mở rộng quyền báo cáo chung qua cờ này.

## Xuất báo cáo tháng

Giữ `POST /exportreport`. Báo cáo chung tiếp tục dùng payload cũ. Khi xuất xăng dầu, FE gửi:

```json
{
  "requestTypeId": 1,
  "reportType": "fuel_payment",
  "year": 2026,
  "month": 10
}
```

BE phân nhánh rõ theo `reportType`; không bỏ qua tham số và trả báo cáo chung. Kiểm tra tháng hợp lệ, từ `2026-10`, rồi tính khoảng `[đầu tháng, đầu tháng kế tiếp)` theo `Asia/Ho_Chi_Minh`, quy đổi sang UTC cho truy vấn.

Điều kiện lấy dữ liệu:

- Đúng đề nghị thanh toán, `payment_type = fuel`.
- Đã duyệt hoàn tất: `status = approved`, không dùng chỉ một người duyệt đã chấp nhận.
- Thời điểm duyệt hoàn tất nằm trong tháng báo cáo; không dùng ngày tạo, ngày cập nhật, ngày tiếp nhận hoặc ngày hoàn thành.
- Không hủy, không từ chối, không xóa. Kiểm tra cả cờ hủy và trạng thái nếu BE lưu chúng riêng biệt.
- Gồm hồ sơ chưa tiếp nhận hoặc chưa hoàn thành. Không lọc theo `isReceived`/`isCompleted`.
- Gom theo ID người đề nghị, không gom theo tên. Tránh nhân bản hồ sơ khi join nhiều người duyệt hoặc nhiều hóa đơn.

Nếu BE chưa lưu thời điểm duyệt hoàn tất, cần thêm và ghi timestamp khi hồ sơ chuyển sang `approved`. Với hồ sơ đã duyệt, chỉ khôi phục từ lịch sử duyệt đáng tin cậy; không dùng `updatedAt` thay thế.

Workbook cần có bảng tổng hợp theo người đề nghị (mã/ID, tên, phòng ban, tổng số lít, tổng số tiền, tiền tệ) và bảng chi tiết hồ sơ để đối chiếu (ID hồ sơ, người đề nghị, nội dung, thời điểm duyệt, số lít, số tiền, tiền tệ). Cộng decimal ở BE. Nếu có nhiều tiền tệ, tách tổng số tiền theo tiền tệ; không cộng VND và USD vào cùng một tổng. Mỗi hồ sơ chỉ cộng số lít một lần. Không có dữ liệu vẫn trả workbook với tiêu đề và tổng bằng 0. Ghi chuỗi người dùng thành ô text để tránh bị hiểu là công thức Excel.

Phản hồi thành công:

```text
HTTP 200
Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet
X-Report-Type: fuel_payment
Content-Disposition: attachment; filename="thanh-toan-xang-dau-2026-10.xlsx"
```

Với FE/BE khác origin, expose `X-Report-Type` qua CORS (`Access-Control-Expose-Headers`). FE yêu cầu header này trước khi tải file xăng dầu để phát hiện BE cũ trả nhầm workbook chung. FE tự đặt tên file theo tháng đã chọn.

Trả lỗi bằng HTTP 400/403/422/500 và JSON `{ "message": "..." }`. FE đọc JSON kể cả khi Axios nhận Blob, giữ form để người dùng thử lại, và khóa gửi lặp trong khi xuất.

## Kiểm chứng

`npm run test:fuel`: chạy kiểm thử số lít, multipart/hóa đơn, đổi loại thanh toán, chọn tháng, lỗi/quyền API, tránh tải nhầm workbook, chống gửi lặp và tải lại sau lỗi. Dùng cấu hình Jest riêng vì `setupTests.js` của CRA hiện tham chiếu dependency chưa cài.

`BUILD_PATH=/tmp/dkrequest-fuel-build npm run build`: kiểm tra build production, không ghi đè thư mục build đang được theo dõi.

BE cần thêm kiểm thử tích hợp cho ranh giới tháng Việt Nam, duyệt từng phần/duyệt hoàn tất, hồ sơ hủy/từ chối, hồ sơ chưa tiếp nhận/chưa hoàn thành, nhiều hóa đơn, người trùng tên, nhiều tiền tệ và người không có quyền. Kiểm tra workbook thật và thử tải trên FE sau khi hoàn thành endpoint.
