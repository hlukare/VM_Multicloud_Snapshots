require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const { createSnapshots, getSnapshots, getSnapshotsByInstanceId } = require('./snapshotService');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
// mongoose.connect(process.env.MONGODB_URI, {
//   dbName: process.env.DB_NAME,
//   useNewUrlParser: true,
//   useUnifiedTopology: true
// })
// .then(() => console.log('Connected to MongoDB'))
// .catch(err => console.error('MongoDB connection error:', err));

// Database connection
mongoose.connect(process.env.MONGODB_URI, {
  dbName: process.env.DB_NAME,
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));


// Routes
app.post('/api/snapshot', async (req, res) => {
  try {
    const { instanceId, region } = req.body;
    
    if (!instanceId || !region) {
      return res.status(400).json({ error: 'instanceId and region are required' });
    }

    const result = await createSnapshots(instanceId, region);
    res.status(201).json(result);
  } catch (error) {
    console.error('Error creating snapshots:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/snapshots', async (req, res) => {
  try {
    const snapshots = await getSnapshots();
    res.json(snapshots);
  } catch (error) {
    console.error('Error fetching snapshots:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/snapshots/:instanceId', async (req, res) => {
  try {
    const { instanceId } = req.params;
    const snapshots = await getSnapshotsByInstanceId(instanceId);
    res.json(snapshots);
  } catch (error) {
    console.error('Error fetching snapshots by instanceId:', error);
    res.status(500).json({ error: error.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});