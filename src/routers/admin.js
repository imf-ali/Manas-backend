const express = require("express");
const Admin = require("../models/admin");
const Notice = require("../models/notice");
const { adminAuth } = require("../middleware/auth");
const StatusCodes = require("http-status");
const Blog = require("../models/blog");
const Student = require("../models/student");

const Router = new express.Router();

Router.post("/admin", async (req, res) => {
  const user = new Admin(req.body);

  try {
    await user.save();
    const token = await user.generateAuthToken();
    res.status(StatusCodes.CREATED).send({ user, token });
  } catch (e) {
    console.error(e);
    res.status(StatusCodes.BAD_REQUEST).send();
  }
});

Router.post("/admin/login", async (req, res) => {
  try {
    const user = await Admin.findByCredentials(
      req.body.email,
      req.body.password
    );
    const token = await user.generateAuthToken();
    res.status(StatusCodes.CREATED).send({ user, token });
  } catch (e) {
    console.log(e);
    res.status(StatusCodes.BAD_REQUEST).send();
  }
});

Router.post("/admin/logout", adminAuth, async (req, res) => {
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

Router.post("/admin/logout/all", adminAuth, async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();
    res.send();
  } catch (e) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send();
  }
});

Router.post('/admin/addNotice', adminAuth, async (req, res) => {
  try {
    const notice = new Notice(req.body);
    await notice.save();
    res.status(StatusCodes.CREATED).send({ heading: notice.heading, data: notice.data, mainNotice: notice.mainNotice });
  } catch (e) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send();
  }
})

Router.get('/admin/getAllNotice', adminAuth, async (req, res) => {
  try {
    const allNotice = await Notice.find();
    res.status(StatusCodes.OK).send({ allNotice });
  } catch (e) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send();
  }
})

Router.delete('/admin/deleteNotice', adminAuth, async (req, res) => {
  try {
    const deletedNotice = await Notice.findByIdAndDelete(req.body.id);
    res.status(StatusCodes.OK).send({ deletedNotice });
  } catch (e) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send();
  }
})

Router.patch('/admin/showNotice', adminAuth, async (req, res) => {
  try {
    const notice = await Notice.findById(req.body.id);
    notice.show = req.body.show;
    await notice.save();
    res.status(StatusCodes.OK).send({ notice });
  } catch (e) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send();
  }
})

Router.get('/admin/Blog', adminAuth, async (req, res) => {
  try {
    const blog = await Blog.find();
    res.status(StatusCodes.OK).send({ blog });
  } catch (e) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send();
  }
})

Router.patch('/admin/Blog', adminAuth, async (req, res) => {
  try {
    const blog = await Blog.findById(req.body.id);
    blog.show = req.body.show;
    await blog.save();
    res.status(StatusCodes.OK).send({ blog });
  } catch (e) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send();
  }
})

Router.delete('/admin/Blog', adminAuth, async (req, res) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.body.id);
    res.status(StatusCodes.OK).send({ blog });
  } catch (e) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send();
  }
})

Router.get('/admin/getAllStudents', adminAuth, async (req, res) => {
  try {
    const studentList = await Student.find();
    res.status(StatusCodes.OK).send({ studentList });
  } catch (e) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send();
  }
})

Router.patch('/admin/:studentId/markpaid', adminAuth, async (req, res) => {
  try {
    const student = await Student.updateSchema(req.params.studentId, req.body);
    res.status(StatusCodes.OK).send({ student });
  } catch (e) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send();
  }
})

module.exports = Router;