import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Globe, MapPin, Wifi, Copy, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface IPData {
  ip: string;
  city: string;
  region: string;
  country: string;
  country_name: string;
  continent_code: string;
  postal: string;
  latitude: number;
  longitude: number;
  timezone: string;
  org: string;
  asn: string;
}

const IPLookup = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [ipAddress, setIpAddress] = useState("");
  const [ipData, setIpData] = useState<IPData | null>(null);
  const [loading, setLoading] = useState(false);
  const [myIP, setMyIP] = useState("");

  // Get user's own IP on mount
  useEffect(() => {
    fetchMyIP();
  }, []);

  const fetchMyIP = async () => {
    try {
      const response = await fetch('https://ipapi.co/json/');
      const data = await response.json();
      setMyIP(data.ip);
    } catch (error) {
      console.error("Failed to fetch own IP");
    }
  };

  const lookupIP = async (ip?: string) => {
    const targetIP = ip || ipAddress.trim();
    
    if (!targetIP && !myIP) {
      toast({
        title: "Error",
        description: "Please enter an IP address",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // Using ipapi.co API (free, no API key needed for limited requests)
      // Free tier: 1,000 requests per day
      const lookupTarget = targetIP || myIP;
      const response = await fetch(`https://ipapi.co/${lookupTarget}/json/`);
      
      if (!response.ok) {
        throw new Error("Failed to lookup IP");
      }
      
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.reason || "Invalid IP address");
      }
      
      setIpData(data);
      
      toast({
        title: "IP Lookup Complete",
        description: `Found location for ${lookupTarget}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to lookup IP address",
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Information copied to clipboard",
    });
  };

  const openMaps = () => {
    if (ipData) {
      window.open(
        `https://www.google.com/maps?q=${ipData.latitude},${ipData.longitude}`,
        '_blank',
        'noopener,noreferrer'
      );
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

          <Card className="max-w-3xl mx-auto">
            <CardHeader>
              <CardTitle className="text-3xl">IP Lookup</CardTitle>
              <CardDescription>Find geolocation and information for any IP address</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter IP address (e.g., 8.8.8.8)"
                    value={ipAddress}
                    onChange={(e) => setIpAddress(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && lookupIP()}
                    className="flex-1"
                  />
                  <Button 
                    className="bg-gradient-primary border-0"
                    onClick={() => lookupIP()}
                    disabled={loading}
                  >
                    <Search className="h-4 w-4 mr-2" />
                    {loading ? "Looking up..." : "Lookup"}
                  </Button>
                </div>

                {myIP && (
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div className="flex items-center gap-2">
                      <Wifi className="h-4 w-4 text-primary" />
                      <span className="text-sm">Your IP: <span className="font-mono font-medium">{myIP}</span></span>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => lookupIP(myIP)}
                    >
                      Lookup My IP
                    </Button>
                  </div>
                )}
              </div>

              {ipData && (
                <div className="space-y-4 animate-fade-in">
                  <div className="bg-gradient-primary p-6 rounded-lg text-white text-center">
                    <Globe className="h-16 w-16 mx-auto mb-4" />
                    <div className="text-4xl font-bold font-mono mb-2">
                      {ipData.ip}
                    </div>
                    <div className="text-xl">
                      {ipData.city}, {ipData.region}
                    </div>
                    <div className="text-lg opacity-90">
                      {ipData.country_name}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="space-y-1 flex-1">
                            <div className="text-sm text-muted-foreground">IP Address</div>
                            <div className="text-lg font-mono font-medium">{ipData.ip}</div>
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => copyToClipboard(ipData.ip)}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-4">
                        <div className="space-y-1">
                          <div className="text-sm text-muted-foreground">City</div>
                          <div className="text-lg font-medium">{ipData.city || "N/A"}</div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-4">
                        <div className="space-y-1">
                          <div className="text-sm text-muted-foreground">Region</div>
                          <div className="text-lg font-medium">{ipData.region || "N/A"}</div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-4">
                        <div className="space-y-1">
                          <div className="text-sm text-muted-foreground">Country</div>
                          <div className="text-lg font-medium">{ipData.country_name}</div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-4">
                        <div className="space-y-1">
                          <div className="text-sm text-muted-foreground">Postal Code</div>
                          <div className="text-lg font-medium">{ipData.postal || "N/A"}</div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-4">
                        <div className="space-y-1">
                          <div className="text-sm text-muted-foreground">Timezone</div>
                          <div className="text-lg font-medium">{ipData.timezone}</div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-4">
                        <div className="space-y-1">
                          <div className="text-sm text-muted-foreground">Coordinates</div>
                          <div className="text-sm font-mono">
                            {ipData.latitude.toFixed(6)}, {ipData.longitude.toFixed(6)}
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-4">
                        <div className="space-y-1">
                          <div className="text-sm text-muted-foreground">Organization</div>
                          <div className="text-sm font-medium break-words">
                            {ipData.org || "N/A"}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <Button
                    className="w-full"
                    variant="outline"
                    onClick={openMaps}
                  >
                    <MapPin className="h-4 w-4 mr-2" />
                    View on Google Maps
                  </Button>

                  <Card className="bg-muted">
                    <CardContent className="p-4">
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">ASN:</span>
                          <span className="font-mono">{ipData.asn || "N/A"}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Continent:</span>
                          <span className="font-medium">{ipData.continent_code}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Country Code:</span>
                          <span className="font-mono">{ipData.country}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              <div className="bg-green-50 p-4 rounded-lg text-sm text-green-900">
                <p className="font-medium mb-1">✅ Free IP Geolocation!</p>
                <p className="text-xs">
                  Powered by{" "}
                  <a 
                    href="https://ipapi.co/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="underline font-medium"
                  >
                    ipapi.co
                  </a>
                  {" "}(free tier: 1,000 requests/day). No API key required. Get accurate location
                  data for any IPv4 or IPv6 address.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default IPLookup;
