# Weather Dashboard

## Description
The Weather Dashboard is a web application that allows users to search for a city and retrieve current and future weather conditions. Utilizing the OpenWeather API, the dashboard provides users with an intuitive interface to view weather data, including temperature, humidity, wind speed, and a 5-day forecast. Additionally, users can access their search history to quickly view weather information for previously searched cities.

## Features
- Search for current weather conditions by city name.
- View a 5-day weather forecast for the selected city.
- Display current weather details, including:
  - City name
  - Date
  - Weather icon representation
  - Weather description
  - Temperature
  - Humidity
  - Wind speed
- Maintain a search history to easily revisit previously searched cities.

## Technologies Used
- HTML
- CSS
- JavaScript
- Express.js (Node.js framework)
- OpenWeather API
- Axios (for making HTTP requests)
- Local Storage (for saving search history)

## Acceptance Criteria
- **Search Functionality:** Users can input a city name and retrieve current and future weather conditions. The city is added to the search history.
- **Current Weather Display:** The application presents the following information for the searched city:
  - City name
  - Current date
  - Weather icon
  - Weather description
  - Temperature
  - Humidity
  - Wind speed
- **5-Day Forecast:** Users can view a detailed 5-day weather forecast, including:
  - Date
  - Weather icon
  - Temperature
  - Wind speed
  - Humidity
- **Search History:** Users can click on a city in the search history to view the current and future weather conditions for that city again.

## Installation
1. Clone the repository: 
   ```bash
   git clone https://github.com/yourusername/weather-dashboard.git
Navigate to the project directory:
cd weather-dashboard
Install the required dependencies:
npm install
Create a .env file in the root directory and add your OpenWeather API key:
OPENWEATHER_API_KEY=your_api_key_here
Usage
Start the server:
npm start
Open your web browser and navigate to http://localhost:3000.
Enter a city name in the search bar and click the search button to retrieve weather data.
View the current weather conditions and the 5-day forecast.
Click on a city in the search history to view its weather data again.
Screenshots
N/A

License
This project is licensed under the MIT License.

Contributing
Contributions are welcome! Please feel free to submit a pull request or open an issue for any suggestions or improvements.

Acknowledgments
OpenWeather API for providing weather data.
Express.js for the backend framework.
Sources Used
Xpert+ live agent and learning assistant to help with this project.
