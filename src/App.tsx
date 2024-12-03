import { HashRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import { Edit } from "./pages/Edit";
import { Layout } from "./pages/Layout";
import { Restore } from "./pages/Restore";

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/edit/:key" element={<Edit />} />
          <Route path="/restore" element={<Restore />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}

export default App;
