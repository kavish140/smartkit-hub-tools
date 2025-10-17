import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ArrowLeft, TrendingUp, TrendingDown, RefreshCw, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface CryptoData {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  price_change_percentage_24h: number;
  market_cap: number;
  total_volume: number;
  high_24h: number;
  low_24h: number;
}

const CryptoPrices = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [cryptos, setCryptos] = useState<CryptoData[]>([]);
  const [filteredCryptos, setFilteredCryptos] = useState<CryptoData[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [lastUpdated, setLastUpdated] = useState<string>("");

  const fetchCryptoPrices = async () => {
    setLoading(true);
    try {
      // Using CoinGecko API (free, no API key needed)
      // Fetches top 50 cryptocurrencies by market cap
      const response = await fetch(
        'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=50&page=1&sparkline=false'
      );
      
      if (!response.ok) {
        throw new Error("Failed to fetch crypto prices");
      }
      
      const data = await response.json();
      setCryptos(data);
      setFilteredCryptos(data);
      setLastUpdated(new Date().toLocaleTimeString());
      
      toast({
        title: "Prices Updated",
        description: `Fetched ${data.length} cryptocurrencies`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch crypto prices. Please try again.",
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCryptoPrices();
    // Auto-refresh every 60 seconds
    const interval = setInterval(fetchCryptoPrices, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = cryptos.filter(crypto =>
        crypto.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        crypto.symbol.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredCryptos(filtered);
    } else {
      setFilteredCryptos(cryptos);
    }
  }, [searchQuery, cryptos]);

  const formatPrice = (price: number) => {
    if (price < 0.01) return `$${price.toFixed(6)}`;
    if (price < 1) return `$${price.toFixed(4)}`;
    return `$${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const formatMarketCap = (value: number) => {
    if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`;
    if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
    if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
    return `$${value.toLocaleString()}`;
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

          <Card className="max-w-6xl mx-auto">
            <CardHeader>
              <CardTitle className="text-3xl">Crypto Prices</CardTitle>
              <CardDescription>Track live cryptocurrency prices and market trends</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search cryptocurrencies..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button 
                  onClick={fetchCryptoPrices}
                  disabled={loading}
                  className="bg-gradient-primary border-0"
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
              </div>

              {lastUpdated && (
                <div className="text-sm text-muted-foreground text-center">
                  Last updated: {lastUpdated} • Auto-refreshes every 60 seconds
                </div>
              )}

              {loading && cryptos.length === 0 ? (
                <div className="text-center py-12">
                  <RefreshCw className="h-12 w-12 mx-auto mb-4 animate-spin text-primary" />
                  <p className="text-muted-foreground">Loading crypto prices...</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-[600px] overflow-y-auto">
                  {filteredCryptos.map((crypto, index) => (
                    <Card key={crypto.id} className="p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-center gap-4">
                        <div className="text-muted-foreground font-medium min-w-[30px]">
                          #{index + 1}
                        </div>
                        <img 
                          src={crypto.image} 
                          alt={crypto.name}
                          className="w-10 h-10 rounded-full"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-lg">{crypto.name}</span>
                            <span className="text-sm text-muted-foreground uppercase">
                              {crypto.symbol}
                            </span>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                            <span>Market Cap: {formatMarketCap(crypto.market_cap)}</span>
                            <span className="hidden sm:inline">
                              Volume: {formatMarketCap(crypto.total_volume)}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xl font-bold">
                            {formatPrice(crypto.current_price)}
                          </div>
                          <div className={`flex items-center justify-end gap-1 text-sm font-medium ${
                            crypto.price_change_percentage_24h >= 0 
                              ? 'text-green-600' 
                              : 'text-red-600'
                          }`}>
                            {crypto.price_change_percentage_24h >= 0 ? (
                              <TrendingUp className="h-4 w-4" />
                            ) : (
                              <TrendingDown className="h-4 w-4" />
                            )}
                            {Math.abs(crypto.price_change_percentage_24h).toFixed(2)}%
                          </div>
                        </div>
                      </div>
                      <div className="mt-3 pt-3 border-t grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-muted-foreground">24h High: </span>
                          <span className="font-medium text-green-600">
                            {formatPrice(crypto.high_24h)}
                          </span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">24h Low: </span>
                          <span className="font-medium text-red-600">
                            {formatPrice(crypto.low_24h)}
                          </span>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}

              {filteredCryptos.length === 0 && !loading && (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">
                    No cryptocurrencies found matching "{searchQuery}"
                  </p>
                </div>
              )}

              <div className="bg-green-50 p-4 rounded-lg text-sm text-green-900">
                <p className="font-medium mb-1">✅ Live Crypto Data!</p>
                <p className="text-xs">
                  Real-time cryptocurrency prices powered by{" "}
                  <a 
                    href="https://www.coingecko.com/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="underline font-medium"
                  >
                    CoinGecko API
                  </a>
                  {" "}(free, no API key required). Shows top 50 cryptocurrencies by market cap with
                  automatic updates every 60 seconds.
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

export default CryptoPrices;
