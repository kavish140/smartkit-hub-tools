import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Smartphone, Monitor, Globe, Copy } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HowToUse from "@/components/HowToUse";
import { useToolTracking } from "@/hooks/useToolTracking";

const DeviceInfo = () => {
  useToolTracking("Device Info");
  const navigate = useNavigate();
  const { toast } = useToast();
  const [deviceInfo, setDeviceInfo] = useState({
    browser: "",
    browserVersion: "",
    os: "",
    platform: "",
    language: "",
    cookiesEnabled: false,
    onlineStatus: false,
    screenWidth: 0,
    screenHeight: 0,
    windowWidth: 0,
    windowHeight: 0,
    colorDepth: 0,
    pixelRatio: 0,
    timezone: "",
    userAgent: "",
  });

  useEffect(() => {
    const getBrowserInfo = () => {
      const ua = navigator.userAgent;
      let browser = "Unknown";
      let version = "Unknown";

      if (ua.indexOf("Firefox") > -1) {
        browser = "Firefox";
        version = ua.match(/Firefox\/([0-9.]+)/)?.[1] || "Unknown";
      } else if (ua.indexOf("Edg") > -1) {
        browser = "Microsoft Edge";
        version = ua.match(/Edg\/([0-9.]+)/)?.[1] || "Unknown";
      } else if (ua.indexOf("Chrome") > -1) {
        browser = "Chrome";
        version = ua.match(/Chrome\/([0-9.]+)/)?.[1] || "Unknown";
      } else if (ua.indexOf("Safari") > -1) {
        browser = "Safari";
        version = ua.match(/Version\/([0-9.]+)/)?.[1] || "Unknown";
      } else if (ua.indexOf("Opera") > -1 || ua.indexOf("OPR") > -1) {
        browser = "Opera";
        version = ua.match(/(?:Opera|OPR)\/([0-9.]+)/)?.[1] || "Unknown";
      }

      return { browser, version };
    };

    const getOSInfo = () => {
      const ua = navigator.userAgent;
      let os = "Unknown";

      if (ua.indexOf("Win") > -1) os = "Windows";
      else if (ua.indexOf("Mac") > -1) os = "macOS";
      else if (ua.indexOf("Linux") > -1) os = "Linux";
      else if (ua.indexOf("Android") > -1) os = "Android";
      else if (ua.indexOf("iOS") > -1 || ua.indexOf("iPhone") > -1 || ua.indexOf("iPad") > -1) os = "iOS";

      return os;
    };

    const { browser, version } = getBrowserInfo();

    setDeviceInfo({
      browser,
      browserVersion: version,
      os: getOSInfo(),
      platform: navigator.platform,
      language: navigator.language,
      cookiesEnabled: navigator.cookieEnabled,
      onlineStatus: navigator.onLine,
      screenWidth: window.screen.width,
      screenHeight: window.screen.height,
      windowWidth: window.innerWidth,
      windowHeight: window.innerHeight,
      colorDepth: window.screen.colorDepth,
      pixelRatio: window.devicePixelRatio,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      userAgent: navigator.userAgent,
    });

    const handleResize = () => {
      setDeviceInfo(prev => ({
        ...prev,
        windowWidth: window.innerWidth,
        windowHeight: window.innerHeight,
      }));
    };

    const handleOnline = () => {
      setDeviceInfo(prev => ({ ...prev, onlineStatus: true }));
    };

    const handleOffline = () => {
      setDeviceInfo(prev => ({ ...prev, onlineStatus: false }));
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: `${label} copied to clipboard`,
    });
  };

  const copyAllInfo = () => {
    const text = Object.entries(deviceInfo)
      .map(([key, value]) => `${key}: ${value}`)
      .join('\n');
    
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "All device information copied to clipboard",
    });
  };

  const InfoRow = ({ label, value, copyable = false }: { label: string; value: string | number | boolean; copyable?: boolean }) => (
    <div className="flex justify-between items-center py-2 border-b border-border last:border-0">
      <span className="text-sm text-muted-foreground">{label}</span>
      <div className="flex items-center gap-2">
        <span className="font-medium font-mono text-sm">{value.toString()}</span>
        {copyable && (
          <Button
            size="icon"
            variant="ghost"
            className="h-6 w-6"
            onClick={() => copyToClipboard(value.toString(), label)}
          >
            <Copy className="h-3 w-3" />
          </Button>
        )}
      </div>
    </div>
  );

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
              { title: "View Device Info", description: "Instantly see comprehensive information about your device, browser, and network." },
              { title: "Copy Individual Values", description: "Click the copy icon next to any value to copy it to clipboard." },
              { title: "Copy All Info", description: "Use the 'Copy All' button to copy all device information at once." },
              { title: "Check Online Status", description: "Monitor your internet connection status in real-time." }
            ]}
            tips={[
              { text: "User agent shows browser and operating system details" },
              { text: "Screen resolution helps with responsive design testing" },
              { text: "Useful for troubleshooting and technical support" },
              { text: "All information is gathered client-side for privacy" }
            ]}
          />

          <Card className="max-w-3xl mx-auto mt-6">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-3xl">Device Info</CardTitle>
                  <CardDescription>Detect browser and device information</CardDescription>
                </div>
                <Button onClick={copyAllInfo} variant="outline" size="sm">
                  <Copy className="h-4 w-4 mr-2" />
                  Copy All
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <Globe className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold">Browser Information</h3>
                  </div>
                </CardHeader>
                <CardContent className="space-y-1">
                  <InfoRow label="Browser" value={deviceInfo.browser} />
                  <InfoRow label="Version" value={deviceInfo.browserVersion} />
                  <InfoRow label="Language" value={deviceInfo.language} />
                  <InfoRow label="Cookies Enabled" value={deviceInfo.cookiesEnabled ? "Yes" : "No"} />
                  <InfoRow label="Online Status" value={deviceInfo.onlineStatus ? "Online" : "Offline"} />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <Smartphone className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold">System Information</h3>
                  </div>
                </CardHeader>
                <CardContent className="space-y-1">
                  <InfoRow label="Operating System" value={deviceInfo.os} />
                  <InfoRow label="Platform" value={deviceInfo.platform} />
                  <InfoRow label="Timezone" value={deviceInfo.timezone} copyable />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <Monitor className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold">Display Information</h3>
                  </div>
                </CardHeader>
                <CardContent className="space-y-1">
                  <InfoRow label="Screen Resolution" value={`${deviceInfo.screenWidth} × ${deviceInfo.screenHeight}`} />
                  <InfoRow label="Window Size" value={`${deviceInfo.windowWidth} × ${deviceInfo.windowHeight}`} />
                  <InfoRow label="Color Depth" value={`${deviceInfo.colorDepth} bit`} />
                  <InfoRow label="Pixel Ratio" value={deviceInfo.pixelRatio} />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2 justify-between">
                    <h3 className="font-semibold">User Agent</h3>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => copyToClipboard(deviceInfo.userAgent, "User Agent")}
                    >
                      <Copy className="h-3 w-3 mr-1" />
                      Copy
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-xs font-mono break-all bg-muted p-3 rounded">
                    {deviceInfo.userAgent}
                  </p>
                </CardContent>
              </Card>

              <div className="bg-muted p-4 rounded-lg text-sm">
                <h4 className="font-medium mb-2">About This Tool</h4>
                <p className="text-muted-foreground text-xs">
                  This tool detects information about your browser and device using JavaScript APIs.
                  All detection happens locally in your browser - no data is sent to any server.
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

export default DeviceInfo;
