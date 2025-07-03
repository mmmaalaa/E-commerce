import Category from "../../models/category.model.js";
import Product from "../../models/product.model.js";
import {
  deleteOne,
  updateOne,
  getOne,
  createOne,
  getAll,
} from "../handlerFactory.js";
import sharp from "sharp";

export const resizeImage = async (req, res, next) => {
  if (!req.files) {
    return next();
  }
  if (req.files.imageCover) {
    const fileName = `product-${Date.now()}-cover.jpeg`;
    await sharp(req.files.imageCover[0].buffer)
      .resize(2500, 1333)
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .toFile(`uploads/products/${fileName}`);
    req.body.imageCover = fileName;
  }
  if (req.files.images) {
    req.body.images = [];
    await Promise.all(
      req.files.images.map(async (file, index) => {
        const fileName = `product-${Date.now()}-${index + 1}.jpeg`;
        await sharp(file.buffer)
          .resize(600, 600)
          .toFormat("jpeg")
          .jpeg({ quality: 90 })
          .toFile(`uploads/products/${fileName}`);
        req.body.images.push(fileName);
      })
    );
  }
  next();
};

export const createProduct = createOne(Product, {
  references: [
    { field: "category", model: Category, name: "Category" },
    { field: "subCategory", model: Category, name: "SubCategory" },
    { field: "brand", model: Category, name: "Brand" },
  ],
});

export const getAllProducts = getAll(Product, "Product");

export const getProduct = getOne(Product, "reviews");

export const updateProduct = updateOne(Product);

export const deleteProduct = deleteOne(Product);
