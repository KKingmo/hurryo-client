import "./App.css";
import "antd/dist/antd.css";
import NavBar from "./components/NavBar/NavBar";
import Main from "./components/KakaoMap/Setting";
import Footer from "./components/Footer/Footer";

function App() {
  return (
    <div>
      <NavBar />
      <Main />
      <Footer />
    </div>
  );
}

export default App;
