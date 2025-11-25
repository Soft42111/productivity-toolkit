import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Cloud, Search, Wind, Droplets, Eye, Gauge, Sunrise, Sunset } from "lucide-react";
import HomeButton from "@/components/HomeButton";
import ThemeToggle from "@/components/ThemeToggle";
import Footer from "@/components/Footer";

const WeatherDashboard = () => {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchWeather = async () => {
    if (!city.trim()) {
      toast({ title: "Enter a city name", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      // Using wttr.in for free weather data
      const response = await fetch(`https://wttr.in/${encodeURIComponent(city)}?format=j1`);
      const data = await response.json();
      setWeather(data);
    } catch (error) {
      toast({ title: "Failed to fetch weather", variant: "destructive" });
    }
    setLoading(false);
  };

  const current = weather?.current_condition?.[0];
  const location = weather?.nearest_area?.[0];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/10 p-6">
      <HomeButton />
      <div className="fixed top-6 right-6 z-50">
        <ThemeToggle />
      </div>
      <div className="max-w-4xl mx-auto">
        <Card className="mb-6 border-primary/20 shadow-lg">
          <CardHeader>
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent flex items-center gap-3">
              <Cloud className="w-8 h-8 text-primary" />
              Weather Dashboard
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Input
                placeholder="Enter city name..."
                value={city}
                onChange={(e) => setCity(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && fetchWeather()}
                className="text-lg"
              />
              <Button onClick={fetchWeather} disabled={loading} size="lg">
                <Search className="w-5 h-5" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {weather && current && (
          <div className="space-y-6 animate-fade-in">
            <Card className="border-primary/20 shadow-lg">
              <CardContent className="pt-6">
                <div className="text-center mb-6">
                  <h2 className="text-4xl font-bold mb-2">
                    {location?.areaName?.[0]?.value}, {location?.country?.[0]?.value}
                  </h2>
                  <p className="text-6xl font-bold my-4">{current.temp_C}°C</p>
                  <p className="text-2xl text-muted-foreground">{current.weatherDesc?.[0]?.value}</p>
                  <p className="text-muted-foreground mt-2">Feels like {current.FeelsLikeC}°C</p>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="border-primary/20">
                <CardContent className="pt-6 text-center">
                  <Wind className="w-8 h-8 mx-auto mb-2 text-primary" />
                  <p className="text-2xl font-bold">{current.windspeedKmph} km/h</p>
                  <p className="text-sm text-muted-foreground">Wind Speed</p>
                </CardContent>
              </Card>

              <Card className="border-primary/20">
                <CardContent className="pt-6 text-center">
                  <Droplets className="w-8 h-8 mx-auto mb-2 text-accent" />
                  <p className="text-2xl font-bold">{current.humidity}%</p>
                  <p className="text-sm text-muted-foreground">Humidity</p>
                </CardContent>
              </Card>

              <Card className="border-primary/20">
                <CardContent className="pt-6 text-center">
                  <Eye className="w-8 h-8 mx-auto mb-2 text-primary" />
                  <p className="text-2xl font-bold">{current.visibility} km</p>
                  <p className="text-sm text-muted-foreground">Visibility</p>
                </CardContent>
              </Card>

              <Card className="border-primary/20">
                <CardContent className="pt-6 text-center">
                  <Gauge className="w-8 h-8 mx-auto mb-2 text-accent" />
                  <p className="text-2xl font-bold">{current.pressure} mb</p>
                  <p className="text-sm text-muted-foreground">Pressure</p>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WeatherDashboard;
