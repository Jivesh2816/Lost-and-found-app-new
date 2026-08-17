const multer = require('multer');
const cloudinary = require('cloudinary').v2;

const cloudinaryConfigured =
  !!process.env.CLOUDINARY_CLOUD_NAME && !!process.env.CLOUDINARY_API_KEY && !!process.env.CLOUDINARY_API_SECRET;

if (cloudinaryConfigured) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
  console.log('✅ Cloudinary configured — photo uploads enabled');
} else {
  console.log('⚠️ Cloudinary not configured — photo uploads will be rejected with a clear error');
}

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(file.originalname.toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    cb(null, true);
  } else {
    cb(new Error('Only image files (jpg, png, gif, webp) are allowed'));
  }
};

// Always buffer to memory — the actual Cloudinary upload happens explicitly
// in the controller (via uploadBufferToCloudinary below), inside a normal
// awaited try/catch, rather than via a storage-engine stream whose errors
// have historically surfaced as unhandled rejections that crash the process.
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // Max 5MB
  fileFilter,
});

// Uploads a buffer (from multer memoryStorage) to Cloudinary and resolves
// with the secure URL. Wraps upload_stream in a Promise with explicit
// resolve/reject so callers can await it inside a normal try/catch.
const uploadBufferToCloudinary = (buffer) =>
  new Promise((resolve, reject) => {
    let settled = false;
    const settle = (fn, value) => {
      if (settled) return;
      settled = true;
      fn(value);
    };

    const stream = cloudinary.uploader.upload_stream(
      {
        folder: 'lost-and-found',
        allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
        transformation: [{ width: 1600, height: 1600, crop: 'limit' }],
      },
      (error, result) => {
        if (error) return settle(reject, error);
        settle(resolve, result.secure_url);
      }
    );
    // The write stream can also emit its own 'error' (e.g. on an empty or
    // malformed buffer) independently of the upload callback above — an
    // unhandled 'error' event on a stream crashes the process, so it must
    // be listened for explicitly rather than relying on the callback alone.
    stream.on('error', (error) => settle(reject, error));
    stream.end(buffer);
  });

module.exports = upload;
module.exports.cloudinaryConfigured = cloudinaryConfigured;
module.exports.uploadBufferToCloudinary = uploadBufferToCloudinary;
