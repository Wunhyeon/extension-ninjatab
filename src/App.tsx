import { HashRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import { Edit } from "./pages/Edit";

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/edit/:key" element={<Edit />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
