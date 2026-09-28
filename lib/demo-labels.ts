const labels: Record<string,string> = {
 PENDING:"Chờ xử lý", CONFIRMED:"Đã xác nhận", SHIPPING:"Đang giao", COMPLETED:"Hoàn tất", CANCELLED:"Đã hủy", RETURNED:"Đã hoàn trả",
 AVAILABLE:"Khả dụng", APPROVED:"Đã duyệt", PAID:"Đã chi trả (mô phỏng)", REJECTED:"Đã từ chối",
 COMMISSION_PENDING:"Hoa hồng chờ duyệt", COMMISSION_RELEASE:"Duyệt hoa hồng", COMMISSION_CANCEL:"Hủy hoa hồng",
 WITHDRAWAL_REQUEST:"Giữ số dư cho yêu cầu rút", WITHDRAWAL_PAID:"Chi trả thử nghiệm", WITHDRAWAL_RELEASE:"Giải phóng khoản giữ",
};
export const statusLabel = (value:string) => labels[value] || "Chưa xác định";
