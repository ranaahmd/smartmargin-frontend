import React, { useEffect } from 'react'
import { clearTokens } from '../../lib/auth'
import { useNavigate } from 'react-router'

export default function Logout() {
const navigate = useNavigate()
useEffect(() =>{
    localStorage.removeItem("access")
    localStorage.removeItem("refresh")
    navigate("/login")
},[navigate])
return null
}