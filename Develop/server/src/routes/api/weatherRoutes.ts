import { Router, Request, Response } from "express";
import HistoryService from "../../service/historyService.js";
import WeatherService from "../../service/weatherService.js";

const router = Router();

// POST Request with city name to retrieve weather data
router.post("/", async (req: Request, res: Response) => {
  const city = req.body.city;

  if (!city) {
    return res.status(400).json({ error: "City name is required" });
  }

  try {
    // Get weather data from city name
    const weatherData = await WeatherService.getWeatherByCity(city);

    // Check if weather data was retrieved successfully
    if (!weatherData) {
      return res
        .status(404)
        .json({ error: "Weather data not found for the specified city" });
    }

    // Save city to search history
    await HistoryService.saveCity(city);

    // Respond with the weather data
    return res.status(200).json({ weather: weatherData });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error retrieving weather data" });
  }
});

// GET search history
router.get("/history", async (req: Request, res: Response) => {
  try {
    const history = await HistoryService.getSearchHistory();
    return res.status(200).json(history);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error retrieving search history" });
  }
});

// BONUS: DELETE city from search history
router.delete("/history/:id", async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const result = await HistoryService.deleteCity(id);

    // Check if the city was successfully deleted
    if (!result) {
      return res
        .status(404)
        .json({ error: "City not found in search history" });
    }

    return res.status(204).send(); // No content
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "Error deleting city from search history" });
  }
});

export default router;
