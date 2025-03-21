const mongoose = require("mongoose");

const dbConnection = async () =>
  await mongoose
    .connect(process.env.DATABASE_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then((conn) => {
      console.log(`Connected to MongoDB: ${conn.connection.host}`);
    })
    .catch((err) => {
      console.error("Error connecting to MongoDB", err);
      process.exit(1);
    });

module.exports = dbConnection;
