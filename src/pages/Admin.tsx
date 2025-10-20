import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, BarChart3, Globe, Smartphone, Calendar, Users } from "lucide-react";

const ADMIN_PASSWORD = "changeme123"; // Change this to a strong password!

export default function Admin() {
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setAuthenticated(true);
      setError("");
    } else {
      setError("Incorrect password");
    }
  };

  // Placeholder stats (replace with real analytics API integration)
  const stats = {
    totalVisitors: 0,
    uniqueVisitors: 0,
    pageViews: 0,
    devices: [
      { type: "Desktop", count: 0 },
      { type: "Mobile", count: 0 },
      { type: "Tablet", count: 0 },
    ],
    locations: [
      { country: "India", count: 0 },
      { country: "USA", count: 0 },
      { country: "Other", count: 0 },
    ],
    recent: [],
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-blue-600" />
              Admin Login
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <Input
                type="password"
                placeholder="Enter admin password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
              {error && <p className="text-red-600 text-sm">{error}</p>}
              <Button type="submit" className="w-full bg-gradient-primary border-0">Login</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <BarChart3 className="h-10 w-10 text-purple-600" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Admin Analytics Dashboard
            </h1>
          </div>
          <p className="text-muted-foreground text-lg">
            View user stats, device info, locations, and more (connect to analytics API for real data)
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-600" />
                Visitors
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{stats.totalVisitors}</p>
              <p className="text-muted-foreground">Total Visitors</p>
              <p className="text-lg mt-2">{stats.uniqueVisitors} unique</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-purple-600" />
                Page Views
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{stats.pageViews}</p>
              <p className="text-muted-foreground">Total Page Views</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Smartphone className="h-5 w-5 text-green-600" />
                Devices
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {stats.devices.map(device => (
                  <li key={device.type} className="flex justify-between">
                    <span>{device.type}</span>
                    <span className="font-bold">{device.count}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-orange-600" />
                Locations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {stats.locations.map(loc => (
                  <li key={loc.country} className="flex justify-between">
                    <span>{loc.country}</span>
                    <span className="font-bold">{loc.count}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-indigo-600" />
              Recent Visits
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Connect to analytics API to show recent visits by date, device, and location.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
