import categoryRoutes from "./category.route.js";
import subcategoryRoutes from "./subCategory.route.js";
import productRoutes from "./product.route.js";
import BrandRoutes from "./brand.route.js";
import userRoutes from "./user.route.js";
import authRoutes from "./auth.route.js";
import reviewRoutes from "./review.route.js";
import wishlistRouter from "./wishlist.route.js";
import addressRouter from "./address.route.js";
import couponRouter from "./coupon.route.js";
import cartRouter from "./cart.route.js";
import orderRouter from "./order.route.js";

const routes = (app)=>{
  app.use("/api/v1/categories", categoryRoutes);
  app.use("/api/v1/subcategories", subcategoryRoutes);
  app.use("/api/v1/brands", BrandRoutes);
  app.use("/api/v1/products", productRoutes);
  app.use("/api/v1/user", userRoutes);
  app.use("/api/v1/auth", authRoutes);
  app.use("/api/v1/review", reviewRoutes);
  app.use("/api/v1/wishlist", wishlistRouter);
  app.use("/api/v1/address", addressRouter);
  app.use("/api/v1/coupon", couponRouter);
  app.use("/api/v1/cart", cartRouter);
  app.use("/api/v1/order", orderRouter);
}

export default routes