export type LegalDocument = {
  title: string;
  detail: string;
  href: string;
};

export type Product = {
  id: string;
  slug: string;
  legalName: string;
  name: string;
  subtitle: string;
  sku: string | null;
  price: number;
  currency: "VND";
  unitsPerBox: number;
  unitWeightGrams: number;
  netWeightGrams: number;
  shelfLifeMonths: number;
  images: { src: string; alt: string }[];
  ingredients: string[];
  usage: string[];
  targetUsers: string;
  storage: string[];
  cautions: string[];
  nutritionPer100g: { label: string; value: string }[];
  manufacturer: {
    name: string;
    address: string;
    standard: string;
    certificateNumber: string;
    issueDate: string;
  };
  legalDocuments: LegalDocument[];
};

export const g8Product: Product = {
  id: "g8",
  slug: "bot-tra-sam-nu-hoang-g8",
  legalName: "BỘT TRÀ SÂM NỮ HOÀNG G8",
  name: "Sâm Nữ Hoàng G8",
  subtitle: "Trà Sâm Hòa Tan",
  sku: null,
  price: 480000,
  currency: "VND",
  unitsPerBox: 30,
  unitWeightGrams: 15,
  netWeightGrams: 450,
  shelfLifeMonths: 18,
  images: [{ src: "/images/products/g8/g8-open-box-clean.webp", alt: "Hộp Sâm Nữ Hoàng G8 mở nắp cùng các gói trà sâm hòa tan" }],
  ingredients: [
    "Maltodextrin",
    "Bột sâm nữ hoàng",
    "Nano curcumin",
    "Chất tạo ngọt tổng hợp Isomalt (INS 953)",
    "Chất tạo ngọt tự nhiên (INS 960d)",
    "Hương liệu tổng hợp dùng cho thực phẩm",
  ],
  usage: [
    "Cho 1 gói (15 g) vào cốc.",
    "Thêm 150–200 ml nước nóng 80–90°C.",
    "Khuấy đều và thưởng thức.",
    "Uống 2 ly mỗi ngày.",
    "Uống ngay sau khi pha.",
  ],
  targetUsers: "Người từ 3 tuổi trở lên.",
  storage: [
    "Bảo quản ở nhiệt độ phòng, nơi khô mát và sạch sẽ.",
    "Tránh ánh nắng chiếu trực tiếp.",
    "Sử dụng theo hạn sử dụng ghi dưới đáy hộp.",
  ],
  cautions: [
    "Sau khi pha nên dùng hết trong vòng 1 giờ.",
    "Bỏ phần còn thừa sau khi uống.",
    "Không sử dụng sản phẩm khi hết hạn.",
    "Không sử dụng nếu sản phẩm có mùi vị lạ.",
    "Không sử dụng nếu mẫn cảm với bất kỳ thành phần nào.",
  ],
  nutritionPer100g: [
    { label: "Năng lượng", value: "297 kcal" },
    { label: "Chất đạm", value: "≤ 0,3 g" },
    { label: "Chất béo", value: "≤ 0,3 g" },
    { label: "Carbohydrat", value: "73 g" },
    { label: "Chất xơ", value: "0,4 g" },
    { label: "Đường tổng số", value: "2 g" },
    { label: "Natri", value: "19 mg" },
  ],
  manufacturer: {
    name: "CÔNG TY CỔ PHẦN RV NUTRITION VIỆT NAM",
    address: "Phượng Bãi, Phường Chương Mỹ, Thành phố Hà Nội, Việt Nam.",
    standard: "ISO 22000:2018",
    certificateNumber: "TQC.03.2652",
    issueDate: "15/05/2025",
  },
  legalDocuments: [
    { title: "Bản tự công bố sản phẩm", detail: "Số 04/QUEEN GINSENG/2026 · Trang 1–2", href: "/docs/g8/ho-so-bot-tra-sam-nu-hoang-g8.pdf#page=1" },
    { title: "Tiêu chuẩn nhà sản xuất", detail: "Số 15/TCSX-TSNHG8/2026 · Trang 3–8", href: "/docs/g8/ho-so-bot-tra-sam-nu-hoang-g8.pdf#page=3" },
    { title: "Kết quả kiểm nghiệm Eurofins", detail: "Báo cáo AR-26-VD-154679-01 · Trang 9–10", href: "/docs/g8/ho-so-bot-tra-sam-nu-hoang-g8.pdf#page=9" },
    { title: "Thông tin đơn vị sản xuất", detail: "Thể hiện trong hồ sơ sản phẩm", href: "/docs/g8/ho-so-bot-tra-sam-nu-hoang-g8.pdf#page=1" },
  ],
};

export const publicProducts = [g8Product];

// Future products – not public: G5, G6, G7.
