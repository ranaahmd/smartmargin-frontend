import React, { useState } from "react"
import axios from "axios"
import "../../App.css";
import { saveTokens, getUserFromToken } from "../../lib/auth"
import { useNavigate } from "react-router"

export default function Login({ setUser }) {
      const [form,setForm] =useState({
        username:"",
        password:""
      })
      const navigate = useNavigate()
      const handleChange =(e) =>{
        setForm({...form,[e.target.name]:e.target.value})
      }
      
  const handleSubmit = async (e) => {
    e.preventDefault()
    try { 
      const res = await axios.post("http://127.0.0.1:8000/api/token/", form)

         saveTokens(res.data.access, res.data.refresh)
      setUser(getUserFromToken())
      navigate('/ingredients')
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="login-container">
        <div className="login-card">
        <h2 className="login-title">Login</h2>
          <form className="login-form" onSubmit={handleSubmit}>
            <input className="login-input" name="username" placeholder="Username" onChange={handleChange}/>
            <input className="login-input" name="password" placeholder="Password" type="password" onChange={handleChange}/>
            <button className="login-button" type="submit">Login</button>
        </form>
    </div>
</div>
  )
}

