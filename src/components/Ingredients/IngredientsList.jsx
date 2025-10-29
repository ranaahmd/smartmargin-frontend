import React, {useEffect,useState} from "react"
import axios from "axios"
import IngredientsForm from "./IngredientsForm"
import React from 'react'

export default function () {
    const [ingredients,setIngredients] = useState([])
    const [error,setError] =useState("")
    const [editItem,setEditItem]= useState(null)
    const [refresh,setRefresh]=useState(false)
    const API_URL = "http://127.0.0.1:8000/api/ingredients/"
    useEffect(() =>{
        const loadIngredaients = async()=>{
            try{
                const res = await axios.get(API_URL)
                setIngredients(res.data)

            }catch(err){
                setError(" Failed you need to add some ingredients")

            }

        }
        loadIngredaients()
        [refresh]
    })
    const handleDelete = async(id)=>{
        
    }


  return (
    <div>
    
    </div>
  )
}
