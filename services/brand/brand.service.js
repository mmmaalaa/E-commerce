import path from "path";
import sharp from "sharp";
import Brand from "../../models/brand.model.js";
import {
  createOne,
  deleteOne,
  getAll,
  getOne,
  updateOne,
} from "../handlerFactory.js";

export const resizeImage = async (req, res, next) => {
  const fileName = `brand-${Date.now()}.jpeg`;
  if (!req.file) {
    return next();
  }
  await sharp(req.file.buffer)
    .resize(250, 250)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`uploads/brands/${fileName}`);
    req.body.image = fileName;
    next();
};
export const createBrand = createOne(Brand);

export const getAllBrands = getAll(Brand,"Brand");

export const getBrand = getOne(Brand);

export const updateBrand = updateOne(Brand);

export const deleteBrand = deleteOne(Brand);
