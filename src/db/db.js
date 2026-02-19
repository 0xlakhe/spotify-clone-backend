const mongoose = require("mongoose");

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected");
  } catch (err) {
    res.status(400).json({
      message: "Unable to onnect",
    });
  }
}

module.exports = connectDB;
