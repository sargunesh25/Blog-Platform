require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/blogdb";
mongoose.connect(MONGO_URI).then(() => {
  console.log("✅ Connected to MongoDB");
}).catch((err) => {
  console.error("❌ MongoDB connection error:", err.message);
  console.log("💡 Tip: Make sure MongoDB is running or set MONGO_URI in .env file");
});

const app = express();

// Enable CORS for all origins
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

app.use(express.json());

const logger = require("./Middleware/logger.js");
app.use(logger);


const { swaggerUi, swaggerSpec } = require("./swagger/swagerConfig");
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));


app.use("/auth", require("./routes/authroutes"));
app.use("/notes", require("./routes/notesroutes"));
app.use("/blogs", require("./routes/blogroutes"));


app.listen(3000, () => {
  console.log(`Server is running on port`);
});
