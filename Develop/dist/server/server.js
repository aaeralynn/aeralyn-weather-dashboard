import express from "express";
import path from "path";
import dotenv from "dotenv";
import routes from "./routes/index";
dotenv.config();
const app = express();
const PORT = process.env.PORT || 3001;
// Serve static files
app.use(express.static(path.join(__dirname, "../dist")));
// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Routes
app.use(routes);
// Start server
app.listen(PORT, () => console.log(`Listening on PORT: ${PORT}`));
