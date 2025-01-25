const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');

// Initialize the express app
const app = express();

// Enable CORS for your frontend
app.use(cors());

// MongoDB connection URI
const uri = 'mongodb://localhost:27017';  // Update with your MongoDB connection string if different

// Database and collection
const dbName = 'Janakalyan_Bank';
const collectionName = 'Trial-1';

// MongoDB client
const client = new MongoClient(uri);

app.get('/api/data', async (req, res) => {
  try {
    // Connect to MongoDB
    await client.connect();
    console.log('Connected to MongoDB');

    // Get the database and collection
    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    // Fetch the data from the collection
    const data = await collection.find({}).toArray();

    // If data exists, return the first document (assuming it's an array of data)
    if (data.length > 0) {
      res.json(data[0]);  // Adjust based on your data structure
    } else {
      res.status(404).json({ message: 'No data found in the database' });
    }
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ message: 'Failed to fetch data from database' });
  } finally {
    // Close the connection
    await client.close();
  }
});

// Start the server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
