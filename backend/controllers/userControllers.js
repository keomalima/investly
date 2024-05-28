import User from '../models/userModel.js';
import bcrypt from 'bcrypt';
import generateToken from '../utils/generateToken.js';

// @desc Register new user
// @route POST /api/users
// @access Public
const registerNewUser = async (req, res) => {
  // Obtains the email and password from the request
  const { email, password, username } = req.body;

  if (!email || !password || !username) {
    return res
      .status(409)
      .json({ error: 'Email, username and password are required' });
  }

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
    const token = generateToken(res, user.id);

    // Returns the user id, email and token
    res.status(201).json({
      id: user.id,
      email: user.email,
      username: user.username,
      token,
    });
  } catch (err) {
    res.status(500).json({ error: 'Something went wrong' });
  }
};

// @desc Login existing user
// @route POST /api/users/auth
// @access Public
const authUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(409).json({ error: 'Email and password are required' });
  }

  const user = await User.findOne({ where: { email } });

  if (user && (await user.matchPassword(password))) {
    const token = generateToken(res, user.id);

    res.json({
      id: user.id,
      name: user.username,
      email: user.email,
      token,
    });
  } else {
    res.status(401).json({ error: 'Invalid email or password' });
  }
};

// @desc Updates a user
// @route PUT /api/users
// @access Public
const updateUserById = async (req, res) => {
  const user_id = req.user.id;

  try {
    const user = await User.findByPk(user_id);

    if (!user) {
      return res.status(404).json({
        error: 'User not found',
      });
    }

    // Update username and email if provided
    user.username = req.body.username || user.name;
    user.email = req.body.email || user.email;

    // Update password if provided
    if (req.body.password) {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      user.password = hashedPassword;
    }

    await user.save();

    res.status(200).json({
      id: user_id,
      username: user.username,
      email: user.email,
    });
  } catch (error) {
    res.status(500).json({
      error:
        'An unexpected error occurred while updating the user. Please try again later.',
    });
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

export { registerNewUser, authUser, logoutUser, updateUserById };
