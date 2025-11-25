import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeftRight } from "lucide-react";
import { Link } from "react-router-dom";
import ThemeToggle from "@/components/ThemeToggle";
import Footer from "@/components/Footer";
import HomeButton from "@/components/HomeButton";

type ConversionCategory = "length" | "weight" | "temperature" | "volume";

interface ConversionUnit {
  name: string;
  toBase: (value: number) => number;
  fromBase: (value: number) => number;
}

const conversions: Record<ConversionCategory, Record<string, ConversionUnit>> = {
  length: {
    meter: { name: "Meter", toBase: (v) => v, fromBase: (v) => v },
    kilometer: { name: "Kilometer", toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
    centimeter: { name: "Centimeter", toBase: (v) => v / 100, fromBase: (v) => v * 100 },
    mile: { name: "Mile", toBase: (v) => v * 1609.34, fromBase: (v) => v / 1609.34 },
    yard: { name: "Yard", toBase: (v) => v * 0.9144, fromBase: (v) => v / 0.9144 },
    foot: { name: "Foot", toBase: (v) => v * 0.3048, fromBase: (v) => v / 0.3048 },
    inch: { name: "Inch", toBase: (v) => v * 0.0254, fromBase: (v) => v / 0.0254 },
  },
  weight: {
    kilogram: { name: "Kilogram", toBase: (v) => v, fromBase: (v) => v },
    gram: { name: "Gram", toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
    milligram: { name: "Milligram", toBase: (v) => v / 1000000, fromBase: (v) => v * 1000000 },
    pound: { name: "Pound", toBase: (v) => v * 0.453592, fromBase: (v) => v / 0.453592 },
    ounce: { name: "Ounce", toBase: (v) => v * 0.0283495, fromBase: (v) => v / 0.0283495 },
  },
  temperature: {
    celsius: {
      name: "Celsius",
      toBase: (v) => v,
      fromBase: (v) => v,
    },
    fahrenheit: {
      name: "Fahrenheit",
      toBase: (v) => (v - 32) * (5 / 9),
      fromBase: (v) => v * (9 / 5) + 32,
    },
    kelvin: {
      name: "Kelvin",
      toBase: (v) => v - 273.15,
      fromBase: (v) => v + 273.15,
    },
  },
  volume: {
    liter: { name: "Liter", toBase: (v) => v, fromBase: (v) => v },
    milliliter: { name: "Milliliter", toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
    gallon: { name: "Gallon (US)", toBase: (v) => v * 3.78541, fromBase: (v) => v / 3.78541 },
    quart: { name: "Quart", toBase: (v) => v * 0.946353, fromBase: (v) => v / 0.946353 },
    pint: { name: "Pint", toBase: (v) => v * 0.473176, fromBase: (v) => v / 0.473176 },
    cup: { name: "Cup", toBase: (v) => v * 0.236588, fromBase: (v) => v / 0.236588 },
  },
};

const UnitConverter = () => {
  const [category, setCategory] = useState<ConversionCategory>("length");
  const [fromUnit, setFromUnit] = useState("meter");
  const [toUnit, setToUnit] = useState("kilometer");
  const [fromValue, setFromValue] = useState("");
  const [toValue, setToValue] = useState("");

  const handleConvert = (value: string, isFrom: boolean) => {
    if (!value || isNaN(parseFloat(value))) {
      setFromValue("");
      setToValue("");
      return;
    }

    const numValue = parseFloat(value);
    
    if (isFrom) {
      setFromValue(value);
      const baseValue = conversions[category][fromUnit].toBase(numValue);
      const result = conversions[category][toUnit].fromBase(baseValue);
      setToValue(result.toFixed(6).replace(/\.?0+$/, ""));
    } else {
      setToValue(value);
      const baseValue = conversions[category][toUnit].toBase(numValue);
      const result = conversions[category][fromUnit].fromBase(baseValue);
      setFromValue(result.toFixed(6).replace(/\.?0+$/, ""));
    }
  };

  const handleCategoryChange = (newCategory: ConversionCategory) => {
    setCategory(newCategory);
    const units = Object.keys(conversions[newCategory]);
    setFromUnit(units[0]);
    setToUnit(units[1]);
    setFromValue("");
    setToValue("");
  };

  const swapUnits = () => {
    const tempUnit = fromUnit;
    setFromUnit(toUnit);
    setToUnit(tempUnit);
    const tempValue = fromValue;
    setFromValue(toValue);
    setToValue(tempValue);
  };

  return (
    <div className="min-h-screen bg-background p-6 animate-fade-in flex flex-col">
      <HomeButton />
      <div className="max-w-2xl mx-auto flex-1">
        <div className="flex justify-end items-center mb-6">
          <ThemeToggle />
        </div>

        <Card className="p-6 shadow-[var(--shadow-soft)]">
          <h1 className="text-2xl font-bold text-foreground mb-6">Unit Converter</h1>

          <div className="space-y-6">
            <div>
              <label className="text-sm font-medium text-muted-foreground mb-2 block">
                Category
              </label>
              <Select value={category} onValueChange={(v) => handleCategoryChange(v as ConversionCategory)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="length">Length</SelectItem>
                  <SelectItem value="weight">Weight</SelectItem>
                  <SelectItem value="temperature">Temperature</SelectItem>
                  <SelectItem value="volume">Volume</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-4">
              <Card className="p-4 bg-secondary">
                <label className="text-sm font-medium text-muted-foreground mb-2 block">
                  From
                </label>
                <div className="flex gap-3">
                  <Input
                    type="number"
                    value={fromValue}
                    onChange={(e) => handleConvert(e.target.value, true)}
                    placeholder="Enter value"
                    className="flex-1"
                  />
                  <Select value={fromUnit} onValueChange={setFromUnit}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(conversions[category]).map(([key, unit]) => (
                        <SelectItem key={key} value={key}>
                          {unit.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </Card>

              <div className="flex justify-center">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={swapUnits}
                  className="rounded-full"
                >
                  <ArrowLeftRight className="h-4 w-4" />
                </Button>
              </div>

              <Card className="p-4 bg-secondary">
                <label className="text-sm font-medium text-muted-foreground mb-2 block">
                  To
                </label>
                <div className="flex gap-3">
                  <Input
                    type="number"
                    value={toValue}
                    onChange={(e) => handleConvert(e.target.value, false)}
                    placeholder="Result"
                    className="flex-1"
                  />
                  <Select value={toUnit} onValueChange={setToUnit}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(conversions[category]).map(([key, unit]) => (
                        <SelectItem key={key} value={key}>
                          {unit.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </Card>
            </div>
          </div>
        </Card>
      </div>
      <Footer />
    </div>
  );
};

export default UnitConverter;
