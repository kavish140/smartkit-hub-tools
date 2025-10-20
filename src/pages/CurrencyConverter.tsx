import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, ArrowRightLeft, DollarSign } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";`nimport HowToUse from "@/components/HowToUse";
import { useToolTracking } from "@/hooks/useToolTracking";

const CurrencyConverter = () => {
  useToolTracking("Currency Converter");
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [amount, setAmount] = useState("1");
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("EUR");
  const [result, setResult] = useState<number | null>(null);
  const [rates, setRates] = useState<{ [key: string]: number }>({});
  const [lastUpdated, setLastUpdated] = useState<string>("");
  const [loading, setLoading] = useState(false);

  // Popular currencies
  const currencies = [
    { code: "USD", name: "US Dollar", symbol: "$" },
    { code: "EUR", name: "Euro", symbol: "€" },
    { code: "GBP", name: "British Pound", symbol: "£" },
    { code: "JPY", name: "Japanese Yen", symbol: "¥" },
    { code: "AUD", name: "Australian Dollar", symbol: "A$" },
    { code: "CAD", name: "Canadian Dollar", symbol: "C$" },
    { code: "CHF", name: "Swiss Franc", symbol: "CHF" },
    { code: "CNY", name: "Chinese Yuan", symbol: "¥" },
    { code: "INR", name: "Indian Rupee", symbol: "₹" },
    { code: "MXN", name: "Mexican Peso", symbol: "$" },
    { code: "BRL", name: "Brazilian Real", symbol: "R$" },
    { code: "ZAR", name: "South African Rand", symbol: "R" },
    { code: "RUB", name: "Russian Ruble", symbol: "₽" },
    { code: "KRW", name: "South Korean Won", symbol: "₩" },
    { code: "SGD", name: "Singapore Dollar", symbol: "S$" },
    { code: "HKD", name: "Hong Kong Dollar", symbol: "HK$" },
    { code: "NOK", name: "Norwegian Krone", symbol: "kr" },
    { code: "SEK", name: "Swedish Krona", symbol: "kr" },
    { code: "DKK", name: "Danish Krone", symbol: "kr" },
    { code: "PLN", name: "Polish Zloty", symbol: "zł" },
    { code: "THB", name: "Thai Baht", symbol: "฿" },
    { code: "IDR", name: "Indonesian Rupiah", symbol: "Rp" },
    { code: "MYR", name: "Malaysian Ringgit", symbol: "RM" },
    { code: "PHP", name: "Philippine Peso", symbol: "₱" },
    { code: "AED", name: "UAE Dirham", symbol: "د.إ" },
    { code: "SAR", name: "Saudi Riyal", symbol: "﷼" },
    { code: "TRY", name: "Turkish Lira", symbol: "₺" },
    { code: "NZD", name: "New Zealand Dollar", symbol: "NZ$" },
  ];

  // Fetch exchange rates
  const fetchRates = async () => {
    setLoading(true);
    try {
      // Using ExchangeRate-API (free tier) - API key configured
      const API_KEY = "0e4edbc99e17da0178826462";
      
      // Using authenticated endpoint with API key for better rate limits
      const response = await fetch(`https://v6.exchangerate-api.com/v6/${API_KEY}/latest/${fromCurrency}`);
      
      if (!response.ok) throw new Error("Failed to fetch rates");
      
      const data = await response.json();
      setRates(data.rates);
      setLastUpdated(new Date().toLocaleString());
      
      toast({
        title: "Rates Updated",
        description: "Exchange rates fetched successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch exchange rates. Using fallback rates.",
        variant: "destructive",
      });
      
      // Fallback rates (approximate)
      setRates({
        USD: 1, EUR: 0.92, GBP: 0.79, JPY: 149.50, AUD: 1.54, CAD: 1.36,
        CHF: 0.88, CNY: 7.24, INR: 83.12, MXN: 17.05, BRL: 4.97, ZAR: 18.75,
        RUB: 92.50, KRW: 1320.50, SGD: 1.35, HKD: 7.82, NOK: 10.68, SEK: 10.52,
        DKK: 6.87, PLN: 3.98, THB: 35.68, IDR: 15678, MYR: 4.68, PHP: 56.35,
        AED: 3.67, SAR: 3.75, TRY: 28.50, NZD: 1.65
      });
      setLastUpdated(new Date().toLocaleString());
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchRates();
  }, [fromCurrency]);

  const convert = () => {
    const inputAmount = parseFloat(amount);
    if (isNaN(inputAmount) || !rates[toCurrency]) {
      toast({
        title: "Invalid Input",
        description: "Please enter a valid amount",
        variant: "destructive",
      });
      return;
    }

    const rate = rates[toCurrency];
    const convertedAmount = inputAmount * rate;
    setResult(convertedAmount);
  };

  const swapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
    if (result !== null) {
      setAmount(result.toFixed(2));
      setResult(parseFloat(amount));
    }
  };

  const getCurrencySymbol = (code: string) => {
    return currencies.find(c => c.code === code)?.symbol || code;
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
              { title: "Enter Amount", description: "Type the amount you want to convert in the 'From' field." },
              { title: "Select Currencies", description: "Choose source and target currencies from the dropdown menus." },
              { title: "View Result", description: "See instant conversion with live exchange rates." },
              { title: "Swap Currencies", description: "Use the swap button to quickly reverse the conversion direction." }
            ]}
            tips={[
              { text: "Exchange rates update in real-time" },
              { text: "Supports major world currencies (USD, EUR, GBP, JPY, etc.)" },
              { text: "Perfect for travel planning and international transactions" },
              { text: "Historical rate information helps track currency trends" }
            ]}
          />

          <Card className="max-w-3xl mx-auto mt-6">
            <CardHeader>
              <CardTitle className="text-3xl">Currency Converter</CardTitle>
              <CardDescription>Convert between world currencies with live rates</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>From</Label>
                  <Input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Enter amount"
                    className="mb-2"
                  />
                  <Select value={fromCurrency} onValueChange={setFromCurrency}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {currencies.map((currency) => (
                        <SelectItem key={currency.code} value={currency.code}>
                          {currency.symbol} {currency.code} - {currency.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>To</Label>
                  <div className="bg-muted p-3 rounded-md h-[42px] flex items-center mb-2 font-mono text-lg">
                    {result !== null ? result.toFixed(2) : "0.00"}
                  </div>
                  <Select value={toCurrency} onValueChange={setToCurrency}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {currencies.map((currency) => (
                        <SelectItem key={currency.code} value={currency.code}>
                          {currency.symbol} {currency.code} - {currency.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex gap-2">
                <Button 
                  className="flex-1 bg-gradient-primary border-0" 
                  onClick={convert}
                  disabled={loading}
                >
                  <DollarSign className="h-4 w-4 mr-2" />
                  {loading ? "Loading..." : "Convert"}
                </Button>
                <Button 
                  variant="outline"
                  onClick={swapCurrencies}
                  className="px-4"
                >
                  <ArrowRightLeft className="h-4 w-4" />
                </Button>
              </div>

              {result !== null && (
                <div className="bg-gradient-primary p-6 rounded-lg text-white text-center">
                  <div className="text-sm opacity-90 mb-2">Conversion Result</div>
                  <div className="text-3xl font-bold mb-1">
                    {getCurrencySymbol(fromCurrency)} {amount} {fromCurrency} =
                  </div>
                  <div className="text-5xl font-bold">
                    {getCurrencySymbol(toCurrency)} {result.toFixed(2)} {toCurrency}
                  </div>
                  <div className="text-sm opacity-90 mt-4">
                    1 {fromCurrency} = {rates[toCurrency]?.toFixed(4)} {toCurrency}
                  </div>
                </div>
              )}

              <div className="bg-muted p-4 rounded-lg text-sm space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Last Updated:</span>
                  <span className="font-medium">{lastUpdated || "Not yet loaded"}</span>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={fetchRates}
                  disabled={loading}
                  className="w-full"
                >
                  Refresh Rates
                </Button>
              </div>

              <div className="bg-green-50 p-4 rounded-lg text-sm text-green-900">
                <p className="font-medium mb-1">✅ Live Exchange Rates Enabled!</p>
                <p className="text-xs">
                  Your API key is configured. Exchange rates are fetched in real-time from{" "}
                  <a 
                    href="https://www.exchangerate-api.com/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="underline font-medium"
                  >
                    ExchangeRate-API
                  </a>
                  {" "}with 1,500 free requests per month.
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

export default CurrencyConverter;
