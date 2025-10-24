const express = require("express");
const router = express.Router();
const {
  sendContactMessage,
  getPendingContactRequests,
  testEmail,
} = require("../controllers/contactController");

router.post("/", sendContactMessage);
router.get("/admin/pending", getPendingContactRequests);
router.post("/test-email", testEmail);

module.exports = router;


