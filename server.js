// Import required modules
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Create an instance of the Express application
const app = express();

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

    // Save the user to the database
    const user = { name, email, password: hashedPassword };
    users.push(user);

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// User login endpoint
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = users.find((user) => user.email === email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Compare the provided password with the stored hashed password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate a JSON Web Token (JWT)
    const token = jwt.sign({ email: user.email }, 'secret_key', { expiresIn: '1h' });

    res.status(200).json({ token });
  } catch (error) {
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
