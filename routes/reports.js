const express = require('express');
const router = express.Router();
const pool = require('../middlewear/mySqlConnect');

const executeQuery = async (query, params) => {
  try {
    const [results] = await pool.promise().query(query, params);
    return results;
  } catch (error) {
    throw error;
  }
};

// Post a new report
router.post('/', async (req, res) => {
  const { userId, header, data } = req.body;
  const query = 'INSERT INTO reports (userId, header, data) VALUES (?, ?, ?)';
  
  try {
    await executeQuery(query, [userId, header, data]);
    res.status(201).send('Report created successfully.');
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get reports by user ID
router.get('/:userId', async (req, res) => {
  const { userId } = req.params;
  const query = 'SELECT * FROM reports WHERE userId = ?';
  
  try {
    const results = await executeQuery(query, [userId]);
    res.status(200).json({ data: results });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update an existing report
router.put('/:reportId', async (req, res) => {
  const { reportId } = req.params;
  const { newHeader, newData } = req.body;
  const query = 'UPDATE reports SET header = ?, data = ? WHERE id = ?';

  try {
    const results = await executeQuery(query, [newHeader, newData, reportId]);
    if (results.affectedRows === 0) {
      return res.status(404).send('No report found with the provided ID.');
    }
    res.status(200).send('Report updated successfully.');
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
