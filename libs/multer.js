
const multer = require('multer')
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, "../", "uploads"))
    },
    filename: (req, file, cb) => {
        const filename = `${file.fieldname}-${Date.now()}-${Math.floor(Math.random() * 1E9)}${path.extname(file.originalname)}`;
        cb(null, filename)
    },
})

module.exports = multer({storage: storage})