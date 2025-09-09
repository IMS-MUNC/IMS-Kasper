const express = require('express');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const path = require('path');
const fs = require('fs');
const router = express.Router();
const auth = require('../middleware/auth');
const Message = require('../models/Message');
const crypto = require('crypto');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Create uploads directory for local storage fallback
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for both memory storage (Cloudinary) and disk storage (fallback)
const memoryStorage = multer.memoryStorage();
const diskStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter function
const fileFilter = (req, file, cb) => {
  // Check file size (1MB limit)
  if (file.size > 1 * 1024 * 1024) {
    return cb(new Error('File size must be less than 1MB'), false);
  }

  // Check file type
  const allowedTypes = [
    'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp',
    'video/mp4', 'video/avi', 'video/mov', 'video/wmv',
    'application/pdf'
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only images, videos, and PDFs are allowed.'), false);
  }
};

const upload = multer({
  storage: memoryStorage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 1 * 1024 * 1024 // 1MB limit
  }
});

// const uploadLocal = multer({
//   storage: diskStorage,
//   fileFilter: fileFilter,
//   limits: {
//     fileSize: 1 * 1024 * 1024 // 1MB limit
//   }
// });

// Helper function to save message to database
async function saveMessageToDatabase(fromId, toId, messageData) {
  try {
    // Find existing conversation or create new one
    let conversation = await Message.findOne({
      participants: { $all: [fromId, toId] }
    });

    if (!conversation) {
      // Create new conversation
      conversation = new Message({
        participants: [fromId, toId],
        messages: [messageData],
        lastMessage: {
          from: fromId,
          message: messageData.message,
          timestamp: messageData.timestamp
        }
      });
    } else {
      // Add message to existing conversation
      conversation.messages.push(messageData);
      conversation.lastMessage = {
        from: fromId,
        message: messageData.message,
        timestamp: messageData.timestamp
      };
    }

    await conversation.save();
    console.log('Message saved to database successfully');
  } catch (error) {
    console.error('Error saving message to database:', error);
    throw error;
  }
}

// File upload endpoint with Cloudinary fallback to local storage
router.post('/upload-file', auth, upload.single('file'), async (req, res) => {
  try {
    console.log('File upload request received');
    
    if (!req.file) {
      console.log('No file in request');
      return res.status(400).json({ message: 'No file uploaded' });
    }

    console.log('File details:', {
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size
    });

    // Try Cloudinary first
    if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
      try {
        console.log('Attempting Cloudinary upload...');
        
        // Convert buffer to base64 for Cloudinary
        const b64 = Buffer.from(req.file.buffer).toString('base64');
        const dataURI = `data:${req.file.mimetype};base64,${b64}`;

        // Upload to Cloudinary with minimal options
        const result = await cloudinary.uploader.upload(dataURI, {
          folder: 'chat-files',
          resource_type: 'auto'
        });

        console.log('Cloudinary upload successful:', result.secure_url);

        // Save file message to database
        const fileMessage = {
          from: req.user.id,
          message: `📎 ${req.file.originalname}`,
          fileUrl: result.secure_url,
          fileType: req.file.mimetype,
          fileName: req.file.originalname,
          timestamp: new Date(),
          read: false
        };

        await saveMessageToDatabase(req.user.id, req.body.to, fileMessage);

        return res.json({
          message: 'File uploaded successfully to Cloudinary',
          fileUrl: result.secure_url,
          fileName: req.file.originalname,
          fileSize: req.file.size,
          fileType: req.file.mimetype,
          cloudinaryId: result.public_id,
          storage: 'cloudinary'
        });
      } catch (cloudinaryError) {
        console.error('Cloudinary upload failed, falling back to local storage:', cloudinaryError.message);
        // Continue to local storage fallback
      }
    }

    // Fallback to local storage
    console.log('Using local storage fallback...');
    
    // Save file to local storage
    const fileName = `file-${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(req.file.originalname)}`;
    const filePath = path.join(uploadsDir, fileName);
    
    fs.writeFileSync(filePath, req.file.buffer);
    
    const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${fileName}`;
    
    console.log('Local storage upload successful:', fileUrl);

    // Save file message to database
    const fileMessage = {
      from: req.user.id,
      message: `📎 ${req.file.originalname}`,
      fileUrl: fileUrl,
      fileType: req.file.mimetype,
      fileName: req.file.originalname,
      timestamp: new Date(),
      read: false
    };

    await saveMessageToDatabase(req.user.id, req.body.to, fileMessage);

    res.json({
      message: 'File uploaded successfully to local storage',
      fileUrl: fileUrl,
      fileName: req.file.originalname,
      fileSize: req.file.size,
      fileType: req.file.mimetype,
      storage: 'local'
    });

  } catch (error) {
    console.error('File upload error details:', {
      message: error.message,
      stack: error.stack,
      code: error.code,
      http_code: error.http_code
    });
    
    res.status(500).json({ message: `Upload failed: ${error.message}` });
  }
});


// Test endpoint to check Cloudinary configuration
router.get('/test-cloudinary', auth, async (req, res) => {
  try {
    console.log('Testing Cloudinary configuration...');
    console.log('Environment variables:', {
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME ? 'Set' : 'Missing',
      api_key: process.env.CLOUDINARY_API_KEY ? 'Set' : 'Missing',
      api_secret: process.env.CLOUDINARY_API_SECRET ? 'Set' : 'Missing'
    });

    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      return res.status(500).json({ 
        message: 'Cloudinary credentials missing',
        details: {
          cloud_name: !!process.env.CLOUDINARY_CLOUD_NAME,
          api_key: !!process.env.CLOUDINARY_API_KEY,
          api_secret: !!process.env.CLOUDINARY_API_SECRET
        }
      });
    }

    // Test Cloudinary connection with credentials
    const testConfig = {
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET
    };
    
    console.log('Cloudinary config (first few chars):', {
      cloud_name: testConfig.cloud_name,
      api_key: testConfig.api_key ? testConfig.api_key.substring(0, 4) + '...' : 'Missing',
      api_secret: testConfig.api_secret ? testConfig.api_secret.substring(0, 4) + '...' : 'Missing'
    });

    // Test Cloudinary connection
    const result = await cloudinary.api.ping();
    res.json({ 
      message: 'Cloudinary configuration is working',
      ping: result,
      config: {
        cloud_name: testConfig.cloud_name,
        api_key_length: testConfig.api_key ? testConfig.api_key.length : 0,
        api_secret_length: testConfig.api_secret ? testConfig.api_secret.length : 0
      }
    });

  } catch (error) {
    console.error('Cloudinary test error:', error);
    res.status(500).json({ 
      message: 'Cloudinary configuration error',
      error: error.message,
      details: {
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME ? 'Set' : 'Missing',
        api_key: process.env.CLOUDINARY_API_KEY ? 'Set' : 'Missing',
        api_secret: process.env.CLOUDINARY_API_SECRET ? 'Set' : 'Missing'
      }
    });
  }
});

router.get('/cloudinary-signature', auth, (req, res) => {
  const timestamp = Math.floor(Date.now() / 1000);
  const folder = 'chat-files';
  const stringToSign = `folder=${folder}&timestamp=${timestamp}`;
  const signature = crypto
    .createHash('sha1')
    .update(stringToSign + process.env.CLOUDINARY_API_SECRET)
    .digest('hex');

  res.json({
    timestamp,
    signature,
    folder,
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
  });
});

// Note: Files are now served statically via /uploads route in main app

module.exports = router; 