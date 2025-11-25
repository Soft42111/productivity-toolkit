import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Bell, Clock, BookOpen, MapPin, Calendar } from "lucide-react";
import { toast } from "sonner";
import ThemeToggle from "@/components/ThemeToggle";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";

interface PrayerTimes {
  Fajr: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
}

export default function IslamicReminders() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [prayerReminders, setPrayerReminders] = useState(true);
  const [quranReminders, setQuranReminders] = useState(true);
  const [quranReminderTime, setQuranReminderTime] = useState("09:00");
  const [location, setLocation] = useState({ lat: 0, lng: 0, city: "Loading..." });
  const [prayerTimes, setPrayerTimes] = useState<PrayerTimes | null>(null);
  const [method, setMethod] = useState("2"); // 2 = ISNA

  useEffect(() => {
    checkNotificationPermission();
    getLocation();
  }, []);

  useEffect(() => {
    if (location.lat && location.lng) {
      fetchPrayerTimes();
    }
  }, [location, method]);

  const checkNotificationPermission = () => {
    if ("Notification" in window) {
      setNotificationsEnabled(Notification.permission === "granted");
    }
  };

  const requestNotificationPermission = async () => {
    if ("Notification" in window) {
      const permission = await Notification.requestPermission();
      setNotificationsEnabled(permission === "granted");
      if (permission === "granted") {
        toast.success("Notifications enabled!");
        scheduleReminders();
      } else {
        toast.error("Notification permission denied");
      }
    } else {
      toast.error("Notifications not supported in this browser");
    }
  };

  const getLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          
          // Reverse geocode to get city name
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
          // Default to Mecca if location denied
          setLocation({ lat: 21.4225, lng: 39.8262, city: "Mecca (Default)" });
          toast.info("Using default location (Mecca). Enable location for accurate prayer times.");
        }
      );
    }
  };

  const fetchPrayerTimes = async () => {
    try {
      const date = new Date();
      const timestamp = Math.floor(date.getTime() / 1000);
      
      const response = await fetch(
        `https://api.aladhan.com/v1/timings/${timestamp}?latitude=${location.lat}&longitude=${location.lng}&method=${method}`
      );
      const data = await response.json();
      
      if (data.code === 200) {
        setPrayerTimes(data.data.timings);
      }
    } catch (error) {
      console.error("Error fetching prayer times:", error);
      toast.error("Failed to fetch prayer times");
    }
  };

  const scheduleReminders = () => {
    if (!notificationsEnabled) return;

    // Schedule Quran reminder
    if (quranReminders) {
      const [hours, minutes] = quranReminderTime.split(":");
      const now = new Date();
      const reminderTime = new Date();
      reminderTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
      
      if (reminderTime > now) {
        const timeout = reminderTime.getTime() - now.getTime();
        setTimeout(() => {
          showNotification(
            "Quran Reading Reminder",
            "It's time for your daily Quran reading 📖"
          );
        }, timeout);
      }
    }

    // Schedule prayer reminders
    if (prayerReminders && prayerTimes) {
      Object.entries(prayerTimes).forEach(([prayer, time]) => {
        if (["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"].includes(prayer)) {
          const [hours, minutes] = time.split(":");
          const now = new Date();
          const prayerTime = new Date();
          prayerTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
          
          if (prayerTime > now) {
            const timeout = prayerTime.getTime() - now.getTime();
            setTimeout(() => {
              showNotification(
                `${prayer} Prayer Time`,
                `It's time for ${prayer} prayer 🕌`
              );
            }, timeout);
          }
        }
      });
    }

    toast.success("Reminders scheduled for today");
  };

  const showNotification = (title: string, body: string) => {
    if (notificationsEnabled) {
      new Notification(title, {
        body,
        icon: "/favicon.png",
        badge: "/favicon.png",
      });
    }
  };

  const testNotification = () => {
    if (notificationsEnabled) {
      showNotification("Test Notification", "Your Islamic reminders are working! 🌟");
    } else {
      toast.error("Please enable notifications first");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <Link to="/" className="text-sm text-muted-foreground hover:text-foreground mb-2 inline-block">
              ← Back to Home
            </Link>
            <h1 className="text-4xl font-bold text-foreground mb-2">Islamic Reminders</h1>
            <p className="text-muted-foreground">Set up prayer times and Quran reading notifications</p>
          </div>
          <ThemeToggle />
        </div>

        <div className="grid gap-6 max-w-4xl mx-auto">
          {/* Notification Permission Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Notification Settings
              </CardTitle>
              <CardDescription>
                Enable notifications to receive prayer time and Quran reading reminders
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="notifications" className="text-base">Enable Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    {notificationsEnabled ? "Notifications are enabled ✓" : "Click to enable notifications"}
                  </p>
                </div>
                {!notificationsEnabled ? (
                  <Button onClick={requestNotificationPermission}>
                    Enable
                  </Button>
                ) : (
                  <Button variant="outline" onClick={testNotification}>
                    Test
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Location Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Location
              </CardTitle>
              <CardDescription>
                Your location is used to calculate accurate prayer times
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{location.city}</p>
                  <p className="text-sm text-muted-foreground">
                    {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
                  </p>
                </div>
                <Button variant="outline" onClick={getLocation}>
                  Update Location
                </Button>
              </div>
              
              <div className="mt-4">
                <Label htmlFor="method">Calculation Method</Label>
                <Select value={method} onValueChange={setMethod}>
                  <SelectTrigger id="method">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2">ISNA (North America)</SelectItem>
                    <SelectItem value="1">University of Islamic Sciences, Karachi</SelectItem>
                    <SelectItem value="3">Muslim World League</SelectItem>
                    <SelectItem value="4">Umm Al-Qura University, Makkah</SelectItem>
                    <SelectItem value="5">Egyptian General Authority of Survey</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Prayer Times Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Today's Prayer Times
              </CardTitle>
              <CardDescription>
                Prayer times for {location.city}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <Label htmlFor="prayer-reminders" className="text-base">Prayer Reminders</Label>
                  <p className="text-sm text-muted-foreground">Get notified for each prayer</p>
                </div>
                <Switch
                  id="prayer-reminders"
                  checked={prayerReminders}
                  onCheckedChange={setPrayerReminders}
                />
              </div>

              {prayerTimes ? (
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {Object.entries(prayerTimes)
                    .filter(([prayer]) => ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"].includes(prayer))
                    .map(([prayer, time]) => (
                      <div key={prayer} className="text-center p-3 rounded-lg bg-muted">
                        <p className="font-semibold">{prayer}</p>
                        <p className="text-lg text-primary">{time}</p>
                      </div>
                    ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground">Loading prayer times...</p>
              )}
            </CardContent>
          </Card>

          {/* Quran Reading Reminder Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Quran Reading Reminder
              </CardTitle>
              <CardDescription>
                Set a daily reminder for Quran reading
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="quran-reminders" className="text-base">Daily Quran Reminder</Label>
                  <p className="text-sm text-muted-foreground">Get a daily reminder to read Quran</p>
                </div>
                <Switch
                  id="quran-reminders"
                  checked={quranReminders}
                  onCheckedChange={setQuranReminders}
                />
              </div>

              {quranReminders && (
                <div>
                  <Label htmlFor="quran-time">Reminder Time</Label>
                  <Input
                    id="quran-time"
                    type="time"
                    value={quranReminderTime}
                    onChange={(e) => setQuranReminderTime(e.target.value)}
                    className="mt-1"
                  />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Save Button */}
          <Card>
            <CardContent className="pt-6">
              <Button 
                onClick={scheduleReminders} 
                disabled={!notificationsEnabled}
                className="w-full"
                size="lg"
              >
                <Calendar className="w-4 h-4 mr-2" />
                Schedule Today's Reminders
              </Button>
              {!notificationsEnabled && (
                <p className="text-sm text-center text-muted-foreground mt-2">
                  Enable notifications first to schedule reminders
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
}