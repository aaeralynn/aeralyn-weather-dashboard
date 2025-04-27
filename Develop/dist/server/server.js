// Import required packages
import express from "express";
import path from "path";
import dotenv from "dotenv";
import routes from "./routes";
// Initialize dotenv to load .env variables
dotenv.config();
// Create an instance of Express
const app = express();
// Define PORT (from .env or fallback to 3001)
const PORT = process.env.PORT || 3001;
// Serve static files from the client dist folder
app.use(express.static(path.join(__dirname, "../dist")));
// Implement middleware for parsing JSON and urlencoded form data
app.use(express.json()); // For parsing application/json
app.use(express.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded
// Implement middleware to connect the routes
app.use(routes);
// Start the server on the port
app.listen(PORT, () => console.log(`Listening on PORT: ${PORT}`));
