import { Router, Request, Response } from "express";
import HistoryService from "../../service/historyService.js";
import WeatherService from "../../service/weatherService.js";

const router = Router();

// POST Request with city name to retrieve weather data
router.post("/", async (_req: Request, _res: Response) => {
  const city = _req.body.city;

  if (!city) {
    return _res.status(400).json({ error: "City name is required" });
  }

  try {
    // Get weather data from city name
    const weatherData = await WeatherService.getWeatherForCity(city); // Ensure this method exists in WeatherService

    // Check if weather data was retrieved successfully
    if (!weatherData) {
      return _res
        .status(404)
        .json({ error: "Weather data not found for the specified city" });
    }

    // Save city to search history
    await HistoryService.addCity(city); // Ensure this method exists in HistoryService

    // Respond with the weather data
    return _res.status(200).json({ weather: weatherData });
  } catch (error) {
    console.error("Error retrieving weather data:", error);
    return _res.status(500).json({ error: "Error retrieving weather data" });
  }
});

// GET search history
router.get("/history", async (_req: Request, _res: Response) => {
  try {
    const history = await HistoryService.getCities(); // Ensure this method exists in HistoryService
    return _res.status(200).json(history);
  } catch (error) {
    console.error("Error retrieving search history:", error);
    return _res.status(500).json({ error: "Error retrieving search history" });
  }
});

// BONUS: DELETE city from search history
router.delete("/history/:id", async (_req: Request, _res: Response) => {
  const { id } = _req.params;

  try {
    const result = await HistoryService.removeCity(id); // Ensure this method exists in HistoryService

    // Check if the city was successfully deleted
    if (result === undefined) {
      // Adjusted to handle void return type
      return _res
        .status(404)
        .json({ error: "City not found in search history" });
    }

    return _res.status(204).send(); // No content
  } catch (error) {
    console.error("Error deleting city from search history:", error);
    return _res
      .status(500)
      .json({ error: "Error deleting city from search history" });
  }
});

export default router;
