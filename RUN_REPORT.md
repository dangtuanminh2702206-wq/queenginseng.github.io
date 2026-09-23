# Queen Ginseng Vietnam — Báo cáo chạy

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
- Checkout ghi rõ bản trải nghiệm ở đầu trang. Khi chưa biết phí giao hàng, chỉ hiển thị **tạm tính tiền hàng**. QR thật nằm trong mục xem trước có cảnh báo ngay cạnh; trang không nhận tiền, không gửi đơn thật hoặc xác nhận chuyển khoản. Tài khoản/hoa hồng có cảnh báo dữ liệu cục bộ.

### UI/UX Pro Max đã ảnh hưởng thế nào

Giữ design system `design-system/queen-ginseng-vietnam/MASTER.md`, áp dụng ưu tiên nội dung chính trên mobile, một CTA chính trong hero, kích thước nút chạm lớn, giữ tỉ lệ ảnh, focus rõ, cấu trúc tiêu đề dễ đọc và phần thông tin dài mở theo nhu cầu. `quick-reference.md` được dùng để rà tương tác, layout, khả năng truy cập và nội dung chi tiết.

### Kiểm tra lần này

- `tsc --noEmit`: đạt.
- `next build` với cấu hình GitHub Pages: đạt, 16 tuyến static export.
- `node scripts/audit-export.mjs`: đạt, 371 tham chiếu nội bộ (trang, ảnh, PDF, neo), quét nội dung công khai, JSON-LD G8 và không bịa tồn kho/SKU.
- Đo không tràn ngang ở 375, 390, 768, 1024, 1440 px trên homepage, trang G8, checkout.
- Bấm trang chủ → G8, thêm giỏ, tăng lên hai hộp, giỏ → checkout; 1 hộp 480.000 ₫, 2 hộp 960.000 ₫. Tải trực tiếp trang G8 dưới base path thành công. QR tải được và cảnh báo xuất hiện khi mở mục xem trước.
- Ảnh trước/sau đã được quan sát ở desktop và mobile trong lượt làm việc. Chưa đo Lighthouse hoặc kiểm toán WCAG tự động.

### Còn là demo và cần chủ website cung cấp

Tài khoản, đơn hàng, hoa hồng, quản trị và rút tiền vẫn chỉ lưu trên từng trình duyệt, không xác thực thật. Cần hotline/email khách hàng, kênh tiếp nhận đại lý, phí và điều kiện giao hàng, đổi trả, bảo mật, tồn kho và ảnh sản phẩm nhiều góc được duyệt. Chỉ bật nhận đơn và hướng dẫn chuyển khoản sau khi có backend, quy trình xác nhận đơn/giao dịch và chính sách được chốt. QR doanh nghiệp vẫn là ảnh thật nên khách có thể quét nếu tự mở mục xem trước; cảnh báo không thay thế quy trình vận hành thật.
