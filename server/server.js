const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// Initialize app
const app = express();
const server = http.createServer(app);

// Socket.io setup with CORS enabling
const io = socketIo(server, {
  cors: {
    origin: "*", // allow all for ease of deployment/testing
    methods: ["GET", "POST", "PUT", "DELETE"]
  }
});

// Save socket instance on app
app.set('io', io);

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' })); // Support base64 image uploads

// Database Connection
const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/mulla_db';
mongoose.connect(mongoUri)
  .then(() => console.log('Successfully connected to MongoDB Database'))
  .catch(err => console.error('MongoDB database connection error:', err));

// Routes mounting
app.use('/api/admin', require('./routes/auth'));
app.use('/api/menu', require('./routes/menu'));
app.use('/api/orders', require('./routes/order'));

// Default route
app.get('/', (req, res) => {
  res.send('Mulla Fresh Juices & Fried Chicken API is running.');
});

// Socket connection handler
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
