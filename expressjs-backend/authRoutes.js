const express = require('express');
const User = require('./user');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const router = express.Router();

router.use(cookieParser());

// Registration
router.post('/register', async (req, res) => {
    try {
      const { name, job, password } = req.body;
      const newUser = new User({ name, job, password });
      await newUser.save();
  
      // Create JWT and set it as a cookie
      const token = jwt.sign({ userId: newUser._id }, 'your-secret-key', { expiresIn: '1h' });
      res.cookie('token', token, { httpOnly: true });
  
      res.status(201).json({ message: 'User registered successfully', token });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });
  
  // Login
  router.post('/login', async (req, res) => {
    try {
      const { name, password } = req.body;
      const user = await User.findOne({ name, password });
  
      if (user) {
        // Create JWT and set it as a cookie
        const token = jwt.sign({ userId: user._id }, 'your-secret-key', { expiresIn: '1h' });
        res.cookie('token', token, { httpOnly: true });
  
        res.status(200).json({ message: 'Login successful', token });
      } else {
        res.status(401).json({ message: 'Invalid credentials' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });
  
  // Logout
  router.post('/logout', (req, res) => {
    res.clearCookie('token');
    res.status(200).json({ message: 'Logout successful' });
  });
  

module.exports = router;
