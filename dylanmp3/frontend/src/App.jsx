import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import YoutubeAMp3 from "./pages/YoutubeAMp3";
import DescargaShortsYoutube from "./pages/DescargaShortsYoutube";
import Privacidad from "./pages/Privacidad";
import Terminos from "./pages/Terminos";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/youtube-a-mp3" element={<YoutubeAMp3 />} />
      <Route path="/descargar-shorts-youtube" element={<DescargaShortsYoutube />} />
      <Route path="/privacidad" element={<Privacidad />} />
      <Route path="/terminos" element={<Terminos />} />
    </Routes>
  );
}
