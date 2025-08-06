Dự án này gồm 3 phần:
- ESP32 gửi trạng thái thiết bị và thời gian thực lên server.
- Backend Node.js nhận và lưu dữ liệu vào MongoDB.
- Frontend hiển thị dữ liệu từ MongoDB ra giao diện web.

---

## 🔧 Yêu cầu hệ thống

- VS Code đã cài:
  - Extension PlatformIO hoặc Arduino
  - Node.js (>=18)
  - Git (tùy chọn)
- Thiết bị: ESP32 + WiFi
- MongoDB: 
  - Dùng [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (miễn phí) hoặc local

---

## 1️⃣ ESP32: Gửi dữ liệu lên Web Server

### Cài đặt

1. Cài `Arduino IDE` hoặc dùng PlatformIO trên VS Code.
2. Cài thư viện cần thiết trong Arduino:
   - `WiFi.h`
   - `HTTPClient.h`

### Mã nguồn (`esp32/esp32_send_data.ino`)
