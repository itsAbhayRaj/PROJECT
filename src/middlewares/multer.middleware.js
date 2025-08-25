import multer from "multer";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./public/temp");
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname); //use Date.now() for unique file names prevents overwriting
    },
});

export const upload = multer({ 
    storage,
    limits: {
        fileSize: 100 * 1024 * 1024, // 100MB limit for video files
        fieldSize: 1024 * 1024 // 1MB for text fields
    },
    fileFilter: function (req, file, cb) {
        // Accept video files
        if (file.fieldname === 'videoFile') {
            if (file.mimetype.startsWith('video/')) {
                cb(null, true);
            } else {
                cb(new Error('Only video files are allowed for videoFile field'), false);
            }
        }
        // Accept image files for thumbnail
        else if (file.fieldname === 'thumbnail') {
            if (file.mimetype.startsWith('image/')) {
                cb(null, true);
            } else {
                cb(new Error('Only image files are allowed for thumbnail field'), false);
            }
        }
        // Accept image files for avatar and coverImage
        else if (file.fieldname === 'avatar' || file.fieldname === 'coverImage') {
            if (file.mimetype.startsWith('image/')) {
                cb(null, true);
            } else {
                cb(new Error('Only image files are allowed'), false);
            }
        }
        else {
            cb(null, true);
        }
    }
});

// Dedicated multer error handler middleware
export const handleMulterError = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        console.error('Multer error:', err);
        
        switch (err.code) {
            case 'LIMIT_FILE_SIZE':
                return res.status(400).json({
                    success: false,
                    message: 'File too large. Maximum size is 100MB'
                });
            case 'LIMIT_FILE_COUNT':
                return res.status(400).json({
                    success: false,
                    message: 'Too many files uploaded'
                });
            case 'LIMIT_UNEXPECTED_FILE':
                return res.status(400).json({
                    success: false,
                    message: 'Unexpected file field'
                });
            case 'LIMIT_FIELD_COUNT':
                return res.status(400).json({
                    success: false,
                    message: 'Too many fields'
                });
            default:
                return res.status(400).json({
                    success: false,
                    message: 'File upload error'
                });
        }
    }
    
    if (err.message) {
        return res.status(400).json({
            success: false,
            message: err.message
        });
    }
    
    next(err);
};