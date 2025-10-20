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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 p-6">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <Card className="w-full max-w-md shadow-2xl border-0 relative z-10">
          <CardHeader className="text-center pb-2">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
              <Eye className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Admin Dashboard
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-2">Enter password to access analytics</p>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <Input
                  type="password"
                  placeholder="Enter admin password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  className="h-12 text-lg border-2 focus:border-purple-500"
                />
                {error && (
                  <div className="flex items-center gap-2 mt-2 text-red-600 text-sm bg-red-50 p-2 rounded">
                    <span>⚠️</span>
                    <span>{error}</span>
                  </div>
                )}
              </div>
              <Button type="submit" className="w-full h-12 text-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg">
                Access Dashboard
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-4 md:p-8">
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header Section */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center gap-3 mb-4 bg-white rounded-2xl shadow-lg px-6 py-3">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
              <BarChart3 className="h-6 w-6 text-white" />
            </div>
            <div className="text-left">
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Analytics Dashboard
              </h1>
              <p className="text-sm text-muted-foreground">Real-time insights</p>
            </div>
          </div>
        </div>

        {/* Bot Filter Toggle */}
        <Card className="mb-8 border-2 border-purple-100 shadow-lg bg-white/80 backdrop-blur">
          <CardContent className="py-5">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                  <Filter className="h-5 w-5 text-white" />
                </div>
                <div>
                  <Label htmlFor="bot-filter" className="text-base font-semibold cursor-pointer block">
                    Show All Visits
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    {showBotsOnly 
                      ? "Including bots and crawlers" 
                      : "Real human visitors only"}
                  </p>
                </div>
              </div>
              <Switch
                id="bot-filter"
                checked={showBotsOnly}
                onCheckedChange={setShowBotsOnly}
                className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-purple-600 data-[state=checked]:to-pink-600"
              />
            </div>
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="border-0 shadow-xl bg-gradient-to-br from-blue-500 to-cyan-500 text-white overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur">
                      <Users className="h-5 w-5 text-white" />
                    </div>
                    <p className="text-sm font-medium opacity-90">Visitors</p>
                  </div>
                  <p className="text-5xl font-bold mb-2">{stats.totalVisitors}</p>
                  <div className="flex items-center gap-2 bg-white/20 rounded-full px-3 py-1 w-fit">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                    <p className="text-sm">{stats.uniqueVisitors} unique visitors</p>
                  </div>
                </div>
                <div className="w-20 h-20 bg-white/10 rounded-full -mr-4 -mt-4"></div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-xl bg-gradient-to-br from-purple-500 to-pink-500 text-white overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur">
                      <BarChart3 className="h-5 w-5 text-white" />
                    </div>
                    <p className="text-sm font-medium opacity-90">Page Views</p>
                  </div>
                  <p className="text-5xl font-bold mb-2">{stats.pageViews}</p>
                  <p className="text-sm opacity-90">Total interactions</p>
                </div>
                <div className="w-20 h-20 bg-white/10 rounded-full -mr-4 -mt-4"></div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Devices and Locations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="border-2 border-green-100 shadow-lg bg-white">
            <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b">
              <CardTitle className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                  <Smartphone className="h-4 w-4 text-white" />
                </div>
                <span>Devices</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              {stats.devices.length > 0 ? (
                <ul className="space-y-3">
                  {stats.devices.map(device => (
                    <li key={device.type} className="flex items-center justify-between p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg hover:shadow-md transition-shadow">
                      <span className="font-medium text-gray-700">{device.type}</span>
                      <span className="text-xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">{device.count}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-center text-muted-foreground py-4">No device data yet</p>
              )}
            </CardContent>
          </Card>
          
          <Card className="border-2 border-orange-100 shadow-lg bg-white">
            <CardHeader className="bg-gradient-to-r from-orange-50 to-amber-50 border-b">
              <CardTitle className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-amber-500 rounded-lg flex items-center justify-center">
                  <Globe className="h-4 w-4 text-white" />
                </div>
                <span>Top Locations</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              {stats.locations.length > 0 ? (
                <ul className="space-y-3">
                  {stats.locations.map((loc, index) => (
                    <li key={loc.country} className="flex items-center justify-between p-3 bg-gradient-to-r from-orange-50 to-amber-50 rounded-lg hover:shadow-md transition-shadow">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 bg-gradient-to-br from-orange-500 to-amber-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                          {index + 1}
                        </span>
                        <span className="font-medium text-gray-700">{loc.country}</span>
                      </div>
                      <span className="text-xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">{loc.count}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-center text-muted-foreground py-4">No location data yet</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Recent Visits Section */}
        <Card className="border-2 border-indigo-100 shadow-xl bg-white">
          <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50 border-b">
            <CardTitle className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
                <Calendar className="h-4 w-4 text-white" />
              </div>
              <span>Recent Visits</span>
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
