// api/index.js
const express = require('express');
const path = require('path');

const app = express();

// Set view engine
app.set('views', path.join(__dirname, '../src/views'));
app.set('view engine', 'ejs');

// Static files
app.use(express.static(path.join(__dirname, '../src/public')));

// Routes
const indexRouter = require('../src/routes/index');
app.use('/', indexRouter);

// Optional: 404 handler
app.use((req, res) => {
  res.status(404).render('404', { message: 'Page Not Found' });
});

module.exports = app;
