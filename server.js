import express from "express";
import morgan from "morgan";
import dbConnection from "./config/DB.js";
import categoryRoutes from "./routes/category.route.js";
import subcategoryRoutes from "./routes/subCategory.route.js";
import productRoutes from "./routes/product.route.js";
import BrandRoutes from "./routes/brand.route.js";
import userRoutes from "./routes/user.route.js";
import authRoutes from "./routes/auth.route.js";
import reviewRoutes from "./routes/review.route.js";
import wishlistRouter from "./routes/wishlist.route.js";
import addressRouter from "./routes/address.route.js";
import apiError from "./utils/apiError.js";
import globalError from "./middlewares/globalError.js";

const app = express();

dbConnection();
// app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(`uploads`));


if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
app.use("/api/v1/categories", categoryRoutes);
app.use("/api/v1/subcategories",subcategoryRoutes );
app.use("/api/v1/brands",BrandRoutes );
app.use("/api/v1/products",productRoutes );
app.use("/api/v1/user",userRoutes );
app.use("/api/v1/auth",authRoutes );
app.use("/api/v1/review",reviewRoutes );
app.use("/api/v1/wishlist",wishlistRouter );
app.use("/api/v1/address",addressRouter );
app.use((req, res, next) => {
  next(new apiError("Not Found", 404));
});
// handle global error
app.use(globalError);
const port = process.env.PORT || 8000;
const server = app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
// handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.log("Unhandled Rejection! Shutting down...");
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
