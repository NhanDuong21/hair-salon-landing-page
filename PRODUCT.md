# Sol. Hair Studio

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Người dùng chọn Next.js App Router, TypeScript và Tailwind CSS. Chạy local trong repository này; không commit, push hoặc deploy.

## Users

Khách muốn đến một salon để cắt, tạo kiểu và chăm sóc tóc. Khách cần xem phong cách, dịch vụ, giá, thời lượng, người thực hiện và cách đặt lịch trước khi đến tiệm. Giao diện tiếng Việt, phục vụ trên cả điện thoại và desktop, không giới hạn cho nam.

## Product Purpose

Bản concept cá nhân độc lập giúp hình dung trải nghiệm salon. Hành động chính là “Đặt lịch”. Đây không phải sản phẩm quản lý salon, marketplace hoặc quyết định kiến trúc cho project nhóm.

## Operating Context

Nghiệm thu qua ứng dụng chạy thật, thao tác trình duyệt và ảnh chụp thực tế ở 375, 430, 768 và 1440 px. Kiểm tra build, lint, typecheck và hành vi tương tác.

## Capabilities and Constraints

- Một trang: header/menu mobile, hero, khoảng 6 dịch vụ có giá và thời lượng hiện ngay, 3 nhân sự mẫu, gợi ý kiểu tóc, không gian, thông tin ghé tiệm, 4 FAQ và CTA cuối trang.
- Một trải nghiệm đặt lịch demo dùng chung: dịch vụ → nhân sự, ngày/giờ mẫu → tóm tắt; cho phép quay lại sửa, có “Để salon sắp xếp”, điền sẵn từ dịch vụ/nhân sự trên trang.
- Dữ liệu dùng chung cho trang và booking. Lịch mẫu luôn ở tương lai; đổi lựa chọn phải loại bỏ giờ không còn phù hợp. Có trạng thái giờ khả dụng và không khả dụng.
- Không thu thông tin cá nhân, không API/database, không lưu lịch, không gửi dữ liệu, email hoặc thanh toán. Tóm tắt phải nói rõ chưa tạo lịch hẹn.
- Giữ nội dung giới thiệu render server/tĩnh; chỉ các phần tương tác cần client component. Metadata tiếng Việt và noindex, không schema doanh nghiệp hoặc đánh giá giả.
- Nội dung thương hiệu, dịch vụ, nhân sự và ảnh phải dễ thay. Không số điện thoại, địa chỉ doanh nghiệp thật, link gọi/Zalo/bản đồ giả, testimonial hoặc thành tích tự tạo.

## Brand Commitments

Art direction 2026-09-10: the user's new brief authorizes richer desktop photo motion, seven sourced additions and changed desktop photo layouts. “Moving photographic frames in space”: layered hero, short pinned 3D gallery, opposing vertical space ribbons. Retain the white/green Sol identity, typography, service truth, demo limits, all existing QA fixes and accepted mobile/booking behavior. Full motion requires a wide screen, fine pointer and no reduced-motion preference, with pause control and capability-gated assets. This explicitly supersedes older motion-only and no-new-image constraints below.

Refine 2026-09-08: người dùng đã chốt hướng Sol hiện tại, chưa nghiệm thu tương tác. Giữ wordmark, màu, serif và bảng dịch vụ; thống nhất ảnh/crop, tiêu đề thao tác trực tiếp, ghi chú concept gọn, nửa cuối trang ngắn hơn. Mobile chỉ có CTA hero khi ở đầu trang; bar xuất hiện sau CTA hero, ẩn ở CTA cuối/menu/booking. Bộ ảnh mobile một ảnh lớn trên hai ảnh nhỏ, caption dưới ảnh. Motion có mục đích và đường reduced motion; nghiệm thu bổ sung video desktop/mobile thật. Không redesign hoặc thêm section/nghiệp vụ.

Tên tạm “Sol. Hair Studio”; lời văn tự nhiên, ngắn gọn, cụ thể. Brief đã chốt nền trắng chủ đạo, chữ gần đen và xanh lá trầm tiết chế; không dark mode, nền kem/vàng chủ đạo, gradient, kính hoặc hiệu ứng phô diễn. Người dùng giao agent tự quyết định chi tiết thiết kế và triển khai, không mở thêm vòng chọn màu/font/bố cục.

## Evidence on Hand

Chưa có ảnh hoặc nội dung vận hành thực tế của thương hiệu. Tất cả dữ liệu kinh doanh là minh họa. Ảnh phải có nguồn và quyền sử dụng phù hợp, lưu tối ưu trong project khi được phép, ghi nguồn/điều kiện sử dụng và chú thích minh họa ngay tại phần liên quan. Nhân vật trong ảnh không được ngụ ý là nhân viên thật.

## Product Principles

1. Khách tìm được dịch vụ, giá, thời lượng và CTA sớm.
2. Hiểu rõ demo không tạo hay giữ chỗ thật.
3. Dữ liệu nhất quán giữa nội dung và tương tác.
4. Ảnh và chữ giúp hiểu salon; không thêm tuyên bố không có bằng chứng.

## Accessibility & Inclusion

HTML semantic, tiếng Việt đầy đủ, focus dễ thấy, menu sử dụng bằng bàn phím, dialog có nhãn và quản lý focus, Escape để đóng và trả focus. Tôn trọng reduced motion, không tràn ngang, nội dung đọc được trước khi JavaScript sẵn sàng. Nếu có CTA mobile cố định, chừa safe area và ẩn khi booking mở.
