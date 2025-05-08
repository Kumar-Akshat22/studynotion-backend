import multer from "multer";
import path from "path";
import fs from "fs";


// Optional: create temp folder if it doesn't exist
const tempDir = "./temp"
if(!fs.existsSync(tempDir)){

    fs.mkdirSync(tempDir);
}

// Configure storage settings for multer
const storage = multer.diskStorage({
    
    destination: function (req, file, cb) {
      cb(null, tempDir); // files will be saved to ./temp folder
    },

    filename: function (req, file, cb) {
      const ext = path.extname(file.originalname); // e.g., .jpg or .mp4
      cb(null, `${Date.now()}-${file.originalname}`); // give it a unique name
    },
  });

export const upload = multer({storage});