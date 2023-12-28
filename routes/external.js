const express = require('express');
const axios = require('axios');
require('dotenv').config();

const router = express.Router();
const apiKey = process.env.ENVIRONMENTAL_NEWS_API_KEY;

async function fetchWeatherData(lat, lon) {
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`;
  return await axios.get(apiUrl);
}

router.get('/weather', async (req, res) => {
  const { lat, lon } = req.query;
  if (!lat || !lon) {
    return res.status(400).send('Latitude and longitude are required');
  }

  try {
    const response = await fetchWeatherData(lat, lon);
    res.status(200).json(response.data);
  } catch (error) {
    console.error('Error fetching weather data:', error);
    res.status(500).send('Failed to fetch weather data');
  }
});

module.exports = router;
