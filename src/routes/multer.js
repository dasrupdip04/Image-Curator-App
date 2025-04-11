const path = require('path');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');


const uploadPath = path.join(__dirname, '../public/images/uploads');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniquename = uuidv4();
    cb(null, uniquename+path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });
module.exports = upload;
