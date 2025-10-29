import React, { useState } from "react"
import axios from "axios"
import { saveTokens, getUserFromToken } from "../../lib/auth"
import { useNavigate } from "react-router"
export default function Login() {
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
    // copied from gerge
    try { 
        const res = await API.post("/login/",form)
         saveTokens(res.data.access, res.data.refresh)
      setUser(getUserFromToken())
      navigate("/dashboard")
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div>
        <h2>Login</h2>
          <form onSubmit={handleSubmit}>
            <input name="username" placeholder="Username" onChange={handleChange}/>
            <input name="password" placeholder="Password" type="password" onChange={handleChange}/>
            <button type="submit">Login</button>

        </form>
    </div>

  )}

