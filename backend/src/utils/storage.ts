import BadRequest from "../errors/bad-request.error";
import multer from "multer";

const allowedFileTypes = ["image/jpeg", "image/png", "image/gif"];

const storage = multer.diskStorage({
  destination: (_req, _file, callback) => {
    callback(null, "storage/images");
  },

  filename: (_req, file, callback) => {
    callback(null, Date.now() + "-" + file.originalname);
  },
});

export const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
  fileFilter(_req, file, callback) {
    if (allowedFileTypes.includes(file.mimetype)) {
      callback(null, true);
    } else {
      callback(new BadRequest("Invalid file type. Only images are allowed!"));
    }
  },
});
