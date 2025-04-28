import express from "express";
import path from "path";
import dotenv from "dotenv";
import fs from "fs";
import fetch from "node-fetch"; // If you haven't installed node-fetch yet, do so via npm install node-fetch
dotenv.config();
const app = express();
const PORT = process.env.PORT || 3001;
// Serve static files
app.use(express.static(path.join(__dirname, "../dist")));
// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Fetch weather data from OpenWeather API
const getWeatherData = async (cityName) => {
    const apiKey = process.env.OPENWEATHER_API_KEY; // Ensure you have this in your .env file
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=imperial`);
    if (!response.ok) {
        throw new Error("Weather data fetch failed");
    }
    return await response.json();
};
// Get search history from a JSON file (you can replace this with DB logic if needed)
const getSearchHistory = () => {
    try {
        const history = fs.readFileSync("searchHistory.json", "utf8");
        return JSON.parse(history);
    }
    catch (error) {
        return []; // Return an empty array if file doesn't exist or has no data
    }
};
// Save search history to a JSON file
const saveSearchHistory = (history) => {
    fs.writeFileSync("searchHistory.json", JSON.stringify(history), "utf8");
};
app.post("/weather", async (req, res) => {
    const { cityName } = req.body;
    console.log("City Name:", cityName); // Log the city name
    if (!cityName) {
        return res.status(400).json({ message: "City cannot be blank" });
    }
    try {
        const weatherData = await getWeatherData(cityName);
        console.log("Weather Data:", weatherData); // Log weather data
        // Save to history and return the data
        const history = getSearchHistory();
        history.push({ cityName, date: new Date() });
        saveSearchHistory(history);
        res.json(weatherData);
    }
    catch (error) {
        console.error("Error fetching weather data:", error);
        res.status(500).json({ message: "Error fetching weather data" });
    }
});
// Route to fetch search history
app.get("/api/weather/history", (req, res) => {
    try {
        const history = getSearchHistory(); // Get history from a file
        res.json(history);
    }
    catch (error) {
        console.error("Error fetching search history:", error);
        res.status(500).json({ message: "Error fetching search history" });
    }
});
// Route to delete a specific city from history (optional)
app.delete("/api/weather/history/:id", (req, res) => {
    const cityId = req.params.id;
    try {
        let history = getSearchHistory();
        history = history.filter((city) => city.cityName !== cityId); // Filter out the city to delete
        saveSearchHistory(history);
        res.status(200).json({ message: "City deleted from history" });
    }
    catch (error) {
        console.error("Error deleting city from history:", error);
        res.status(500).json({ message: "Error deleting city from history" });
    }
});
// Routes
import routes from "./routes/index";
app.use(routes);
// Start server
app.listen(PORT, () => console.log(`Listening on PORT: ${PORT}`));
