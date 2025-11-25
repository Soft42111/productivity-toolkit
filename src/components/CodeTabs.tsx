import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";

const CodeTabs = () => {
  const tabs = [
    {
      name: "index.tsx",
      code: [
        { text: "import", color: "text-purple-400", font: "font-mono" },
        { text: " { useState } ", color: "text-foreground", font: "font-mono" },
        { text: "from", color: "text-purple-400", font: "font-mono" },
        { text: ' "react"', color: "text-green-400", font: "font-mono" },
        { text: ";\n\n", color: "text-foreground", font: "font-mono" },
        { text: "const", color: "text-purple-400", font: "font-mono" },
        { text: " ", color: "text-foreground", font: "font-mono" },
        { text: "App", color: "text-yellow-300", font: "font-sans" },
        { text: " = () ", color: "text-foreground", font: "font-mono" },
        { text: "=>", color: "text-purple-400", font: "font-mono" },
        { text: " {\n  ", color: "text-foreground", font: "font-mono" },
        { text: "return", color: "text-purple-400", font: "font-mono" },
        { text: " (\n    <", color: "text-foreground", font: "font-mono" },
        { text: "div", color: "text-pink-400", font: "font-serif" },
        { text: " ", color: "text-foreground", font: "font-mono" },
        { text: "className", color: "text-blue-400", font: "font-sans" },
        { text: '="app"', color: "text-green-400", font: "font-mono" },
        { text: ">\n      Hello World\n    </", color: "text-foreground", font: "font-mono" },
        { text: "div", color: "text-pink-400", font: "font-serif" },
        { text: ">\n  );\n};", color: "text-foreground", font: "font-mono" },
      ],
    },
    {
      name: "utils.ts",
      code: [
        { text: "export", color: "text-purple-400", font: "font-mono" },
        { text: " ", color: "text-foreground", font: "font-mono" },
        { text: "const", color: "text-purple-400", font: "font-mono" },
        { text: " ", color: "text-foreground", font: "font-mono" },
        { text: "formatDate", color: "text-yellow-300", font: "font-sans" },
        { text: " = (", color: "text-foreground", font: "font-mono" },
        { text: "date", color: "text-orange-400", font: "font-serif" },
        { text: ": ", color: "text-foreground", font: "font-mono" },
        { text: "Date", color: "text-cyan-400", font: "font-sans" },
        { text: ") ", color: "text-foreground", font: "font-mono" },
        { text: "=>", color: "text-purple-400", font: "font-mono" },
        { text: " {\n  ", color: "text-foreground", font: "font-mono" },
        { text: "return", color: "text-purple-400", font: "font-mono" },
        { text: " date.", color: "text-foreground", font: "font-mono" },
        { text: "toLocaleDateString", color: "text-yellow-300", font: "font-sans" },
        { text: "();\n};", color: "text-foreground", font: "font-mono" },
      ],
    },
    {
      name: "config.json",
      code: [
        { text: "{\n  ", color: "text-foreground", font: "font-mono" },
        { text: '"name"', color: "text-blue-400", font: "font-sans" },
        { text: ": ", color: "text-foreground", font: "font-mono" },
        { text: '"PowerTools"', color: "text-green-400", font: "font-mono" },
        { text: ",\n  ", color: "text-foreground", font: "font-mono" },
        { text: '"version"', color: "text-blue-400", font: "font-sans" },
        { text: ": ", color: "text-foreground", font: "font-mono" },
        { text: '"1.0.0"', color: "text-green-400", font: "font-mono" },
        { text: ",\n  ", color: "text-foreground", font: "font-mono" },
        { text: '"theme"', color: "text-blue-400", font: "font-sans" },
        { text: ": ", color: "text-foreground", font: "font-mono" },
        { text: '"minimal"', color: "text-green-400", font: "font-mono" },
        { text: "\n}", color: "text-foreground", font: "font-mono" },
      ],
    },
  ];

  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTab((prev) => (prev + 1) % tabs.length);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="w-full max-w-xl mx-auto border border-border bg-card/80 backdrop-blur-sm">
      <div className="flex border-b border-border text-xs">
        {tabs.map((tab, index) => (
          <button
            key={tab.name}
            onClick={() => setActiveTab(index)}
            className={`flex-1 px-3 py-1.5 font-mono transition-colors border-r last:border-r-0 border-border ${
              activeTab === index
                ? "bg-muted text-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
            }`}
          >
            {tab.name}
          </button>
        ))}
      </div>
      <div className="p-3">
        <div className="flex items-center gap-1.5 mb-2">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
          <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
        </div>
        <pre className="text-xs overflow-x-auto leading-relaxed">
          <code>
            {tabs[activeTab].code.map((segment, i) => (
              <span key={i} className={`${segment.color} ${segment.font}`}>
                {segment.text}
              </span>
            ))}
          </code>
        </pre>
      </div>
    </Card>
  );
};

export default CodeTabs;
