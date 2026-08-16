const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const Post = require("../models/Post");
const ContactRequest = require("../models/ContactRequest");

// Create transporter using Gmail SMTP with better error handling
let transporter;

try {
  if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
    transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
    console.log('✅ Email transporter configured');
  } else {
    console.log('⚠️ Email credentials not found');
  }
} catch (error) {
  console.error('❌ Email configuration failed:', error.message);
}

const FROM_ADDRESS = process.env.MAIL_FROM || process.env.EMAIL_USER;

exports.sendContactMessage = async (req, res) => {
  try {
    console.log("📩 Contact request received:", req.body);

    // Contact sending doesn't require auth, but if a token is present, block
    // the shared guest/demo account so recruiters testing the app can't
    // trigger real emails to real students.
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      try {
        const decoded = jwt.verify(authHeader.split(" ")[1], process.env.JWT_SECRET);
        if (decoded.guest) {
          return res.status(403).json({ message: "Guest accounts can't send messages — create a free account to contact a poster." });
        }
      } catch (_) {
        // Invalid/expired token — ignore, this endpoint doesn't require auth.
      }
    }

    const { postId, name, email, phone, message } = req.body;
    if (!postId || !name || !email || !message) {
      return res.status(400).json({
        message: "postId, name, email, and message are required",
      });
    }

    // Check if email is configured
    if (!transporter) {
      console.log("⚠️ Email not configured, saving contact request only");
      // Save contact request without sending email
      const contactRequest = new ContactRequest({
        postId,
        name,
        email,
        phone,
        message,
        status: 'pending'
      });
      await contactRequest.save();
      
      return res.json({
        message: "Contact request saved (email not configured)",
        postTitle: "Unknown",
        ownerEmail: "Not available"
      });
    }

    // Find the post + owner
    const post = await Post.findById(postId).populate("userId", "name email");
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const owner = post.userId && post.userId.email ? post.userId : null;
    if (!owner) {
      return res.status(400).json({ message: "Post owner email not available" });
    }

    // Email content
    const msgData = {
      from: FROM_ADDRESS,
      to: owner.email,
      subject: `New contact about: ${post.title}`,
      text: `Hello ${owner.name || "there"},\n\n` +
        `Someone is reaching out about your ${post.status === "found" ? "found" : "lost"} item.\n\n` +
        `Message: ${message}\n\n` +
        `Contact details:\n` +
        `Name: ${name}\n` +
        `Email: ${email}\n` +
        (phone ? `Phone: ${phone}\n` : "") +
        `\n— Lost & Found App`,
    };

    console.log("📨 Sending email to owner...");
    await transporter.sendMail(msgData);
    console.log("✅ Email sent successfully");

    // Confirmation email to sender (non-blocking)
    setImmediate(async () => {
      try {
        console.log("📨 Sending confirmation email to sender...");
        await transporter.sendMail({
          from: FROM_ADDRESS,
          to: email,
          subject: `We sent your message about: ${post.title}`,
          text: `Hi ${name},\n\nWe forwarded your message to ${owner.name || "the post owner"}.\n\n` +
                `Your message:\n${message}\n\n— Lost & Found App`,
        });
        console.log("✅ Confirmation email sent");
      } catch (err) {
        console.error("⚠️ Failed to send confirmation email:", err.message);
      }
    });

    return res.json({
      message: "Contact request sent successfully",
      postTitle: post.title,
      ownerEmail: owner.email,
    });

  } catch (error) {
    console.error("❌ sendContactMessage error:", error.message);

    // Always return something so Postman doesn’t hang
    return res.status(500).json({
      message: "Failed to send contact message",
      error: error.message,
    });
  }
};


exports.testEmail = async (req, res) => {
  try {
    if (!transporter) {
      return res.status(400).json({
        message: "Email not configured - check EMAIL_USER and EMAIL_PASS environment variables",
        error: "EMAIL_NOT_CONFIGURED"
      });
    }

    const fromAddress = FROM_ADDRESS;
    const toAddress = req.body.email || "test@example.com";

    console.log(`📨 Sending test email to ${toAddress}...`);

    const msg = {
      from: fromAddress,
      to: toAddress,
      subject: "Test Email from Lost & Found App",
      text: "This is a test email to verify email functionality via Gmail SMTP.",
    };

    await transporter.sendMail(msg);
    console.log("✅ Test email sent");

    res.json({ message: "Test email sent successfully" });
  } catch (error) {
    console.error("❌ testEmail error:", error.message);
    
    if (error.message.includes('Invalid login') || error.message.includes('Username and Password not accepted')) {
      return res.status(400).json({
        message: "Gmail authentication failed - you need to use an App Password, not your regular Gmail password",
        error: "GMAIL_AUTH_FAILED",
        solution: "Go to Google Account > Security > App passwords > Generate new app password for 'Mail'"
      });
    }
    
    res.status(500).json({
      message: "Test email failed",
      error: error.message,
    });
  }
};

exports.getPendingContactRequests = async (req, res) => {
  try {
    const pendingRequests = await ContactRequest.find({ status: "pending" })
      .sort({ createdAt: -1 })
      .limit(50);

    res.json({
      message: "Pending contact requests retrieved",
      requests: pendingRequests,
      count: pendingRequests.length,
    });
  } catch (error) {
    console.error("Error fetching pending contact requests:", error);
    res.status(500).json({ message: "Failed to fetch pending contact requests" });
  }
};
