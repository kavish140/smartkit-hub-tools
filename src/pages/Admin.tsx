import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, BarChart3, Globe, Smartphone, Calendar, Users, Filter, ChevronLeft, ChevronRight, TrendingUp, Activity, LogOut } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  Area,
  AreaChart
} from 'recharts';

const ADMIN_PASSWORD = "K@vish49101284";
const VISITS_PER_PAGE = 5;
const REMEMBER_ME_KEY = "admin_remember_me";

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

interface DailyVisit {
  date: string;
  visits: number;
  uniqueVisitors: number;
}

interface BrowserStat {
  name: string;
  value: number;
}

interface ToolStat {
  name: string;
  count: number;
}

interface Stats {
  totalVisitors: number;
  uniqueVisitors: number;
  pageViews: number;
  devices: DeviceStat[];
  locations: LocationStat[];
  recentVisits: Visit[];
  dailyVisits: DailyVisit[];
  browsers: BrowserStat[];
  botPercentage: number;
  topTools: ToolStat[];
  totalToolUsage: number;
}

export default function Admin() {
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [showBotsOnly, setShowBotsOnly] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [stats, setStats] = useState<Stats>({
    totalVisitors: 0,
    uniqueVisitors: 0,
    pageViews: 0,
    devices: [],
    locations: [],
    recentVisits: [],
    dailyVisits: [],
    browsers: [],
    botPercentage: 0,
    topTools: [],
    totalToolUsage: 0,
  });
  const [loading, setLoading] = useState(false);

  // Check if user is already authenticated via localStorage
  useEffect(() => {
    const remembered = localStorage.getItem(REMEMBER_ME_KEY);
    if (remembered === "true") {
      setAuthenticated(true);
    }
  }, []);

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

        // Browser breakdown
        const browserCounts: { [key: string]: number } = {};
        visits.forEach(v => {
          browserCounts[v.browser || 'Unknown'] = (browserCounts[v.browser || 'Unknown'] || 0) + 1;
        });
        const browsers = Object.entries(browserCounts)
          .map(([name, value]) => ({ name, value }))
          .sort((a, b) => b.value - a.value)
          .slice(0, 5); // Top 5 browsers

        // Daily visits for last 7 days
        const dailyVisitsMap: { [key: string]: { visits: Set<string>, total: number } } = {};
        const last7Days = Array.from({ length: 7 }, (_, i) => {
          const date = new Date();
          date.setDate(date.getDate() - i);
          return date.toISOString().split('T')[0];
        }).reverse();

        last7Days.forEach(date => {
          dailyVisitsMap[date] = { visits: new Set(), total: 0 };
        });

        visits.forEach(v => {
          const date = new Date(v.timestamp).toISOString().split('T')[0];
          if (dailyVisitsMap[date]) {
            dailyVisitsMap[date].total += 1;
            if (v.ip) dailyVisitsMap[date].visits.add(v.ip);
          }
        });

        const dailyVisits = last7Days.map(date => ({
          date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          visits: dailyVisitsMap[date].total,
          uniqueVisitors: dailyVisitsMap[date].visits.size,
        }));

        // Bot percentage
        const botCount = visits.filter(v => v.is_bot).length;
        const botPercentage = totalVisitors > 0 ? Math.round((botCount / totalVisitors) * 100) : 0;

        // Fetch tool usage data
        let toolQuery = supabase
          .from('tool_usage')
          .select('*')
          .order('timestamp', { ascending: false });
        
        if (!showBotsOnly) {
          toolQuery = toolQuery.or('is_bot.is.null,is_bot.eq.false');
        }

        const { data: toolUsage, error: toolError } = await toolQuery;
        
        let topTools: ToolStat[] = [];
        let totalToolUsage = 0;

        if (!toolError && toolUsage) {
          totalToolUsage = toolUsage.length;
          
          // Count tool usage
          const toolCounts: { [key: string]: number } = {};
          toolUsage.forEach(t => {
            toolCounts[t.tool_name] = (toolCounts[t.tool_name] || 0) + 1;
          });
          
          topTools = Object.entries(toolCounts)
            .map(([name, count]) => ({ name, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 10); // Top 10 tools
        }

        setStats({
          totalVisitors,
          uniqueVisitors: uniqueIPs,
          pageViews: totalVisitors,
          devices,
          locations,
          recentVisits: visits.slice(0, 10), // Latest 10 visits
          dailyVisits,
          browsers,
          botPercentage,
          topTools,
          totalToolUsage,
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
      
      // Save to localStorage if "Remember Me" is checked
      if (rememberMe) {
        localStorage.setItem(REMEMBER_ME_KEY, "true");
      } else {
        localStorage.removeItem(REMEMBER_ME_KEY);
      }
    } else {
      setError("Incorrect password");
    }
  };

  const handleLogout = () => {
    setAuthenticated(false);
    setPassword("");
    localStorage.removeItem(REMEMBER_ME_KEY);
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
              
              {/* Remember Me Checkbox */}
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="remember-me"
                  checked={rememberMe}
                  onChange={e => setRememberMe(e.target.checked)}
                  className="w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500 focus:ring-2 cursor-pointer"
                />
                <Label 
                  htmlFor="remember-me" 
                  className="text-sm font-medium text-gray-700 cursor-pointer select-none"
                >
                  Remember me on this device
                </Label>
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
        <div className="flex items-center justify-between mb-10">
          <div className="inline-flex items-center justify-center gap-3 bg-white rounded-2xl shadow-lg px-6 py-3">
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
          
          {/* Logout Button */}
          <Button 
            onClick={handleLogout}
            variant="outline"
            className="bg-white hover:bg-red-50 border-2 border-red-200 hover:border-red-400 text-red-600 hover:text-red-700 shadow-md"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
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
                    <p className="text-sm">{stats.uniqueVisitors} unique</p>
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
                    <p className="text-sm font-medium opacity-90">Tool Uses</p>
                  </div>
                  <p className="text-5xl font-bold mb-2">{stats.totalToolUsage}</p>
                  <p className="text-sm opacity-90">Total tool interactions</p>
                </div>
                <div className="w-20 h-20 bg-white/10 rounded-full -mr-4 -mt-4"></div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-xl bg-gradient-to-br from-orange-500 to-red-500 text-white overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur">
                      <Activity className="h-5 w-5 text-white" />
                    </div>
                    <p className="text-sm font-medium opacity-90">
                      {stats.topTools.length > 0 ? "Top Tool" : "Bot Traffic"}
                    </p>
                  </div>
                  <p className="text-5xl font-bold mb-2">
                    {stats.topTools.length > 0 ? stats.topTools[0].count : `${stats.botPercentage}%`}
                  </p>
                  <p className="text-sm opacity-90 truncate">
                    {stats.topTools.length > 0 ? stats.topTools[0].name : "Automated visitors"}
                  </p>
                </div>
                <div className="w-20 h-20 bg-white/10 rounded-full -mr-4 -mt-4"></div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Visitor Trend Chart */}
        <Card className="mb-8 border-2 border-purple-100 shadow-lg bg-white">
          <CardHeader className="border-b bg-gradient-to-r from-purple-50 to-pink-50">
            <CardTitle className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-4 w-4 text-white" />
              </div>
              Visitor Trends (Last 7 Days)
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={stats.dailyVisits}>
                <defs>
                  <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorUnique" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ec4899" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#ec4899" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="date" stroke="#6b7280" style={{ fontSize: '12px' }} />
                <YAxis stroke="#6b7280" style={{ fontSize: '12px' }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '2px solid #e5e7eb', 
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                  }} 
                />
                <Legend wrapperStyle={{ paddingTop: '20px' }} />
                <Area type="monotone" dataKey="visits" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorVisits)" name="Total Visits" />
                <Area type="monotone" dataKey="uniqueVisitors" stroke="#ec4899" fillOpacity={1} fill="url(#colorUnique)" name="Unique Visitors" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Browser & Device Analytics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Browser Pie Chart */}
          <Card className="border-2 border-blue-100 shadow-lg bg-white">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50 border-b">
              <CardTitle className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                  <Globe className="h-4 w-4 text-white" />
                </div>
                Browser Distribution
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={stats.browsers}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {stats.browsers.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'][index % 5]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Device Bar Chart */}
          <Card className="border-2 border-green-100 shadow-lg bg-white">
            <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b">
              <CardTitle className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                  <Smartphone className="h-4 w-4 text-white" />
                </div>
                Device Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={stats.devices}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="type" stroke="#6b7280" style={{ fontSize: '12px' }} />
                  <YAxis stroke="#6b7280" style={{ fontSize: '12px' }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '2px solid #e5e7eb', 
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                    }} 
                  />
                  <Bar dataKey="count" fill="url(#barGradient)" radius={[8, 8, 0, 0]} />
                  <defs>
                    <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10b981" />
                      <stop offset="100%" stopColor="#059669" />
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Top Tools Chart */}
        {stats.topTools.length > 0 && (
          <Card className="mb-8 border-2 border-indigo-100 shadow-lg bg-white">
            <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50 border-b">
              <CardTitle className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
                  <BarChart3 className="h-4 w-4 text-white" />
                </div>
                Most Popular Tools ({stats.totalToolUsage} total uses)
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={stats.topTools} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis type="number" stroke="#6b7280" style={{ fontSize: '12px' }} />
                  <YAxis dataKey="name" type="category" width={150} stroke="#6b7280" style={{ fontSize: '12px' }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '2px solid #e5e7eb', 
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                    }} 
                  />
                  <Bar dataKey="count" fill="url(#toolBarGradient)" radius={[0, 8, 8, 0]} />
                  <defs>
                    <linearGradient id="toolBarGradient" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#8b5cf6" />
                      <stop offset="100%" stopColor="#ec4899" />
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        {/* Top Locations */}
        <Card className="mb-8 border-2 border-orange-100 shadow-lg bg-white">
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
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {stats.locations.map((loc, index) => (
                  <div key={loc.country} className="text-center p-4 bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl hover:shadow-md transition-shadow border-2 border-orange-100">
                    <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-orange-500 to-amber-500 rounded-full flex items-center justify-center text-white text-xl font-bold">
                      {index + 1}
                    </div>
                    <p className="font-semibold text-gray-700 mb-1">{loc.country}</p>
                    <p className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">{loc.count}</p>
                    <p className="text-xs text-gray-500 mt-1">visits</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-4">No location data yet</p>
            )}
          </CardContent>
        </Card>

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
              <>
                <div className="space-y-3">
                  {stats.recentVisits
                    .slice((currentPage - 1) * VISITS_PER_PAGE, currentPage * VISITS_PER_PAGE)
                    .map((visit, index) => (
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
                
                {/* Pagination Controls */}
                {stats.recentVisits.length > VISITS_PER_PAGE && (
                  <div className="flex items-center justify-between mt-6 pt-4 border-t">
                    <p className="text-sm text-muted-foreground">
                      Showing {((currentPage - 1) * VISITS_PER_PAGE) + 1} to {Math.min(currentPage * VISITS_PER_PAGE, stats.recentVisits.length)} of {stats.recentVisits.length} visits
                    </p>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="gap-1"
                      >
                        <ChevronLeft className="h-4 w-4" />
                        Previous
                      </Button>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: Math.ceil(stats.recentVisits.length / VISITS_PER_PAGE) }, (_, i) => i + 1).map(page => (
                          <Button
                            key={page}
                            variant={currentPage === page ? "default" : "outline"}
                            size="sm"
                            onClick={() => setCurrentPage(page)}
                            className={currentPage === page ? "bg-gradient-to-r from-purple-600 to-pink-600" : ""}
                          >
                            {page}
                          </Button>
                        ))}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(p => Math.min(Math.ceil(stats.recentVisits.length / VISITS_PER_PAGE), p + 1))}
                        disabled={currentPage === Math.ceil(stats.recentVisits.length / VISITS_PER_PAGE)}
                        className="gap-1"
                      >
                        Next
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </>
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
