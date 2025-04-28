import dotenv from "dotenv";
import fetch from "node-fetch";
dotenv.config();
// Define a class for the Weather object
class weather {
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
        const apiKey = process.env.OPENWEATHER_API_KEY;
        if (!apiKey) {
            throw new Error("Missing OpenWeather API key. Check your .env file.");
        }
        this.apiKey = apiKey;
    }
    // Create fetchLocationData method
    async fetchLocationData(query) {
        const url = this.buildGeocodeQuery(query);
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to fetch location data: ${response.statusText}`);
        }
        const data = await response.json();
        return this.destructureLocationData(data);
    }
    // Create destructureLocationData method
    destructureLocationData(locationData) {
        if (!locationData.coord) {
            throw new Error("Invalid location data received from OpenWeather API");
        }
        return {
            lat: locationData.coord.lat,
            lon: locationData.coord.lon,
        };
    }
    // Create buildGeocodeQuery method
    buildGeocodeQuery(city) {
        return `${this.baseURL}/weather?q=${encodeURIComponent(city)}&appid=${this.apiKey}&units=imperial`;
    }
    // Create buildWeatherQuery method
    buildWeatherQuery(coordinates) {
        return `${this.baseURL}/forecast?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${this.apiKey}&units=imperial`;
    }
    // Create fetchAndDestructureLocationData method
    async fetchAndDestructureLocationData(city) {
        return await this.fetchLocationData(city);
    }
    // Create fetchWeatherData method
    async fetchWeatherData(coordinates) {
        const response = await fetch(this.buildWeatherQuery(coordinates));
        if (!response.ok) {
            throw new Error(`Failed to fetch weather data: ${response.statusText}`);
        }
        return await response.json();
    }
    // Build parseCurrentWeather method
    parseCurrentWeather(response) {
        const currentWeather = response.list[0];
        const weatherDescription = currentWeather.weather[0];
        return new weather(currentWeather.main.temp, weatherDescription.description, weatherDescription.icon, this.buildForecastArray(response));
    }
    // Complete buildForecastArray method
    buildForecastArray(weatherData) {
        // Pick 1 forecast per day (every 24 hours) for a cleaner 5-day forecast
        const forecastMap = new Map();
        weatherData.list.forEach((item) => {
            const date = item.dt_txt.split(" ")[0]; // Just the date part
            if (!forecastMap.has(date)) {
                forecastMap.set(date, {
                    date,
                    temperature: item.main.temp,
                    description: item.weather[0].description,
                });
            }
        });
        return Array.from(forecastMap.values());
    }
    // Complete getWeatherForCity method
    async getWeatherForCity(city) {
        const coordinates = await this.fetchAndDestructureLocationData(city);
        const weatherData = await this.fetchWeatherData(coordinates);
        return this.parseCurrentWeather(weatherData);
    }
}
export default new WeatherService();
