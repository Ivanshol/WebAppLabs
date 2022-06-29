const Record = require("../models/Record");
const jwt = require("jsonwebtoken");
const { secretAccessKey } = require("../config");
const { validationResult } = require("express-validator");
const io = require("../servers/socketServer");

const getInfoFromAccessToken = token => jwt.verify(token, secretAccessKey);

class PhonebookController {
  async getAllRecords(req, res) {
    try {
      const records = await Record.find();
      return res.status(200).json(records);
    } catch (e) {
      console.log(e);

      return res
        .status(400)
        .json({ message: "Failed to get all records", error: e });
    }
  }

  async getRecords(req, res) {
    try {
      const records = await Record.find({ user: req.params.userId });
      return res.status(200).json(records);
    } catch (e) {
      console.log(e);
      return res
        .status(400)
        .json({ message: "Failed to get records for user", error: e });
    }
  }

  async createRecord(req, res) {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({ message: "Validation error", errors });
      }

      const { name, phoneNumbers } = req.body;
      const { userId } = req.params;
      const record = await Record.create({ name, phoneNumbers, user: userId });

      io.sockets.emit("record:created", record);
      return res.status(200).json(record);
    } catch (e) {
      console.log(e);
      return res
        .status(400)
        .json({ message: "Failed to create record", error: e });
    }
  }
  async updateRecord(req, res) {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({ message: "Validation error", errors });
      }

      const { name, phoneNumbers } = req.body;
      const { recordId, userId } = req.params;
      const record = await Record.findOne({ _id: recordId, user: userId });

      if (!record) {
        return res.status(400).json({ message: "Record not found" });
      }

      record.name = name;
      record.phoneNumbers = phoneNumbers;

      await record.save();

      io.sockets.emit("record:updated", record);
      return res.status(200).json(record);
    } catch (e) {
      console.log(e);
      return res.status(400).json({
        message: "Failed to update record",
        error: e
      });
    }
  }
  async deleteRecord(req, res) {
    try {
      const { userId, recordId } = req.params;
      const response = await Record.deleteOne({ _id: recordId, user: userId });
      io.sockets.emit("record:deleted", { recordId, userId });
      return res.json(response);
    } catch (e) {
      console.log(e);
      return res
        .status(400)
        .json({ message: "Failed to delete record", error: e });
    }
  }
  async getRecord(req, res) {
    try {
      const { userId, recordId } = req.params;

      const record = await Record.findOne({ _id: recordId, user: userId });

      if (!record) {
        return res.status(400).json({ message: "Record not found" });
      }

      return res.status(200).json(record);
    } catch (e) {
      console.log(e);
      return res.status(400).json({
        message: "Failed to get record for user",
        error: e
      });
    }
  }
}

const controller = new PhonebookController();

module.exports = controller;
