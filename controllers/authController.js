const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const generateToken = (user, extra = {}) => {
  return jwt.sign(
    { id: user._id, email: user.email, name: user.name, ...extra },
    process.env.JWT_SECRET,
    { expiresIn: '1d' } // Token valid for 1 day
  );
};

const GUEST_EMAIL = 'guest@lostandfound.demo';


exports.signup = async (req, res) => {
  try {
    console.log('Signup request received:', { body: req.body });
    
    const { name, email, password } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      console.log('Missing required fields');
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    if (password.length < 8) {
      console.log('Password too short');
      return res.status(400).json({ message: 'Password must be at least 8 characters' });
    }

    if (!email.trim().toLowerCase().endsWith('@uwaterloo.ca')) {
      console.log('Non-uwaterloo email rejected');
      return res.status(400).json({ message: 'Email must be a @uwaterloo.ca address' });
    }

    console.log('Checking for existing user...');
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('User already exists');
      return res.status(409).json({ message: 'Email already registered' });
    }

    console.log('Hashing password...');
    const hashedPassword = await bcrypt.hash(password, 10);

    console.log('Creating new user...');
    const user = new User({
      name,
      email,
      password: hashedPassword,
    });

    await user.save();
    console.log('User saved successfully');

    console.log('Generating token...');
    const token = generateToken(user);

    console.log('Sending response...');
    res.status(201).json({ 
      token,
      message: 'User created successfully',
      user: { id: user._id, name: user.name, email: user.email }
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Server error during signup', error: error.message });
  }
};


exports.login = async (req, res) => {
  try {
    console.log('Login request received:', { email: req.body.email });
    
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      console.log('Missing email or password');
      return res.status(400).json({ message: 'Email and password are required' });
    }

    console.log('Looking up user...');
    const user = await User.findOne({ email });
    if (!user) {
      console.log('User not found');
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    console.log('Checking password...');
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      console.log('Password mismatch');
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    console.log('Generating token...');
    const token = generateToken(user);

    console.log('Login successful, sending response...');
    res.json({ 
      token,
      message: 'Login successful',
      user: { id: user._id, name: user.name, email: user.email }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login', error: error.message });
  }
};


// Issues a token for a shared, read-only demo account — lets people (e.g.
// recruiters) explore the app without signing up. Enforced server-side in
// postController/contactController, not just hidden in the UI.
exports.guestLogin = async (req, res) => {
  try {
    let guest = await User.findOne({ email: GUEST_EMAIL });
    if (!guest) {
      const randomPassword = require('crypto').randomBytes(32).toString('hex');
      const hashedPassword = await bcrypt.hash(randomPassword, 10);
      guest = await User.create({ name: 'Guest', email: GUEST_EMAIL, password: hashedPassword });
    }

    const token = generateToken(guest, { guest: true });
    res.json({
      token,
      message: 'Guest login successful',
      user: { id: guest._id, name: guest.name, email: guest.email, guest: true },
    });
  } catch (error) {
    console.error('Guest login error:', error);
    res.status(500).json({ message: 'Server error during guest login', error: error.message });
  }
};
