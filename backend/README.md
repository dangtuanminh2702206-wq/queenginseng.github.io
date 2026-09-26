# Nền tảng nhận đơn Queen Ginseng

GitHub Pages chỉ phục vụ file tĩnh, nên website gửi đơn qua Cloudflare Worker. Worker kiểm tra nguồn web, tạo mã nhận diện khách truy cập để giới hạn tần suất, rồi gọi Apps Script. Apps Script giữ khóa nội bộ, dùng `LockService` khi ghi Sheet và tự tính giá G8 từ tab `Products`.

## Cấu hình cần thực hiện

1. Tab `Products` đã có dữ liệu G8 chính thức: `g8`, `bot-tra-sam-nu-hoang-g8`, `BỘT TRÀ SÂM NỮ HOÀNG G8`, `Sâm Nữ Hoàng G8 – Trà Sâm Hòa Tan`, `480000`, `VND`, `30`, `15`, `450`, `TRUE`. Chỉ sửa dữ liệu này khi có xác nhận mới.
2. Tạo Apps Script độc lập, dán `apps-script/Code.gs`, rồi thêm Script Properties `SPREADSHEET_ID` và `INTERNAL_KEY`.
3. Triển khai Apps Script Web App chạy dưới tài khoản chủ Sheet. Chỉ Worker gọi URL này.
4. Tạo Cloudflare Worker từ `worker/`. Thêm các secrets: `APPS_SCRIPT_URL`, `INTERNAL_KEY`, `RATE_LIMIT_SALT`, `ALLOWED_ORIGIN=https://dangtuanminh2702206-wq.github.io`.
5. Sau khi Worker đã kiểm tra được một đơn thử, cập nhật `public/config/commerce.json` bằng URL Worker `/orders` và đặt `ordersEnabled` thành `true`; sau đó build và deploy GitHub Pages.

Không đưa `INTERNAL_KEY`, `RATE_LIMIT_SALT`, URL Apps Script hay dữ liệu khách hàng vào Git.

## Giới hạn giai đoạn này

Mã hiện chỉ tiếp nhận đơn khách. Đăng nhập, quản trị, email, tồn kho, thanh toán thủ công, ví và hoa hồng cần được thêm qua Worker với xác thực thật trước khi bật cho người dùng.
