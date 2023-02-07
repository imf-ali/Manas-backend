const express = require("express");
const Notice = require("../models/notice");
const StatusCodes = require("http-status");

const Router = new express.Router();

Router.get('/getNotice', async (req, res) => {
  try {
    const allNotice = await Notice.find({ show: true });
    res.status(StatusCodes.OK).send({ allNotice });
  } catch (e) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send();
  }
})

module.exports = Router;