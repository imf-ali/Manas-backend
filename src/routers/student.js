const express = require("express");
const Student = require("../models/student");
const { studentAuth } = require("../middleware/auth");
const StatusCodes = require("http-status");
const shortid = require('shortid');
const Razorpay = require("razorpay");
require("dotenv").config();

const Router = new express.Router();

Router.post("/student", async (req, res) => {
  const user = new Student(req.body);
  try {
    await user.save();
    const token = await user.generateAuthToken();
    res.status(StatusCodes.CREATED).send({ user, token });
  } catch (e) {
    res.status(StatusCodes.BAD_REQUEST).send();
  }
});

Router.patch("/student/:studentId/update", async (req, res) => {
  try {
    console.log(req.body);
    console.log(req.params.studentId);
    const user = await Student.updateSchema(req.params.studentId, req.body);
    res.status(StatusCodes.CREATED).send({ user });
  } catch (e) {
    res.status(StatusCodes.BAD_REQUEST).send();
  }
});

Router.get("/student/:studentId/me", async (req, res) => {
  try {
    const user = await Student.findById(req.params.studentId);
    const userRes = user.toJSON();
    res.status(StatusCodes.OK).send({ userRes });
  } catch (e) {
    res.status(StatusCodes.BAD_REQUEST).send();
  }
});

Router.post("/student/login", async (req, res) => {
  try {
    const user = await Student.findByCredentials(
      req.body.email,
      req.body.password
    );
    const token = await user.generateAuthToken();
    res.status(StatusCodes.CREATED).send({ user, token });
  } catch (e) {
    res.status(StatusCodes.BAD_REQUEST).send();
  }
});

Router.post("/student/logout", studentAuth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter(
      token => token.token !== req.token
    );
    await req.user.save();

    res.send();
  } catch (e) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send();
  }
});

Router.post("/student/logout/all", studentAuth, async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();
    res.send();
  } catch (e) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send();
  }
});

Router.post("/student/payment", studentAuth, async (req, res) => {
  try {
    const instance = new Razorpay({
      key_id: process.env.YOUR_KEY_ID,
      key_secret: process.env.YOUR_KEY_SECRET,
      headers: {
        "X-Razorpay-Account": process.env.RAZORPAYMERCHANTID
      }
    });
    const options = {
      amount: req.body.amount * 100, // amount in the smallest currency unit
      currency: "INR",
      receipt: shortid.generate(),
      payment_capture: 1
    };
    const response = await instance.orders.create(options);
    res.status(StatusCodes.OK).send({
      id : response.id,
      currency : response.currency,
      amount : response.amount
    })
  } catch (error) {
    console.log(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send();
  }
});

module.exports = Router;