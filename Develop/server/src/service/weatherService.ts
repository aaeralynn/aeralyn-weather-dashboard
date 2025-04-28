import axios from "axios"; // You can use axios for making HTTP requests
import { config } from "dotenv"; // If you use environment variables for your API key
config();

class WeatherService {
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = process.env.OPENWEATHER_API_KEY ?? ""; // Use your OpenWeather API key here
    this.baseUrl = "http://api.openweathermap.org/data/2.5/"; // OpenWeather API base URL
  }

  // Fetch weather data for a city
  async getWeatherForCity(city: string) {
    try {
      const response = await axios.get(`${this.baseUrl}weather`, {
        params: {
          q: city,
          appid: this.apiKey,
          units: "imperial", // or "metric" for Celsius
        },
      });

      const weatherData = response.data;

      if (!weatherData || !weatherData.main) {
        throw new Error("Weather data not found");
      }

      // Parse the relevant weather data
      const parsedData = {
        city: weatherData.name,
        date: new Date().toLocaleDateString(),
        icon: weatherData.weather[0].icon,
        iconDescription: weatherData.weather[0].description,
        tempF: weatherData.main.temp,
        windSpeed: weatherData.wind.speed,
        humidity: weatherData.main.humidity,
      };

      return parsedData;
    } catch (error) {
      console.error("Error fetching weather data:", error);
      throw error;
    }
  }
}

export default new WeatherService();
