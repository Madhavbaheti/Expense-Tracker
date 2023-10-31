import Home from "./screens/Home/home";
import Login from "./screens/Login/login";
import Signup from "./screens/SignUp/signup";
import Intocard from "./screens/intoCard/intocard";

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/intocard" element={<Intocard/>}/>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
