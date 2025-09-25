import { useTheme } from "../../contexts/ThemeContext";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";

const Settings = () => {
  const { theme, toggleTheme, isDark, primaryColor, setPrimaryColor } =
    useTheme();

  const handleColorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPrimaryColor(event.target.value);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Settings</h1>

      <Card>
        <CardHeader>
          <CardTitle>Theme Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Current theme display */}
          <div className="flex items-center justify-between">
            <Label>Current Theme</Label>
            <span className="px-2 py-1 rounded bg-muted text-sm">
              {theme.charAt(0).toUpperCase() + theme.slice(1)}
            </span>
          </div>

          {/* Toggle dark/light mode */}
          <div className="flex items-center space-x-2">
            <Label htmlFor="theme-toggle">Dark Mode</Label>
            <Button
              id="theme-toggle"
              onClick={toggleTheme}
              variant={isDark ? "default" : "outline"}
            >
              {isDark ? "Dark" : "Light"}
            </Button>
          </div>

          {/* Primary color picker */}
          <div className="flex items-center space-x-2">
            <Label htmlFor="color-input">Primary Color</Label>
            <Input
              id="color-input"
              type="color"
              value={primaryColor}
              onChange={handleColorChange}
              className="w-16 h-10 cursor-pointer"
            />
          </div>

          {/* Preset colors */}
          <div>
            <Label>Preset Themes</Label>
            <div className="flex space-x-2 mt-2">
              <Button
                onClick={() => setPrimaryColor("#1976d2")}
                variant="outline"
              >
                Blue
              </Button>
              <Button
                onClick={() => setPrimaryColor("#ff5722")}
                variant="outline"
              >
                Orange
              </Button>
              <Button
                onClick={() => setPrimaryColor("#4caf50")}
                variant="outline"
              >
                Green
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;
