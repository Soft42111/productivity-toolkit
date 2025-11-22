import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ArrowRightLeft, TrendingUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const CurrencyConverter = () => {
  const [amount, setAmount] = useState("1");
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("EUR");
  const [result, setResult] = useState<number | null>(null);
  const [rate, setRate] = useState<number | null>(null);
  const { toast } = useToast();

  const currencies = ["USD", "EUR", "GBP", "JPY", "AUD", "CAD", "CHF", "CNY", "INR", "MXN"];

  const convert = async () => {
    try {
      const response = await fetch(`https://api.exchangerate-api.com/v4/latest/${fromCurrency}`);
      const data = await response.json();
      const exchangeRate = data.rates[toCurrency];
      setRate(exchangeRate);
      setResult(parseFloat(amount) * exchangeRate);
    } catch (error) {
      toast({ title: "Failed to fetch rates", variant: "destructive" });
    }
  };

  useEffect(() => {
    if (amount && fromCurrency && toCurrency) {
      convert();
    }
  }, [amount, fromCurrency, toCurrency]);

  const swap = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/5 to-primary/10 p-6">
      <div className="max-w-2xl mx-auto">
        <Card className="border-primary/20 shadow-2xl">
          <CardHeader>
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent flex items-center gap-3">
              <TrendingUp className="w-8 h-8 text-primary" />
              Currency Converter
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Amount</label>
                <Input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="text-2xl h-14"
                  placeholder="Enter amount"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">From</label>
                <Select value={fromCurrency} onValueChange={setFromCurrency}>
                  <SelectTrigger className="h-14 text-lg">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {currencies.map((curr) => (
                      <SelectItem key={curr} value={curr} className="text-lg">
                        {curr}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-center">
                <Button onClick={swap} variant="outline" size="icon" className="rounded-full">
                  <ArrowRightLeft className="w-5 h-5" />
                </Button>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">To</label>
                <Select value={toCurrency} onValueChange={setToCurrency}>
                  <SelectTrigger className="h-14 text-lg">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {currencies.map((curr) => (
                      <SelectItem key={curr} value={curr} className="text-lg">
                        {curr}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {result !== null && (
              <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary/30">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-2">Converted Amount</p>
                    <p className="text-4xl font-bold mb-2">
                      {result.toFixed(2)} {toCurrency}
                    </p>
                    {rate && (
                      <p className="text-sm text-muted-foreground">
                        1 {fromCurrency} = {rate.toFixed(4)} {toCurrency}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CurrencyConverter;
