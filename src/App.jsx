import { BrowserRouter as Router,Routes,Route } from "react-router-dom";
import SignUp from "./components/Auth/Signup";
import Login from "./components/Auth/Login";


export default function App() {
  return (
   <Router>
    <Routes>
       <Route path="/" element={<div>Home Page - <a href="/signup">Sign Up</a> | <a href="/login">Login</a></div>} />
      <Route path ="/signup" element={<SignUp/>}/>
      <Route path ="/login" element={<Login/>}/>
      <Route path ="/dashboard" element={<Dashboard/>}/>
    </Routes>
   </Router>
  )
}
