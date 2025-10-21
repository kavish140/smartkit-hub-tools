import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Cloud, Droplets, Wind, Eye, Gauge, Sun, Moon, CloudRain, CloudSnow, CloudDrizzle, CloudLightning } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HowToUse from "@/components/HowToUse";
import { useToolTracking } from "@/hooks/useToolTracking";

interface WeatherData {
  location: string;
  country: string;
  temperature: number;
  feelsLike: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  pressure: number;
  visibility: number;
  icon: string;
}

const WeatherForecast = () => {
  useToolTracking("Weather Forecast");
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchWeather = async () => {
    if (!city.trim()) {
      toast({
        title: "Error",
        description: "Please enter a city name",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // Step 1: Get coordinates from city name using geocoding API
      // Use CORS proxy for geocoding API
      const geocodeUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`;
      const geocodeProxyUrl = `https://corsproxy.io/?${encodeURIComponent(geocodeUrl)}`;
      const geocodeResponse = await fetch(geocodeProxyUrl);
      
      if (!geocodeResponse.ok) {
        throw new Error("Failed to find city");
      }
      
      const geocodeData = await geocodeResponse.json();
      
      if (!geocodeData.results || geocodeData.results.length === 0) {
        throw new Error("City not found");
      }
      
      const location = geocodeData.results[0];
      const { latitude, longitude, name, country } = location;
      
      // Step 2: Get weather data using coordinates (Open-Meteo is free, no API key needed)
      // Use CORS proxy for weather API
      const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,pressure_msl,visibility&timezone=auto`;
      const weatherProxyUrl = `https://corsproxy.io/?${encodeURIComponent(weatherUrl)}`;
      const weatherResponse = await fetch(weatherProxyUrl);
      
      if (!weatherResponse.ok) {
        throw new Error("Failed to fetch weather data");
      }
      
      const weatherData = await weatherResponse.json();
      const current = weatherData.current;
      
      // Map weather codes to conditions
      const getWeatherCondition = (code: number): string => {
        if (code === 0) return "Clear";
        if (code <= 3) return "Partly Cloudy";
        if (code <= 48) return "Foggy";
        if (code <= 67) return "Rainy";
        if (code <= 77) return "Snowy";
        if (code <= 82) return "Showers";
        if (code <= 99) return "Thunderstorm";
        return "Clear";
      };
      
      const getWeatherIcon = (code: number): string => {
        if (code === 0) return "01d";
        if (code <= 3) return "02d";
        if (code <= 48) return "50d";
        if (code <= 67) return "10d";
        if (code <= 77) return "13d";
        if (code <= 82) return "09d";
        if (code <= 99) return "11d";
        return "01d";
      };
      
      setWeather({
        location: name,
        country: country || "Unknown",
        temperature: Math.round(current.temperature_2m),
        feelsLike: Math.round(current.apparent_temperature),
        condition: getWeatherCondition(current.weather_code),
        humidity: current.relative_humidity_2m,
        windSpeed: Math.round(current.wind_speed_10m),
        pressure: Math.round(current.pressure_msl),
        visibility: Math.round(current.visibility / 1000), // meters to km
        icon: getWeatherIcon(current.weather_code),
      });
      
      toast({
        title: "Weather Loaded",
        description: `Weather data for ${name} fetched successfully`,
      });
    } catch (error) {
      console.error("Weather fetch error:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to fetch weather data. Please try again.",
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  const getWeatherIcon = (condition: string) => {
    const icons: { [key: string]: JSX.Element } = {
      Clear: <Sun className="h-16 w-16 text-yellow-500" />,
      Clouds: <Cloud className="h-16 w-16 text-gray-500" />,
      Rain: <CloudRain className="h-16 w-16 text-blue-500" />,
      Drizzle: <CloudDrizzle className="h-16 w-16 text-blue-400" />,
      Snow: <CloudSnow className="h-16 w-16 text-blue-200" />,
      Thunderstorm: <CloudLightning className="h-16 w-16 text-purple-500" />,
      Mist: <Cloud className="h-16 w-16 text-gray-400" />,
      Fog: <Cloud className="h-16 w-16 text-gray-400" />,
    };
    return icons[condition] || <Cloud className="h-16 w-16 text-gray-500" />;
  };

  const popularCities = ["London", "New York", "Tokyo", "Paris", "Sydney", "Mumbai"];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-gradient-subtle py-12">
        <div className="container mx-auto px-4">
          <Button 
            variant="ghost" 
            onClick={() => navigate("/")}
            className="mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Tools
          </Button>

          <Card className="max-w-3xl mx-auto">
            <CardHeader>
              <CardTitle className="text-3xl">Weather Forecast</CardTitle>
              <CardDescription>Real-time weather data for any location</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex gap-2">
                <Input
                  placeholder="Enter city name..."
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && fetchWeather()}
                  className="flex-1"
                />
                <Button 
                  className="bg-gradient-primary border-0" 
                  onClick={fetchWeather}
                  disabled={loading}
                >
                  <Cloud className="h-4 w-4 mr-2" />
                  {loading ? "Loading..." : "Get Weather"}
                </Button>
              </div>

              <div className="flex flex-wrap gap-2">
                <span className="text-sm text-muted-foreground">Quick search:</span>
                {popularCities.map((popularCity) => (
                  <Button
                    key={popularCity}
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setCity(popularCity);
                    }}
                  >
                    {popularCity}
                  </Button>
                ))}
              </div>

              {weather && (
                <div className="space-y-6">
                  <div className="bg-gradient-primary p-8 rounded-lg text-white text-center">
                    <div className="flex justify-center mb-4">
                      {getWeatherIcon(weather.condition)}
                    </div>
                    <h2 className="text-4xl font-bold mb-2">
                      {weather.location}, {weather.country}
                    </h2>
                    <div className="text-7xl font-bold mb-2">
                      {weather.temperature}°C
                    </div>
                    <div className="text-xl opacity-90">
                      {weather.condition}
                    </div>
                    <div className="text-sm opacity-75 mt-2">
                      Feels like {weather.feelsLike}°C
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Card>
                      <CardContent className="p-4 text-center">
                        <Droplets className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                        <div className="text-2xl font-bold">{weather.humidity}%</div>
                        <div className="text-sm text-muted-foreground">Humidity</div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-4 text-center">
                        <Wind className="h-8 w-8 mx-auto mb-2 text-green-500" />
                        <div className="text-2xl font-bold">{weather.windSpeed} km/h</div>
                        <div className="text-sm text-muted-foreground">Wind Speed</div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-4 text-center">
                        <Gauge className="h-8 w-8 mx-auto mb-2 text-purple-500" />
                        <div className="text-2xl font-bold">{weather.pressure} hPa</div>
                        <div className="text-sm text-muted-foreground">Pressure</div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-4 text-center">
                        <Eye className="h-8 w-8 mx-auto mb-2 text-orange-500" />
                        <div className="text-2xl font-bold">{weather.visibility} km</div>
                        <div className="text-sm text-muted-foreground">Visibility</div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}

              <div className="bg-green-50 dark:bg-green-950 p-4 rounded-lg text-sm border border-green-200 dark:border-green-800">
                <p className="font-medium mb-1 text-green-900 dark:text-green-100">✅ Live Weather Data Enabled!</p>
                <p className="text-xs text-green-800 dark:text-green-200">
                  Weather data is fetched in real-time from{' '}
                  <a
                    href="https://open-meteo.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline font-medium"
                  >
                    Open-Meteo
                  </a>
                  {' '}using a public CORS proxy. No API key required! If you see a fetch error, the proxy may be temporarily unavailable.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default WeatherForecast;
