# Kế hoạch chuyển từ bản demo sang hệ thống thật

## Trạng thái hiện tại

Website là bản frontend tĩnh dành cho GitHub Pages. Tài khoản, phiên đăng nhập, đơn hàng, quan hệ giới thiệu, hoa hồng, sổ giao dịch và yêu cầu rút tiền đang được lưu bằng `localStorage` với tiền tố `qgv-demo-*`. Không có dữ liệu nào được gửi tới máy chủ, ngân hàng hoặc hệ thống vận hành thật.

## Kiến trúc đề xuất

- Backend Node.js với PostgreSQL hoặc MySQL.
- Xác thực và phiên đăng nhập an toàn ở phía máy chủ.
- Các bảng riêng cho người dùng, đơn hàng, quan hệ giới thiệu bất biến, hoa hồng, bút toán ví và yêu cầu rút tiền.
- Webhook/cổng quản trị để xác nhận thanh toán, hoàn tất hoặc hoàn trả đơn hàng.
- Phân quyền khách hàng, vận hành và quản trị; có nhật ký kiểm toán.

## Quy tắc bắt buộc ở máy chủ

Máy chủ phải tự tính và kiểm tra lại giá sản phẩm, giảm giá, phí giao hàng, giá trị đủ điều kiện hưởng hoa hồng, tỷ lệ hoa hồng, người thụ hưởng, điều kiện đơn hàng và số dư khả dụng. Không tin cậy bất kỳ giá trị hoa hồng, số dư hay trạng thái thanh toán nào do trình duyệt gửi lên.

Hoa hồng chỉ được giải phóng khi đơn đã hoàn tất và được duyệt. Hủy/hoàn đơn phải tạo bút toán đảo phù hợp. Yêu cầu rút tiền cần khóa số dư theo giao dịch nguyên tử để tránh chi trả trùng.

## Trước khi vận hành thật

- Chốt thời gian ghi nhận, thời gian giữ hoa hồng, mức rút tối thiểu, điều kiện đơn đầu tiên và chính sách hoàn/hủy.
- Chốt phí giao hàng, tồn kho, chính sách đổi trả và thông tin liên hệ.
- Kiểm thử bảo mật, phân quyền, chống gian lận giới thiệu và sao lưu dữ liệu.
- Tích hợp email/SMS, cổng thanh toán hoặc quy trình đối soát ngân hàng nếu được phê duyệt.
