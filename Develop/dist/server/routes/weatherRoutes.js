import { Router } from "express";
import HistoryService from "../service/historyService";
import WeatherService from "../service/weatherService";
const router = Router();
// POST Request to retrieve weather data by city name
router.post("/", async (req, // 'req' is used here
res) => {
    const { cityName } = req.body;
    if (!cityName) {
        return res.status(400).json({ error: "City name is required" });
    }
    try {
        // Get weather data for the city
        const weatherData = await WeatherService.getWeatherForCity(cityName);
        // Check if weather data was found
        if (!weatherData) {
            return res
                .status(404)
                .json({ error: "Weather data not found for the specified city" });
        }
        // Save the city to search history
        await HistoryService.addCity(cityName);
        // Respond with the weather data
        return res.status(200).json([weatherData]); // Send an array with the current weather
    }
    catch (error) {
        console.error("Error retrieving weather data:", error);
        return res.status(500).json({ error: "Error retrieving weather data" });
    }
});
// GET route to fetch search history
router.get("/history", async (_, res) => {
    try {
        const history = await HistoryService.getCities();
        return res.status(200).json(history);
    }
    catch (error) {
        console.error("Error retrieving search history:", error);
        return res.status(500).json({ error: "Error retrieving search history" });
    }
});
// DELETE route to remove city from search history
router.delete("/history/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const result = await HistoryService.removeCity(id);
        if (result === undefined) {
            return res
                .status(404)
                .json({ error: "City not found in search history" });
        }
        return res.status(204).send(); // No content response
    }
    catch (error) {
        console.error("Error deleting city from search history:", error);
        return res
            .status(500)
            .json({ error: "Error deleting city from search history" });
    }
});
export default router;
