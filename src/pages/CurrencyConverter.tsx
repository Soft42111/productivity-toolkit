import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup, SelectLabel } from "@/components/ui/select";
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

  const currencies = [
    { code: "AED", name: "United Arab Emirates" },
    { code: "AFN", name: "Afghanistan" },
    { code: "ALL", name: "Albania" },
    { code: "AMD", name: "Armenia" },
    { code: "ANG", name: "Netherlands Antilles" },
    { code: "AOA", name: "Angola" },
    { code: "ARS", name: "Argentina" },
    { code: "AUD", name: "Australia" },
    { code: "AWG", name: "Aruba" },
    { code: "AZN", name: "Azerbaijan" },
    { code: "BAM", name: "Bosnia and Herzegovina" },
    { code: "BBD", name: "Barbados" },
    { code: "BDT", name: "Bangladesh" },
    { code: "BGN", name: "Bulgaria" },
    { code: "BHD", name: "Bahrain" },
    { code: "BIF", name: "Burundi" },
    { code: "BMD", name: "Bermuda" },
    { code: "BND", name: "Brunei" },
    { code: "BOB", name: "Bolivia" },
    { code: "BRL", name: "Brazil" },
    { code: "BSD", name: "Bahamas" },
    { code: "BTN", name: "Bhutan" },
    { code: "BWP", name: "Botswana" },
    { code: "BYN", name: "Belarus" },
    { code: "BZD", name: "Belize" },
    { code: "CAD", name: "Canada" },
    { code: "CDF", name: "Congo (DRC)" },
    { code: "CHF", name: "Switzerland" },
    { code: "CLP", name: "Chile" },
    { code: "CNY", name: "China" },
    { code: "COP", name: "Colombia" },
    { code: "CRC", name: "Costa Rica" },
    { code: "CUP", name: "Cuba" },
    { code: "CVE", name: "Cape Verde" },
    { code: "CZK", name: "Czech Republic" },
    { code: "DJF", name: "Djibouti" },
    { code: "DKK", name: "Denmark" },
    { code: "DOP", name: "Dominican Republic" },
    { code: "DZD", name: "Algeria" },
    { code: "EGP", name: "Egypt" },
    { code: "ERN", name: "Eritrea" },
    { code: "ETB", name: "Ethiopia" },
    { code: "EUR", name: "European Union" },
    { code: "FJD", name: "Fiji" },
    { code: "FKP", name: "Falkland Islands" },
    { code: "GBP", name: "United Kingdom" },
    { code: "GEL", name: "Georgia" },
    { code: "GGP", name: "Guernsey" },
    { code: "GHS", name: "Ghana" },
    { code: "GIP", name: "Gibraltar" },
    { code: "GMD", name: "Gambia" },
    { code: "GNF", name: "Guinea" },
    { code: "GTQ", name: "Guatemala" },
    { code: "GYD", name: "Guyana" },
    { code: "HKD", name: "Hong Kong" },
    { code: "HNL", name: "Honduras" },
    { code: "HRK", name: "Croatia" },
    { code: "HTG", name: "Haiti" },
    { code: "HUF", name: "Hungary" },
    { code: "IDR", name: "Indonesia" },
    { code: "ILS", name: "Israel" },
    { code: "IMP", name: "Isle of Man" },
    { code: "INR", name: "India" },
    { code: "IQD", name: "Iraq" },
    { code: "IRR", name: "Iran" },
    { code: "ISK", name: "Iceland" },
    { code: "JEP", name: "Jersey" },
    { code: "JMD", name: "Jamaica" },
    { code: "JOD", name: "Jordan" },
    { code: "JPY", name: "Japan" },
    { code: "KES", name: "Kenya" },
    { code: "KGS", name: "Kyrgyzstan" },
    { code: "KHR", name: "Cambodia" },
    { code: "KID", name: "Kiribati" },
    { code: "KMF", name: "Comoros" },
    { code: "KRW", name: "South Korea" },
    { code: "KWD", name: "Kuwait" },
    { code: "KYD", name: "Cayman Islands" },
    { code: "KZT", name: "Kazakhstan" },
    { code: "LAK", name: "Laos" },
    { code: "LBP", name: "Lebanon" },
    { code: "LKR", name: "Sri Lanka" },
    { code: "LRD", name: "Liberia" },
    { code: "LSL", name: "Lesotho" },
    { code: "LYD", name: "Libya" },
    { code: "MAD", name: "Morocco" },
    { code: "MDL", name: "Moldova" },
    { code: "MGA", name: "Madagascar" },
    { code: "MKD", name: "North Macedonia" },
    { code: "MMK", name: "Myanmar" },
    { code: "MNT", name: "Mongolia" },
    { code: "MOP", name: "Macau" },
    { code: "MRU", name: "Mauritania" },
    { code: "MUR", name: "Mauritius" },
    { code: "MVR", name: "Maldives" },
    { code: "MWK", name: "Malawi" },
    { code: "MXN", name: "Mexico" },
    { code: "MYR", name: "Malaysia" },
    { code: "MZN", name: "Mozambique" },
    { code: "NAD", name: "Namibia" },
    { code: "NGN", name: "Nigeria" },
    { code: "NIO", name: "Nicaragua" },
    { code: "NOK", name: "Norway" },
    { code: "NPR", name: "Nepal" },
    { code: "NZD", name: "New Zealand" },
    { code: "OMR", name: "Oman" },
    { code: "PAB", name: "Panama" },
    { code: "PEN", name: "Peru" },
    { code: "PGK", name: "Papua New Guinea" },
    { code: "PHP", name: "Philippines" },
    { code: "PKR", name: "Pakistan" },
    { code: "PLN", name: "Poland" },
    { code: "PYG", name: "Paraguay" },
    { code: "QAR", name: "Qatar" },
    { code: "RON", name: "Romania" },
    { code: "RSD", name: "Serbia" },
    { code: "RUB", name: "Russia" },
    { code: "RWF", name: "Rwanda" },
    { code: "SAR", name: "Saudi Arabia" },
    { code: "SBD", name: "Solomon Islands" },
    { code: "SCR", name: "Seychelles" },
    { code: "SDG", name: "Sudan" },
    { code: "SEK", name: "Sweden" },
    { code: "SGD", name: "Singapore" },
    { code: "SHP", name: "Saint Helena" },
    { code: "SLE", name: "Sierra Leone" },
    { code: "SLL", name: "Sierra Leone (Old)" },
    { code: "SOS", name: "Somalia" },
    { code: "SRD", name: "Suriname" },
    { code: "SSP", name: "South Sudan" },
    { code: "STN", name: "São Tomé and Príncipe" },
    { code: "SYP", name: "Syria" },
    { code: "SZL", name: "Eswatini" },
    { code: "THB", name: "Thailand" },
    { code: "TJS", name: "Tajikistan" },
    { code: "TMT", name: "Turkmenistan" },
    { code: "TND", name: "Tunisia" },
    { code: "TOP", name: "Tonga" },
    { code: "TRY", name: "Turkey" },
    { code: "TTD", name: "Trinidad and Tobago" },
    { code: "TVD", name: "Tuvalu" },
    { code: "TWD", name: "Taiwan" },
    { code: "TZS", name: "Tanzania" },
    { code: "UAH", name: "Ukraine" },
    { code: "UGX", name: "Uganda" },
    { code: "USD", name: "United States" },
    { code: "UYU", name: "Uruguay" },
    { code: "UZS", name: "Uzbekistan" },
    { code: "VES", name: "Venezuela" },
    { code: "VND", name: "Vietnam" },
    { code: "VUV", name: "Vanuatu" },
    { code: "WST", name: "Samoa" },
    { code: "XAF", name: "Central African CFA" },
    { code: "XCD", name: "East Caribbean" },
    { code: "XCG", name: "Curaçao and Sint Maarten" },
    { code: "XOF", name: "West African CFA" },
    { code: "XPF", name: "CFP Franc" },
    { code: "YER", name: "Yemen" },
    { code: "ZAR", name: "South Africa" },
    { code: "ZMW", name: "Zambia" },
    { code: "ZWL", name: "Zimbabwe" },
  ];

  // Group currencies by first letter
  const groupedCurrencies = currencies.reduce((acc, curr) => {
    const firstLetter = curr.name[0].toUpperCase();
    if (!acc[firstLetter]) {
      acc[firstLetter] = [];
    }
    acc[firstLetter].push(curr);
    return acc;
  }, {} as Record<string, typeof currencies>);

  const alphabeticalGroups = Object.keys(groupedCurrencies).sort();

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
                  <SelectContent className="bg-popover z-50 max-h-[300px]">
                    {alphabeticalGroups.map((letter) => (
                      <SelectGroup key={letter}>
                        <SelectLabel className="text-primary font-bold">{letter}</SelectLabel>
                        {groupedCurrencies[letter].map((curr) => (
                          <SelectItem key={curr.code} value={curr.code} className="text-base pl-6">
                            {curr.name} - {curr.code}
                          </SelectItem>
                        ))}
                      </SelectGroup>
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
                  <SelectContent className="bg-popover z-50 max-h-[300px]">
                    {alphabeticalGroups.map((letter) => (
                      <SelectGroup key={letter}>
                        <SelectLabel className="text-primary font-bold">{letter}</SelectLabel>
                        {groupedCurrencies[letter].map((curr) => (
                          <SelectItem key={curr.code} value={curr.code} className="text-base pl-6">
                            {curr.name} - {curr.code}
                          </SelectItem>
                        ))}
                      </SelectGroup>
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
