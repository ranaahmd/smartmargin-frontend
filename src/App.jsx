import { BrowserRouter as Router,Routes,Route } from "react-router-dom";
import SignUp from "./components/Auth/Signup";
import React from 'react'

export default function App() {
  return (
   <Router>
    <Routes>
      <Route path="/" element={<div>Home Page - <a href="/signup">Go to Signup</a></div>} />
      <Route path ="/signup" element={<SignUp/>}/>
    </Routes>
   </Router>
  )
}
