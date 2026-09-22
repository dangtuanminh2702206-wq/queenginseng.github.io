# Queen Ginseng Vietnam — Run report

## Nguồn dữ liệu G8

- Dữ liệu công khai của G8 được tập trung tại `lib/products.ts`.
- Giá: 480.000 ₫/hộp.
- Quy cách: 30 gói × 15 g; khối lượng tịnh 450 g.
- SKU để `null` vì chưa được xác nhận.
- Public catalog hiện chỉ có G8. G5, G6, G7 không được hiển thị.

## Phân loại tài liệu

### A. Hồ sơ sản phẩm G8

- `public/docs/g8/ho-so-bot-tra-sam-nu-hoang-g8.pdf`
- Gồm bản tự công bố số 04/QUEEN GINSENG/2026, tiêu chuẩn nhà sản xuất số 15/TCSX-TSNHG8/2026, mẫu nhãn và kết quả kiểm nghiệm Eurofins.
- Được liên kết tại homepage và mục “Hồ sơ sản phẩm” trên trang G8.

### B. Nghiên cứu nguyên liệu

- `public/docs/research/tai-lieu-tham-khao-nghien-cuu-sam-nu-hoang.pdf`
- `public/docs/research/phieu-kiem-nghiem-tinh-chat-sam-nu-hoang.pdf`
- Được trình bày tách khỏi hồ sơ G8, có ghi rõ kết quả chỉ áp dụng cho mẫu thử.

### C. Dấu ấn thương hiệu

- Ảnh sự kiện và chứng nhận tại `public/images/brand-awards/2026/`.
- Hiển thị như dấu ấn thương hiệu ngày 19/09/2026, không xếp vào hồ sơ chất lượng sản phẩm.

### D. Tin tức / kiến thức bên ngoài

- Bài Người Đưa Tin về sâm Ngọc Linh được dẫn bằng link gốc.
- Không dùng bài này làm bằng chứng cho Sâm Nữ Hoàng hoặc G8.

## Asset khác

- Ảnh G8 hiện tại: `public/images/products/g8/g8-open-box.webp`.
- G7 được lưu tại `public/images/future/g7/preview.webp` với trạng thái future product; không xuất hiện trong catalog public.
- QR doanh nghiệp: `public/images/payment/mb-bank-qr.png`; chỉ hiện khi chọn chuyển khoản tại checkout.

## Cart và checkout

- Cart dùng `localStorage`, đơn giá 480.000 ₫.
- 1 hộp = 480.000 ₫; 2 hộp = 960.000 ₫.
- Checkout có COD và chuyển khoản, nhưng không tạo đơn hoặc tự xác nhận giao dịch.

## Dữ liệu còn cần cung cấp

- Hotline bán hàng, email khách hàng, Zalo, Facebook, TikTok.
- Tình trạng tồn kho.
- Phí giao hàng và ngưỡng miễn phí.
- Chính sách đổi trả, bảo mật và điều khoản bán hàng.
- Chính sách NPP/đại lý/CTV.
- SKU chính thức.

## Ảnh cần bổ sung

- Ảnh thương mại mặt trước, mặt sau, đáy hộp và cận cảnh nhãn G8.
- Ảnh tách nền hoặc ảnh chụp studio G8 nếu cần thay mockup hiện tại.

## TODO

- Kết nối backend tạo đơn và xác nhận thanh toán khi có yêu cầu.
- Chỉ bật dữ liệu tồn kho trong structured data sau khi được xác nhận.
- Hoàn thiện các placeholder `[...]` sau khi nhận dữ liệu chính thức.
