import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Compass, MapPin, Navigation } from "lucide-react";
import { toast } from "sonner";
import ThemeToggle from "@/components/ThemeToggle";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
import HomeButton from "@/components/HomeButton";

export default function QiblaCompass() {
  const [location, setLocation] = useState({ lat: 0, lng: 0, city: "Loading..." });
  const [qiblaDirection, setQiblaDirection] = useState(0);
  const [deviceHeading, setDeviceHeading] = useState(0);
  const [compassSupported, setCompassSupported] = useState(false);
  const [permissionGranted, setPermissionGranted] = useState(false);

  const KAABA_LAT = 21.4225;
  const KAABA_LNG = 39.8262;

  useEffect(() => {
    getLocation();
    checkCompassSupport();
  }, []);

  useEffect(() => {
    if (location.lat && location.lng) {
      calculateQiblaDirection();
    }
  }, [location]);

  const checkCompassSupport = () => {
    if (window.DeviceOrientationEvent) {
      setCompassSupported(true);
    } else {
      toast.error("Compass not supported on this device");
    }
  };

  const requestCompassPermission = async () => {
    if (typeof (DeviceOrientationEvent as any).requestPermission === "function") {
      try {
        const permission = await (DeviceOrientationEvent as any).requestPermission();
        if (permission === "granted") {
          setPermissionGranted(true);
          startCompass();
          toast.success("Compass access granted");
        } else {
          toast.error("Compass permission denied");
        }
      } catch (error) {
        toast.error("Error requesting compass permission");
      }
    } else {
      // Permission not required on Android or desktop
      setPermissionGranted(true);
      startCompass();
    }
  };

  const startCompass = () => {
    window.addEventListener("deviceorientationabsolute", handleOrientation as any, true);
    window.addEventListener("deviceorientation", handleOrientation as any, true);
  };

  const handleOrientation = (event: DeviceOrientationEvent) => {
    let heading = 0;
    
    if (event.absolute && event.alpha !== null) {
      heading = 360 - event.alpha;
    } else if (event.alpha !== null) {
      heading = 360 - event.alpha;
    }
    
    setDeviceHeading(heading);
  };

  const getLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          
          try {
            const response = await fetch(
              `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`
            );
            const data = await response.json();
            setLocation({ lat, lng, city: data.city || data.locality || "Your Location" });
          } catch {
            setLocation({ lat, lng, city: "Your Location" });
          }
        },
        () => {
          setLocation({ lat: 21.4225, lng: 39.8262, city: "Mecca (Default)" });
          toast.info("Using default location (Mecca). Enable location for accurate Qibla direction.");
        }
      );
    }
  };

  const calculateQiblaDirection = () => {
    const lat1 = (location.lat * Math.PI) / 180;
    const lng1 = (location.lng * Math.PI) / 180;
    const lat2 = (KAABA_LAT * Math.PI) / 180;
    const lng2 = (KAABA_LNG * Math.PI) / 180;

    const dLng = lng2 - lng1;

    const y = Math.sin(dLng) * Math.cos(lat2);
    const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLng);
    
    let bearing = Math.atan2(y, x);
    bearing = (bearing * 180) / Math.PI;
    bearing = (bearing + 360) % 360;

    setQiblaDirection(bearing);
  };

  const getQiblaAngle = () => {
    return qiblaDirection - deviceHeading;
  };

  const getDistance = () => {
    const R = 6371; // Earth's radius in km
    const lat1 = (location.lat * Math.PI) / 180;
    const lat2 = (KAABA_LAT * Math.PI) / 180;
    const dLat = ((KAABA_LAT - location.lat) * Math.PI) / 180;
    const dLng = ((KAABA_LNG - location.lng) * Math.PI) / 180;

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    return distance.toFixed(0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <HomeButton />
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">Qibla Compass</h1>
            <p className="text-muted-foreground">Find the direction to Kaaba for prayer</p>
          </div>
          <ThemeToggle />
        </div>

        <div className="max-w-2xl mx-auto space-y-6">
          {/* Location Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Your Location
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="font-medium text-lg">{location.city}</p>
                <p className="text-sm text-muted-foreground">
                  {location.lat.toFixed(4)}°, {location.lng.toFixed(4)}°
                </p>
                <p className="text-sm text-muted-foreground">
                  Distance to Kaaba: <span className="font-semibold">{getDistance()} km</span>
                </p>
                <Button variant="outline" onClick={getLocation} className="mt-2">
                  Update Location
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Compass Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Compass className="w-5 h-5" />
                Qibla Direction
              </CardTitle>
              <CardDescription>
                {compassSupported
                  ? "Point your device forward to find Qibla direction"
                  : "Compass not supported on this device"}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center space-y-6">
              {/* Compass Display */}
              <div className="relative w-80 h-80">
                {/* Compass Circle */}
                <div
                  className="absolute inset-0 rounded-full border-8 border-primary/20"
                  style={{
                    transform: `rotate(${-deviceHeading}deg)`,
                    transition: "transform 0.1s ease-out",
                  }}
                >
                  {/* Cardinal Directions */}
                  <div className="absolute top-2 left-1/2 -translate-x-1/2 text-sm font-bold">N</div>
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 text-sm font-bold">E</div>
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-sm font-bold">S</div>
                  <div className="absolute left-2 top-1/2 -translate-y-1/2 text-sm font-bold">W</div>
                </div>

                {/* Qibla Arrow */}
                <div
                  className="absolute inset-0 flex items-center justify-center"
                  style={{
                    transform: `rotate(${getQiblaAngle()}deg)`,
                    transition: "transform 0.1s ease-out",
                  }}
                >
                  <Navigation className="w-24 h-24 text-primary fill-primary" />
                </div>

                {/* Center Point */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-6 h-6 rounded-full bg-primary border-4 border-background" />
                </div>
              </div>

              <div className="text-center space-y-2">
                <p className="text-2xl font-bold text-primary">{qiblaDirection.toFixed(0)}°</p>
                <p className="text-sm text-muted-foreground">Qibla Direction from North</p>
              </div>

              {compassSupported && !permissionGranted && (
                <Button onClick={requestCompassPermission} size="lg" className="w-full">
                  <Compass className="w-4 h-4 mr-2" />
                  Enable Compass
                </Button>
              )}

              {!compassSupported && (
                <div className="text-center p-4 bg-muted rounded-lg">
                  <p className="text-sm">
                    Compass not available. The Qibla direction is <strong>{qiblaDirection.toFixed(0)}°</strong> from North.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Instructions Card */}
          <Card>
            <CardHeader>
              <CardTitle>How to Use</CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                <li>Allow location access for accurate Qibla direction</li>
                <li>Enable compass access when prompted (iOS devices)</li>
                <li>Hold your device flat and point it forward</li>
                <li>Rotate your body until the arrow points upward</li>
                <li>The Kaaba is now in front of you</li>
              </ol>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
}