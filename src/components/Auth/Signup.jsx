import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import "../../App.css";
// copied from george
export default function SignUp() {
  const [form,setForm] =useState({
    username:"",
    email:"",
    password:""
  })
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({...form,[e.target.name]:e.target.value});
  };

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await axios.post('http://127.0.0.1:8000/api/signup/',
         { username: form.username,
             password: form.password,
              email :form.email})
              navigate('/login')
    } catch (err) {
      console.error(err)
      alert('Signup failed')
    }
  }

  return (
    <div className="signup-container">
        <div className="signup-card">
        <h2 className="signup-title">Signup</h2>
        <p className="signup-subtitle"> Create your account</p>
        <form className="signup-form" onSubmit={handleSubmit}>
            <input className="signup-input" name="firstname" placeholder="First name" onChange={handleChange}/>
            <input className="signup-input" name="email" placeholder="email" onChange={handleChange}/>
            <input className="signup-input" name="password" placeholder="Password" type="password" onChange={handleChange}/>
            <button className="signup-button" type="submit">Sign up</button>
        </form>
          <p className="login-link">
              Already have an account? <a href="/login">Login here</a>
            </p>
    </div> 
    </div>
  )
}