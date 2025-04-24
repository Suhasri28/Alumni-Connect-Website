// server/index.js
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const app = express();

app.use(cors());
app.use(express.json());

// Import the mysql2 package
const mysql = require('mysql2');

// Create a connection to the database
const connection = mysql.createConnection({
  host: 'localhost', // MySQL server address
  user: 'root',      // Your MySQL username
  password: 'LearnGrow123$',      // Your MySQL password (empty if no password)
  database: 'alumni_connect'  // Name of your MySQL database
});

// Connect to the database
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to the database: ' + err.stack);
    return;
  }
  console.log('Connected to the database as id ' + connection.threadId);
});

// User Registration/Login APIs
app.post('/register', (req, res) => {
  const { name, email, password, role, department, year_of_passing, current_position } = req.body;
  const hash = bcrypt.hashSync(password, 10);
  connection.query(
    'INSERT INTO users (name, email, password, role, department, year_of_passing, current_position) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [name, email, hash, role, department, year_of_passing || null, current_position || null],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json({ message: 'Registered successfully' });
    }
  );
});

app.post('/login', (req, res) => {
  const { email, password } = req.body;
  connection.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
    if (err || results.length === 0) return res.status(401).json({ message: 'User not found' });
    const user = results[0];
    if (!bcrypt.compareSync(password, user.password)) return res.status(401).json({ message: 'Invalid credentials' });
    const token = jwt.sign({ user_id: user.user_id, role: user.role }, 'secretkey');
    res.json({ token, user });
  });
});

// Student: Request Scholarship
app.post('/scholarship/request', (req, res) => {
  const { student_id, reason } = req.body;
  connection.query(
    'INSERT INTO scholarships (student_id, request_date, status, reason) VALUES (?, NOW(), ?, ?)',
    [student_id, 'pending', reason],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json({ message: 'Scholarship request sent' });
    }
  );
});

// Student: View Status
app.get('/scholarship/status/:id', (req, res) => {
  const { id } = req.params;
  connection.query('SELECT * FROM scholarships WHERE student_id = ?', [id], (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

// Alumni: View & Respond to Requests
app.get('/scholarship/requests', (req, res) => {
  connection.query(
    'SELECT scholarships.*, users.name FROM scholarships JOIN users ON scholarships.student_id = users.user_id WHERE status = ?',
    ['pending'],
    (err, results) => {
      if (err) return res.status(500).json(err);
      res.json(results);
    }
  );
});

app.post('/scholarship/respond', (req, res) => {
  const { scholarship_id, status } = req.body;
  connection.query('UPDATE scholarships SET status = ? WHERE scholarship_id = ?', [status, scholarship_id], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ message: 'Scholarship status updated' });
  });
});

// Alumni: Schedule Meetings
app.post('/meetings/schedule', (req, res) => {
  const { alumni_id, title, description, meeting_date } = req.body;
  connection.query(
    'INSERT INTO meetings (alumni_id, title, description, meeting_date) VALUES (?, ?, ?, ?)',
    [alumni_id, title, description, meeting_date],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: 'Meeting scheduled' });
    }
  );
});

// Students: View Meetings
app.get('/meetings', (req, res) => {
  connection.query(
    'SELECT meetings.*, users.name FROM meetings JOIN users ON meetings.alumni_id = users.user_id',
    (err, results) => {
      if (err) return res.status(500).json(err);
      res.json(results);
    }
  );
});

// View All Alumni
app.get('/alumni', (req, res) => {
  connection.query(
    "SELECT user_id, name, department, year_of_passing, current_position FROM users WHERE role = 'alumni'",
    (err, results) => {
      if (err) return res.status(500).json(err);
      res.json(results);
    }
  );
});

app.listen(3001, () => {
  console.log('Server running on port 3001');
});
