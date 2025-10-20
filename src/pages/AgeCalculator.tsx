import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Calendar as CalendarIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HowToUse from "@/components/HowToUse";
import { useToolTracking } from "@/hooks/useToolTracking";

const AgeCalculator = () => {
  useToolTracking("Age Calculator");
  const navigate = useNavigate();
  const [birthDate, setBirthDate] = useState("");
  const [targetDate, setTargetDate] = useState(new Date().toISOString().split('T')[0]);
  const [result, setResult] = useState<{
    years: number;
    months: number;
    days: number;
    totalDays: number;
    totalWeeks: number;
    totalMonths: number;
    totalHours: number;
    totalMinutes: number;
    nextBirthday: string;
  } | null>(null);

  const calculateAge = () => {
    if (!birthDate) return;

    const birth = new Date(birthDate);
    const target = new Date(targetDate);

    if (birth > target) {
      alert("Birth date cannot be after target date!");
      return;
    }

    let years = target.getFullYear() - birth.getFullYear();
    let months = target.getMonth() - birth.getMonth();
    let days = target.getDate() - birth.getDate();

    if (days < 0) {
      months--;
      const prevMonth = new Date(target.getFullYear(), target.getMonth(), 0);
      days += prevMonth.getDate();
    }

    if (months < 0) {
      years--;
      months += 12;
    }

    const totalDays = Math.floor((target.getTime() - birth.getTime()) / (1000 * 60 * 60 * 24));
    const totalWeeks = Math.floor(totalDays / 7);
    const totalMonths = years * 12 + months;
    const totalHours = totalDays * 24;
    const totalMinutes = totalHours * 60;

    // Calculate next birthday
    let nextBirthday = new Date(target.getFullYear(), birth.getMonth(), birth.getDate());
    if (nextBirthday < target) {
      nextBirthday = new Date(target.getFullYear() + 1, birth.getMonth(), birth.getDate());
    }
    const daysToNextBirthday = Math.floor((nextBirthday.getTime() - target.getTime()) / (1000 * 60 * 60 * 24));

    setResult({
      years,
      months,
      days,
      totalDays,
      totalWeeks,
      totalMonths,
      totalHours,
      totalMinutes,
      nextBirthday: `${daysToNextBirthday} days`,
    });
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

          {/* How to Use Guide */}
          <HowToUse
            steps={[
              {
                title: "Enter Birth Date",
                description: "Select or type your birth date in the first date field using the date picker."
              },
              {
                title: "Choose Target Date",
                description: "By default, it calculates your current age. Change the target date to calculate age on a future or past date."
              },
              {
                title: "Click Calculate",
                description: "Press the Calculate Age button to see detailed results including years, months, and days."
              },
              {
                title: "View Results",
                description: "See your age broken down in years, months, days, and total days lived. Results update instantly."
              }
            ]}
            tips={[
              { text: "Use the target date to see how old you'll be on future dates" },
              { text: "Calculate age differences between any two dates" },
              { text: "Perfect for legal age verification and milestone tracking" },
              { text: "Total days calculation useful for anniversaries" }
            ]}
          />

          <Card className="max-w-2xl mx-auto mt-6">
            <CardHeader>
              <CardTitle className="text-3xl">Age Calculator</CardTitle>
              <CardDescription>Calculate your age and time differences precisely</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="birthDate">Birth Date</Label>
                  <Input
                    id="birthDate"
                    type="date"
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="targetDate">Calculate Age On</Label>
                  <Input
                    id="targetDate"
                    type="date"
                    value={targetDate}
                    onChange={(e) => setTargetDate(e.target.value)}
                  />
                </div>
              </div>

              <Button 
                className="w-full bg-gradient-primary border-0" 
                size="lg"
                onClick={calculateAge}
                disabled={!birthDate}
              >
                <CalendarIcon className="h-4 w-4 mr-2" />
                Calculate Age
              </Button>

              {result && (
                <div className="space-y-4 mt-6">
                  <div className="bg-gradient-primary p-6 rounded-lg text-white text-center">
                    <div className="text-4xl font-bold mb-2">
                      {result.years} Years, {result.months} Months, {result.days} Days
                    </div>
                    <p className="text-sm opacity-90">Your exact age</p>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="bg-muted p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold text-primary">{result.totalMonths}</div>
                      <div className="text-sm text-muted-foreground">Total Months</div>
                    </div>
                    <div className="bg-muted p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold text-primary">{result.totalWeeks}</div>
                      <div className="text-sm text-muted-foreground">Total Weeks</div>
                    </div>
                    <div className="bg-muted p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold text-primary">{result.totalDays}</div>
                      <div className="text-sm text-muted-foreground">Total Days</div>
                    </div>
                    <div className="bg-muted p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold text-primary">{result.totalHours.toLocaleString()}</div>
                      <div className="text-sm text-muted-foreground">Total Hours</div>
                    </div>
                    <div className="bg-muted p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold text-primary">{result.totalMinutes.toLocaleString()}</div>
                      <div className="text-sm text-muted-foreground">Total Minutes</div>
                    </div>
                    <div className="bg-muted p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold text-primary">{result.nextBirthday}</div>
                      <div className="text-sm text-muted-foreground">To Next Birthday</div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AgeCalculator;
