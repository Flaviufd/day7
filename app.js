const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const cron = require('node-cron');
const fs = require('fs');

const apiEndpoint = 'http://localhost:3000/books';

const app = express();
const port = 3000;

let books = [
  { id: 1, title: 'Book 1', author: 'Author 1' },
  { id: 2, title: 'Book 2', author: 'Author 2' },
  { id: 3, title: 'Book 3', author: 'Author 3' },
];

app.use(bodyParser.json());

function writeToLogFile(message) {
    fs.appendFile('api.log', `[${new Date().toLocaleString()}] ${message}\n`, (err) => {
      if (err) {
        console.error('Error writing to log file:', err);
      }
    });
  }
  

app.get('/books', (req, res) => {
  res.json(books);
});

async function checkApiStatus() {
    try {
      const response = await axios.get(apiEndpoint);
      if (response.status === 200) {
        writeToLogFile(`200 API is up and running!`);
        console.log(`[${new Date().toLocaleString()}] 200 API is up and running!`);
      } else if (response.status === 500) {
        writeToLogFile(`500 API is down.`)
        console.log(`[${new Date().toLocaleString()}] 500 API is down.`);
      }
    } catch (error) {
      writeToLogFile(`API is down. Error: ${error.message}`);
      console.log(`[${new Date().toLocaleString()}] API is down. Error: ${error.message}`);
    }
  }
  
  // verificam la fiecare 10 secunde
  cron.schedule('*/10 * * * * *', checkApiStatus);
  
  console.log('API Monitoring System started. Press Ctrl+C to stop.');

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
