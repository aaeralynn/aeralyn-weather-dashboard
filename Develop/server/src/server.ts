import dotenv from "dotenv";
import express from "express";
import path from "path"; // Import path for serving static files
dotenv.config();

// Import the routes
import routes from "./routes/index.js";

const app = express();

const PORT = process.env.PORT || 3001;

// Serve static files from the client dist folder
app.use(express.static(path.join(__dirname, "dist"))); // Adjust the path as necessary

// Implement middleware for parsing JSON and urlencoded form data
app.use(express.json()); // For parsing application/json
app.use(express.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded

// Implement middleware to connect the routes
app.use(routes);

// Start the server on the port
app.listen(PORT, () => console.log(`Listening on PORT: ${PORT}`));
