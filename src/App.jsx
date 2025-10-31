import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignUp from "./components/Auth/Signup";
import Login from "./components/Auth/Login";
import NavBar from "./components/Auth/NavBar/NavBar";
import { getUserFromToken } from "./lib/auth";
import NotesList from './components/Notes/NotesList';
export default function App() {
  const [user, setUser] = useState(null)
  
  useEffect(() => {
    const tokenUser = getUserFromToken();
    setUser(tokenUser);
  }, []);
  
  return (
   <Router>
     <NavBar user={user} setUser={setUser}/>
    <Routes>
       <Route path="/" element={<div>Home Page - <a href="/signup">Sign Up</a> | <a href="/login">Login</a><a href="/notes">Note</a> | </div>} />
      <Route path="/signup" element={<SignUp/>}/>
      <Route path="/notes" element={<NotesList/>}/>
      <Route path="/login" element={<Login setUser={setUser}/>}/>
    </Routes>
   </Router>
  )
}