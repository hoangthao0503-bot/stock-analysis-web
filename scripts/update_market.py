import json
import os
import sys
from datetime import datetime

def fetch_data():
    try:
        from vnstock_data import Reference
    except ImportError:
        print("Lỗi: Không tìm thấy thư viện 'vnstock_data'.")
        print("Vui lòng cài đặt thông qua hướng dẫn của Vnstock (Reference Layer V3).")
        sys.exit(1)

    print("Khởi tạo kết nối Reference API...")
    ref = Reference()

    print("Đang tải danh sách thành viên VN30...")
    try:
        # Giả sử cấu trúc DataFrame row trả về chứa thông tin
        vn30 = ref.index.members("VN30")
        symbols = vn30['symbol'].tolist() if 'symbol' in vn30.columns else vn30.index.tolist()
    except Exception as e:
        print(f"Lỗi khi lấy vn30: {e}")
        symbols = ["BID", "TCB", "FPT", "VHM", "VPB"] # Fallback test list

    market_data = []
    
    for sym in symbols[:10]: # Lấy top 10 để tránh timeout/chặn API trong lúc test
        print(f"-> Đang lấy dữ liệu Công ty: {sym}")
        try:
            # Lấy thông tin công ty chung
            info_df = ref.company(sym).info()
            # Lấy thông tin đầu tiên (record 0)
            record = info_df.iloc[0].to_dict() if not info_df.empty else {}
            
            market_data.append({
                "Symbol": sym,
                "Industry": record.get("industry", "Tài chính / Bất động sản / Dịch vụ"),
                "Summary": record.get("short_name", f"Công ty Cổ phần {sym}"),
                "FullReview": record.get("profile", f"Phân tích hệ thống tự động cho {sym}. Dữ liệu được kéo từ Vnstock Reference V3. Mã số doanh nghiệp: {record.get('tax_code', 'N/A')}"),
                "LastUpdated": datetime.now().strftime("%d/%m/%Y %H:%M")
            })
        except Exception as e:
            print(f"Không thể lấy profile {sym}: {e}")

    return market_data

def main():
    data_dir = os.path.join(os.path.dirname(__file__), "..", "public", "data")
    os.makedirs(data_dir, exist_ok=True)
    json_path = os.path.join(data_dir, "market_reference.json")

    print(f"Sẽ lưu dữ liệu vào: {json_path}")
    market_data = fetch_data()

    if market_data:
        with open(json_path, "w", encoding="utf-8") as f:
            json.dump(market_data, f, ensure_ascii=False, indent=2)
        print(f"Thành công! Đã lưu {len(market_data)} bản ghi vào {json_path}.")
    else:
        print("Thất bại. Không có dữ liệu đầu ra.")

if __name__ == "__main__":
    main()
