import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";

const CodeTabs = () => {
  const tabs = [
    {
      name: "App.tsx",
      code: [
        { text: "import", color: "text-purple-400", font: "font-mono" },
        { text: " { useState, useEffect } ", color: "text-foreground", font: "font-mono" },
        { text: "from", color: "text-purple-400", font: "font-mono" },
        { text: ' "react"', color: "text-green-400", font: "font-mono" },
        { text: ";\n", color: "text-foreground", font: "font-mono" },
        { text: "import", color: "text-purple-400", font: "font-mono" },
        { text: " { Button } ", color: "text-foreground", font: "font-mono" },
        { text: "from", color: "text-purple-400", font: "font-mono" },
        { text: ' "@/components/ui/button"', color: "text-green-400", font: "font-mono" },
        { text: ";\n\n", color: "text-foreground", font: "font-mono" },
        { text: "const", color: "text-purple-400", font: "font-mono" },
        { text: " ", color: "text-foreground", font: "font-mono" },
        { text: "App", color: "text-yellow-300", font: "font-sans" },
        { text: " = () ", color: "text-foreground", font: "font-mono" },
        { text: "=>", color: "text-purple-400", font: "font-mono" },
        { text: " {\n  ", color: "text-foreground", font: "font-mono" },
        { text: "const", color: "text-purple-400", font: "font-mono" },
        { text: " [", color: "text-foreground", font: "font-mono" },
        { text: "count", color: "text-orange-400", font: "font-serif" },
        { text: ", ", color: "text-foreground", font: "font-mono" },
        { text: "setCount", color: "text-orange-400", font: "font-serif" },
        { text: "] = ", color: "text-foreground", font: "font-mono" },
        { text: "useState", color: "text-yellow-300", font: "font-sans" },
        { text: "(", color: "text-foreground", font: "font-mono" },
        { text: "0", color: "text-cyan-400", font: "font-mono" },
        { text: ");\n\n  ", color: "text-foreground", font: "font-mono" },
        { text: "useEffect", color: "text-yellow-300", font: "font-sans" },
        { text: "(() ", color: "text-foreground", font: "font-mono" },
        { text: "=>", color: "text-purple-400", font: "font-mono" },
        { text: " {\n    ", color: "text-foreground", font: "font-mono" },
        { text: "console", color: "text-yellow-300", font: "font-sans" },
        { text: ".", color: "text-foreground", font: "font-mono" },
        { text: "log", color: "text-yellow-300", font: "font-sans" },
        { text: '("Mounted"', color: "text-green-400", font: "font-mono" },
        { text: ");\n  }, []);\n\n  ", color: "text-foreground", font: "font-mono" },
        { text: "return", color: "text-purple-400", font: "font-mono" },
        { text: " (\n    <", color: "text-foreground", font: "font-mono" },
        { text: "div", color: "text-pink-400", font: "font-serif" },
        { text: " ", color: "text-foreground", font: "font-mono" },
        { text: "className", color: "text-blue-400", font: "font-sans" },
        { text: '="flex gap-4"', color: "text-green-400", font: "font-mono" },
        { text: ">\n      <", color: "text-foreground", font: "font-mono" },
        { text: "Button", color: "text-pink-400", font: "font-serif" },
        { text: " ", color: "text-foreground", font: "font-mono" },
        { text: "onClick", color: "text-blue-400", font: "font-sans" },
        { text: "={() ", color: "text-foreground", font: "font-mono" },
        { text: "=>", color: "text-purple-400", font: "font-mono" },
        { text: " ", color: "text-foreground", font: "font-mono" },
        { text: "setCount", color: "text-orange-400", font: "font-serif" },
        { text: "(count ", color: "text-foreground", font: "font-mono" },
        { text: "+", color: "text-purple-400", font: "font-mono" },
        { text: " ", color: "text-foreground", font: "font-mono" },
        { text: "1", color: "text-cyan-400", font: "font-mono" },
        { text: ")}>\n        Increment\n      </", color: "text-foreground", font: "font-mono" },
        { text: "Button", color: "text-pink-400", font: "font-serif" },
        { text: ">\n      <", color: "text-foreground", font: "font-mono" },
        { text: "span", color: "text-pink-400", font: "font-serif" },
        { text: ">{count}</", color: "text-foreground", font: "font-mono" },
        { text: "span", color: "text-pink-400", font: "font-serif" },
        { text: ">\n    </", color: "text-foreground", font: "font-mono" },
        { text: "div", color: "text-pink-400", font: "font-serif" },
        { text: ">\n  );\n};\n\n", color: "text-foreground", font: "font-mono" },
        { text: "export default", color: "text-purple-400", font: "font-mono" },
        { text: " App;", color: "text-foreground", font: "font-mono" },
      ],
    },
    {
      name: "hooks.ts",
      code: [
        { text: "import", color: "text-purple-400", font: "font-mono" },
        { text: " { useState, useEffect } ", color: "text-foreground", font: "font-mono" },
        { text: "from", color: "text-purple-400", font: "font-mono" },
        { text: ' "react"', color: "text-green-400", font: "font-mono" },
        { text: ";\n\n", color: "text-foreground", font: "font-mono" },
        { text: "export", color: "text-purple-400", font: "font-mono" },
        { text: " ", color: "text-foreground", font: "font-mono" },
        { text: "const", color: "text-purple-400", font: "font-mono" },
        { text: " ", color: "text-foreground", font: "font-mono" },
        { text: "useLocalStorage", color: "text-yellow-300", font: "font-sans" },
        { text: " = <", color: "text-foreground", font: "font-mono" },
        { text: "T", color: "text-cyan-400", font: "font-serif" },
        { text: ",>(", color: "text-foreground", font: "font-mono" },
        { text: "key", color: "text-orange-400", font: "font-serif" },
        { text: ": ", color: "text-foreground", font: "font-mono" },
        { text: "string", color: "text-cyan-400", font: "font-sans" },
        { text: ", ", color: "text-foreground", font: "font-mono" },
        { text: "initial", color: "text-orange-400", font: "font-serif" },
        { text: ": ", color: "text-foreground", font: "font-mono" },
        { text: "T", color: "text-cyan-400", font: "font-serif" },
        { text: ") ", color: "text-foreground", font: "font-mono" },
        { text: "=>", color: "text-purple-400", font: "font-mono" },
        { text: " {\n  ", color: "text-foreground", font: "font-mono" },
        { text: "const", color: "text-purple-400", font: "font-mono" },
        { text: " [", color: "text-foreground", font: "font-mono" },
        { text: "value", color: "text-orange-400", font: "font-serif" },
        { text: ", ", color: "text-foreground", font: "font-mono" },
        { text: "setValue", color: "text-orange-400", font: "font-serif" },
        { text: "] = ", color: "text-foreground", font: "font-mono" },
        { text: "useState", color: "text-yellow-300", font: "font-sans" },
        { text: "<", color: "text-foreground", font: "font-mono" },
        { text: "T", color: "text-cyan-400", font: "font-serif" },
        { text: ">(() ", color: "text-foreground", font: "font-mono" },
        { text: "=>", color: "text-purple-400", font: "font-mono" },
        { text: " {\n    ", color: "text-foreground", font: "font-mono" },
        { text: "const", color: "text-purple-400", font: "font-mono" },
        { text: " ", color: "text-foreground", font: "font-mono" },
        { text: "stored", color: "text-orange-400", font: "font-serif" },
        { text: " = localStorage.", color: "text-foreground", font: "font-mono" },
        { text: "getItem", color: "text-yellow-300", font: "font-sans" },
        { text: "(key);\n    ", color: "text-foreground", font: "font-mono" },
        { text: "return", color: "text-purple-400", font: "font-mono" },
        { text: " stored ? JSON.", color: "text-foreground", font: "font-mono" },
        { text: "parse", color: "text-yellow-300", font: "font-sans" },
        { text: "(stored) : initial;\n  });\n\n  ", color: "text-foreground", font: "font-mono" },
        { text: "useEffect", color: "text-yellow-300", font: "font-sans" },
        { text: "(() ", color: "text-foreground", font: "font-mono" },
        { text: "=>", color: "text-purple-400", font: "font-mono" },
        { text: " {\n    localStorage.", color: "text-foreground", font: "font-mono" },
        { text: "setItem", color: "text-yellow-300", font: "font-sans" },
        { text: "(key, JSON.", color: "text-foreground", font: "font-mono" },
        { text: "stringify", color: "text-yellow-300", font: "font-sans" },
        { text: "(value));\n  }, [key, value]);\n\n  ", color: "text-foreground", font: "font-mono" },
        { text: "return", color: "text-purple-400", font: "font-mono" },
        { text: " [value, setValue] ", color: "text-foreground", font: "font-mono" },
        { text: "as const", color: "text-purple-400", font: "font-mono" },
        { text: ";\n};", color: "text-foreground", font: "font-mono" },
      ],
    },
    {
      name: "config.ts",
      code: [
        { text: "export", color: "text-purple-400", font: "font-mono" },
        { text: " ", color: "text-foreground", font: "font-mono" },
        { text: "const", color: "text-purple-400", font: "font-mono" },
        { text: " ", color: "text-foreground", font: "font-mono" },
        { text: "config", color: "text-yellow-300", font: "font-sans" },
        { text: " = {\n  ", color: "text-foreground", font: "font-mono" },
        { text: "app", color: "text-blue-400", font: "font-sans" },
        { text: ": {\n    ", color: "text-foreground", font: "font-mono" },
        { text: "name", color: "text-blue-400", font: "font-sans" },
        { text: ": ", color: "text-foreground", font: "font-mono" },
        { text: '"Power Tools"', color: "text-green-400", font: "font-mono" },
        { text: ",\n    ", color: "text-foreground", font: "font-mono" },
        { text: "version", color: "text-blue-400", font: "font-sans" },
        { text: ": ", color: "text-foreground", font: "font-mono" },
        { text: '"1.0.0"', color: "text-green-400", font: "font-mono" },
        { text: ",\n    ", color: "text-foreground", font: "font-mono" },
        { text: "description", color: "text-blue-400", font: "font-sans" },
        { text: ": ", color: "text-foreground", font: "font-mono" },
        { text: '"Minimal toolkit"', color: "text-green-400", font: "font-mono" },
        { text: ",\n  },\n  ", color: "text-foreground", font: "font-mono" },
        { text: "theme", color: "text-blue-400", font: "font-sans" },
        { text: ": {\n    ", color: "text-foreground", font: "font-mono" },
        { text: "mode", color: "text-blue-400", font: "font-sans" },
        { text: ": ", color: "text-foreground", font: "font-mono" },
        { text: '"dark"', color: "text-green-400", font: "font-mono" },
        { text: ",\n    ", color: "text-foreground", font: "font-mono" },
        { text: "colors", color: "text-blue-400", font: "font-sans" },
        { text: ": {\n      ", color: "text-foreground", font: "font-mono" },
        { text: "primary", color: "text-blue-400", font: "font-sans" },
        { text: ": ", color: "text-foreground", font: "font-mono" },
        { text: '"#000"', color: "text-green-400", font: "font-mono" },
        { text: ",\n      ", color: "text-foreground", font: "font-mono" },
        { text: "accent", color: "text-blue-400", font: "font-sans" },
        { text: ": ", color: "text-foreground", font: "font-mono" },
        { text: '"#fff"', color: "text-green-400", font: "font-mono" },
        { text: ",\n    },\n  },\n  ", color: "text-foreground", font: "font-mono" },
        { text: "features", color: "text-blue-400", font: "font-sans" },
        { text: ": {\n    ", color: "text-foreground", font: "font-mono" },
        { text: "analytics", color: "text-blue-400", font: "font-sans" },
        { text: ": ", color: "text-foreground", font: "font-mono" },
        { text: "true", color: "text-cyan-400", font: "font-mono" },
        { text: ",\n    ", color: "text-foreground", font: "font-mono" },
        { text: "notifications", color: "text-blue-400", font: "font-sans" },
        { text: ": ", color: "text-foreground", font: "font-mono" },
        { text: "false", color: "text-cyan-400", font: "font-mono" },
        { text: ",\n  },\n} ", color: "text-foreground", font: "font-mono" },
        { text: "as const", color: "text-purple-400", font: "font-mono" },
        { text: ";", color: "text-foreground", font: "font-mono" },
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
    <Card className="w-full border-t-0 border border-border bg-card/95 backdrop-blur-sm overflow-hidden">
      <div className="flex bg-muted/30 text-[10px] border-b border-border">
        {tabs.map((tab, index) => (
          <div
            key={tab.name}
            onClick={() => setActiveTab(index)}
            className={`group relative flex items-center gap-1.5 px-3 py-1.5 font-mono cursor-pointer border-r border-border transition-colors ${
              activeTab === index
                ? "bg-card text-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
            }`}
          >
            <span className="text-yellow-500">●</span>
            <span>{tab.name}</span>
            <button className="opacity-0 group-hover:opacity-100 ml-1 hover:bg-muted rounded-sm p-0.5">
              ×
            </button>
          </div>
        ))}
        <div className="flex-1 bg-muted/10" />
      </div>
      <div className="p-4 bg-card">
        <div className="flex items-center gap-1.5 mb-3 pb-2 border-b border-border/50">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
          <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
        </div>
        <pre className="text-[11px] overflow-x-auto leading-[1.6]">
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
