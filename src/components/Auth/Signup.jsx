import React, { useState } from "react";
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import "../../App.css";

export default function SignUp() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: ""
  })
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true);
    setError('');
    try {
      await axios.post('http://127.0.0.1:8000/api/signup/',
        {
          username: form.username,
          password: form.password,
          email: form.email
        })
      navigate('/login')
    } catch (err) {
      setError(err.response?.data?.error || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="signup-container">
      <div className="signup-card">
        <h2 className="signup-title">Signup</h2>
        <p className="signup-subtitle"> Create your account</p>
        {error && <div className="alert alert-error">{error}</div>}
        <form className="signup-form" onSubmit={handleSubmit}>
          <input className="signup-input" name="username" placeholder="Username" value={form.username} onChange={handleChange} disabled={loading} required />
          <input className="signup-input" name="email" placeholder="email" type="email" value={form.email} onChange={handleChange} disabled={loading} required />
          <input className="signup-input" name="password" placeholder="Password" type="password" value={form.password} onChange={handleChange} disabled={loading} required />
          <button className="signup-button" type="submit" disabled={loading}>
            {loading ? 'Signing up...' : 'Sign up'}
          </button>
        </form>
        <p className="login-link">
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </div>
    </div>
  )
}
