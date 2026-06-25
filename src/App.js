import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Header from "./components/Header";
import "./App.css";
import Home from "./components/Home";
import Detail from "./components/Detail";
import Search from "./components/Search";

function App() {
  return (
    <div className="App">
      <Router>
        <Header />
        {/* Replace <Switch> with <Routes> */}
        <Routes>
          {/* Update Route tags to use the 'element' prop */}
          <Route path="/" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/detail/:id" element={<Detail />} />
          <Route path="/search" element={<Search />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;