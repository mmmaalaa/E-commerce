import mongoose from "mongoose";
import clearExpiredCoupons from "../utils/clearExpiredCoupons.js";
const dbConnection = async () => {
  await mongoose.connect(process.env.DB_CONNECTION).then(() => {
    console.log("Connected to MongoDB atlas");
    clearExpiredCoupons();
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB", err);
  });
};

export default dbConnection;
