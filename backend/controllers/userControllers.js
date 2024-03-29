import User from '../models/userModel.js';
import bcrypt from 'bcrypt';
import generateToken from '../utils/generateToken.js';

// @desc Register new user
// @route POST /api/users
// @access Public
const registerUser = async (req, res) => {
  // Obtains the email and password from the request
  const { email, password, username } = req.body;
  const saltRounds = 10;

  try {
    // Checks if an email already exists in the database
    const userExists = await User.findOne({ where: { email } });

    if (userExists) {
      return res.status(409).json({ error: 'User already exists' });
    }

    // Method for hashing the password
    const hash = await bcrypt.hash(password, saltRounds);
    const user = await User.create({ email, username, password: hash });
    generateToken(res, user.id);

    // Returns the user id, email and token
    res.status(201).json({
      id: user.id,
      email: user.email,
      username: user.username,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Something went wrong' });
  }
};

// @desc Login existing user
// @route POST /api/users/login
// @access Public
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ where: { email } });

  if (user && (await user.matchPassword(password))) {
    generateToken(res, user.id);

    res.json({
      id: user.id,
      name: user.username,
      email: user.email,
    });
  } else {
    res.status(401).json({ error: 'Invalid email or password' });
  }
};

// @desc Logout user
// @route POST /api/users/logout
// @access Public
const logoutUser = (req, res) => {
  // Erase the JWT token from the cookies
  res.cookie('jwt', '', {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: 'Logged out successfully' });
};

export { registerUser, loginUser, logoutUser };