import express from "express";
import dotenv from "dotenv";
import { initDB } from "./config/db.js";
import rateLimiter from "./middleware/rateLimiter.js";
import transactionsRoute from "./routes/transactionsRoute.js";

dotenv.config();

const app = express();

//middleware : is a function that runs in the middle i.e between the request and the response;
//They help in authentication checks, or anything before req or res.
app.use(rateLimiter);
//built-in middleware
app.use(express.json());

//Our customized middleware = this middleware runs "Hey, we hit a req, the method is GET" before the app.get displays "I am working..."
// app.use((req, res, next) => {
//   console.log("Hey, we hit a req, the method is ", req.method);
//   next();
// });

const PORT = process.env.PORT || 5001;

//This just to check if your API is working
app.get("/", (req, res) => {
  res.send("I am Working...");
});

app.use("/api/transactions", transactionsRoute);

//Note: In case later you want to create a route for "products"
// and you will create a route for that in the "routes folder" that is about products
//app.use("/api/products", transactionsRoute);

initDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
