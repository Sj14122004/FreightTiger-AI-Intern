import { BrowserRouter, Route, Routes } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import AllRoutes from "./pages/AllRoutes";
import Generate from "./pages/Generate";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/all-routes" element={<AllRoutes />} />
        <Route path="/generate" element={<Generate />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;