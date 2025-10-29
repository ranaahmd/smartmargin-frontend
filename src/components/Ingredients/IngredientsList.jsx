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
                setError(" Failed loading your ingredients")

            }

        }
        loadIngredaients()
        [refresh]
    })
    const handleDelete = async (id) =>{
        try{
            await axios.delete(`${API_URL}${id}/`)
            setRefresh(!refresh)
        }catch{
            setError("can't delete ingredients")
        }

    }
    const handleEdit =(item) =>{
        setEditItem(item)
    }
    const handleUpdate = async(updateData)=>{
        try{
            await axios.put(`${API_URL}${editItem.id}/`,updateData)
            setEditItem(null)
            setRefresh(!refresh)
        }catch{
            setError("update filed")
        }
    }
  return (
    <div className="ingredients-container">
        <h2>Ingredients</h2>
        <IngredientsForm
        onSuccess={()=>
            setRefresh(!refresh)}
            editItem={editItem}
            onUpdate={handleUpdate}
        />
        <ul>
            {ingredients.map((i)=>(
                <li key ={i.id}>
                    <strong>{i.name}</strong> {i.cost_per_unit} per {i.unit}
                    <button onClick={() => handleEdit(i)}> Edit</button>
                    <button onClick={() => handleDelete(i.id)}>Delete</button>
                </li>
            )
            )}
        </ul>

    
    </div>
  )
}
