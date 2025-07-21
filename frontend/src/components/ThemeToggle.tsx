import { Moon, Sun, Monitor } from "lucide-react";
import { Button } from "./ui/button";
import { useTheme } from "./ThemeProvider";
import { useState, useRef, useEffect } from "react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const getIcon = () => {
    switch (theme) {
      case "light":
        return <Sun className="h-[1.2rem] w-[1.2rem]" />;
      case "dark":
        return <Moon className="h-[1.2rem] w-[1.2rem]" />;
      case "system":
        return <Monitor className="h-[1.2rem] w-[1.2rem]" />;
      default:
        return <Monitor className="h-[1.2rem] w-[1.2rem]" />;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        variant="outline"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className="relative"
      >
        {getIcon()}
        <span className="sr-only">Toggle theme</span>
      </Button>
      
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-md shadow-lg z-50">
          <div className="py-1">
            <button
              onClick={() => {
                setTheme("light");
                setIsOpen(false);
              }}
              className={`flex items-center w-full px-4 py-2 text-sm text-foreground hover:bg-accent hover:text-accent-foreground ${
                theme === "light" ? "bg-accent text-accent-foreground" : ""
              }`}
            >
              <Sun className="mr-2 h-4 w-4" />
              <span>Light</span>
            </button>
            <button
              onClick={() => {
                setTheme("dark");
                setIsOpen(false);
              }}
              className={`flex items-center w-full px-4 py-2 text-sm text-foreground hover:bg-accent hover:text-accent-foreground ${
                theme === "dark" ? "bg-accent text-accent-foreground" : ""
              }`}
            >
              <Moon className="mr-2 h-4 w-4" />
              <span>Dark</span>
            </button>
            <button
              onClick={() => {
                setTheme("system");
                setIsOpen(false);
              }}
              className={`flex items-center w-full px-4 py-2 text-sm text-foreground hover:bg-accent hover:text-accent-foreground ${
                theme === "system" ? "bg-accent text-accent-foreground" : ""
              }`}
            >
              <Monitor className="mr-2 h-4 w-4" />
              <span>System</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
