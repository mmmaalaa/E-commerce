import multer from "multer";
import apiError from "../utils/apiError.js";
const multerSettings = () => {
  const multerStorage = multer.memoryStorage();
  const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image")) {
      cb(null, true);
    } else {
      cb(new apiError("Not an image! Please upload only images.", 400), false);
    }
  };
  const upload = multer({ storage: multerStorage, fileFilter: multerFilter });
  return upload;
};

export const uploadSingleImage = (filedName) => {
  return multerSettings().single(filedName);
};

export const uploadMultipleImages = (
  fields
) => {
  return multerSettings().fields(fields);
};
