const Users = require('../../models/userModel')
require('dotenv').config()
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const Envets = require('../../models/EventModel.js')

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body
    console.log(req.body)

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'please fill all the fields' });
    }

    const userExists = await Users.findOne({ email })

    if (userExists) {
      return res.status(401).json({ error: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    const user = await Users.create({
      name,
      email,
      password: hashedPassword,
      admin: false
    })
    if (user) {

      res.status(201).json({
        message: 'new user created',
        _id: user._id,
        name: user.name,
        email: user.email,
        password: hashedPassword,
        admin: user.admin,
        token: generateToken(user._id)
      })
    } else {
      res.status(400)
      throw new Error('wrong user data')
    }
  } catch (error) {
    res.status(500).json({
      message: error.message,
    })
  }
}

const login = async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await Users.findOne({ email })
    if (!user) {
      res.status(404).json({
        message: 'user not found',
      })
    }

    if (user && user.email === email) {
      const isPasswordValid = await bcrypt.compare(password, user.password)
      if (!isPasswordValid) {
        return res.status(400).json({ message: 'invalid password' })
      }
      return res.status(200).json({
        message: 'login successfully',
        name: user.name,
        _id: user._id,
        email: user.email,
        admin: user.admin,
        token: generateToken(user._id),
        //   avatarUrl: user.avatarUrl,
      })
    }
  } catch (error) {
    return res.status(400).json({ message: error })
  }
}

const getCurrentUser = async (req, res) => {
  try {
    const user = req.user

    if (!user) {
      res.status(404).json({ message: 'failed to find user' })
    }

    const isUser = Users.findOne({_id: user._id})
    if (!isUser)
      res.status(404).json({ message: 'user not found' })

    res.status(200).json({
      message: 'login successfully',
      _id: user._id,
      name: user.name,
      email: user.email,
      password: user.password,
      admin: user.admin
    })
  } catch (e) {
    console.log(e)
  }
}
const getAllUsers = async (req, res) => {
  try {
    const users = await Users.find()
    res.status(200).json({
      users: users.map((user) => {
        return {
          name: user.name,
          _id: user._id,
        }
      }),
    })
  } catch (err) {
    res.status(500).json({
      message: err,
    })
  }
}

const checkEmailTaken = async (req, res) => {
  const given_email = req.body.email
  const user = await Users.findOne({ email: given_email })
  if (user) {
    res.status(200).json({ isTaken: true })
  } else {
    res.status(200).json({ isTaken: false })
  }
}

const checkUsernameTaken = async (req, res) => {
  const given_name = req.body.name
  const user = await Users.findOne({ name: given_name })
  if (user) {
    res.status(200).json({ isTaken: true })
  } else {
    res.status(200).json({ isTaken: false })
  }
}

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' })
}


const banUser = async (req, res) => {
  try {
    if(!req.user.admin)
      return res.status(402).json({ message: 'user not admin!' })
    //ban user
    if (req.user._id.toString() === req.params.id)
      return res.status(401).json({ message: 'cant ban user is admin'})

    const event = await Envets.deleteMany({user_id: req.user._id })

    if (!event)
      return res.status(404).json({ message: 'failed delete events'})
    const response = await Users.deleteOne({_id: req.params.id});
    if (response)
      return res.status(200).json({ message: 'user deleted!' });

  } catch (error) {
    return res.status(403).json({ message: error })
  }
}

module.exports = {
  registerUser,
  login,
  getCurrentUser,
  getAllUsers,
  checkEmailTaken,
  checkUsernameTaken,
  banUser
}