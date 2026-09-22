# Queen Ginseng Vietnam — Master Design System

## Direction

**Premium Botanical Minimal Editorial**: sang trọng, tự nhiên, hiện đại và có nhiều khoảng thở. Giao diện ưu tiên hình ảnh G8, nội dung ngắn gọn và bằng chứng được phân loại đúng phạm vi. Không dùng phong cách website thuốc truyền thống, glassmorphism nặng, hiệu ứng màu mè hoặc bố cục dày đặc.

## Brand tokens

- Forest Green `#073D2B`: CTA chính, điểm nhận diện, nền khối quan trọng.
- Deep Green `#052C20`: tiêu đề, footer, nền tương phản cao.
- Gold `#C8A34A`: điểm nhấn có kiểm soát, không dùng cho đoạn chữ nhỏ trên nền trắng.
- Gold Text `#997B33`: nhãn nhỏ trên nền sáng, đạt độ tương phản tốt hơn.
- Warm Ivory `#F7F2E7`: nền chính.
- White `#FFFFFF`: bề mặt card.
- Body Muted `#587067`: nội dung phụ.
- Border `rgba(7, 61, 43, 0.12)`.

Tỷ lệ cảm giác: 60% ivory/white, 30% green, 10% gold.

## Typography

- Nội dung, điều hướng, biểu mẫu: Arial, Segoe UI, sans-serif.
- Tiêu đề editorial: Cambria, Georgia, Times New Roman, serif.
- Cỡ chữ nội dung tối thiểu 16px trên mobile; line-height 1.6–1.8 cho đoạn dài.
- Giá dùng số tabular. Tiêu đề dùng `text-wrap: balance`; nội dung dài dùng `overflow-wrap`.

## Layout and spacing

- Hệ khoảng cách theo bội số 8px; ngoại lệ 12px và 20px cho nhóm nhỏ.
- Container tối đa 1280px; lề mobile 20px, tablet/desktop 32–64px.
- Section spacing linh hoạt 72–128px desktop, 64–80px mobile.
- Card radius 20–32px; không trộn quá nhiều bán kính trong cùng một vùng.
- Mỗi màn hình chỉ có một CTA chính nổi bật.

## Components

- Button cao tối thiểu 44px; primary xanh, secondary outline, buy-now gold.
- Header sticky, nền ivory bán trong suốt; icon control tối thiểu 44×44px.
- Card mặc định viền mảnh, nền trắng, bóng nhẹ. Hover nâng tối đa 3px trong 200–250ms.
- Form luôn có label hiển thị, input cao tối thiểu 48px, focus ring vàng rõ.
- Hình ảnh luôn giữ tỉ lệ để tránh layout shift; chỉ hero/product-main dùng `priority`.

## Motion

- 150–250ms cho hover/focus, chỉ transform/opacity/color/shadow.
- Entrance animation dùng tiết chế ở hero.
- Tôn trọng `prefers-reduced-motion`.

## Accessibility and mobile

- Focus-visible outline không bị che bởi sticky header.
- Touch target tối thiểu 44px; pressed state rõ.
- Không dùng màu làm tín hiệu duy nhất.
- Không có horizontal overflow tại 375, 768, 1024 và 1440px.
- Table dài đặt trong vùng scroll ngang; menu mobile đóng sau khi chọn.

## Avoid

- Không dùng màu đen/nâu thay palette thương hiệu.
- Không đổi Arial ở phần nội dung.
- Không dùng Liquid Glass, gradient rực, glow, shadow dày hoặc animation phô trương.
- Không tạo sản phẩm giả, claim sức khỏe hoặc nội dung chưa được xác nhận.
- Không dùng giải thưởng thương hiệu như chứng nhận chất lượng G8.
