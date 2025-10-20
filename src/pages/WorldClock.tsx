import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Clock, Plus, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HowToUse from "@/components/HowToUse";
import { useToolTracking } from "@/hooks/useToolTracking";

interface WorldTime {
  timezone: string;
  city: string;
  time: Date;
}

const WorldClock = () => {
  useToolTracking("World Clock");
  const navigate = useNavigate();
  const [clocks, setClocks] = useState<WorldTime[]>([
    { timezone: "America/New_York", city: "New York", time: new Date() },
    { timezone: "Europe/London", city: "London", time: new Date() },
    { timezone: "Asia/Tokyo", city: "Tokyo", time: new Date() },
  ]);
  const [selectedTimezone, setSelectedTimezone] = useState("America/Los_Angeles");

  const timezones = [
    { value: "Pacific/Midway", label: "Midway Island" },
    { value: "Pacific/Honolulu", label: "Hawaii" },
    { value: "America/Anchorage", label: "Alaska" },
    { value: "America/Los_Angeles", label: "Los Angeles" },
    { value: "America/Denver", label: "Denver" },
    { value: "America/Chicago", label: "Chicago" },
    { value: "America/New_York", label: "New York" },
    { value: "America/Caracas", label: "Caracas" },
    { value: "America/Santiago", label: "Santiago" },
    { value: "America/Sao_Paulo", label: "São Paulo" },
    { value: "Atlantic/Azores", label: "Azores" },
    { value: "Europe/London", label: "London" },
    { value: "Europe/Paris", label: "Paris" },
    { value: "Europe/Berlin", label: "Berlin" },
    { value: "Europe/Athens", label: "Athens" },
    { value: "Europe/Moscow", label: "Moscow" },
    { value: "Africa/Cairo", label: "Cairo" },
    { value: "Africa/Johannesburg", label: "Johannesburg" },
    { value: "Asia/Dubai", label: "Dubai" },
    { value: "Asia/Karachi", label: "Karachi" },
    { value: "Asia/Kolkata", label: "Mumbai/Delhi" },
    { value: "Asia/Dhaka", label: "Dhaka" },
    { value: "Asia/Bangkok", label: "Bangkok" },
    { value: "Asia/Shanghai", label: "Beijing" },
    { value: "Asia/Tokyo", label: "Tokyo" },
    { value: "Asia/Seoul", label: "Seoul" },
    { value: "Australia/Sydney", label: "Sydney" },
    { value: "Pacific/Auckland", label: "Auckland" },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setClocks(prev => prev.map(clock => ({
        ...clock,
        time: new Date()
      })));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (date: Date, timezone: string) => {
    return date.toLocaleTimeString('en-US', {
      timeZone: timezone,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
  };

  const formatDate = (date: Date, timezone: string) => {
    return date.toLocaleDateString('en-US', {
      timeZone: timezone,
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getOffset = (timezone: string) => {
    const now = new Date();
    const tzString = now.toLocaleString('en-US', { timeZone: timezone });
    const tzDate = new Date(tzString);
    const utcDate = new Date(now.toLocaleString('en-US', { timeZone: 'UTC' }));
    const offset = (tzDate.getTime() - utcDate.getTime()) / (1000 * 60 * 60);
    return offset >= 0 ? `UTC +${offset}` : `UTC ${offset}`;
  };

  const addClock = () => {
    const selectedTz = timezones.find(tz => tz.value === selectedTimezone);
    if (selectedTz && !clocks.find(c => c.timezone === selectedTimezone)) {
      setClocks([...clocks, {
        timezone: selectedTimezone,
        city: selectedTz.label,
        time: new Date()
      }]);
    }
  };

  const removeClock = (timezone: string) => {
    if (clocks.length > 1) {
      setClocks(clocks.filter(clock => clock.timezone !== timezone));
    }
  };

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

          <Card className="max-w-5xl mx-auto">
            <CardHeader>
              <CardTitle className="text-3xl">World Clock</CardTitle>
              <CardDescription>View time across different time zones</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex gap-2">
                <Select value={selectedTimezone} onValueChange={setSelectedTimezone}>
                  <SelectTrigger className="flex-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {timezones.map((tz) => (
                      <SelectItem key={tz.value} value={tz.value}>
                        {tz.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button onClick={addClock} className="bg-gradient-primary border-0">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Clock
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {clocks.map((clock) => (
                  <Card key={clock.timezone} className="relative">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-2xl font-bold">{clock.city}</h3>
                          <p className="text-sm text-muted-foreground">{getOffset(clock.timezone)}</p>
                        </div>
                        {clocks.length > 1 && (
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => removeClock(clock.timezone)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Clock className="h-5 w-5 text-primary" />
                          <span className="text-4xl font-bold font-mono">
                            {formatTime(clock.time, clock.timezone)}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {formatDate(clock.time, clock.timezone)}
                        </p>
                      </div>

                      <div className="mt-4 pt-4 border-t">
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <span className="text-muted-foreground">Day:</span>
                            <span className="ml-2 font-medium">
                              {new Date().toLocaleDateString('en-US', { 
                                timeZone: clock.timezone, 
                                weekday: 'short' 
                              })}
                            </span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Week:</span>
                            <span className="ml-2 font-medium">
                              {Math.ceil(new Date().getDate() / 7)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {clocks.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No clocks added. Add a timezone to get started!</p>
                </div>
              )}

              <div className="bg-muted p-4 rounded-lg text-sm">
                <h4 className="font-medium mb-2">Tips:</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• All times update in real-time</li>
                  <li>• Add multiple cities to compare time zones</li>
                  <li>• UTC offset shows the difference from Coordinated Universal Time</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default WorldClock;
