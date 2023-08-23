require("dotenv").config();
const express = require("express");
const multer = require("multer");
const fs = require("fs");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const { registerUser, loginUser } = require("./utils/firebase");

const app = express();
const PORT = process.env.PORT || 3000;
const s3Client = new S3Client({
  region: "ap-southeast-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
  },
});

const storage = multer.diskStorage({
  destination: async function (req, file, cb) {
    const params = {
      Bucket: "secure-data-system",
      Key: file.originalname,
      Body: file.buffer,
    };
    await s3Client.send(new PutObjectCommand(params));
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.status(200).send("Hello World!");
});

app.post("/register", async (req, res) => {
  const { email, password } = req.body;
  try {
    await registerUser(email, password);
    res.status(201).json({ message: `${email} successfully registered` });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    await loginUser(email, password);
    res.status(201).json({ message: `${email} successfully logged in` });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.post("/upload", upload.array("file"), async (req, res) => {
  try {
    for (const index in req.files) {
      await fs.unlinkSync(`${__dirname}/${req.files[index].path}`);
    }
    res.status(200).json({
      message: `${req.files.length} file${
        req.files.length > 1 ? "s" : ""
      } uploaded`,
    });
  } catch (error) {}
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
