import './App.css';
import Header from "./components/Header"
import {BrowserRouter as Router, Routes, Route, Link} from "react-router-dom"
import Home from "./pages/Home"
import Chats from "./pages/Chats"
import ChatScreen from "./pages/ChatScreen"
import Landing from "./pages/Landing"
import Profile from "./pages/Profile"
import CreateAccount from "./pages/CreateAccount"
function App() { 
  return (
    <div>
      

      <Router>
        
        <Routes>

          <Route path="/signup" element={<CreateAccount/>}/>

          <Route path="/chat/:character" element={ <><Header backButton="/chat"/><ChatScreen/></>}/>
          
          <Route path="/profile" element={ <><Header /><Profile/></>}/>

          <Route path="/chat" element={ <><Header /><Chats/></>}/>

          <Route path="/home" element={<><Header /><Home/></>}/>

          <Route path="/" element={<><Landing/></>}/>

        </Routes>

      </Router>
    </div>
  );
}

export default App;
