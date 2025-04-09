const express = require("express");
const app = express();
const cors = require("cors");

app.use(cors({
    origin: "http://localhost:3000",
    credentials: true,
}));

require("dotenv").config();
require("./config/mongoose");

const port = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Import and use the GNS3 routes
const gns3Routes = require("./routes/gns3.routes");
app.use("/api/gns3", gns3Routes);

app.listen(port, () => console.log(`🚀 Server running on port: ${port}`));