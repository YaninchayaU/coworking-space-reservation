const express = require("express");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");
const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
const xss = require("xss-clean");
const rateLimit = require("express-rate-limit");
const hpp = require("hpp");
const cors = require("cors");

//Load env vars
dotenv.config({ path: "./config/config.env" });

//Connect to database
connectDB();
//Route files
const coworkingSpaces = require("./routes/CoworkingSpaces");
const auth = require("./routes/auth");
const app = express();
const reservations = require("./routes/reservations");
//Body parser
app.use(express.json());

//Cookie parser
app.use(express.json());

//Sanitize data
app.use(mongoSanitize());

//Set security headers
app.use(helmet());

//Prevent XSS attacks
app.use(xss());

//Rate Limiting
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 mins
  max: 100,
});
app.use(limiter);

//Prevent http
app.use(hpp());

//Enable CORS
app.use(cors());

//Mount routers
app.use("/cosr/api/CoworkingSpaces", coworkingSpaces);
app.use("/cosr/api/reservations", reservations);
app.use("/cosr/api/auth", auth);
const PORT = process.env.PORT || 5002;

const server = app.listen(
  PORT,
  console.log("Server running in ", process.env.NODE_ENV, "mode on port", PORT)
);

//Handle unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error : ${err.message}`);

  //Close server & exit process
  server.close(() => process.exit(1));
});
