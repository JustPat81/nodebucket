/**
 * Require statements
 */
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const EmployeeAPI = require('./routes/employee-api');
const config = require('./data/config.json');

const app = express(); // Express variable.

/**
 * App configurations.
 */
app.use(express.json());
app.use(express.urlencoded({'extended': true}));
app.use(express.static(path.join(__dirname, '../dist/nodebucket')));
app.use('/', express.static(path.join(__dirname, '../dist/nodebucket')));

// default server port value.
const PORT = process.env.PORT || 3000;

const CONN = config.dbConn

/**
 * Database connection.
 */
mongoose.set('strictQuery', false);

mongoose.connect(CONN).then(
  () => {
    console.log('Connection to the database was successful');
  },
  err => {
    console.log(config.mongoServerError + ': ' + err.message);
  }
)

mongoose.connection.on('error', err => {
  console.log(config.mongoServerError + ': ' + err.message);
})

mongoose.connection.on('disconnected', () => {
  console.log('Server disconnected from host (MongoDB Atlas).');
})

/**
 * APIS go here
 */
app.use('/api/employees', EmployeeAPI);

// localhost:3000/api/employees/:empId

// Wire-up the Express server.
app.listen(PORT, () => {
  console.log('Application started and listening on PORT: ' + PORT);
})
