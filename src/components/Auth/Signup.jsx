
import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
// copied idea from cat-collector
export default function SignUp() {
  const [form,setForm] =useState({
    username:"",
    email:"",
    password:""
  })
  const navigate = useNavigate()
  const handleChange =(e) =>{
    setForm({...form,[e.target.name]:e.target.value})
  

}

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
    <div>
        <h2>Signup</h2>
        <form onSubmit={handleSubmit}>
            <input name="username" placeholder="Username" onChange={handleChange}/>
            <input name="email" placeholder="email" onChange={handleChange}/>
            <input name="password" placeholder="Password" type="password" onChange={handleChange}/>
            <button type="submit">Sign up</button>

        </form>
    </div>
  )
}