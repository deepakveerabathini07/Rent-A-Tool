import { createRoot } from "react-dom/client";
import "./lib/mock-api"; // intercept /api/* calls with mock data
// v2
import App from "./App";
import "./index.css";

createRoot(document.getElementById("root")!).render(<App />);
