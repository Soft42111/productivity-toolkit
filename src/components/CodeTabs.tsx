import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";

const CodeTabs = () => {
  const tabs = [
    {
      name: "Dashboard",
      code: `import { Card } from "@/components/ui/card";\nimport { Button } from "@/components/ui/button";\n\nconst Dashboard = () => {\n  return (\n    <div className="grid gap-4 md:grid-cols-3">\n      <Card className="p-6">\n        <h3>Analytics</h3>\n        <p className="text-2xl">1,234</p>\n      </Card>\n      <Card className="p-6">\n        <h3>Users</h3>\n        <p className="text-2xl">567</p>\n      </Card>\n      <Card className="p-6">\n        <h3>Revenue</h3>\n        <p className="text-2xl">$8,910</p>\n      </Card>\n    </div>\n  );\n};`,
    },
    {
      name: "Components",
      code: `import { useState } from "react";\nimport { Button } from "@/components/ui/button";\n\nconst Counter = () => {\n  const [count, setCount] = useState(0);\n\n  return (\n    <div className="flex items-center gap-4">\n      <Button\n        onClick={() => setCount(count - 1)}\n      >\n        -\n      </Button>\n      <span className="text-2xl">{count}</span>\n      <Button\n        onClick={() => setCount(count + 1)}\n      >\n        +\n      </Button>\n    </div>\n  );\n};`,
    },
    {
      name: "Hooks",
      code: `import { useEffect, useState } from "react";\n\nconst useLocalStorage = (key: string, initial: any) => {\n  const [value, setValue] = useState(() => {\n    const stored = localStorage.getItem(key);\n    return stored ? JSON.parse(stored) : initial;\n  });\n\n  useEffect(() => {\n    localStorage.setItem(key, JSON.stringify(value));\n  }, [key, value]);\n\n  return [value, setValue];\n};\n\nexport default useLocalStorage;`,
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
    <Card className="w-full max-w-2xl mx-auto border border-border bg-card/80 backdrop-blur-sm">
      <div className="flex border-b border-border">
        {tabs.map((tab, index) => (
          <button
            key={tab.name}
            onClick={() => setActiveTab(index)}
            className={`flex-1 px-4 py-2 text-sm font-medium transition-colors border-r last:border-r-0 border-border ${
              activeTab === index
                ? "bg-muted text-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
            }`}
          >
            {tab.name}
          </button>
        ))}
      </div>
      <div className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <div className="w-3 h-3 rounded-full bg-yellow-500" />
          <div className="w-3 h-3 rounded-full bg-green-500" />
          <span className="ml-2 text-xs text-muted-foreground">index.tsx</span>
        </div>
        <pre className="text-xs font-mono text-foreground/90 overflow-x-auto">
          <code>{tabs[activeTab].code}</code>
        </pre>
      </div>
    </Card>
  );
};

export default CodeTabs;
