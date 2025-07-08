import express from "express";
import morgan from "morgan";
import dbConnection from "./config/DB.js";
import apiError from "./utils/apiError.js";
import globalError from "./middlewares/globalError.js";
import routes from "./routes/index.js";

const app = express();

dbConnection();
// app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(`uploads`));

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
// mount routes
routes(app);

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
