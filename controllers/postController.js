const Post = require('../models/Post');
const multer = require('multer');
const { cloudinaryConfigured, uploadBufferToCloudinary } = require('../middleware/uploadMiddleware');
// Create a new post
const GUEST_BLOCKED_MESSAGE = 'Guest accounts are read-only — create a free account to post, edit, or delete items.';

exports.createPost = async (req, res) => {
  try {
    if (req.user?.guest) {
      return res.status(403).json({ message: GUEST_BLOCKED_MESSAGE });
    }
    if (req.file && !cloudinaryConfigured) {
      return res.status(400).json({ message: 'Photo uploads are not configured on the server yet.' });
    }
    console.log('📝 Creating post...');
    console.log('req.body:', req.body);

    const { title, description, category, location, status } = req.body;

    // Get userId from authenticated user or request body
    const userId = req.user?.id || req.body.userId;

    let imageUrl = '';
    if (req.file) {
      try {
        imageUrl = await uploadBufferToCloudinary(req.file.buffer);
      } catch (uploadError) {
        console.error('❌ Cloudinary upload error:', uploadError);
        return res.status(502).json({ message: 'Failed to upload photo. Please try again.' });
      }
    }

    const newPost = new Post({
      title,
      description,
      category,
      location,
      image: imageUrl,
      status,
      userId,
    });

    const savedPost = await newPost.save();
    console.log('✅ Post created successfully:', savedPost._id);
    res.status(201).json(savedPost);
  } catch (error) {
    console.error('❌ Create post error:', error);
    
    // Handle specific errors
    if (error instanceof multer.MulterError) {
      return res.status(400).json({ 
        message: 'File upload error: ' + error.message,
        error: 'FILE_UPLOAD_ERROR'
      });
    }
    
    if (error.message && error.message.includes('Only images')) {
      return res.status(400).json({ 
        message: error.message,
        error: 'INVALID_FILE_TYPE'
      });
    }
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        message: 'Validation error: ' + Object.values(error.errors).map(e => e.message).join(', '),
        error: 'VALIDATION_ERROR'
      });
    }
    
    // Generic server error
    res.status(500).json({ 
      message: 'Server error during creating post',
      error: error.message || 'UNKNOWN_ERROR'
    });
  }
};


exports.getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate('userId', 'name email');
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.json(post);
  } catch (error) {
    console.error('Get post by id error:', error);
    if (error.name === 'CastError') {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.status(500).json({ message: 'Server error during fetching post' });
  }
};

exports.getAllPosts = async (req, res) => {
  try {
    const { title, category, status, location, page = 1, limit = 10 } = req.query;
    const filter = {};
    if (title) filter.title = { $regex: title, $options: 'i' };
    if (category) filter.category = category;
    if (status) filter.status = status;
    if (location) filter.location = { $regex: location, $options: 'i' };

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const posts = await Post.find(filter)
      .populate('userId', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    const total = await Post.countDocuments(filter);

    res.json({
      posts,
      page: parseInt(page),
      totalPages: Math.ceil(total / limit),
      totalPosts: total,
    });
  } catch (error) {
    console.error('Get posts error:', error);
    res.status(500).json({ message: 'Server error during fetching posts' });
  }
};


// Update post status (e.g., mark as returned)
exports.updatePostDetails = async (req, res) => {
  try {
    if (req.user?.guest) {
      return res.status(403).json({ message: GUEST_BLOCKED_MESSAGE });
    }
    if (req.file && !cloudinaryConfigured) {
      return res.status(400).json({ message: 'Photo uploads are not configured on the server yet.' });
    }
    const { id } = req.params;
    const { title, description, category, location, status } = req.body;

    // Fetch the post by ID
    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Ownership check
    if (post.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Forbidden: cannot edit others' posts" });
    }

    // Update fields if provided
    if (title !== undefined) post.title = title;
    if (description !== undefined) post.description = description;
    if (category !== undefined) post.category = category;
    if (location !== undefined) post.location = location;
    if (req.file) {
      try {
        post.image = await uploadBufferToCloudinary(req.file.buffer);
      } catch (uploadError) {
        console.error('❌ Cloudinary upload error:', uploadError);
        return res.status(502).json({ message: 'Failed to upload photo. Please try again.' });
      }
    } else if (req.body.removeImage === 'true') {
      post.image = '';
    }
    if (status !== undefined) {
      if (!['lost', 'found', 'returned'].includes(status)) {
        return res.status(400).json({ message: 'Invalid status value' });
      }
      post.status = status;
    }

    const updatedPost = await post.save();
    res.json(updatedPost);

  } catch (error) {
    console.error('Update post details error:', error);
    res.status(500).json({ message: 'Server error during updating post details' });
  }
};

exports.deletePost = async (req, res) => {
  try {
    if (req.user?.guest) {
      return res.status(403).json({ message: GUEST_BLOCKED_MESSAGE });
    }
    const { id } = req.params;

    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Ownership check
    if (post.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Forbidden: cannot delete others' posts" });
    }

    await Post.findByIdAndDelete(id);
    res.json({ message: 'Post deleted successfully' });

  } catch (error) {
    console.error('Delete post error:', error);
    res.status(500).json({ message: 'Server error during deleting post' });
  }
};
