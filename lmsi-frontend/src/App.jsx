import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HeaderComponent from "./components/HeaderComponent";
import FooterComponent from "./components/FooterComponent";
import ListPopularBookComponent from "./components/ListPopularBookComponent";

function App() {
  return (
    <Router>
      <HeaderComponent />
      <Routes>
        <Route path="/popular-books" element={<ListPopularBookComponent />} />
      </Routes>
      <FooterComponent />
    </Router>
  );
}

export default App;
