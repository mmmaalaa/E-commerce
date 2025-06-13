import Category from "../../models/category.model.js";
import SubCategory from "../../models/subCategory.model.js";
import {
  createOne,
  deleteOne,
  getAll,
  getOne,
  updateOne,
} from "../handlerFactory.js";

export const CategoryID = async (req, res, next) => {
  if (!req.body.category) req.body.category = req.params.categoryId;
  next();
};
export const createSubCategory = createOne(SubCategory, {
  references: [{ field: "category", model: Category, name: "Category" }],
});

export const getAllSubCategories = getAll(SubCategory, "SubCategory");

export const getSubCategory = getOne(SubCategory);

export const updateSubCategory = updateOne(SubCategory);

export const deleteSubCategory = deleteOne(SubCategory);
