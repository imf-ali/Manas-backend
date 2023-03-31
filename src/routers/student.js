const express = require("express");
const pug = require("pug");
const Student = require("../models/student");
const { studentAuth } = require("../middleware/auth");
const StatusCodes = require("http-status");
const shortid = require('shortid');
const Razorpay = require("razorpay");
require("dotenv").config();
const Render = require('../utils/render');
const GoogleLogin = require('../utils/googleLogin');

const Router = new express.Router();

Router.post("/student", async (req, res) => {
  try {
    var googleRes, user;
    if (req.body.googleAccessToken) {
      googleRes = await GoogleLogin.login(req.body.googleAccessToken);
      user = new Student({
        email: googleRes.data.email,
        firstname: googleRes.data.given_name,
        lastname: googleRes.data.family_name,
      })
    }
    else {
      user = new Student(req.body);
    }
    await user.save();
    const token = await user.generateAuthToken();
    const registration = await user.getRegistration();
    res.status(StatusCodes.CREATED).send({ user, token, registration });
  } catch (e) {
    res.status(StatusCodes.BAD_REQUEST).send();
  }
});

Router.patch("/student/:studentId/update", async (req, res) => {
  try {
    const user = await Student.updateSchema(req.params.studentId, req.body);
    res.status(StatusCodes.CREATED).send({ user });
  } catch (e) {
    res.status(StatusCodes.BAD_REQUEST).send();
  }
});

Router.get("/student/:studentId/me", studentAuth, async (req, res) => {
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
    var googleRes;
    if (req.body.googleAccessToken) {
      googleRes = await GoogleLogin.login(req.body.googleAccessToken);
    }
    const user = await Student.findByCredentials(
      req.body.email || googleRes.data.email,
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

Router.post("/student/renderadmitcard", studentAuth, async (req, res) => {
  try {
    const data = await Render.renderFile({
      template: `src/views/admitCard.pug`,
      render: {
        registration: req.user.registration,
        firstname: req.user.firstname,
        lastname: req.user.lastname,
        classdata : req.user.class,
      }
    })
    res.status(StatusCodes.CREATED).send({ data });
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
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send();
  }
});

module.exports = Router;