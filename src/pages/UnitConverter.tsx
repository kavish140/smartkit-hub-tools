import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, ArrowRightLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const UnitConverter = () => {
  const navigate = useNavigate();
  const [value, setValue] = useState("1");
  const [fromUnit, setFromUnit] = useState("meter");
  const [toUnit, setToUnit] = useState("kilometer");
  const [result, setResult] = useState("");
  const [category, setCategory] = useState("length");

  const conversions = {
    length: {
      meter: 1,
      kilometer: 0.001,
      centimeter: 100,
      millimeter: 1000,
      mile: 0.000621371,
      yard: 1.09361,
      foot: 3.28084,
      inch: 39.3701,
    },
    weight: {
      kilogram: 1,
      gram: 1000,
      milligram: 1000000,
      pound: 2.20462,
      ounce: 35.274,
      ton: 0.001,
    },
    temperature: {
      celsius: "c",
      fahrenheit: "f",
      kelvin: "k",
    },
    volume: {
      liter: 1,
      milliliter: 1000,
      gallon: 0.264172,
      quart: 1.05669,
      pint: 2.11338,
      cup: 4.22675,
      fluid_ounce: 33.814,
    },
    time: {
      second: 1,
      minute: 1/60,
      hour: 1/3600,
      day: 1/86400,
      week: 1/604800,
      month: 1/2592000,
      year: 1/31536000,
    },
    digital: {
      byte: 1,
      kilobyte: 1/1024,
      megabyte: 1/(1024*1024),
      gigabyte: 1/(1024*1024*1024),
      terabyte: 1/(1024*1024*1024*1024),
      bit: 8,
    }
  };

  const units = {
    length: ["meter", "kilometer", "centimeter", "millimeter", "mile", "yard", "foot", "inch"],
    weight: ["kilogram", "gram", "milligram", "pound", "ounce", "ton"],
    temperature: ["celsius", "fahrenheit", "kelvin"],
    volume: ["liter", "milliliter", "gallon", "quart", "pint", "cup", "fluid_ounce"],
    time: ["second", "minute", "hour", "day", "week", "month", "year"],
    digital: ["byte", "kilobyte", "megabyte", "gigabyte", "terabyte", "bit"]
  };

  const convertTemperature = (val: number, from: string, to: string): number => {
    let celsius = 0;
    
    // Convert to Celsius first
    if (from === "celsius") celsius = val;
    else if (from === "fahrenheit") celsius = (val - 32) * 5/9;
    else if (from === "kelvin") celsius = val - 273.15;
    
    // Convert from Celsius to target
    if (to === "celsius") return celsius;
    else if (to === "fahrenheit") return (celsius * 9/5) + 32;
    else if (to === "kelvin") return celsius + 273.15;
    
    return 0;
  };

  const convert = () => {
    const inputValue = parseFloat(value);
    if (isNaN(inputValue)) {
      setResult("Invalid input");
      return;
    }

    let convertedValue = 0;

    if (category === "temperature") {
      convertedValue = convertTemperature(inputValue, fromUnit, toUnit);
    } else {
      const categoryConversions = conversions[category as keyof typeof conversions];
      const fromFactor = categoryConversions[fromUnit as keyof typeof categoryConversions] as number;
      const toFactor = categoryConversions[toUnit as keyof typeof categoryConversions] as number;
      convertedValue = (inputValue * toFactor) / fromFactor;
    }

    setResult(convertedValue.toFixed(6).replace(/\.?0+$/, ""));
  };

  const swapUnits = () => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
    setValue(result || value);
    setResult(value);
  };

  const handleCategoryChange = (newCategory: string) => {
    setCategory(newCategory);
    setFromUnit(units[newCategory as keyof typeof units][0]);
    setToUnit(units[newCategory as keyof typeof units][1]);
    setValue("1");
    setResult("");
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
              <CardTitle className="text-3xl">Unit Converter</CardTitle>
              <CardDescription>Convert between various units of measurement</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Tabs value={category} onValueChange={handleCategoryChange}>
                <TabsList className="grid grid-cols-3 lg:grid-cols-6 w-full">
                  <TabsTrigger value="length">Length</TabsTrigger>
                  <TabsTrigger value="weight">Weight</TabsTrigger>
                  <TabsTrigger value="temperature">Temp</TabsTrigger>
                  <TabsTrigger value="volume">Volume</TabsTrigger>
                  <TabsTrigger value="time">Time</TabsTrigger>
                  <TabsTrigger value="digital">Digital</TabsTrigger>
                </TabsList>
              </Tabs>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>From</Label>
                    <Input
                      type="number"
                      value={value}
                      onChange={(e) => setValue(e.target.value)}
                      placeholder="Enter value"
                      className="mb-2"
                    />
                    <Select value={fromUnit} onValueChange={setFromUnit}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {units[category as keyof typeof units].map((unit) => (
                          <SelectItem key={unit} value={unit}>
                            {unit.charAt(0).toUpperCase() + unit.slice(1).replace('_', ' ')}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>To</Label>
                    <div className="bg-muted p-3 rounded-md h-[42px] flex items-center mb-2 font-mono">
                      {result || "0"}
                    </div>
                    <Select value={toUnit} onValueChange={setToUnit}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {units[category as keyof typeof units].map((unit) => (
                          <SelectItem key={unit} value={unit}>
                            {unit.charAt(0).toUpperCase() + unit.slice(1).replace('_', ' ')}
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
                  >
                    Convert
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={swapUnits}
                    className="px-4"
                  >
                    <ArrowRightLeft className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default UnitConverter;
