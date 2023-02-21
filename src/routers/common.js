const express = require("express");
const Notice = require("../models/notice");
const StatusCodes = require("http-status");
const Blog = require("../models/blog");

const Router = new express.Router();

Router.get('/getNotice', async (req, res) => {
  try {
    const allNotice = await Notice.find({ show: true, mainNotice: true });
    res.status(StatusCodes.OK).send({ allNotice });
  } catch (e) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send();
  }
})

Router.post('/uploadBlog', async (req, res) => {
  try {
    const blog = new Blog(req.body);
    await blog.save();
    res.status(StatusCodes.OK).send({ blog });
  } catch (e) {
    console.error(e);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send();
  }
})

Router.get('/getBlog', async (req, res) => {
  try {
    const blog = await Blog.find({ show: true });
    res.status(StatusCodes.OK).send({ blog });
  } catch (e) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send();
  }
})

Router.get('/getBlog/:blogid', async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.blogid);
    res.status(StatusCodes.OK).send({ blog });
  } catch (e) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send();
  }
})

Router.get('/app/health', async (req, res) => {
  try {
    res.status(StatusCodes.OK).send({ status : 'Server is running' });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send();
  }
})

module.exports = Router;