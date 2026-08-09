const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB Atlas
const MONGODB_URI =  'mongodb+srv://capstone_user:6uxFf2dcByOKXEAA@cluster0.zmyvcma.mongodb.net/footprint_db?retryWrites=true&w=majority';
mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// ==================== SCHEMAS ====================
// User Schema
const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});
// Activity Log Schema
const ActivityLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  category: { type: String, required: true },
  activity: { type: String, required: true },
  amount: { type: Number, required: true },
  co2Value: { type: Number, required: true },
  date: { type: Date, default: Date.now }
});

const User = mongoose.model('User', UserSchema);
const ActivityLog = mongoose.model('ActivityLog', ActivityLogSchema);

const JWT_SECRET = 'footprint_secret_key_2025';

// ==================== AUTH MIDDLEWARE ====================

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
  
  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Invalid or expired token.' });
  }
};

// ==================== PUBLIC ROUTES ====================

// Register
app.post('/api/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    // Validation
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, email, password: hashedPassword });
    await user.save();
    res.status(201).json({ message: 'User created successfully' });
  } catch (err) {
    if (err.code === 11000) {
      res.status(400).json({ error: 'Username or email already exists' });
    } else {
      res.status(400).json({ error: err.message });
    }
  }
});

// Login
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ 
      token, 
      userId: user._id, 
      username: user.username,
      message: 'Login successful'
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Community average (public)
app.get('/api/community/average', async (req, res) => {
  try {
    const logs = await ActivityLog.find();
    if (logs.length === 0) {
      return res.json({ average: 0, count: 0 });
    }
    const total = logs.reduce((sum, log) => sum + log.co2Value, 0);
    const average = total / logs.length;
    res.json({ average: parseFloat(average.toFixed(2)), count: logs.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==================== PROTECTED ROUTES (require token) ====================

// Get user's logs
app.get('/api/logs', authenticateToken, async (req, res) => {
  try {
    const logs = await ActivityLog.find({ userId: req.userId }).sort({ date: -1 });
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add log
app.post('/api/logs', authenticateToken, async (req, res) => {
  try {
    const { category, activity, amount, co2Value } = req.body;
    
    // Validation
    if (!category || !activity || !amount || co2Value === undefined) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    if (amount <= 0) {
      return res.status(400).json({ error: 'Amount must be greater than 0' });
    }
    
    const log = new ActivityLog({ 
      userId: req.userId, 
      category, 
      activity, 
      amount, 
      co2Value 
    });
    await log.save();
    res.status(201).json(log);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete log (optional bonus)
app.delete('/api/logs/:logId', authenticateToken, async (req, res) => {
  try {
    const log = await ActivityLog.findOne({ 
      _id: req.params.logId, 
      userId: req.userId 
    });
    if (!log) {
      return res.status(404).json({ error: 'Log not found' });
    }
    await log.deleteOne();
    res.json({ message: 'Log deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==================== START SERVER ====================

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(` Server running on port ${PORT}`));