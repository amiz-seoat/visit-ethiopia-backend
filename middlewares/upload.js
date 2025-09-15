import multer from 'multer'

// store file temporarily before upload to cloudinary
const storage = multer.diskStorage({})
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true)
  } else {
    cb(new Error('Only image files are allowed!'), false)
  }
}

export const upload = multer({ storage, fileFilter })
