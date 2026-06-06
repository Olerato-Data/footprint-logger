const express = require('express');
const router = express.Router();
const ActivityLog = require('../models/ActivityLog');
const protect = require('../middleware/auth');

// All routes below require authentication
router.use(protect);

// GET /api/logs — get all logs for logged-in user
router.get('/', async (req, res) => {
  try {
    const logs = await ActivityLog.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(logs);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET /api/logs/summary — totals grouped by category
router.get('/summary', async (req, res) => {
  try {
    const summary = await ActivityLog.aggregate([
      { $match: { user: req.user.id } },
      {
        $group: {
          _id: '$category',
          totalCo2: { $sum: '$co2Grams' },
          count: { $sum: 1 },
        },
      },
    ]);

    const communityAvg = { transport: 12400, food: 8200, energy: 5600 };
    res.json({ summary, communityAvg });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET /api/logs/weekly — last 7 days of daily totals
router.get('/weekly', async (req, res) => {
  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const weekly = await ActivityLog.aggregate([
      {
        $match: {
          user: req.user.id,
          createdAt: { $gte: sevenDaysAgo },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          totalCo2: { $sum: '$co2Grams' },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.json(weekly);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// POST /api/logs — add a new activity log
router.post('/', async (req, res) => {
  const { activityName, category, icon, quantity, unit, co2Grams } = req.body;

  try {
    const log = await ActivityLog.create({
      user: req.user.id,
      activityName,
      category,
      icon,
      quantity,
      unit,
      co2Grams,
    });

    res.status(201).json(log);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// DELETE /api/logs/:id — delete a log entry
router.delete('/:id', async (req, res) => {
  try {
    const log = await ActivityLog.findById(req.params.id);

    if (!log) return res.status(404).json({ message: 'Log not found' });

    // Make sure it belongs to this user
    if (log.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorised' });
    }

    await log.deleteOne();
    res.json({ message: 'Log deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
