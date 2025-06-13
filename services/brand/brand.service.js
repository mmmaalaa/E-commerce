import Brand from "../../models/brand.model.js";
import {
  createOne,
  deleteOne,
  getAll,
  getOne,
  updateOne,
} from "../handlerFactory.js";

export const createBrand = createOne(Brand);

export const getAllBrands = getAll(Brand,"Brand");

export const getBrand = getOne(Brand);

export const updateBrand = updateOne(Brand);

export const deleteBrand = deleteOne(Brand);
