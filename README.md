# Queen Ginseng Vietnam

Frontend homepage thương mại điện tử cho **Công ty Cổ phần Queen Ginseng Việt Nam**.

## Trọng tâm hiện tại

- Sản phẩm chủ lực: Queen Ginseng G8 – Trà sâm hòa tan
- Quy cách hiện tại: 30 gói/hộp, 15 g/gói, khối lượng tịnh 450 g
- Giá bán lẻ: 480.000 VNĐ/hộp
- Dữ liệu sản phẩm tập trung tại `lib/products.ts`
- Giao diện 100% tiếng Việt
- Responsive cho desktop và mobile
- Các dữ liệu chưa được xác nhận được giữ ở dạng `[...]`
- Tài khoản, đơn hàng, giới thiệu một cấp, hoa hồng và rút tiền đang ở chế độ demo bằng `localStorage`
- Trang quản trị thử nghiệm: `/demo-admin`

## Chạy cục bộ

```bash
npm install
npm run dev
```

Kiểm tra bản tĩnh:

```bash
npm run build
```

Không dùng dữ liệu demo cho vận hành thật. Xem `PRODUCTION_MIGRATION.md` trước khi kết nối backend.

## GitHub Pages

Mỗi lần cập nhật nhánh `main`, workflow `deploy-pages.yml` sẽ build bản tĩnh và triển khai lên GitHub Pages.
