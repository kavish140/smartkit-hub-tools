import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Copy, Clock, Info } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useToolTracking } from "@/hooks/useToolTracking";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HowToUse from "@/components/HowToUse";

const CronGenerator = () => {
  useToolTracking("Cron Generator");
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [minute, setMinute] = useState("*");
  const [hour, setHour] = useState("*");
  const [dayOfMonth, setDayOfMonth] = useState("*");
  const [month, setMonth] = useState("*");
  const [dayOfWeek, setDayOfWeek] = useState("*");
  const [description, setDescription] = useState("");

  const generateCronExpression = (): string => {
    return `${minute} ${hour} ${dayOfMonth} ${month} ${dayOfWeek}`;
  };

  const generateDescription = (): string => {
    const minuteDesc = minute === "*" ? "every minute" : minute.includes("/") ? `every ${minute.split("/")[1]} minutes` : `at minute ${minute}`;
    const hourDesc = hour === "*" ? "every hour" : hour.includes("/") ? `every ${hour.split("/")[1]} hours` : `at ${hour}:00`;
    const dayDesc = dayOfMonth === "*" ? "every day" : `on day ${dayOfMonth}`;
    const monthDesc = month === "*" ? "" : `in ${getMonthName(month)}`;
    const weekDesc = dayOfWeek === "*" ? "" : `on ${getDayName(dayOfWeek)}`;

    let desc = "Run ";
    if (minute !== "*" || hour !== "*") {
      desc += `${minuteDesc}`;
      if (hour !== "*") desc += ` ${hourDesc}`;
    } else {
      desc += "every minute ";
    }
    
    if (dayOfWeek !== "*") desc += ` ${weekDesc}`;
    else if (dayOfMonth !== "*") desc += ` ${dayDesc}`;
    
    if (month !== "*") desc += ` ${monthDesc}`;

    return desc;
  };

  const getMonthName = (m: string): string => {
    const months = ["", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    return months[parseInt(m)] || m;
  };

  const getDayName = (d: string): string => {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    return days[parseInt(d)] || d;
  };

  useEffect(() => {
    setDescription(generateDescription());
  }, [minute, hour, dayOfMonth, month, dayOfWeek]);

  const cronExpression = generateCronExpression();

  const copyCron = () => {
    navigator.clipboard.writeText(cronExpression);
    toast({
      title: "Copied!",
      description: "Cron expression copied to clipboard",
    });
  };

  const presets = [
    { name: "Every minute", cron: "* * * * *", desc: "Run every minute" },
    { name: "Every hour", cron: "0 * * * *", desc: "Run at minute 0 of every hour" },
    { name: "Every day at midnight", cron: "0 0 * * *", desc: "Run at 00:00 every day" },
    { name: "Every day at noon", cron: "0 12 * * *", desc: "Run at 12:00 every day" },
    { name: "Every Monday at 9 AM", cron: "0 9 * * 1", desc: "Run at 09:00 on Monday" },
    { name: "Every weekday at 8 AM", cron: "0 8 * * 1-5", desc: "Run at 08:00 on weekdays" },
    { name: "First day of month", cron: "0 0 1 * *", desc: "Run at 00:00 on the 1st of every month" },
    { name: "Every 15 minutes", cron: "*/15 * * * *", desc: "Run every 15 minutes" },
    { name: "Every 6 hours", cron: "0 */6 * * *", desc: "Run at minute 0 of every 6th hour" },
    { name: "Twice daily", cron: "0 9,21 * * *", desc: "Run at 09:00 and 21:00 every day" },
  ];

  const loadPreset = (cron: string) => {
    const parts = cron.split(" ");
    setMinute(parts[0]);
    setHour(parts[1]);
    setDayOfMonth(parts[2]);
    setMonth(parts[3]);
    setDayOfWeek(parts[4]);
  };

  const minuteOptions = [
    { value: "*", label: "Every minute" },
    { value: "0", label: "At minute 0" },
    { value: "*/5", label: "Every 5 minutes" },
    { value: "*/10", label: "Every 10 minutes" },
    { value: "*/15", label: "Every 15 minutes" },
    { value: "*/30", label: "Every 30 minutes" },
  ];

  const hourOptions = [
    { value: "*", label: "Every hour" },
    { value: "0", label: "At midnight (00:00)" },
    { value: "6", label: "At 6:00 AM" },
    { value: "9", label: "At 9:00 AM" },
    { value: "12", label: "At noon (12:00)" },
    { value: "18", label: "At 6:00 PM" },
    { value: "*/6", label: "Every 6 hours" },
  ];

  const dayOfMonthOptions = [
    { value: "*", label: "Every day" },
    { value: "1", label: "1st of month" },
    { value: "15", label: "15th of month" },
    { value: "*/7", label: "Every 7 days" },
  ];

  const monthOptions = [
    { value: "*", label: "Every month" },
    { value: "1", label: "January" },
    { value: "6", label: "June" },
    { value: "12", label: "December" },
  ];

  const dayOfWeekOptions = [
    { value: "*", label: "Every day" },
    { value: "0", label: "Sunday" },
    { value: "1", label: "Monday" },
    { value: "2", label: "Tuesday" },
    { value: "3", label: "Wednesday" },
    { value: "4", label: "Thursday" },
    { value: "5", label: "Friday" },
    { value: "6", label: "Saturday" },
    { value: "1-5", label: "Weekdays (Mon-Fri)" },
    { value: "0,6", label: "Weekends (Sat-Sun)" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Button>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-6 w-6" />
              Cron Expression Generator
            </CardTitle>
            <CardDescription>
              Create and understand cron expressions for scheduling tasks. Perfect for system administrators and developers.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Result */}
            <Card className="bg-primary/5 border-primary">
              <CardContent className="pt-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-lg">Cron Expression</Label>
                    <Button onClick={copyCron} size="sm">
                      <Copy className="mr-2 h-4 w-4" />
                      Copy
                    </Button>
                  </div>
                  <code className="block text-2xl font-mono font-bold bg-background p-4 rounded-lg">
                    {cronExpression}
                  </code>
                  <div className="flex items-start gap-2 text-sm text-muted-foreground">
                    <Info className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <p>{description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="space-y-2">
                <Label>Minute (0-59)</Label>
                <Select value={minute} onValueChange={setMinute}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {minuteOptions.map(opt => (
                      <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  value={minute}
                  onChange={(e) => setMinute(e.target.value)}
                  placeholder="e.g., *, 0, */5"
                  className="font-mono text-sm"
                />
              </div>

              <div className="space-y-2">
                <Label>Hour (0-23)</Label>
                <Select value={hour} onValueChange={setHour}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {hourOptions.map(opt => (
                      <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  value={hour}
                  onChange={(e) => setHour(e.target.value)}
                  placeholder="e.g., *, 0, */6"
                  className="font-mono text-sm"
                />
              </div>

              <div className="space-y-2">
                <Label>Day of Month (1-31)</Label>
                <Select value={dayOfMonth} onValueChange={setDayOfMonth}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {dayOfMonthOptions.map(opt => (
                      <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  value={dayOfMonth}
                  onChange={(e) => setDayOfMonth(e.target.value)}
                  placeholder="e.g., *, 1, 15"
                  className="font-mono text-sm"
                />
              </div>

              <div className="space-y-2">
                <Label>Month (1-12)</Label>
                <Select value={month} onValueChange={setMonth}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {monthOptions.map(opt => (
                      <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  value={month}
                  onChange={(e) => setMonth(e.target.value)}
                  placeholder="e.g., *, 1-6"
                  className="font-mono text-sm"
                />
              </div>

              <div className="space-y-2">
                <Label>Day of Week (0-6)</Label>
                <Select value={dayOfWeek} onValueChange={setDayOfWeek}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {dayOfWeekOptions.map(opt => (
                      <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  value={dayOfWeek}
                  onChange={(e) => setDayOfWeek(e.target.value)}
                  placeholder="e.g., *, 0, 1-5"
                  className="font-mono text-sm"
                />
              </div>
            </div>

            {/* Presets */}
            <div className="space-y-3">
              <Label>Common Presets</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                {presets.map((preset) => (
                  <Button
                    key={preset.name}
                    variant="outline"
                    size="sm"
                    onClick={() => loadPreset(preset.cron)}
                    className="justify-start h-auto p-3 flex-col items-start"
                  >
                    <span className="font-semibold text-sm">{preset.name}</span>
                    <code className="text-xs font-mono text-muted-foreground">{preset.cron}</code>
                  </Button>
                ))}
              </div>
            </div>

            {/* Syntax Guide */}
            <Card className="bg-muted">
              <CardHeader>
                <CardTitle className="text-lg">Cron Syntax Guide</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="font-semibold mb-2">Special Characters:</p>
                    <ul className="space-y-1 text-muted-foreground">
                      <li><code className="bg-background px-1 rounded">*</code> - Any value</li>
                      <li><code className="bg-background px-1 rounded">,</code> - Value list separator</li>
                      <li><code className="bg-background px-1 rounded">-</code> - Range of values</li>
                      <li><code className="bg-background px-1 rounded">/</code> - Step values</li>
                    </ul>
                  </div>
                  <div>
                    <p className="font-semibold mb-2">Examples:</p>
                    <ul className="space-y-1 text-muted-foreground">
                      <li><code className="bg-background px-1 rounded">0 0 * * *</code> - Daily at midnight</li>
                      <li><code className="bg-background px-1 rounded">*/5 * * * *</code> - Every 5 minutes</li>
                      <li><code className="bg-background px-1 rounded">0 9-17 * * 1-5</code> - Weekdays 9 AM-5 PM</li>
                      <li><code className="bg-background px-1 rounded">0 0 1,15 * *</code> - 1st & 15th of month</li>
                    </ul>
                  </div>
                </div>
                <div className="pt-2 border-t">
                  <p className="font-semibold mb-2">Field Order:</p>
                  <code className="block bg-background p-2 rounded text-xs">
                    minute (0-59) | hour (0-23) | day of month (1-31) | month (1-12) | day of week (0-6)
                  </code>
                </div>
              </CardContent>
            </Card>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default CronGenerator;
