import dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config();

// Define an interface for the Coordinates object
interface Coordinates {
  lat: number;
  lon: number;
}

// Define a class for the Weather object
class Weather {
  constructor(
    public temperature: number,
    public description: string,
    public icon: string,
    public forecast: Array<{
      date: string;
      temperature: number;
      description: string;
    }>
  ) {}
}

// Complete the WeatherService class
class WeatherService {
  private baseURL: string;
  private apiKey: string;

  constructor() {
    this.baseURL = "https://api.openweathermap.org/data/2.5";
    this.apiKey = process.env.OPENWEATHER_API_KEY || "";
  }

  // Create fetchLocationData method
  private async fetchLocationData(query: string): Promise<Coordinates> {
    const response = await fetch(
      `${this.baseURL}/weather?q=${query}&appid=${this.apiKey}`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch location data");
    }
    const data = await response.json();
    return this.destructureLocationData(data);
  }

  // Create destructureLocationData method
  private destructureLocationData(locationData: any): Coordinates {
    return {
      lat: locationData.coord.lat,
      lon: locationData.coord.lon,
    };
  }

  // Create buildGeocodeQuery method
  private buildGeocodeQuery(city: string): string {
    return `${this.baseURL}/weather?q=${city}&appid=${this.apiKey}`;
  }

  // Create buildWeatherQuery method
  private buildWeatherQuery(coordinates: Coordinates): string {
    return `${this.baseURL}/forecast?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${this.apiKey}`;
  }

  // Create fetchAndDestructureLocationData method
  private async fetchAndDestructureLocationData(
    city: string
  ): Promise<Coordinates> {
    const locationData = await this.fetchLocationData(city);
    return locationData;
  }

  // Create fetchWeatherData method
  private async fetchWeatherData(coordinates: Coordinates): Promise<any> {
    const response = await fetch(this.buildWeatherQuery(coordinates));
    if (!response.ok) {
      throw new Error("Failed to fetch weather data");
    }
    return await response.json();
  }

  // Build parseCurrentWeather method
  private parseCurrentWeather(response: any): Weather {
    const currentWeather = response.list[0];
    const weatherDescription = currentWeather.weather[0];
    return new Weather(
      currentWeather.main.temp,
      weatherDescription.description,
      weatherDescription.icon,
      this.buildForecastArray(response)
    );
  }

  // Complete buildForecastArray method
  private buildForecastArray(
    weatherData: any
  ): Array<{ date: string; temperature: number; description: string }> {
    return weatherData.list.map((item: any) => ({
      date: item.dt_txt,
      temperature: item.main.temp,
      description: item.weather[0].description,
    }));
  }

  // Complete getWeatherForCity method
  async getWeatherForCity(city: string): Promise<Weather> {
    const coordinates = await this.fetchAndDestructureLocationData(city);
    const weatherData = await this.fetchWeatherData(coordinates);
    return this.parseCurrentWeather(weatherData);
  }
}

export default new WeatherService();
