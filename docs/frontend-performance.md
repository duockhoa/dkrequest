# Tối ưu thời gian tải frontend

## Thay đổi

- Tách form tạo yêu cầu, từng form theo loại, phần xem chi tiết và các trang phụ thành các gói JavaScript chỉ tải khi người dùng mở tính năng tương ứng. Có trạng thái chờ tải trong trang hoặc hộp thoại.
- Dùng lại danh mục loại yêu cầu và phòng ban trong Redux trong 5 phút; các lần gọi đồng thời dùng cùng truy vấn đang chạy. Khi API lỗi có thể thử lại.
- Hủy HTTP lấy danh sách/chi tiết khi người dùng chuyển trang, chuyển hồ sơ hoặc rời màn hình. Redux chỉ nhận phản hồi của truy vấn mới nhất để tránh dữ liệu cũ ghi đè.
- Lấy loại yêu cầu từ đường dẫn hiện tại trước khi gọi danh sách. Chuyển loại yêu cầu từ trang sau sẽ lấy thẳng trang 1.
- Ghi nhớ kết quả nhóm hồ sơ theo ngày và đếm tab để tránh tính lại khi mở hộp thoại hoặc thay đổi giao diện không liên quan.

## Kết quả kiểm tra

Cùng mã nguồn và dependencies trên máy phát triển, chạy production build trước/sau:

| Gói JavaScript ban đầu | Trước | Sau |
| --- | ---: | ---: |
| Kích thước sau gzip theo React Scripts | 444,16 kB | 231,52 kB |
| Kích thước chưa nén | 1.631.338 byte | 734.392 byte |

JavaScript ban đầu giảm khoảng 48% sau gzip. Các phần còn lại được tải khi cần. Đây là kích thước build, chưa phải số đo thời gian tải trong trình duyệt người dùng hoặc trên mạng production.

`npm run test:performance` chạy các kiểm thử nhiên liệu/phê duyệt hiện có và kiểm thử mới về tranh chấp phản hồi, truyền tín hiệu hủy đến Axios, cache danh mục, mở form khi cần và chuyển loại yêu cầu từ trang sau. Kết quả: **58 kiểm thử đạt**.

Production build thành công; còn các cảnh báo lint có sẵn, chủ yếu là biến không dùng và dependencies của effect. Bộ test CRA mặc định vẫn có test mẫu `App.test.js` và `setupTests.js` từ template; dùng lệnh kiểm thử chuyên biệt ở trên cho thay đổi này.

## Triển khai

```bash
npm run test:performance
npm run build
```

Đưa toàn bộ thư mục `build/` lên hosting frontend, gồm HTML, CSS và tất cả các file chunk JavaScript. Triển khai đồng bộ các file và duy trì các file có hash cũ trong thời gian người dùng còn phiên mở. Đo lại tải trang đầu, chuyển loại yêu cầu, mở chi tiết, thêm yêu cầu và xuất báo cáo trên thiết bị thực tế.

Chưa triển khai hosting hoặc thay đổi cấu hình máy chủ trong lần sửa này.

## Phạm vi cần lưu ý

Giữ nguyên `pageSize=100`: tìm kiếm và các tab trạng thái hiện chỉ lọc trong trang đã tải. Muốn giảm kích thước trang và tìm kiếm/lọc trên toàn bộ hồ sơ cần bổ sung điều kiện tương ứng ở API trước để kết quả và số đếm chính xác. Việc giảm kích thước JavaScript không xác nhận toàn bộ nguyên nhân chậm trên production; vẫn cần đo tốc độ mạng, API và render thực tế sau triển khai.

## Tối ưu bổ sung phản hồi và bình luận

- Tách trạng thái đang gửi bình luận khỏi trạng thái tải danh sách: ô nhập và bình luận cũ tiếp tục hiển thị khi đang gửi, có chỉ báo đang xử lý và chặn nhấn gửi liên tục.
- Khi gửi thất bại, giữ lại bản nháp và file. Khi chuyển hồ sơ, hủy truy vấn bình luận cũ và bỏ qua phản hồi cũ; bình luận gửi ở hồ sơ trước không chèn sang hồ sơ mới. Một lượt tải bắt đầu trước khi gửi thành công không làm mất hoặc nhân đôi bình luận mới.
- Form chuyển duyệt và form người theo dõi dùng chung danh mục nhân viên trong Redux với cache 5 phút và chống gọi trùng khi đang tải. Danh mục lỗi có thể thử lại ngay. Việc tải danh mục nhân viên hoàn tất không gọi lại API người theo dõi lần thứ hai.

Sau đợt bổ sung, `npm run test:performance` đạt **68 kiểm thử**. Build production thành công, JavaScript ban đầu khoảng **231,87 kB sau gzip**; thay đổi lần này tập trung vào giảm truy vấn dư và cải thiện phản hồi thao tác. Đo kích thước build chưa xác nhận thời gian tải production. Build vẫn còn các cảnh báo lint có sẵn.

Backend cần được triển khai cùng các thay đổi về truy vấn chi tiết, bình luận và gửi email theo nhóm trong repository `/home/binh/mysql`. Chưa thay đổi hosting, tiến trình chạy hoặc dữ liệu thật.
