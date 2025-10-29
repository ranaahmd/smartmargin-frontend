import React,{useState} from "react";
import API from  "../services/api";
import { useNavigate } from 'react-router'
// copied idea from cat-collector
export default function SignUp() {
  const [form,setForm] =useState({
    username:"",
    email:"",
    password:""
  })
  const handleChange =(e) =>{
    setForm({...formToJSON,[e.target.name]:e.target.value})
  

}

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await axios.post('http://127.0.0.1:8000/api/signup/', { username, password, email })
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