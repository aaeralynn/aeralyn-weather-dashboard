import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Define a City class with name and id properties
class City {
    constructor(id, name) {
        this.id = id;
        this.name = name;
    }
}
// Complete the HistoryService class
class HistoryService {
    constructor() {
        // Define the path to the searchHistory.json file
        this.filePath = path.join(__dirname, "searchHistory.json");
    }
    // Define a read method that reads from the searchHistory.json file
    async read() {
        try {
            const data = await fs.readFile(this.filePath, "utf-8");
            return JSON.parse(data);
        }
        catch (error) {
            console.error("Error reading search history:", error);
            return [];
        }
    }
    // Define a write method that writes the updated cities array to the searchHistory.json file
    async write(cities) {
        try {
            await fs.writeFile(this.filePath, JSON.stringify(cities, null, 2));
        }
        catch (error) {
            console.error("Error writing to search history:", error);
        }
    }
    // Define a getCities method that reads the cities from the searchHistory.json file and returns them as an array of City objects
    async getCities() {
        return await this.read();
    }
    // Define an addCity method that adds a city to the searchHistory.json file
    async addCity(cityName) {
        const cities = await this.getCities();
        const newCity = new City(Date.now().toString(), cityName); // Create a new City with a unique ID
        cities.push(newCity);
        await this.write(cities);
    }
    // BONUS TODO: Define a removeCity method that removes a city from the searchHistory.json file
    async removeCity(id) {
        let cities = await this.getCities();
        cities = cities.filter((city) => city.id !== id); // Remove the city with the matching ID
        await this.write(cities);
    }
}
export default new HistoryService();
