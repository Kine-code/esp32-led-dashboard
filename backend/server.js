const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const axios = require("axios");
const mongoose = require("mongoose");
const path = require("path");

const app = express();
const PORT = 3000;
const ESP32_IP = "http://192.169.11.199"; // ⚠️ IP của ESP32 trong mạng LAN

// ======= MongoDB: Kết nối tới database esp32db =======
mongoose.connect("mongodb://localhost:27017/esp32db", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ Đã kết nối MongoDB (esp32db)"))
.catch((err) => console.error("❌ Lỗi MongoDB:", err.message));

// ======= Định nghĩa schema và model cho log =======
const logSchema = new mongoose.Schema({
  led: String,
  state: String,
  timestamp: { type: Date, default: Date.now },
});

const Log = mongoose.model("Log", logSchema);

// ======= Middleware =======
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "../frontend"))); // đường dẫn tới frontend

// ======= Route: Gửi lệnh điều khiển tới ESP32 =======
app.post("/control", async (req, res) => {
  const { led, state } = req.body;

  try {
    // Gửi lệnh tới ESP32
    const response = await axios.post(`${ESP32_IP}/api/control`, { led, state });
    console.log("📡 Phản hồi từ ESP32:", response.data);

    // Nếu ESP32 phản hồi OK thì lưu log
    if (response.data.status === "OK") {
      await Log.create({ led, state }); // Mongo sẽ tự thêm timestamp
      console.log("📝 Đã lưu log:", { led, state });
    }

    res.json(response.data);
  } catch (error) {
    console.error("❌ Không gửi được tới ESP32:", error.message);
    res.status(500).json({ error: "ESP32 không phản hồi" });
  }
});

// ======= Route: Trả về 50 log mới nhất từ MongoDB =======
app.get("/api/logs", async (req, res) => {
  try {
    const latestLogs = await Log.find().sort({ timestamp: -1 }).limit(50);
    res.json(latestLogs);
  } catch (err) {
    console.error("❌ Lỗi khi lấy log:", err.message);
    res.status(500).json({ error: "Không thể lấy log từ MongoDB" });
  }
});

// ======= Route: Trả về giao diện điều khiển =======
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

// ======= Khởi động server =======
app.listen(PORT, () => {
  console.log(`✅ Backend đang chạy tại: http://localhost:${PORT}`);
});
