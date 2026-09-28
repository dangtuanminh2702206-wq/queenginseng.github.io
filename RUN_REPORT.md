# Queen Ginseng — Kiểm tra và sửa lỗi 27–28/09/2026

## Kết luận hiện tại

Đã sửa code trên repository hiện có, giữ phong cách Premium Botanical và dữ liệu G8. Không xây lại, không bật nhận đơn/thu tiền thật. Phần nhận đơn backend mới được kiểm thử bằng giả lập; chưa được coi là hệ thống production.

**Còn P0 cần xử lý trước khi nhận dữ liệu khách:** Google Sheet vận hành trả về quyền `anyone:writer` trong lượt khảo sát. Nghĩa là bất kỳ ai có liên kết có thể sửa. Chưa thu hồi được quyền bằng connector hiện có; trình duyệt Sheet chưa đăng nhập. Chủ Sheet cần chuyển “Quyền truy cập chung” thành **Bị hạn chế**, rà người được chia sẻ. Không kết luận đã có rò rỉ hay đã có đơn thật chỉ từ phát hiện quyền này. Code Apps Script mới có kiểm tra PRIVATE và từ chối ghi, nhưng **đây không phải thao tác thay đổi quyền Sheet**.

## Khảo sát và phiên bản

- Repo đúng: `dangtuanminh2702206-wq/queenginseng.github.io`, remote `github`, nhánh main.
- Khởi đầu ở `0996d5c`, working tree sạch; không thấy AGENTS.md trong repo/các vị trí cha được tìm.
- Đã đọc package/config Next, TypeScript, Tailwind, workflow, báo cáo cũ, backend/README và design system.
- Bản live trước sửa có GitHub Actions thành công gắn commit `0996d5c`; local cùng commit. Fetch trước commit sửa không có chênh lệch remote.
- Các route được kiểm tra: /, trang G8, /gio-hang, /thanh-toan, /dang-nhap, /dang-ky, /tai-khoan, bốn trang con đơn hàng/giới thiệu/hoa hồng/rút tiền, /demo-admin. Thêm trang 404 tiếng Việt; giữ sitemap/robots static.
- Đọc header thực tế Products, Orders, OrderItems, Customers, AuditLog và hàng G8. Không ghi đơn thử, không sửa schema hay dữ liệu Sheet trong lượt này.

## Lỗi và cách xử lý

| Mức | Phát hiện / nguyên nhân | Kết quả |
| --- | --- | --- |
| P0 | Sheet cho anyone quyền writer | Chưa đổi được quyền; ghi rõ thao tác chủ Sheet phải làm, giữ ordersEnabled=false; thêm chốt PRIVATE trong Apps Script |
| P0 tiềm ẩn khi mở backend | Ghi nhiều tab chưa có phục hồi; retry có thể trả thành công khi child rows chưa đủ | Orders ghi WRITING trước; cùng key sẽ tiếp tục Customers/OrderItems/AuditLog, chỉ PENDING sau flush đủ; mock kiểm tra lỗi trước/sau từng lần ghi |
| P0 tiềm ẩn khi mở backend | Tin phản hồi server quá rộng; retry mất key qua reload hoặc khi bị từ chối sau một lần timeout | Kiểm tra cấu trúc/mã đơn/số tiền; key + hash trong sessionStorage, giữ key khi lỗi, chặn thay nội dung khi kết quả chưa rõ; không xóa giỏ khi lỗi |
| P1 | Worker thiếu chặn body lớn, dữ liệu sai kiểu, timeout và phản hồi upstream không hợp lệ | Whitelist trường, validation chung + validation độc lập Apps Script, giới hạn 8 KiB, timeout, mã lỗi an toàn; không phản chiếu CORS cho origin bị từ chối |
| P1 | Giỏ/header có thể crash khi localStorage bị chặn hoặc JSON sai shape | Đọc an toàn, lọc shape, fallback bộ nhớ; quantity nguyên 0–99; cập nhật giỏ không dựa vào snapshot cũ |
| P1 | Hai ảnh giải thưởng, QR và asset G7 tương lai bị hỏng/truncated | Khôi phục từ ảnh gốc người dùng; giải mã đầy đủ 10 ảnh đạt; QR sao chép nguyên byte, SHA-256 trùng nguồn |
| P2 | Homepage dùng overflow-x:hidden tạo scroll container khiến sticky header trượt khỏi viewport | Dùng overflow-x:clip; test scroll 700 px giữ header top=0 |
| P2 | Rút tiền demo nhận NaN/số lẻ, chuyển trạng thái sai, xử lý lặp, tính số dư sau rút một phần thiếu nhất quán | Chặn số tiền không hợp lệ; trạng thái có thứ tự; giữ/giải phóng tiền mẫu đúng một lần; kiểm tra lại khi hoa hồng bị hủy; vẫn chỉ là mô phỏng |
| P2 | Nút tạo dữ liệu mẫu có thể ghi đè demo hiện có; đăng ký trùng tự đăng nhập | Chặn seed khi có dữ liệu; báo trùng số điện thoại; giữ dữ liệu cũ trừ khi người dùng chủ động đặt lại demo |
| P2 | Chữ phụ #6B7C75 chưa đủ tương phản cho chữ nhỏ; focus vàng nhạt khó thấy; lỗi form khó tìm | Đổi chữ phụ #587067, vòng focus hai màu; lỗi từng trường + summary nhận focus; radio/fieldset/label và loading rõ |
| P2 | Trang tài khoản/checkout/admin còn index, sitemap chứa route riêng; thiếu tiêu đề riêng | Thêm noindex, title từng khu vực; sitemap chỉ homepage/G8; URL Open Graph tuyệt đối, kiểm tra canonical/basePath |
| P2/P3 | Tiếng Anh trạng thái demo, thiếu footer ở tài khoản/auth/admin, promise chia sẻ không xử lý lỗi, phản hồi thêm giỏ sai khi chạm giới hạn | Nhãn Việt, footer thống nhất, lỗi chia sẻ rõ, phản hồi theo số hộp thực sự thêm, nút + vô hiệu ở giới hạn |

Không khẳng định sự cố mất đơn/tiền đã xảy ra: backend chưa được bật. Những mục backend P0/P1 là rủi ro được tìm thấy trong mã và đã có sửa + test giả lập.

## G8, hồ sơ và ảnh

- Nguồn hiển thị: `lib/products.ts`, không thay đổi dữ liệu đã chốt: 480.000 ₫, 30 × 15 g, 450 g, 18 tháng; SKU null; không giả tồn kho/review.
- Nguồn giá khi nhận đơn: tab Products; server so khớp giá/quy cách với bộ dữ liệu đã duyệt và từ chối nếu lệch. Client và Worker kiểm tra số tiền biên nhận. Hai nguồn có vai trò riêng, không tự đồng bộ Sheet bằng frontend.
- Hồ sơ G8: `public/docs/g8/ho-so-bot-tra-sam-nu-hoang-g8.pdf`.
- Hai PDF tại `public/docs/research/` là nghiên cứu mẫu nguyên liệu/tinh chất, không phải chỉ tiêu dinh dưỡng G8. Không thay nội dung PDF.
- Giải thưởng ở `public/images/brand-awards/2026/`, tách khỏi hồ sơ G8; không gọi là chứng nhận Bộ Y tế.
- Bài ngoài vẫn ghi rõ sâm Ngọc Linh; không biến 150 triệu/kg thành giá/đặc điểm Sâm Nữ Hoàng.
- Ảnh G8 `g8-open-box-clean.webp` giữ nguyên, không có hàng Sunart phía trên và không cắt mất hộp/gói.
- G7 chỉ là asset tương lai tại `public/images/future/g7/preview.webp`; không có route sản phẩm/catalog/nút mua. Lưu trong public nghĩa là file có thể truy cập trực tiếp, không phải file mật.
- QR `public/images/payment/mb-bank-qr.png` là file public, không phải “asset nội bộ”. Hiện không hiển thị ở checkout, không xác nhận thanh toán.
- Chưa có ảnh thương mại nhiều góc được duyệt; không tạo gallery giả.

## UI/UX Pro Max đã được áp dụng thế nào

Đã đọc SKILL.md, quick-reference và pro-rules của skill đã cài, đối chiếu design system hiện có; tra hướng dẫn error summary/validation.
Quyết định cụ thể: giữ màu/font và cấu trúc bán G8; sửa lỗi thay vì đổi toàn bộ layout; bảo toàn ảnh/tỷ lệ; focus và tương phản rõ; lỗi form tại trường kèm tóm tắt có thể focus; không báo thành công khi API chưa xác minh; tiếng Việt và trạng thái rỗng/thử nghiệm rõ. Không đưa một palette hoặc typography mới vào website.

## Kiểm tra đã có kết quả

- TypeScript và production build với GITHUB_ACTIONS=true: đạt; Next tạo 16 mục static, giữ basePath /queenginseng.github.io.
- 27 regression tests: đạt. Bao phủ tiền/số lượng, storage lỗi, UUID, retry qua reload, phản hồi sai/timeout, Apps Script ghi dở và schema đổi thứ tự, chia sẻ public/khóa sai/lock bận/rate limit, Worker whitelist, demo wallet và dữ liệu sai shape.
- 15 nhóm thao tác trình duyệt Edge headless: đạt; không có pageerror ghi nhận. Có giỏ 1/2 hộp, xóa/giỏ trống/reload/đồng bộ tab; menu/Escape/focus; checkout disabled; API giả lập lỗi/rate limit/timeout/retry/thành công hợp lệ; đăng ký/đăng xuất demo; accordion Enter; PDF; CTA/back/forward.
- 12 route × 5 viewport 375/390/768/1024/1440: 60 lượt kiểm tra sau sửa, không thấy tràn ngang, lỗi tải hoặc lỗi giải mã ảnh. Thêm 6 màn hình tài khoản/admin có dữ liệu mẫu × 5 viewport: không tràn ngang cấp trang; bảng có vùng cuộn riêng.
- audit-export: 452 tham chiếu nội bộ hợp lệ, kiểm tra neo/asset/PDF, JSON-LD giá VND, không SKU/tồn kho/rating/review bịa, private routes noindex và sitemap sạch.
- audit-images: 10 ảnh được giải mã toàn bộ, không chỉ kiểm tra HTTP/metadata. Hai ảnh giải thưởng cũ trả HTTP thành công nhưng hỏng pixel, nên kiểm tra đường dẫn ban đầu không phát hiện; đã bổ sung phép thử này.
- Ba PDF được tải bằng request local, HTTP 200 và chữ ký %PDF-.
- Độ tương phản tính theo màu: #6B7C75 trên ivory khoảng 3,95:1 → #587067 khoảng 4,79:1. Không coi vài cặp màu này là chứng nhận WCAG toàn site.
- Quét nội dung giao diện/export không thấy quy cách G8 cũ, sản phẩm tương lai trong catalog hoặc các claim trong danh sách cấm được kiểm tra.
- git diff --check trước commit: kiểm tra và sửa khoảng trắng thừa.
- Không có script/config lint độc lập nên không báo lint đã đạt. Chưa đo Lighthouse, chưa kiểm thử trình đọc màn hình, Safari/iPhone thật hoặc zoom hệ điều hành.
- Các test Apps Script/Worker là giả lập, không chứng minh deployment/quota/transaction thật. Không gửi đơn, email hay thông báo khách thật. Chưa kiểm thử đối soát ngân hàng hoặc quyền admin thật vì chưa có dịch vụ hoạt động.

## Ảnh đối chiếu

Bản trước chụp từ website công khai ở commit 0996d5c, bản sau từ local production export, cùng viewport:

- [Desktop trước](docs/audit/2026-09-28/before-desktop.png) · [Desktop sau](docs/audit/2026-09-28/after-desktop.png)
- [Mobile trước](docs/audit/2026-09-28/before-mobile.png) · [Mobile sau](docs/audit/2026-09-28/after-mobile.png)

Ảnh đầy đủ trang G8/checkout cùng JSON kết quả ở thư mục local `outputs/audit/` (không commit). Chỉ lưu screenshot không chứa dữ liệu khách thật vào docs.

## Chức năng thật / chưa bật

**Hoạt động ở frontend:** xem G8 và tài liệu, điều hướng, responsive, giỏ hàng cục bộ, kiểm tra form, cảnh báo trạng thái chưa nhận đơn.

**Vẫn demo:** đăng ký/đăng nhập/tài khoản, danh sách đơn trong tài khoản, giới thiệu, 5% chỉ là tỷ lệ minh họa chưa phải chính sách, hoa hồng, số dư, yêu cầu rút và /demo-admin. Không có xác thực thật, không dùng demo làm bảo mật. Không thêm nạp tiền/chuyển tiền/chi tiêu ví.

**Chưa kết nối:** Worker/Apps Script live, nhận đơn thật, tồn kho, phân quyền admin thật, email, đối soát chuyển khoản, thông báo và analytics vận hành. Không tạo dịch vụ trả phí hay database mới.

## Chủ website cần cung cấp / TODO trước mở bán

1. Thu hồi quyền anyone:writer của Sheet; xác nhận nhóm vận hành được phép. Không ghi dữ liệu khách vào Sheet đang public.
2. Tài khoản/quyền triển khai Cloudflare + Apps Script, secrets đặt ở server, staging Sheet riêng và nghiệm thu theo backend/README.md.
3. Kênh liên hệ và người xử lý đơn thật; phí vận chuyển, tồn kho, đổi trả/bảo mật, quy trình xác nhận/hoàn tiền.
4. Nhà cung cấp xác thực và cách cấp vai trò quản trị; email gửi/nhận được xác nhận, quy tắc thống kê và sự đồng ý phù hợp.
5. Chính sách giới thiệu/hoa hồng/rút tiền: tỷ lệ thật, điều kiện hưởng, thời gian giữ, ngưỡng rút, xử lý hủy/hoàn, kênh hoàn tiền. Chưa xác nhận thì không bật.
6. Giới hạn Sheets: khóa ghi không biến nhiều tab thành transaction; cần đối soát WRITING nếu khách không retry, giám sát quota, backup hạn chế quyền và quy trình phục hồi.
7. Chống spam production ở edge chưa cấu hình/kiểm thử. Idempotency frontend chỉ trong một tab/phiên; không đảm bảo hợp nhất đơn cùng khách trên nhiều thiết bị.
8. Nếu storage bị chặn, giỏ/demo chỉ tồn tại trong bộ nhớ trang và không bảo đảm giữ sau reload. Kết quả gửi đơn mơ hồ cần retry đúng dữ liệu hoặc đối soát, không tự tạo yêu cầu mới.

## File sửa / thêm

### Sửa

- `.github/workflows/deploy-pages.yml`
- `app/dang-ky/page.tsx`
- `app/dang-nhap/page.tsx`
- `app/gio-hang/page.tsx`
- `app/globals.css`
- `app/layout.tsx`
- `app/page.tsx`
- `app/san-pham/bot-tra-sam-nu-hoang-g8/page.tsx`
- `app/sitemap.ts`
- `app/tai-khoan/don-hang/page.tsx`
- `app/tai-khoan/gioi-thieu/page.tsx`
- `app/tai-khoan/hoa-hong/page.tsx`
- `app/tai-khoan/rut-tien/page.tsx`
- `app/thanh-toan/page.tsx`
- `backend/apps-script/Code.gs`
- `backend/worker/src/index.ts`
- `components/account-shell.tsx`
- `components/account-views.tsx`
- `components/cart-button.tsx`
- `components/cart-provider.tsx`
- `components/demo-admin-view.tsx`
- `components/product-purchase.tsx`
- `components/site-footer.tsx`
- `lib/commerce-api.ts`
- `lib/demo-store.ts`
- `package.json`
- `public/images/brand-awards/2026/award-ceremony.webp`
- `public/images/brand-awards/2026/award-certificate.webp`
- `public/images/future/g7/preview.webp`
- `public/images/payment/mb-bank-qr.png`
- `scripts/audit-export.mjs`
- `scripts/preview-static.mjs`
- `RUN_REPORT.md`
- `backend/README.md`
- `PRODUCTION_MIGRATION.md`

### Thêm

- `app/dang-ky/layout.tsx`
- `app/dang-nhap/layout.tsx`
- `app/demo-admin/layout.tsx`
- `app/gio-hang/layout.tsx`
- `app/not-found.tsx`
- `app/tai-khoan/layout.tsx`
- `app/thanh-toan/layout.tsx`
- `docs/audit/2026-09-28/after-desktop.png`
- `docs/audit/2026-09-28/after-mobile.png`
- `docs/audit/2026-09-28/before-desktop.png`
- `docs/audit/2026-09-28/before-mobile.png`
- `lib/cart-store.ts`
- `lib/demo-labels.ts`
- `lib/order-validation.ts`
- `lib/private-metadata.ts`
- `scripts/audit-images.mjs`
- `scripts/browser-audit.cjs`
- `scripts/browser-flows.cjs`
- `tests/commerce.test.cjs`
- `tests/helpers.cjs`

## Commit và triển khai

- `bf377b1`: sửa tiếp nhận đơn, phục hồi ghi dở, storage, ví demo và regression tests.
- `ba11f0d`: ảnh hỏng, sticky header, accessibility, SEO, screenshot và bài test trình duyệt/CI.
- `81c873b`: ghi báo cáo, bằng chứng kiểm tra và hướng dẫn các điều kiện mở bán.
- Lần chạy Actions `36367710278` build thành công nhưng test chưa chạy do Node 22 không hỗ trợ `--test-isolation=none` (máy local dùng Node 24). Website cũ không bị thay bởi lượt deploy thất bại.
- `ace2ad5`: sửa npm test dùng `node --test` tiêu chuẩn, chạy lại 27/27 test tại local; không bỏ qua test.
- Đã push các commit trên. [Actions 36367891639](https://github.com/dangtuanminh2702206-wq/queenginseng.github.io/actions/runs/36367891639) tại commit `ace2ad53cb8b274e5b1b8a65e03eb22a5c5e6a84` hoàn tất **success**, bao gồm build, kiểm tra và deploy GitHub Pages.
- Kiểm tra sau deploy trực tiếp website công khai: 12 route × 5 viewport = 60 lượt, không có lỗi tải trang, tràn ngang, lỗi giải mã ảnh hoặc pageerror được ghi nhận. Bằng chứng local tại `outputs/audit/live-after/` gồm JSON và screenshot desktop/mobile.
- Bấm thêm G8 và tăng số lượng trực tiếp trên bản public: 480.000 ₫ → 960.000 ₫. Checkout hiện đúng cảnh báo không chuyển tiền, nút nhận đơn vô hiệu và không hiển thị QR. Config live giữ `ordersEnabled=false`, API URL trống. Không gửi đơn thử.
- Ba PDF public trả HTTP 200 và chữ ký %PDF- hợp lệ; URL không tồn tại trả 404. Đây là kiểm tra tải file, không thay thế đối chiếu nội dung pháp lý. Bản cập nhật báo cáo sau kiểm tra chỉ thay tài liệu, không đổi code đã kiểm chứng.

---

# Nhật ký các giai đoạn trước

Các mục bên dưới là ghi chép lịch sử, không phải trạng thái vận hành hiện tại. Phần audit ngày 28/09/2026 phía trên có hiệu lực khi có khác biệt.

# Queen Ginseng Vietnam — Nhật ký cũ

## 1. Phạm vi hoàn thành

Website giữ phong cách Premium Botanical và tiếp tục từ code hiện có. Public catalog chỉ hiển thị G8. Đã bổ sung tài khoản thử nghiệm, đơn hàng demo, giới thiệu một cấp, hoa hồng 5%, sổ giao dịch, rút tiền demo và trang quản trị dữ liệu cục bộ.

## 2. Tuyến trang

- `/` — homepage bán G8.
- `/san-pham/bot-tra-sam-nu-hoang-g8` — trang sản phẩm.
- `/gio-hang`, `/thanh-toan` — giỏ hàng và tạo đơn demo.
- `/dang-nhap`, `/dang-ky` — tài khoản demo.
- `/tai-khoan`, `/tai-khoan/don-hang`, `/tai-khoan/gioi-thieu`, `/tai-khoan/hoa-hong`, `/tai-khoan/rut-tien`.
- `/demo-admin` — quản trị cục bộ, có nhãn DEMO ADMIN / LOCAL DATA ONLY.

## 3. Dữ liệu G8

Nguồn duy nhất là `lib/products.ts`: BỘT TRÀ SÂM NỮ HOÀNG G8; 480.000 ₫/hộp; 30 gói × 15 g; 450 g; hạn sử dụng 18 tháng; SKU `null`. Không có G5/G6/G7 trong catalog.

## 4. Giới thiệu và hoa hồng

`lib/referral-config.ts` đặt `commissionRate = 0.05`. Quan hệ chỉ một cấp và người giới thiệu được gắn một lần khi đăng ký. Tự dùng mã của chính mình bị chặn với thông báo yêu cầu. Một hộp 480.000 ₫ tạo 24.000 ₫ hoa hồng chờ duyệt; hai hộp tạo 48.000 ₫.

Trạng thái hoa hồng: `PENDING`, `AVAILABLE`, `PAID`, `CANCELLED`. Chỉ đơn `COMPLETED` mới được quản trị duyệt sang khả dụng.

## 5. Ví và rút tiền

Sổ giao dịch có `COMMISSION_PENDING`, `COMMISSION_RELEASE`, `COMMISSION_CANCEL`, `WITHDRAWAL_REQUEST`, `WITHDRAWAL_PAID`. Số dư được suy ra từ hoa hồng và yêu cầu rút, không lưu dưới dạng một số dư tùy ý. Rút tiền chỉ là yêu cầu demo, không chuyển tiền thật.

## 6. Đơn hàng và thanh toán

Đơn demo có mã `QGV-DEMO-*`, sản phẩm, số lượng, đơn giá, tổng tiền, người giới thiệu, phương thức và trạng thái. Trạng thái: `PENDING → CONFIRMED → SHIPPING → COMPLETED`; có `CANCELLED` và `RETURNED`. COD và QR MB Bank đều không tự xác nhận thanh toán.

## 7. Lưu trữ demo

Sử dụng đúng bảy khóa `qgv-demo-users-v1`, `qgv-demo-session-v1`, `qgv-demo-orders-v1`, `qgv-demo-referrals-v1`, `qgv-demo-commissions-v1`, `qgv-demo-wallet-v1`, `qgv-demo-withdrawals-v1`. Nút đặt lại chỉ xóa nhóm khóa này.

## 8. Logo và hình ảnh

- Logo thật: `public/images/brand/queen-ginseng-logo.png`; bản crop trung thành dùng trên header/favicon.
- G8 đang dùng: `public/images/products/g8/g8-open-box-clean.webp`; đã cắt bỏ hàng thông tin Sunart phía trên bằng thao tác crop từ ảnh gốc, không chỉnh sửa nội dung bao bì. File `g8-open-box.webp` được giữ lại để đối chiếu; gallery đã sẵn kiến trúc nhiều ảnh nhưng hiện chỉ có một ảnh đúng quy cách được công khai.
- Dấu ấn thương hiệu: ảnh trong `public/images/brand-awards/2026/`, tách khỏi hồ sơ chất lượng.
- QR: `public/images/payment/mb-bank-qr.png`, giữ nguyên nội dung.
- G7: `public/images/future/g7/preview.webp`, asset tương lai, không xuất hiện trong catalog.
- Ảnh lễ trao danh hiệu có tên doanh nghiệp khác không được đưa lên website.

## 9. Tài liệu

- Hồ sơ G8: `public/docs/g8/ho-so-bot-tra-sam-nu-hoang-g8.pdf`.
- Nghiên cứu: hai PDF tại `public/docs/research/`, có cảnh báo phạm vi mẫu thử.
- Tin ngoài về sâm Ngọc Linh luôn được ghi rõ là nguồn tham khảo ngoài, không dùng làm bằng chứng cho Sâm Nữ Hoàng.

## 10. SEO và khả năng truy cập

Đã có metadata, canonical, Open Graph, logo favicon, robots, sitemap, nhãn tiếng Việt, skip link, focus state, aria-label và trạng thái sao chép.

## 10.1. Nâng cấp giao diện

- Đã áp dụng design system Premium Botanical Minimal Editorial tại `design-system/queen-ginseng-vietnam/MASTER.md`.
- Giữ Arial cho nội dung, Cambria/Georgia cho tiêu đề và đúng palette xanh–ivory–gold.
- Chuẩn hóa nút/touch target tối thiểu 44 px, focus-visible, trạng thái nhấn, khoảng trắng, card, bóng đổ và chuyển động nhẹ có hỗ trợ reduced motion.
- Nâng cấp hero, dải thông tin tin cậy, card minh bạch, header desktop/mobile và footer; không thêm claim hoặc dữ liệu sản phẩm mới.

## 11. Kiểm tra lần triển khai trước

- TypeScript: đạt.
- Ghi chú: repository hiện không có cấu hình hoặc script ESLint độc lập, nên không coi đây là một kiểm tra đã chạy cho lần tối ưu mới.
- Production build/static export: đạt, 16 tuyến được tạo tĩnh.
- GitHub Pages: đã chuyển sang nguồn GitHub Actions; website công khai nhận đúng static export thay vì trang README.
- Rà chuỗi G8 cũ và claim y tế trong mã giao diện: không tìm thấy.
- Định dạng giá: 480.000 ₫; 2 hộp = 960.000 ₫.

## 12. Dữ liệu còn cần cung cấp

Hotline, email khách hàng, Zalo, Facebook, TikTok; tồn kho; phí giao hàng; ngưỡng miễn phí; chính sách đổi trả/bảo mật; chính sách đại lý; SKU; thời gian ghi nhận và giữ hoa hồng; mức rút tối thiểu; điều kiện đơn đầu tiên.

## 13. Ảnh còn cần

Ảnh thương mại chính thức mặt trước, mặt sau, đáy hộp và cận cảnh nhãn G8. Hiện không nhân bản hoặc bịa thêm góc ảnh.

## 14. Giới hạn và bước chuyển production

Đây là demo cục bộ, không có xác thực thật, backend, database, webhook hay chi trả. Kế hoạch chuyển đổi nằm trong `PRODUCTION_MIGRATION.md`; giá, hoa hồng, quyền hưởng và số dư phải được máy chủ tính lại, không tin dữ liệu trình duyệt.

## 15. Tối ưu giao diện bán G8 — 23/09/2026

### File đã sửa

`app/page.tsx`, `app/globals.css`, `app/san-pham/bot-tra-sam-nu-hoang-g8/page.tsx`, `app/gio-hang/page.tsx`, `app/thanh-toan/page.tsx`, `components/site-header.tsx`, `components/cart-button.tsx`, `components/product-gallery.tsx`, `components/product-purchase.tsx`, `components/ui/sheet.tsx`, `components/account-shell.tsx`, `components/auth-card.tsx`, `lib/products.ts`, `RUN_REPORT.md`.

### File đã thêm

`components/site-footer.tsx` dùng chung cho trang chủ, G8, giỏ hàng và checkout. `scripts/preview-static.mjs` xem bản xuất dưới đúng GitHub Pages base path. `scripts/audit-export.mjs` rà tuyến, ảnh, tài liệu, neo và dữ liệu G8 trong bản xuất.

### Cải thiện cụ thể

- Hero đặt G8, ảnh đầy đủ, giá và nút mua lên đầu. Ở khung 390 px, ảnh bắt đầu khoảng 272 px từ đầu tài liệu; trang chủ giảm từ khoảng 11.500 px xuống khoảng 5.700 px. Giữ màu xanh, kem, vàng và font thân Arial. Giảm menu còn năm mục.
- Gỡ dải thông tin lặp, ảnh G8 lặp và khối 5% lớn khỏi trang chủ. Phần hồ sơ và nghiên cứu ở homepage dẫn về đúng mục chi tiết của trang G8; giải thưởng, nghiên cứu nguyên liệu và bài báo ngoài vẫn được phân biệt rõ.
- Trang G8 dùng ảnh `object-contain`, ẩn SKU `null`, bỏ tình trạng hàng chưa rõ; nội dung dài dùng `details/summary` thao tác được bằng bàn phím; bảng dinh dưỡng dùng bảng ngữ nghĩa.
- Footer nhất quán. Kênh liên hệ và chính sách chưa xác nhận được ghi là đang cập nhật; không còn nút đăng ký đại lý dẫn đến placeholder.
- Checkout ghi rõ bản trải nghiệm ở đầu trang. Khi chưa biết phí giao hàng, chỉ hiển thị **tạm tính tiền hàng**. Từ giai đoạn nhận đơn Google Sheets, QR được ẩn khỏi checkout cho đến khi có luồng xác nhận giao dịch thật; trang không nhận tiền, không gửi đơn thật hoặc xác nhận chuyển khoản. Tài khoản/hoa hồng có cảnh báo dữ liệu cục bộ.

### UI/UX Pro Max đã ảnh hưởng thế nào

Giữ design system `design-system/queen-ginseng-vietnam/MASTER.md`, áp dụng ưu tiên nội dung chính trên mobile, một CTA chính trong hero, kích thước nút chạm lớn, giữ tỉ lệ ảnh, focus rõ, cấu trúc tiêu đề dễ đọc và phần thông tin dài mở theo nhu cầu. `quick-reference.md` được dùng để rà tương tác, layout, khả năng truy cập và nội dung chi tiết.

### Kiểm tra lần này

- `tsc --noEmit`: đạt.
- `next build` với cấu hình GitHub Pages: đạt, 16 tuyến static export.
- `node scripts/audit-export.mjs`: đạt, 371 tham chiếu nội bộ (trang, ảnh, PDF, neo), quét nội dung công khai, JSON-LD G8 và không bịa tồn kho/SKU.
- Đo không tràn ngang ở 375, 390, 768, 1024, 1440 px trên homepage, trang G8, checkout.
- Bấm trang chủ → G8, thêm giỏ, tăng lên hai hộp, giỏ → checkout; 1 hộp 480.000 ₫, 2 hộp 960.000 ₫. Tải trực tiếp trang G8 dưới base path thành công. Sau lần kiểm tra đó, QR đã được rút khỏi checkout cho đến khi luồng thanh toán vận hành thật được cấu hình.
- Ảnh trước/sau đã được quan sát ở desktop và mobile trong lượt làm việc. Chưa đo Lighthouse hoặc kiểm toán WCAG tự động.

### Còn là demo và cần chủ website cung cấp

Tài khoản, đơn hàng, hoa hồng, quản trị và rút tiền vẫn chỉ lưu trên từng trình duyệt, không xác thực thật. Cần hotline/email khách hàng, kênh tiếp nhận đại lý, phí và điều kiện giao hàng, đổi trả, bảo mật, tồn kho và ảnh sản phẩm nhiều góc được duyệt. Chỉ bật nhận đơn và hướng dẫn chuyển khoản sau khi có backend, quy trình xác nhận đơn/giao dịch và chính sách được chốt. QR doanh nghiệp đang được giữ làm asset public và chưa hiển thị trong checkout; không đưa khách vào tình huống chuyển tiền khi chưa có quy trình vận hành thật.

## 16. Nền tảng nhận đơn Google Sheets — 26/09/2026

### Đã thực hiện

- Kiểm tra Google Sheet `Thông tin đặt hàng trên web Queen Ginseng`: giữ nguyên tab `Trang tính1`, tạo tab vận hành riêng và không có dữ liệu khách hàng cũ cần chuyển đổi.
- Tạo các tab: `Products`, `Customers`, `Orders`, `OrderItems`, `InventoryTransactions`, `Payments`, `Refunds`, `Partners`, `Referrals`, `CommissionTransactions`, `WalletTransactions`, `WithdrawalRequests`, `Notifications`, `AnalyticsDaily`, `AuditLog`.
- Đặt header, hàng tiêu đề cố định và filter cho các tab. G8 được khai báo trong `Products` với giá 480.000 VND, 30 gói, 15 g/gói, 450 g và trạng thái công khai.
- Thêm `lib/commerce-api.ts` và `public/config/commerce.json`. Checkout giờ cho khách gửi yêu cầu mà không cần tài khoản demo, kiểm tra dữ liệu, giữ idempotency key khi thử lại và chỉ hiển thị mã đơn sau phản hồi hợp lệ của server.
- Thêm `backend/worker/` làm lớp kiểm tra request/CORS; giới hạn tần suất xử lý ở Apps Script; secrets chỉ được giữ trên Cloudflare Worker/Apps Script, không nằm trong GitHub Pages.
- Thêm `backend/apps-script/Code.gs`: kiểm tra dữ liệu, lấy giá G8 từ Sheet, khóa ghi đồng thời bằng `LockService`, chống ghi trùng theo idempotency key, lọc công thức Sheet và ghi Order/OrderItems/AuditLog theo cùng một luồng.

### Trạng thái thật

Chưa có Cloudflare Worker URL, Apps Script deployment URL hoặc secrets được cấu hình nên `ordersEnabled` đang là `false`. Website không nhận đơn thật và không hiển thị QR thúc đẩy chuyển tiền ở checkout. Các trang tài khoản, hoa hồng, ví, rút tiền và `/demo-admin` vẫn là dữ liệu demo cục bộ; chúng không được xem là dữ liệu vận hành.

### Các việc tiếp theo cần cấu hình

1. Tạo/triển khai Apps Script và Cloudflare Worker theo `backend/README.md`.
2. Cập nhật URL Worker vào `public/config/commerce.json`, sau đó chạy một đơn thử tách biệt.
3. Chốt email quản trị, tồn kho ban đầu, phí giao hàng, quy tắc hoàn tiền, xác thực tài khoản và quy tắc hoa hồng/rút tiền.
4. Chỉ sau đó mới mở tài khoản thật, quản trị, thanh toán thủ công, email, ví và hoa hồng.
