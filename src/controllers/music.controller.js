const musicModel = require("../models/music.model");
const { uploadFile } = require("../services/storage.service");
const jwt = require("jsonwebtoken");

async function createMusic(req, res) {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  //checking for valid token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    //we had encoded id and role in token, checking if user has right role
    if (decoded.role !== "artist") {
      return res.status(403).json({
        message: "you ain't no artist boi",
      });
    }

    const { title } = req.body;
    const file = req.file;

    const result = await uploadFile(file.buffer.toString("base64"));
    console.log(result);
    const music = await musicModel.create({
      url: result.url,
      title,
      artist: decoded.id,
    });

    res.status(201).json({
      message: "Music created",
      music: {
        id: music._id,
        url: music.url,
        title: music.title,
        artist: music.artist,
      },
    });
  } catch (err) {
    console.log(err);
    return res.status(401).json({ message: "you are music enjoyer only" });
  }
}

module.exports = { createMusic };
