import { useState, useEffect } from "react";
import { useFetcher } from "react-router";

export function useTheme() {
  const fetcher = useFetcher();
  const [theme, setTheme] = useState<"light" | "dark">("dark");

  useEffect(() => {
    setTheme(
      document.documentElement.classList.contains("dark") ? "dark" : "light"
    );
  }, []);

  function toggleTheme() {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");

    // Save theme preference via cookie
    fetcher.submit(
      { theme: newTheme },
      { method: "post", action: "/api/theme" }
    );
  }

  return { theme, toggleTheme };
}
