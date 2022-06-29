const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const { secretAccessKey } = require("../config");
const io = require("../servers/socketServer");

const User = require("../models/User");
const Role = require("../models/Role");

const generateAccessToken = payload => jwt.sign(payload, secretAccessKey);

class AuthController {
  async registration(req, res) {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({ message: "Validation error", errors });
      }

      const {
        email,
        password,
        firstName,
        lastName,
        gender,
        dateOfBirth,
        roles
      } = req.body;

      const candidate = await User.findOne({ email });

      if (candidate) {
        return res.status(400).json({ message: "User already exist" });
      }

      const hashPassword = bcrypt.hashSync(password, 5);
      const userRole = await Role.findOne({ value: "USER" });

      const user = new User({
        email,
        password: hashPassword,
        firstName,
        lastName,
        gender,
        dateOfBirth,
        status: "offline",
        roles: roles || [userRole.value]
      });

      await user.save();

      io.sockets.emit("user:created", user);
      return res.json({ message: "User successfully created" });
    } catch (e) {
      console.log(e);
      return res.status(400).json({ message: "Registration error" });
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });

      if (!user) {
        return res.status(400).json({ message: "User not found" });
      }

      const validPassword = bcrypt.compareSync(password, user.password);

      if (!validPassword) {
        return res.status(400).json({ message: "Invalid password" });
      }

      const token = generateAccessToken({
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        gender: user.gender,
        dateOfBirth: user.dateOfBirth,
        roles: user?.roles,
        status: user?.status
      });

      user.status = "online";
      await user.save();
      io.sockets.emit("user:online", user);
      return res.json({ token });
    } catch (e) {
      console.log(e);
      return res.status(400).json({ message: "Login error" });
    }
  }

  async logout(req, res) {
    try {
      const { userId } = req.params;
      const user = await User.findOne({ _id: userId });

      if (!user) {
        return res.status(400).json({ message: "User not found" });
      }

      user.status = "offline";
      await user.save();

      io.sockets.emit("user:offline", user);
      return res.json({ message: "User successfully logged out" });
    } catch (e) {
      console.log(e);
      return res.status(400).json({ message: "Logout error" });
    }
  }

  async getUsers(req, res) {
    try {
      const users = await User.find();
      return res.json(users);
    } catch (e) {
      console.log(e);
      return res.status(400).json({ message: "Failed to get users" });
    }
  }

  async getOnlineUsers(req, res) {
    try {
      const users = await User.find({ status: "online" });
      return res.json(users);
    } catch (e) {
      console.log(e);
      return res.status(400).json({ message: "Failed to get online users" });
    }
  }

  async getUser(req, res) {
    try {
      const user = await User.findById(req.params.userId);
      return res.json(user);
    } catch (e) {
      console.log(e);
      return res.status(400).json({ message: "Failed to get user" });
    }
  }
}

const controller = new AuthController();

module.exports = controller;
