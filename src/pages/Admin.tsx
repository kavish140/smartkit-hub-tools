import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, BarChart3, Globe, Smartphone, Calendar, Users, Filter } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const ADMIN_PASSWORD = "changeme123"; // Change this to a strong password!

interface Visit {
  id: string;
  timestamp: string;
  device: string | null;
  browser: string | null;
  country: string | null;
  city: string | null;
  ip: string | null;
  user_agent: string | null;
  is_bot: boolean | null;
}

interface DeviceStat {
  type: string;
  count: number;
}

interface LocationStat {
  country: string;
  count: number;
}

interface Stats {
  totalVisitors: number;
  uniqueVisitors: number;
  pageViews: number;
  devices: DeviceStat[];
  locations: LocationStat[];
  recentVisits: Visit[];
}

export default function Admin() {
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [error, setError] = useState("");
  const [showBotsOnly, setShowBotsOnly] = useState(false);
  const [stats, setStats] = useState<Stats>({
    totalVisitors: 0,
    uniqueVisitors: 0,
    pageViews: 0,
    devices: [],
    locations: [],
    recentVisits: [],
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (authenticated) {
      fetchStats();
    }
  }, [authenticated, showBotsOnly]);

  const fetchStats = async () => {
    setLoading(true);
    try {
      // Fetch all visits (filter bots if toggle is off)
      let query = supabase
        .from('visits')
        .select('*')
        .order('timestamp', { ascending: false });
      
      // Filter out bots if showBotsOnly is false
      if (!showBotsOnly) {
        query = query.or('is_bot.is.null,is_bot.eq.false');
      }

      const { data: visits, error } = await query;

      if (error) throw error;

      if (visits) {
        // Calculate stats
        const totalVisitors = visits.length;
        const uniqueIPs = new Set(visits.map(v => v.ip).filter(Boolean)).size;
        
        // Device breakdown
        const deviceCounts: { [key: string]: number } = {};
        visits.forEach(v => {
          deviceCounts[v.device || 'Unknown'] = (deviceCounts[v.device || 'Unknown'] || 0) + 1;
        });
        const devices = Object.entries(deviceCounts).map(([type, count]) => ({ type, count }));

        // Location breakdown
        const locationCounts: { [key: string]: number } = {};
        visits.forEach(v => {
          const country = v.country || 'Unknown';
          locationCounts[country] = (locationCounts[country] || 0) + 1;
        });
        const locations = Object.entries(locationCounts)
          .map(([country, count]) => ({ country, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 5); // Top 5 countries

        setStats({
          totalVisitors,
          uniqueVisitors: uniqueIPs,
          pageViews: totalVisitors,
          devices,
          locations,
          recentVisits: visits.slice(0, 10), // Latest 10 visits
        });
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setAuthenticated(true);
      setError("");
    } else {
      setError("Incorrect password");
    }
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
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <BarChart3 className="h-10 w-10 text-purple-600" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Admin Analytics Dashboard
            </h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Real-time visitor statistics and analytics
          </p>
        </div>

        {/* Bot Filter Toggle */}
        <Card className="mb-6">
          <CardContent className="py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Filter className="h-5 w-5 text-blue-600" />
                <Label htmlFor="bot-filter" className="text-base font-semibold cursor-pointer">
                  Show All Visits (including bots)
                </Label>
              </div>
              <Switch
                id="bot-filter"
                checked={showBotsOnly}
                onCheckedChange={setShowBotsOnly}
              />
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              {showBotsOnly 
                ? "Showing all traffic including search engine crawlers and bots" 
                : "Showing real human visitors only (bots filtered out)"}
            </p>
          </CardContent>
        </Card>

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
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                <p className="ml-3 text-muted-foreground">Loading visits...</p>
              </div>
            ) : stats.recentVisits.length > 0 ? (
              <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                {stats.recentVisits.map((visit, index) => (
                  <Card key={index} className="border-l-4 border-l-purple-500 hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-purple-600" />
                          <span className="text-sm font-semibold text-gray-700">
                            {new Date(visit.timestamp).toLocaleDateString('en-US', { 
                              month: 'short', 
                              day: 'numeric', 
                              year: 'numeric' 
                            })}
                          </span>
                          <span className="text-sm text-gray-500">
                            {new Date(visit.timestamp).toLocaleTimeString('en-US', { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </span>
                        </div>
                        {visit.is_bot && (
                          <span className="bg-gradient-to-r from-orange-400 to-red-400 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-sm">
                            🤖 Bot
                          </span>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="flex items-center gap-2">
                          <Smartphone className="h-4 w-4 text-blue-600" />
                          <span className="text-sm">
                            <span className="font-medium text-gray-700">{visit.device}</span>
                            <span className="text-gray-400 mx-1">•</span>
                            <span className="text-gray-600">{visit.browser}</span>
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Globe className="h-4 w-4 text-green-600" />
                          <span className="text-sm text-gray-700">
                            {visit.city ? `${visit.city}, ` : ''}{visit.country || 'Unknown'}
                          </span>
                        </div>
                      </div>
                      
                      <div className="mt-3 pt-3 border-t border-gray-100">
                        <div className="flex items-center gap-2">
                          <div className="flex items-center justify-center w-6 h-6 bg-purple-100 rounded">
                            <span className="text-xs font-mono text-purple-700">IP</span>
                          </div>
                          <span className="text-sm font-mono text-gray-600">{visit.ip || 'N/A'}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg font-medium">No visits recorded yet</p>
                <p className="text-gray-400 text-sm mt-2">Visits will appear here as users access your site</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
