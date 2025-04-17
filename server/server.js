const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

const DeviceMonitor = require("./services/deviceMonitor");
const gns3Routes = require("./routes/gns3.routes");
const alertRoutes = require("./routes/alertRoutes");

dotenv.config();
require("./config/mongoose");

const app = express();
const port = process.env.PORT || 5000;

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/gns3", gns3Routes);
app.use("/api/alerts", alertRoutes);

// Start monitoring
const monitor = new DeviceMonitor();
monitor.startMonitoring();

app.listen(port, () => console.log(`🚀 Server running on port: ${port}`));
