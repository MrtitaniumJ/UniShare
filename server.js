// Import required modules
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('.models/User');

// Create an instance of the Express application
const app = express();

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/mydatabase', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });

// Middleware to parse incoming requests as JSON
app.use(express.json());

// Enable CORS if needed (replace * with your frontend's URL)
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');
  next();
});

// In-memory database (replace this with your database setup)
const users = [];

// User registration endpoint
app.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user with the same email already exists
    const existingUser = users.find((user) => user.email === email);
    if (existingUser) {
      return res.status(409).json({ error: 'User already exists' });
    }

    // Hash the user's password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user instance
    const user = new User({
        name: name,
        email: email,
        password: hashedPassword,
      });

    // Save the user data in the database
    await user.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// User login endpoint
app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
    
        // Find the user by email
        const user = await User.findOne({ email });
    
        // If the user doesn't exist, return an error
        if (!user) {
          return res.status(401).json({ error: 'Invalid email or password' });
        }
    
        // Compare the provided password with the hashed password
        const isPasswordValid = await bcrypt.compare(password, user.password);
    
        // If the passwords don't match, return an error
        if (!isPasswordValid) {
          return res.status(401).json({ error: 'Invalid email or password' });
        }
    
        // Passwords match, user is authenticated
        res.json({ message: 'Login successful' });
      } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ error: 'Internal server error' });
      }
    });

// Protected route example
app.get('/protected', (req, res) => {
  // Middleware to verify JWT
  // Replace 'secret_key' with the same key used to sign the token in the login endpoint
  jwt.verify(req.headers.authorization, 'secret_key', (err, decodedToken) => {
    if (err) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    // Token is valid, user is authenticated
    res.status(200).json({ message: 'Protected route accessed successfully' });
  });
});

// Start the server
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
