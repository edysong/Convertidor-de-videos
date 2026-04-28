import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Privacidad from "./pages/Privacidad";
import Terminos from "./pages/Terminos";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/privacidad" element={<Privacidad />} />
      <Route path="/terminos" element={<Terminos />} />
    </Routes>
  );
}
