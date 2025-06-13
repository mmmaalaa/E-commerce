import Category from "../../models/category.model.js";
import {
  createOne,
  deleteOne,
  getAll,
  getOne,
  updateOne,
} from "../handlerFactory.js";
// import { sendCategoryResponse } from "./categoryHelperFunctions.js";

export const createCategory = createOne(Category);

export const getAllCategories = getAll(Category, "Category");

export const getCategory = getOne(Category);

export const updateCategory = updateOne(Category);

export const deleteCategory = deleteOne(Category);
