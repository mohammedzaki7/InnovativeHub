const { S3 } = require("@aws-sdk/client-s3");
const multer = require("multer");
const multerS3 = require("multer-s3");
const yaml = require("js-yaml");
const fs = require("fs");
const path = require("path");

// Load AWS credentials and configuration
const secrets = yaml.load(fs.readFileSync("./utils/secrets.yaml", "utf8"));

// Configure AWS S3 client
const s3 = new S3({
  region: secrets.aws.region,
  credentials: {
    accessKeyId: secrets.aws.accessKeyId,
    secretAccessKey: secrets.aws.secretAccessKey,
  },
});

const uploadFiles = multer({
  storage: multerS3({
    s3: s3,
    bucket: secrets.aws.bucketName,
    key: (req, file, cb) => {
      cb(null, Date.now().toString() + "-" + file.originalname); // Unique file name
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5 MB
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png/;
    const extname = fileTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimeType = fileTypes.test(file.mimetype);
    cb(null, extname && mimeType);
  },
}).array("images", 10); // Allows up to 10 images per upload


// Function to delete old images from S3// Function to delete old images from S3
const deleteOldImages = async (oldImages) => {
  try {
    // Create an array of promises for deleting each image
    const deletePromises = oldImages.map(async (imageUrl) => {
      const key = imageUrl.split("/").pop(); // Extract the key from the URL
      return s3.deleteObject({
        Bucket: secrets.aws.bucketName,
        Key: key,
      });
    });

    // Wait for all delete operations to complete
    await Promise.all(deletePromises);
  } catch (error) {
    console.error("Error deleting images:", error);
    throw new Error("Failed to delete old images");
  }
};

module.exports = { uploadFiles, deleteOldImages };
