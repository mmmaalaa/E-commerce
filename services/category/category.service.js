import sharp from "sharp";
import Category from "../../models/category.model.js";
import {
  createOne,
  deleteOne,
  getAll,
  getOne,
  updateOne,
} from "../handlerFactory.js";

// const multerStorage = multer.memoryStorage();
// const multerFilter = (req, file, cb) => {
//   if (file.mimetype.startsWith("image")) {
//     cb(null, true);
//   } else {
//     cb(new apiError("Not an image! Please upload only images."), false);
//   }
// };
// const upload = multer({ storage: multerStorage, fileFilter: multerFilter });

export const resizeImage = async (req, res, next) => {
  const fileName = `category-${Date.now()}.jpeg`;
  if (!req.file) {
    return next();
  }
  await sharp(req.file.buffer)
    .resize(600, 600)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`uploads/categories/${fileName}`);
    req.body.image = fileName;
    next();
};
export const createCategory = createOne(Category);

export const getAllCategories = getAll(Category, "Category");

export const getCategory = getOne(Category);

export const updateCategory = updateOne(Category);

export const deleteCategory = deleteOne(Category);
