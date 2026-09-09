const assetBasePath = process.env.GITHUB_REPOSITORY
  ? `/${process.env.GITHUB_REPOSITORY.split("/")[1]}`
  : "";

export const salon = {
  name: "Sol. Hair Studio",
  description:
    "Xem dịch vụ, giá và thời lượng. Chọn người thực hiện và thời gian phù hợp trước khi đến tiệm.",
  hours: "09:00 – 20:00",
  area: "Khu vực Thảo Điền, TP. Hồ Chí Minh",
};

export const services = [
  {
    id: "cut",
    name: "Cắt & tạo dáng",
    description: "Tư vấn dáng tóc, cắt và sấy vào nếp.",
    price: 250000,
    from: false,
    duration: 60,
    category: "Cắt tóc",
  },
  {
    id: "wash",
    name: "Gội & thư giãn",
    description: "Làm sạch tóc, massage da đầu và sấy khô.",
    price: 150000,
    from: false,
    duration: 45,
    category: "Chăm sóc",
  },
  {
    id: "care",
    name: "Chăm sóc phục hồi",
    description: "Bổ sung độ ẩm cho mái tóc khô, thiếu sức sống.",
    price: 350000,
    from: true,
    duration: 75,
    category: "Chăm sóc",
  },
  {
    id: "style",
    name: "Sấy & tạo kiểu",
    description: "Vào nếp tự nhiên hoặc tạo kiểu cho dịp riêng.",
    price: 200000,
    from: false,
    duration: 45,
    category: "Tạo kiểu",
  },
  {
    id: "perm",
    name: "Uốn sóng tự nhiên",
    description: "Sóng mềm, độ phồng vừa vặn với gương mặt.",
    price: 850000,
    from: true,
    duration: 150,
    category: "Tạo kiểu",
  },
  {
    id: "color",
    name: "Nhuộm màu",
    description: "Tông màu dễ diện, tư vấn theo nền tóc hiện tại.",
    price: 750000,
    from: true,
    duration: 120,
    category: "Màu tóc",
  },
] as const;

export const stylists = [
  {
    id: "an",
    name: "An",
    role: "Cắt & tạo dáng",
    description: "Dáng cắt gọn, dễ chăm mỗi ngày.",
    image: `${assetBasePath}/images/stylist-an.webp`,
  },
  {
    id: "linh",
    name: "Linh",
    role: "Màu tóc & chăm sóc",
    description: "Tông màu tự nhiên, mái tóc mềm khỏe.",
    image: `${assetBasePath}/images/stylist-linh.webp`,
  },
  {
    id: "minh",
    name: "Minh",
    role: "Uốn & tạo kiểu",
    description: "Sóng nhẹ và độ phồng vừa đủ.",
    image: `${assetBasePath}/images/stylist-minh.webp`,
  },
] as const;

export type ServiceId = (typeof services)[number]["id"];
export type StylistId = (typeof stylists)[number]["id"] | "any";
export type BookingPreset = { serviceId?: ServiceId; stylistId?: StylistId };
const currency = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
});
export function formatPrice(price: number) {
  return currency.format(price);
}
export function priceLabel(service: (typeof services)[number]) {
  return `${service.from ? "Từ " : ""}${formatPrice(service.price)}`;
}

export const faqs = [
  {
    question: "Chưa biết chọn dịch vụ nào thì sao?",
    answer:
      "Bạn có thể thử “Cắt & tạo dáng” để khám phá luồng đặt lịch. Khi đến một salon thực tế, hãy trao đổi mong muốn và tình trạng tóc trước khi chốt dịch vụ.",
  },
  {
    question: "Có cần chọn người thực hiện không?",
    answer:
      "Không bắt buộc. Chọn “Để salon sắp xếp” nếu bạn chưa có người phù hợp; demo sẽ dùng lựa chọn đó trong phần xem lại.",
  },
  {
    question: "Giá “từ” và thời lượng được hiểu thế nào?",
    answer:
      "Giá khởi điểm tùy độ dài, nền tóc và kỹ thuật. Thời lượng là ước tính; cần trao đổi chi tiết trước khi thực hiện.",
  },
  {
    question: "Tôi có thể đổi hoặc hủy lịch không?",
    answer:
      "Bạn có thể quay lại sửa lựa chọn hoặc đóng demo bất cứ lúc nào. Chưa có lịch hẹn nào được tạo; bản concept chưa có chính sách đổi/hủy thực tế.",
  },
];
