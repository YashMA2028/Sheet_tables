const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors"); // ✅ Import CORS

const app = express();

// ✅ Enable CORS for frontend access
app.use(cors({ origin: "http://localhost:3000" })); 

app.use(bodyParser.json());

mongoose.connect("mongodb://localhost:27017/Janakalyan_Bank", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Function to get a dynamic collection per user
const getUserCollection = (userId) => {
  return mongoose.connection.collection(userId);
};

// Save user data
app.post("/save_to_mongo/", async (req, res) => {
  const { userId, data } = req.body;

  if (!userId || !data) {
    return res.status(400).json({ message: "User ID and data are required." });
  }

  try {
    const userCollection = getUserCollection(userId);
    const timestamp = new Date().toISOString();

    const record = { _id: timestamp, data, timestamp: new Date() };
    await userCollection.insertOne(record);

    res.status(200).json({ message: "Data saved successfully", recordId: timestamp });
  } catch (error) {
    res.status(500).json({ message: "Error saving data", error });
  }
});

// Get user records
app.get("/get_user_records/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const userCollection = getUserCollection(userId);
    const records = await userCollection.find({}).toArray();

    res.status(200).json(records);
  } catch (error) {
    res.status(500).json({ message: "Error fetching records", error });
  }
});

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
