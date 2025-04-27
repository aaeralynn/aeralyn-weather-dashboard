import dotenv from "dotenv";
import fetch from "node-fetch";
dotenv.config();
// Define a class for the Weather object
class Weather {
    constructor(temperature, description, icon, forecast) {
        this.temperature = temperature;
        this.description = description;
        this.icon = icon;
        this.forecast = forecast;
    }
}
// Complete the WeatherService class
class WeatherService {
    constructor() {
        this.baseURL = "https://api.openweathermap.org/data/2.5";
        this.apiKey = process.env.OPENWEATHER_API_KEY || "";
    }
    // Create fetchLocationData method
    async fetchLocationData(query) {
        const url = this.buildGeocodeQuery(query); // Use the buildGeocodeQuery method
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error("Failed to fetch location data");
        }
        const data = await response.json();
        return this.destructureLocationData(data);
    }
    // Create destructureLocationData method
    destructureLocationData(locationData) {
        return {
            lat: locationData.coord.lat,
            lon: locationData.coord.lon,
        };
    }
    // Create buildGeocodeQuery method
    buildGeocodeQuery(city) {
        return `${this.baseURL}/weather?q=${city}&appid=${this.apiKey}`;
    }
    // Create buildWeatherQuery method
    buildWeatherQuery(coordinates) {
        return `${this.baseURL}/forecast?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${this.apiKey}`;
    }
    // Create fetchAndDestructureLocationData method
    async fetchAndDestructureLocationData(city) {
        const locationData = await this.fetchLocationData(city);
        return locationData;
    }
    // Create fetchWeatherData method
    async fetchWeatherData(coordinates) {
        const response = await fetch(this.buildWeatherQuery(coordinates));
        if (!response.ok) {
            throw new Error("Failed to fetch weather data");
        }
        return await response.json();
    }
    // Build parseCurrentWeather method
    parseCurrentWeather(response) {
        const currentWeather = response.list[0];
        const weatherDescription = currentWeather.weather[0];
        return new Weather(currentWeather.main.temp, weatherDescription.description, weatherDescription.icon, this.buildForecastArray(response));
    }
    // Complete buildForecastArray method
    buildForecastArray(weatherData) {
        return weatherData.list.map((item) => ({
            date: item.dt_txt,
            temperature: item.main.temp,
            description: item.weather[0].description,
        }));
    }
    // Complete getWeatherForCity method
    async getWeatherForCity(city) {
        const coordinates = await this.fetchAndDestructureLocationData(city);
        const weatherData = await this.fetchWeatherData(coordinates);
        return this.parseCurrentWeather(weatherData);
    }
}
export default new WeatherService();
