import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar as CalendarIcon, Star } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
import HomeButton from "@/components/HomeButton";

interface HijriDate {
  day: number;
  month: string;
  year: number;
  gregorianDate: string;
}

interface IslamicEvent {
  name: string;
  date: string;
  description: string;
  isSpecial: boolean;
}

export default function IslamicCalendar() {
  const [hijriDate, setHijriDate] = useState<HijriDate | null>(null);
  const [upcomingEvents, setUpcomingEvents] = useState<IslamicEvent[]>([]);

  const islamicEvents: IslamicEvent[] = [
    {
      name: "Ramadan Begins",
      date: "1st Ramadan",
      description: "The holy month of fasting begins",
      isSpecial: true,
    },
    {
      name: "Laylat al-Qadr",
      date: "27th Ramadan",
      description: "The Night of Power, better than a thousand months",
      isSpecial: true,
    },
    {
      name: "Eid al-Fitr",
      date: "1st Shawwal",
      description: "Festival of Breaking the Fast",
      isSpecial: true,
    },
    {
      name: "Day of Arafah",
      date: "9th Dhul-Hijjah",
      description: "The most important day of Hajj",
      isSpecial: true,
    },
    {
      name: "Eid al-Adha",
      date: "10th Dhul-Hijjah",
      description: "Festival of Sacrifice",
      isSpecial: true,
    },
    {
      name: "Islamic New Year",
      date: "1st Muharram",
      description: "Beginning of the Hijri year",
      isSpecial: true,
    },
    {
      name: "Day of Ashura",
      date: "10th Muharram",
      description: "Day of fasting commemorating various events",
      isSpecial: false,
    },
    {
      name: "Mawlid al-Nabi",
      date: "12th Rabi' al-Awwal",
      description: "Birth of Prophet Muhammad (PBUH)",
      isSpecial: false,
    },
    {
      name: "Isra and Mi'raj",
      date: "27th Rajab",
      description: "The Night Journey and Ascension",
      isSpecial: false,
    },
    {
      name: "Laylat al-Bara'ah",
      date: "15th Sha'ban",
      description: "Night of Forgiveness",
      isSpecial: false,
    },
  ];

  useEffect(() => {
    fetchHijriDate();
  }, []);

  const fetchHijriDate = async () => {
    try {
      const today = new Date();
      const timestamp = Math.floor(today.getTime() / 1000);
      
      const response = await fetch(
        `https://api.aladhan.com/v1/gToH/${timestamp}`
      );
      const data = await response.json();
      
      if (data.code === 200) {
        const hijri = data.data.hijri;
        setHijriDate({
          day: parseInt(hijri.day),
          month: hijri.month.en,
          year: parseInt(hijri.year),
          gregorianDate: data.data.gregorian.date,
        });
      }
    } catch (error) {
      console.error("Error fetching Hijri date:", error);
    }
  };

  useEffect(() => {
    // Set upcoming events (all events for display)
    setUpcomingEvents(islamicEvents);
  }, []);

  const hijriMonths = [
    "Muharram",
    "Safar",
    "Rabi' al-Awwal",
    "Rabi' al-Thani",
    "Jumada al-Awwal",
    "Jumada al-Thani",
    "Rajab",
    "Sha'ban",
    "Ramadan",
    "Shawwal",
    "Dhul-Qi'dah",
    "Dhul-Hijjah",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <HomeButton />
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">Islamic Calendar</h1>
            <p className="text-muted-foreground">Hijri dates and important Islamic events</p>
          </div>
          <ThemeToggle />
        </div>

        <div className="max-w-4xl mx-auto space-y-6">
          {/* Current Hijri Date Card */}
          <Card className="border-2 border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <CalendarIcon className="w-6 h-6" />
                Today's Hijri Date
              </CardTitle>
            </CardHeader>
            <CardContent>
              {hijriDate ? (
                <div className="text-center space-y-2">
                  <p className="text-5xl font-bold text-primary">
                    {hijriDate.day}
                  </p>
                  <p className="text-3xl font-semibold">
                    {hijriDate.month}
                  </p>
                  <p className="text-2xl text-muted-foreground">
                    {hijriDate.year} AH
                  </p>
                  <p className="text-sm text-muted-foreground mt-4">
                    Gregorian: {new Date(hijriDate.gregorianDate).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              ) : (
                <p className="text-center text-muted-foreground">Loading Hijri date...</p>
              )}
            </CardContent>
          </Card>

          {/* Hijri Months Reference */}
          <Card>
            <CardHeader>
              <CardTitle>Islamic Months</CardTitle>
              <CardDescription>The 12 months of the Hijri calendar</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {hijriMonths.map((month, index) => (
                  <div
                    key={month}
                    className={`p-3 rounded-lg text-center ${
                      hijriDate?.month === month
                        ? "bg-primary text-primary-foreground font-semibold"
                        : "bg-muted"
                    }`}
                  >
                    <p className="text-xs opacity-70">{index + 1}</p>
                    <p className="text-sm">{month}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Important Islamic Events */}
          <Card>
            <CardHeader>
              <CardTitle>Important Islamic Events</CardTitle>
              <CardDescription>Key dates in the Islamic calendar</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingEvents.map((event, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border-l-4 ${
                      event.isSpecial
                        ? "bg-primary/5 border-primary"
                        : "bg-muted border-muted-foreground"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-lg">{event.name}</h3>
                          {event.isSpecial && <Star className="w-4 h-4 fill-primary text-primary" />}
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{event.description}</p>
                      </div>
                      <div className="text-right ml-4">
                        <p className="text-sm font-medium text-primary">{event.date}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* About Hijri Calendar */}
          <Card>
            <CardHeader>
              <CardTitle>About the Hijri Calendar</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>
                The Islamic calendar, also known as the Hijri calendar, is a lunar calendar consisting of 12 months
                in a year of 354 or 355 days.
              </p>
              <p>
                It is used to determine the proper days of Islamic holidays and rituals, such as the annual fasting
                during Ramadan and the timing for the Hajj pilgrimage.
              </p>
              <p>
                The calendar began in 622 CE, marking the Hijra (migration) of Prophet Muhammad (peace be upon him)
                from Mecca to Medina.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
}