import mongoose from "mongoose";
const dbConnection = async () => {
  await mongoose
    .connect(process.env.DB_CONNECTION)
    .then(() => {
      console.log("Connected to MongoDB atlas");
    })
    // .catch((err) => {
    //   console.error("Error connecting to MongoDB", err);
    // });
};

export default dbConnection;
