# Nền tảng nhận yêu cầu đặt hàng Queen Ginseng

## Trạng thái 28/09/2026

Frontend tĩnh trên GitHub Pages. Worker + Apps Script đã có code nhưng **chưa xác minh triển khai thật**. Cấu hình công khai vẫn là `ordersEnabled:false`, URL rỗng. Không tạo đơn/thu tiền thật ở trạng thái này.

**P0 cần chủ Sheet xử lý:** lúc khảo sát, quyền chia sẻ trả về `anyone:writer`. Mở Sheet → Chia sẻ → Quyền truy cập chung → **Bị hạn chế**; rà danh sách thành viên và chỉ giữ người vận hành cần thiết. Không thêm dữ liệu khách thật trước khi hoàn tất. Connector của phiên kiểm tra không có thao tác thu hồi quyền; trình duyệt Sheet chưa đăng nhập nên chưa thay quyền. Apps Script mới từ chối ghi nếu `getSharingAccess()` không phải `PRIVATE`.

## Luồng và nguồn dữ liệu

Trình duyệt → Worker `POST /orders` → Apps Script có khóa nội bộ → các tab riêng.

- `lib/products.ts`: nguồn hiển thị G8 tập trung, 480000 VND, 30 × 15 g = 450 g.
- `Products` trong Sheet: nguồn giá server. Apps Script bắt buộc kiểm tra đúng giá/quy cách/currency/công khai trước khi tạo đơn. Sai khác làm khóa tiếp nhận, không tự sửa Sheet.
- Worker/client kiểm tra số tiền biên nhận khớp số lượng và giá đã chốt. Đây là kiểm tra nhất quán, không thay nguồn tính tiền server.
- Không có tồn kho đã xác nhận; yêu cầu được ghi `PENDING/UNPAID`, phí và tổng cuối cùng để trống/null. Không tự khai báo còn hàng, đã trả tiền hoặc giao thành công.

## Cấu hình trước khi thử tích hợp

1. Tạo **Sheet thử nghiệm riêng, chia sẻ hạn chế**, cùng schema; không thử đơn vào Sheet vận hành.
2. Tab `Products` cần dữ liệu có đúng kiểu: số 480000, 30, 15, 450; boolean TRUE; currency VND; product_id g8. Dòng tiêu đề phải khớp `SCHEMA_` trong Code.gs. Có thể đổi thứ tự cột, không thiếu/trùng tên cột.
3. Apps Script chạy dưới chủ Sheet: thêm Script Properties `SPREADSHEET_ID`, `INTERNAL_KEY` ngẫu nhiên mạnh, `ORDERS_ENABLED=false`. Cần quyền Spreadsheet và Drive để đọc trạng thái chia sẻ. Không đưa secrets vào Git hay frontend.
4. Triển khai Web App cho Worker gọi. URL công khai không phải bí mật bảo mật: Apps Script vẫn kiểm tra `internalKey` cho mọi request. Bật `ORDERS_ENABLED=true` **chỉ ở môi trường thử** khi bắt đầu nghiệm thu.
5. Triển khai `backend/worker/` bằng tài khoản Cloudflare của chủ website; secrets: `APPS_SCRIPT_URL`, `INTERNAL_KEY`, `RATE_LIMIT_SALT`, `ALLOWED_ORIGIN` (chỉ origin, không gồm basePath). Production origin dự kiến `https://dangtuanminh2702206-wq.github.io`.
6. Thử từ staging/local được cấu hình origin riêng: đơn hợp lệ, giá giả, sản phẩm không có, số lượng sai, timeout/retry cùng khóa, khóa trùng nhưng khác payload, schema sai, ghi dở, Apps Script bị gọi trực tiếp thiếu khóa, nhiều yêu cầu đồng thời.
7. Chốt quy trình nhận/xác nhận đơn, liên hệ, tồn kho, giao hàng, thanh toán và người phụ trách. Sau khi nghiệm thu môi trường thử, cấu hình production có quyền hạn chế, rồi mới cân nhắc bật cả server và `public/config/commerce.json`. Chỉ đổi cờ frontend không chứng minh hệ thống đã sẵn sàng.

## Chống trùng và phục hồi ghi dở

Google Sheets **không có transaction nguyên tử nhiều tab**.
- `LockService` khóa toàn luồng; key UUIDv4 được lưu trên `Orders`.
- Ghi dòng Orders trạng thái `WRITING` trước; sau đó Customers, OrderItems và AuditLog bằng định danh xác định theo order_id.
- Chỉ khi các phần đủ và flush xong mới chuyển `PENDING` và trả biên nhận. Retry cùng key tiếp tục phần còn thiếu; xung đột payload/trùng dòng trả lỗi.
- Khách không retry thì dòng WRITING có thể còn tồn tại. Người vận hành cần đối soát các dòng này, child rows, audit và timestamp; không tự coi là đơn hoàn chỉnh, không xóa dòng để thử lại bằng mã mới.
- Trước sửa dữ liệu thủ công: sao lưu Sheet có quyền hạn chế; giữ nguyên idempotency_key và lịch sử. Chưa có trang quản trị phục hồi tự động.
- Trình duyệt lưu key và hash nội dung ở sessionStorage, không lưu thông tin liên hệ. Khi kết quả chưa rõ, giữ key qua mọi retry kể cả 429/503. Chỉ xóa sau biên nhận hợp lệ.
- Nếu khách sửa thông tin sau lỗi chưa rõ kết quả, chặn yêu cầu mới để tránh trùng. Sau reload cần nhập lại đúng dữ liệu hoặc được người vận hành đối soát; chưa có tra cứu đơn được xác thực.
- sessionStorage chỉ bảo vệ một tab/phiên. Đóng tab, thiết bị mới hoặc hai tab độc lập không được coi là cùng yêu cầu. Cần quy trình phát hiện đơn giống nhau trước khi vận hành thật.

## Giới hạn bảo mật và vận hành

- Worker giới hạn body 8 KiB, whitelist trường gửi đi, kiểm tra dữ liệu và biên nhận, timeout, no-store; không tin giá/quyền/trạng thái từ client.
- Apps Script kiểm tra khóa nội bộ, schema, chia sẻ, giá; ghi chuỗi dạng literal chống formula injection và giữ số 0 đầu điện thoại.
- Giới hạn **đơn mới** hiện ở Apps Script: tối đa 5/visitor hash/10 phút, dữ liệu cửa sổ trong ScriptProperties dưới lock, giới hạn 500 visitor đang hoạt động. Retry không tiêu thụ slot tạo đơn mới.
- CORS không phải xác thực/chống spam. Giới hạn trên không chống DDoS/distributed spam hoặc bảo vệ quota Apps Script trước mọi request. Cần nghiệm thu Cloudflare rate limiting/chống bot bằng cấu hình tài khoản được phép trước khi nhận lưu lượng thật.
- Các test trong repo giả lập Sheets/Worker; chưa xác minh scope, quota, CORS deployment, tải đồng thời hoặc khôi phục thật trên Google.
- Chưa có API xác thực khách/admin, tồn kho, email, đối soát thanh toán, ví, hoa hồng hay rút tiền thật. Demo localStorage không có quyền truy cập hệ thống vận hành.
- QR ở public là tài sản công khai, không phải file nội bộ; hiện không hiển thị trong checkout. Không coi thao tác hiển thị/quét QR là xác nhận thanh toán.
- Không phát tán logs/body chứa thông tin người nhận. Sao lưu, thời hạn lưu giữ và chính sách bảo mật cần chủ website chốt.

## Kiểm tra local

`npm test`, `npm run typecheck`, build với `GITHUB_ACTIONS=true`, `npm run audit:export`, `npm run audit:images`.
Bài test trình duyệt: chạy preview tĩnh, sau đó `scripts/browser-flows.cjs`. Cần Playwright + Edge; biến PLAYWRIGHT_MODULE có thể chỉ vào runtime sẵn có. API test được chặn trong browser, không có đơn thật.
