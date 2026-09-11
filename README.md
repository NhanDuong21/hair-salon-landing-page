# Sol. Hair Studio

Landing page salon tiếng Việt, Next.js App Router + TypeScript + Tailwind CSS. Thương hiệu và dữ liệu minh họa; bản concept cá nhân độc lập.

## Chạy local

Node.js 20.9 trở lên; đã kiểm tra với Node 24.15 và npm.       

```sh
npm ci
npm run dev
```

Mở **http://127.0.0.1:3000**. Nếu cổng bận, xem URL Next.js in trong terminal. Font được tải lúc dev/build rồi phục vụ từ local; lần build đầu cần truy cập Google Fonts.      

Xem bản static export: `npm run build`, sau đó `npm start`. Lệnh start phục vụ thư mục `out/` tại localhost:3000; có thể đổi cổng bằng biến `PORT`. Đây là máy chủ preview local. Cấu hình xuất GitHub Pages và tiền tố repository được giữ nguyên.

## Phạm vi demo

- 6 dịch vụ có giá/thời lượng, 3 nhân sự giả lập, ảnh phong cách, không gian, thông tin ghé tiệm và FAQ.
- CTA dùng chung dialog: dịch vụ → người/ngày/giờ → xem lại. Điền sẵn từ dịch vụ hoặc nhân sự.
- Lịch mẫu bắt đầu ngày mai theo giờ Việt Nam; không kết nối lịch thực tế. Đổi dịch vụ, người hoặc ngày sẽ xóa giờ đã chọn. Quay lại giữ lựa chọn; đóng rồi mở lại bắt đầu phiên mới, chỉ điền sẵn theo nút vừa bấm. Màn xem lại có khoảng bắt đầu–kết thúc dự kiến và giữ “Từ” cho giá khởi điểm.
- Không tạo/giữ lịch, thu thông tin cá nhân, lưu browser storage, gửi dữ liệu/email hay thanh toán. Không backend, tài khoản, database hoặc API booking.
- Nội dung chính render tĩnh; client component dành cho menu/booking và chuyển động ảnh một lần. Có noindex, metadata tiếng Việt, favicon, font tự host và ảnh WebP local.
- Header mobile chỉ có logo/menu. Thanh đặt lịch xuất hiện sau CTA hero, ẩn ở CTA cuối hoặc khi mở menu/booking. Gallery mobile dùng một ảnh lớn, hai ảnh nhỏ; caption dưới từng ảnh.
- Motion dùng CSS và Web Animations, không thêm thư viện. Hero 650ms, phản hồi nút 160ms, ảnh xuất hiện 380ms một lần, FAQ 240ms, dialog mở 240ms/đóng 160ms/chuyển bước 180ms. Reduced motion bỏ dịch chuyển trang trí, giữ trạng thái chọn/mở/đóng.
- Địa điểm, chính sách, giá và nhân sự không đại diện một salon đang hoạt động.

Đổi nội dung tại `lib/salon.ts`, lịch mẫu tại `lib/booking.ts`, bố cục tại `app/page.tsx`, màu và responsive tại `app/globals.css`.

## Kiểm tra

```sh
npm run build
npm run lint
npm run typecheck
npm test
```

9 unit tests kiểm tra bước bắt buộc, đổi lựa chọn, giờ không khả dụng, giới hạn giờ đóng cửa, khoảng bắt đầu–kết thúc, nhãn ngày hai dòng, chuyển năm và năm nhuận theo giờ Việt Nam.

Bằng chứng vòng đầu tại [`evidence/`](evidence/), gồm ảnh 375, 430, 768, 1440px, menu và booking. Các file `browser-checks.json`, `checks.txt`, `final-review.md` ở thư mục này thuộc vòng đầu; bộ mới nằm trong `refine/` bên dưới. Ảnh ghép giữ nguồn viewport, tọa độ cuộn và script để đối chiếu; thanh cuộn lặp trong ảnh ghép không phải nội dung trang.

**Vòng refine 08/09/2026:** bằng chứng mới tại [`evidence/refine/`](evidence/refine/), gồm toàn trang ở bốn chiều rộng trên, ảnh ba bước booking và video thao tác desktop/mobile. Ảnh và video lấy từ compositor của trình duyệt Chromium đang chạy bản static export. Toàn trang ghép từ viewport và tọa độ cuộn thật, bỏ các dải header/bar lặp ở mối nối; video giữ timestamp thực, không tăng/giảm tốc. `prepare-evidence.mjs` tái ghép/xuất từ các khung gốc. Xem báo cáo `review-notes.md` và kết quả review độc lập `final-review.md`. Các thư mục evidence đã được repository cấu hình bỏ qua trong Git.

Thao tác trình duyệt đã kiểm tra: điều hướng/menu/FAQ, các CTA, điền sẵn, chọn ngày/giờ, sửa lựa chọn, Escape, Tab/Shift+Tab, trả focus, ảnh/liên kết, console và nội dung khi tắt JavaScript. Không phải báo cáo Lighthouse hoặc kiểm tra Safari/Firefox/điện thoại thật.

Bằng chứng final polish 10/09/2026 tại [`evidence/final-polish-2026-09-10/report.md`](evidence/final-polish-2026-09-10/report.md): ảnh các trạng thái booking, số đo trước/sau, video thao tác desktop/mobile và phạm vi QA thực tế. Lượt này giữ nguyên hướng thiết kế, ảnh, font, màu và motion; sửa nội dung booking đã chốt cùng lỗi khung nhảy bước ở mobile 430×932. Kiểm tra thêm màn hình thấp 375×568 và 1440×600.

## Skills

Trong `.agents/skills/`: **Impeccable 4.2.2**, **vercel-react-best-practices**, **web-design-guidelines**, từ [Impeccable](https://github.com/pbakaus/impeccable) và [Vercel Agent Skills](https://github.com/vercel-labs/agent-skills). Đã dùng context/init theo brief, thiết kế trực tiếp, critique độc lập, audit và polish. Người dùng xác nhận trust hook trong phiên triển khai; không tự phê duyệt thay người dùng.

`PRODUCT.md` ghi bối cảnh; `DESIGN.md` ghi thiết kế đã triển khai. Không commit, push hoặc deploy trong nhiệm vụ này.

## Nguồn ảnh và font

8 ảnh tải từ trang chính thức, tối ưu WebP trong `public/images/`, theo [Pexels License](https://www.pexels.com/license/) và [Unsplash License](https://unsplash.com/license). Có chú thích minh họa; không ngụ ý người/thương hiệu trong ảnh bảo chứng cho Sol. Ảnh không phải nhân viên, khách, tác phẩm hay mặt bằng thật của Sol.

| Ảnh | Tác giả và trang nguồn |
| --- | --- |
| Hero | [Alexander Mass](https://www.pexels.com/photo/woman-getting-hair-styled-at-salon-29498301/) |
| Không gian | [Daniel / Unsplash](https://unsplash.com/photos/a-room-with-a-chair-sink-and-a-plant-in-it-Ui6DZ9A1eXU) |
| Bob | [Anna Tarazevich](https://www.pexels.com/photo/a-woman-looking-at-the-camera-4927365/) |
| Sóng nhẹ | [光术 山影](https://www.pexels.com/photo/portrait-of-woman-with-brown-hair-19115784/) |
| Màu tóc | [Brian Jess Ragaza](https://www.pexels.com/photo/woman-with-brown-hair-18939542/) |
| Nhân sự An | [cottonbro studio](https://www.pexels.com/photo/portrait-of-a-woman-in-brown-shirt-10209448/) |
| Nhân sự Linh | [cottonbro studio](https://www.pexels.com/photo/woman-in-knitter-sweater-posing-7760229/) |
| Nhân sự Minh | cottonbro studio, ảnh 10204120 trong bộ [portrait of man](https://www.pexels.com/photo/portrait-of-man-10204122/) |

Manifest: `public/images/sources.json`; crop và object-position từng breakpoint tại `public/images/refine-assets.json`; mỗi WebP có sidecar nguồn. `scripts/prepare-assets.mjs <thư-mục-ảnh-gốc> --check` kiểm tra tái xuất giống byte; tên file gốc và cách dùng tại [`scripts/ASSETS.md`](scripts/ASSETS.md). Không cần chạy khi cài dự án.

Font **Be Vietnam Pro** và **Noto Serif**, [Google Fonts](https://fonts.google.com/), SIL Open Font License; hỗ trợ tiếng Việt, được `next/font` tự host cùng ứng dụng.

Favicon Sol do người dùng bổ sung và xác nhận dùng trong phiên làm việc. Giữ bản gốc tại `assets/brand/sol-original.png`; `app/icon.png` là bản tối ưu 128px, `app/favicon.ico` là bản dự phòng cùng hình ảnh. Không áp dụng giấy phép Pexels cho logo này.



