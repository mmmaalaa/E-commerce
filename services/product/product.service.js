import Category from "../../models/category.model.js";
import Product from "../../models/product.model.js";

import { deleteOne, updateOne, getOne, createOne, getAll } from "../handlerFactory.js";

export const createProduct = createOne(Product, {
  references: [
    { field: "category", model: Category, name: "Category" },
    { field: "subCategory", model: Category, name: "SubCategory" },
    { field: "brand", model: Category, name: "Brand" },
  ],
});

export const getAllProducts = getAll(Product,"Product");

export const getProduct = getOne(Product);

export const updateProduct = updateOne(Product);

export const deleteProduct = deleteOne(Product);
