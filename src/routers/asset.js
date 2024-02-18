const express = require("express");
const Asset = require("../models/asset");
const { adminAuth } = require("../middleware/auth");
const StatusCodes = require("http-status");

const Router = new express.Router();

Router.post('/admin/homepageimage', adminAuth, async (req, res) => {
  try {
    const asset = new Asset(req.body);
    const newAsset = await asset.save();
    return res.status(StatusCodes.CREATED).send({ asset: newAsset });
  } catch (err) {
    console.error(err);
    res.status(StatusCodes.BAD_REQUEST)
  }
})

Router.get('/admin/homepageimage', async (req, res) => {
  try {
    const asset = await Asset.find({
      tag: { $in: req.query.tag }
    });
    return res.status(StatusCodes.OK).send({ asset });
  } catch (err) {
    console.error(err);
    res.status(StatusCodes.BAD_REQUEST).send();
  }
})

Router.delete('/admin/imagedata/:imageid', adminAuth, async (req, res) => {
  try {
    await Asset.findByIdAndDelete(req.params.imageid);
    return res.status(StatusCodes.OK).send();
  } catch (err) {
    console.error(err);
    res.status(StatusCodes.BAD_REQUEST).send();
  }
})

module.exports = Router