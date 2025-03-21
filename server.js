const express = require("express");
const morgan = require("morgan");
const dotenv = require("dotenv");

dotenv.config();

const dbConnection = require("./config/db");
const ApiError = require("./utils/ApiError");
const globalError = require("./middleware/errorMiddleware");
const blogRouter = require("./routes/blogRouter");
const userRouter = require("./routes/userRouter");

const app = express();

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
  console.log(`You are in ${process.env.NODE_ENV} mode`);
}

app.use(express.json());

app.use("/api/v1/blogs", blogRouter);
app.use("/api/v1/users", userRouter);

// route handling errors
app.all("*", (req, res, next) => {
  // const err = new Error();
  // next(err.message);
  next(new ApiError(`can't find this route : ${req.originalUrl}`, 400));
});

// global error handling middleware for express
app.use(globalError);

const port = process.env.PORT || 3000;

const startServer = async () => {
  try {
    if (process.env.NODE_ENV !== "test") {
      await dbConnection();
      app.listen(port, () => {
        console.log(`Server is running on port ${port} ...`);
      });
    }
  } catch (error) {
    console.error(`Failed to start server: ${error}`);
    process.exit(1);
  }
};

startServer();
