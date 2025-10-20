import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Play, Pause, RotateCcw, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useToolTracking } from "@/hooks/useToolTracking";

const PomodoroTimer = () => {
  useToolTracking("Pomodoro Timer");
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [workMinutes, setWorkMinutes] = useState(25);
  const [breakMinutes, setBreakMinutes] = useState(5);
  const [longBreakMinutes, setLongBreakMinutes] = useState(15);
  const [pomodorosUntilLongBreak, setPomodorosUntilLongBreak] = useState(4);
  
  const [timeLeft, setTimeLeft] = useState(workMinutes * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState<"work" | "break" | "longBreak">("work");
  const [pomodorosCompleted, setPomodorosCompleted] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleTimerComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, timeLeft]);

  const handleTimerComplete = () => {
    setIsRunning(false);
    
    if (mode === "work") {
      const newCount = pomodorosCompleted + 1;
      setPomodorosCompleted(newCount);
      
      if (newCount % pomodorosUntilLongBreak === 0) {
        setMode("longBreak");
        setTimeLeft(longBreakMinutes * 60);
        toast({
          title: "Work Complete! 🎉",
          description: `Time for a long break (${longBreakMinutes} min)`,
        });
      } else {
        setMode("break");
        setTimeLeft(breakMinutes * 60);
        toast({
          title: "Work Complete! ☕",
          description: `Time for a short break (${breakMinutes} min)`,
        });
      }
    } else {
      setMode("work");
      setTimeLeft(workMinutes * 60);
      toast({
        title: "Break Over! 💪",
        description: `Ready for another work session? (${workMinutes} min)`,
      });
    }

    // Browser notification
    if (Notification.permission === "granted") {
      new Notification(mode === "work" ? "Time for a break!" : "Back to work!", {
        body: mode === "work" ? "Great job! Take a break." : "Let's get back to work!",
        icon: "/favicon.ico"
      });
    }
  };

  const toggleTimer = () => {
    if (!isRunning && Notification.permission === "default") {
      Notification.requestPermission();
    }
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setMode("work");
    setTimeLeft(workMinutes * 60);
  };

  const skipToNext = () => {
    setIsRunning(false);
    if (mode === "work") {
      const newCount = pomodorosCompleted + 1;
      setPomodorosCompleted(newCount);
      
      if (newCount % pomodorosUntilLongBreak === 0) {
        setMode("longBreak");
        setTimeLeft(longBreakMinutes * 60);
      } else {
        setMode("break");
        setTimeLeft(breakMinutes * 60);
      }
    } else {
      setMode("work");
      setTimeLeft(workMinutes * 60);
    }
  };

  const applySettings = () => {
    setTimeLeft(workMinutes * 60);
    setMode("work");
    setIsRunning(false);
    setShowSettings(false);
    toast({
      title: "Settings Applied",
      description: "Timer has been reset with new settings",
    });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const progress = mode === "work" 
    ? ((workMinutes * 60 - timeLeft) / (workMinutes * 60)) * 100
    : mode === "break"
    ? ((breakMinutes * 60 - timeLeft) / (breakMinutes * 60)) * 100
    : ((longBreakMinutes * 60 - timeLeft) / (longBreakMinutes * 60)) * 100;

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

          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="text-3xl">Pomodoro Timer</CardTitle>
              <CardDescription>Boost productivity with focused work sessions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Tabs value={showSettings ? "settings" : "timer"} onValueChange={(v) => setShowSettings(v === "settings")}>
                <TabsList className="grid grid-cols-2 w-full">
                  <TabsTrigger value="timer">Timer</TabsTrigger>
                  <TabsTrigger value="settings">Settings</TabsTrigger>
                </TabsList>

                <TabsContent value="timer" className="space-y-6 mt-6">
                  <div className="text-center space-y-4">
                    <div className={`text-lg font-medium ${mode === "work" ? "text-red-600" : "text-green-600"}`}>
                      {mode === "work" ? "🎯 Focus Time" : mode === "break" ? "☕ Short Break" : "🌴 Long Break"}
                    </div>
                    
                    <div className="relative">
                      <svg className="w-64 h-64 mx-auto" viewBox="0 0 200 200">
                        <circle
                          cx="100"
                          cy="100"
                          r="90"
                          fill="none"
                          stroke="#e5e7eb"
                          strokeWidth="12"
                        />
                        <circle
                          cx="100"
                          cy="100"
                          r="90"
                          fill="none"
                          stroke={mode === "work" ? "#ef4444" : "#10b981"}
                          strokeWidth="12"
                          strokeDasharray={`${2 * Math.PI * 90}`}
                          strokeDashoffset={`${2 * Math.PI * 90 * (1 - progress / 100)}`}
                          strokeLinecap="round"
                          transform="rotate(-90 100 100)"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-6xl font-bold">{formatTime(timeLeft)}</div>
                      </div>
                    </div>

                    <div className="flex justify-center gap-4">
                      <Button
                        size="lg"
                        onClick={toggleTimer}
                        className="w-32 bg-gradient-primary border-0"
                      >
                        {isRunning ? <><Pause className="h-5 w-5 mr-2" />Pause</> : <><Play className="h-5 w-5 mr-2" />Start</>}
                      </Button>
                      <Button
                        size="lg"
                        variant="outline"
                        onClick={resetTimer}
                      >
                        <RotateCcw className="h-5 w-5 mr-2" />
                        Reset
                      </Button>
                    </div>

                    <Button
                      variant="ghost"
                      onClick={skipToNext}
                      className="text-sm"
                    >
                      Skip to {mode === "work" ? "Break" : "Work"}
                    </Button>
                  </div>

                  <div className="bg-muted p-4 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Pomodoros Completed</span>
                      <span className="text-2xl font-bold">{pomodorosCompleted}</span>
                    </div>
                    <div className="flex gap-2 mt-3">
                      {[...Array(pomodorosUntilLongBreak)].map((_, i) => (
                        <div
                          key={i}
                          className={`h-2 flex-1 rounded ${i < pomodorosCompleted % pomodorosUntilLongBreak ? "bg-primary" : "bg-gray-300"}`}
                        />
                      ))}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="settings" className="space-y-4 mt-6">
                  <div className="space-y-2">
                    <Label htmlFor="work">Work Duration (minutes)</Label>
                    <Input
                      id="work"
                      type="number"
                      min="1"
                      max="60"
                      value={workMinutes}
                      onChange={(e) => setWorkMinutes(parseInt(e.target.value) || 25)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="break">Short Break (minutes)</Label>
                    <Input
                      id="break"
                      type="number"
                      min="1"
                      max="30"
                      value={breakMinutes}
                      onChange={(e) => setBreakMinutes(parseInt(e.target.value) || 5)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="longBreak">Long Break (minutes)</Label>
                    <Input
                      id="longBreak"
                      type="number"
                      min="1"
                      max="60"
                      value={longBreakMinutes}
                      onChange={(e) => setLongBreakMinutes(parseInt(e.target.value) || 15)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cycles">Pomodoros Until Long Break</Label>
                    <Input
                      id="cycles"
                      type="number"
                      min="2"
                      max="10"
                      value={pomodorosUntilLongBreak}
                      onChange={(e) => setPomodorosUntilLongBreak(parseInt(e.target.value) || 4)}
                    />
                  </div>

                  <Button 
                    className="w-full bg-gradient-primary border-0" 
                    onClick={applySettings}
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Apply Settings
                  </Button>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PomodoroTimer;
